# pintracker
This is used by our Twitch Stream to do scores and "bounty" points for Pinball games.  Sets up a Socket.io server so OBS can use browser input source to display.

Requires node and npm already installed.

Download or clone... then run "npm install"

Defaults to port 3000

Access the Adminstration UI via: localhost:3000/simple

Point OBS browser capture to either:
- localhost:3000 - this is for the "bounty" board module
- localhost:3000/timer - this is for the "Speed Runner" module
