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



