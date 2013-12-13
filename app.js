var CUL_FS20 = require("./CUL_FS20");
CUL_FS20 = new CUL_FS20;


// Make pstree happy with a nice process title instead of "node":
process.title = 'CUL_FS20';

var d = CUL_FS20.registerDevices({
	Desk : 'F3AA00',
	Remote_Ch1 : 'EB9500',
	Remote_Ch2 : 'EB9501',
	Twilight_sender_Ch1 : 'F2CE00', // on when completely dark
	Twilight_sender_Ch2 : 'F2CE01' // on when dark or twilight
});


CUL_FS20.on("connected", function () {
	// register a new address in a receiver:
	// CUL_FS20.devices.Desk.on();
	// or shorter:
	// d.Desk.on();
	// If you do not want to use the device manager:
	// CUL_FS20.write({'address':'F3AA00','command':'on'});

	// set all lamps to default:
	// d.Desk.off();
});


CUL_FS20.on("read", function(message) {

	d.Desk[
		// switched off
		(d.Remote_Ch1=='off') ? 'off' :
		// daylight
		(d.Twilight_sender_Ch2=='off') ? 'off' :
		// night
		'dim100'
	]();

	switch(message.full) {
		case 'Remote_Ch2 off':
			// print the status of all devices to console
			// The result will look like this:
			// Desk dim100
			// Remote Ch1 on
			// Remote Ch2 off
			for (var device in d) console.log(device,d[device].lastCommand);
			break;
		case 'Remote_Ch2 on':
			// ... more commands
			// e.g. d.Desk.dim31();
		break;
	}
});

