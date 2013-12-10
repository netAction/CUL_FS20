#!/bin/sh

# start script for CUL_FS20
# If you want to run CUL_FS20 on startup use this file with chmod 755.
# Execute $ crontab -e as the user who will run CUL_FS20.
# Add the line @reboot /home/pi/CUL_FS20/start.sh, save, quit, reboot.


#Move to the folder where CUL_FS20 is installed
cd `dirname $0`

/home/pi/node-v0.10.22-linux-arm-pi/bin/node app.js
