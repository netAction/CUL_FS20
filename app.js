var CUL_FS20 = require("./CUL_FS20");
CUL_FS20 = new CUL_FS20;

var d = CUL_FS20.registerDevices({
	'Schreibtisch' : '123456',
	'Minifernbedienung' : 'EB9500',
	'Minifernbedienung2' : 'EB9501'
});


CUL_FS20.on("connected", function () {
	// register a new address in a receiver:
	// d.Schreibtisch.dim100();
	// If you do not want to use the devices manager:
	//CUL_FS20.write({'address':'123456','command':'on'});

	// set all lamps to default
	// d.Schreibtisch.off();
});

CUL_FS20.on("read", function(message) {
	switch (message.full) {
		case 'Minifernbedienung_off':
			d.Schreibtisch.off();
			break;
		case 'Minifernbedienung_on':
			d.Schreibtisch.dim100();
			// same as:
			// CUL_FS20.write({'device':'123456','command':'dim100'});
			break;
		case 'Minifernbedienung2_off':
			for (var device in d) console.log(device,d[device].name,d[device].lastCommand);
			break;
		case 'Minifernbedienung2_on':
				d.Schreibtisch.dim62();
			break;
	};
});

