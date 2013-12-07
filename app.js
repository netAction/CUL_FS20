var CUL_FS20 = require("./CUL_FS20");
CUL_FS20 = new CUL_FS20;

var d = CUL_FS20.registerDevices({
	'Desk' : 'F3AA00',
	'Remote Ch1' : 'EB9500',
	'Remote Ch2' : 'EB9501'
});


CUL_FS20.on("connected", function () {
	// register a new address in a receiver:
	// d.Desk.on();
	// If you do not want to use the devices manager:
	//CUL_FS20.write({'address':'F3AA00','command':'on'});

	// set all lamps to default
	// d.Desk.off();
});

CUL_FS20.on("read", function(message) {
	switch(message.full) {
		case 'Remote Ch1 on':
			d.Desk.dim100();
			break;
		case 'Remote Ch1 off':
			d.Desk.off();
			break;
		case 'Remote Ch2 off':
			// print the status of all devices to console
			// This will look like this:
			// Desk dim100
			// Remote Ch1 on
			// Remote Ch2 off
			for (var device in d) console.log(device,d[device].lastCommand);
			break;
		case 'Remote Ch2 on':
				d.Desk.dim62();
			break;
	}
});

