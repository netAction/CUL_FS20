// Class for connecting a CUL adapter to send and receive FS20 commands
// 2013 Thomas Schmidt
// MIT License
// https://github.com/netAction/CUL_FS20

// Connection to CUL adapter
var SerialPort = require("serialport").SerialPort;

// Timestamp for every console.log
require('log-timestamp')(function() {
	var now = new Date();
	var strDateTime = [
		[now.getDate(), (now.getMonth() + 1), now.getFullYear()].join("."),
		[now.getHours(), (now.getMinutes()<10?'0':'')+now.getMinutes()].join(":")]
		.join(" ");
	return strDateTime;
});
process.env.TZ = 'Europe/Berlin';

// Trigger events "connected" or "read"
var events = require('events');


// The class itself
function CUL_FS20() {
	this.serialPort = new SerialPort("/dev/ttyACM0", {
		baudrate: 9600
	});
	this.CUL_connected = false;

	this.commands = {
		// List of commands
		// http://fhz4linux.info/tiki-index.php?page=FS20%20Protocol
		// http://www.eecs.iu-bremen.de/archive/bsc-2008/stefanovIvan.pdf
		'off' : '00',
		'dim06' : '01', // Switch to Brightness level 1 (min.)
		'dim12' : '02',
		'dim18' : '03',
		'dim25' : '04',
		'dim31' : '05',
		'dim37' : '06',
		'dim43' : '07',
		'dim50' : '08',
		'dim56' : '09',
		'dim62' : '0A',
		'dim68' : '0B',
		'dim75' : '0C',
		'dim81' : '0D',
		'dim87' : '0E',
		'dim93' : '0F',
		'dim100' : '10', // Switch to Brightness level 16 (max.)
		'on' : '11', // dimmers: old value
		'toggle' : '12', // Switch between ”Off” and ”On at previous value”
		'dimup' : '13', // One level brighter.
		'dimdown' : '14', // One level darker.
		'dimupdown' : '15', // Dim up to max. level, pause, down ...
		'sendstate' : '17' // Send status. Only by bidirectional components.
	};

	// Objects for registered devices
	this.devices = {};
	events.EventEmitter.call(this);

	var self = this;
	console.log('Starting CUL FS20 ...');
	self.serialPort.on("open", function () {
		console.log('... connection to CUL opened ...');
		self.serialPort.on('data', function(data) {
			receiveData(data,self);
		});
		self.serialPort.write("X21\n", function(err, results) {
			if (err) {
				console.log('error ' + err);
			} else {
				console.log('... listening to FS20 commands.');
				self.CUL_connected = true;
				self.emit('connected');
			}
		});
	});
}


function receiveData(data,self) {
	// Reverse list of known commands
	var reverse_commands = {};
	for(var command in self.commands) {
		reverse_commands[self.commands[command]] = command;
	}

	var command = data.toString().substr(7);
	// strip non alphanumeric
	command = command.replace(/\W/g, '');
	// strip timecode
	command = command.substring(0,command.length-2);

	if (command in reverse_commands) {
		command = reverse_commands[command];
	}

	// Reverse list of FS20 devices
	var reverse_devices = {};
	for(var device in self.devices) {
		reverse_devices[self.devices[device].address] = device;
	}

	// convert FS20 address to device name
	// if device not registered keep FS20 address
	var device = data.toString().substr(1,6);
	if (device in reverse_devices) {
		device = reverse_devices[device];
		self.devices[device].lastCommand = command;
	}

	var message = {
		'device' : device,
		'command' : command,
		'full' : device+' '+command
	}
	console.log('Received: '+message.full);
	self.emit('read',message);
} // receiveData


CUL_FS20.prototype.write = function(message) {
	if (this.CUL_connected == false) {
		console.log("CUL not connected.");
		return;
	}
	if (!(message.command in this.commands)) {
		console.log("Command "+message.command+" unknown.");
		return;
	}

	/* http://culfw.de/commandref.html
		F12340111
		F = FS20 writing command
		 1234 = FS20 housecode (hex)
				 01 = device address (hex)
					 11 = command (16bit if extension bit is set in first byte) */

	command = this.commands[message.command];
	this.serialPort.write("F"+message.address+command+"\n");
} // CUL_FS20.write


function FS20_Device(CUL_FS20_Obj,deviceName,address) {
	for(var command in CUL_FS20_Obj.commands) {
		(function(obj,addr,cmd,self) {
			self[command] = function() {
				obj.write({'address':addr,'command':cmd});
				console.log('   Sent: '+this.name+' '+cmd);
				self.lastCommand = cmd;
			}
		})(CUL_FS20_Obj,address,command,this);
	}
	this.address = address;
	this.name = deviceName;
	// at startup we do not know the last command on this address:
	this.lastCommand = false;
	this.toString = function() {
		return this.lastCommand;
	}
	// TODO: lastCommand easier
}

CUL_FS20.prototype.registerDevices = function(deviceNames) {
	for(var deviceName in deviceNames) {
		this.devices[deviceName] = new FS20_Device(this,deviceName,deviceNames[deviceName]);
	}
	return this.devices;
} // CUL_FS20.registerDevices


CUL_FS20.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = CUL_FS20;
