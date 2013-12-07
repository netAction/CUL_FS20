CUL FS20
========

CUL_FS20 is a *node.js* program that controls FS20 home automation devices using the [Busware USB CUL adapter](http://busware.de/tiki-index.php?page=CUL). It sends commands depending on other received commands. For this usage CUL_FS20 is a simple replacement for [FHEM](http://fhem.de/) without any user interface. If needed you can easily add your own Web interface.


Installation
------------

-	Install node.js. If you are on a Raspberry Pi, follow the [instruction from voodootikigod](https://github.com/voodootikigod/node-serialport).
- Copy this project to your computer:

		git clone https://github.com/netAction/CUL_FS20.git
- Move to the project's directory and run

		npm install

	A directory *node_modules* should be created containing the *serialport* package.
- Run the program:
		node app.js
- If you like, add *init script* and *logrotate*.


Usage
-----

To include the CUL_FS20 class add this to your app:

	var CUL_FS20 = require("./CUL_FS20");
	CUL_FS20 = new CUL_FS20;

Every received FS20 message will be promted to your console. Using the received commands works like this:

	CUL_FS20.on("read", function(message) {
	  console.log('FS20 device ' + message.device + ' sent the command ' + message.command);
	});

The result is something like *"FS20 device EB9500 sent the command off"*. The device address is hexadecimal where 11=0, 12=1, 14=3, 21=4 and 44=F. The first four bytes contain the house code and the last two are the sender's address.

Messages are *on*, *off*, *dim100*, *toggle* and so on. See the source code for a full list. *message.full* contains the device and command concenated like *"EB9501 dimupdown"*.

Sending a command to a device works with this command:

	CUL_FS20.write({'address':'F3AA00','command':'on'});

But usually you will never use this line as CUL_FS20 has a nice device manager. First add some devices:

	var d = CUL_FS20.registerDevices({
		'Desk' : 'F3AA00',
		'Remote Ch1' : 'EB9500',
		'Remote Ch2' : 'EB9501'
	});

You can add more devices with the same command later. If you need a new variable with the devices simply run *var d2 = CUL_FS20.registerDevices({}); CUL_FS20 has an internal list with all devices.

Now sending a commad is *d.Desk.dim100()*.

	CUL_FS20.on("read", function(message) {
	  switch(message.full) {
      case 'Remote Ch1 on':
	      d.Desk.dim100();
	      break;
      case 'Remote Ch1 off':
	      d.Desk.off();
	      break;
	  }
	});

If you need the status of a channel later read *d.Desk.lastCommand*. This contains the last command no matter if it was received or sent by CUL_FS20.

Sometimes you want to run some commands just after the CUL adapter has been initialized. This could be the case to send some default values or to to program a receiver to a new address.

	CUL_FS20.on("connected", function () {
	  // do something after startup
	});

Have fun!
