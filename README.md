# pintracker
Used by our Twitch Stream to do "bounty" points and speed runs for Pinball games.  

Uses Express and Socket.io to run an HTTP server with web sockets, allowing OBS to capture widgets via a browser input source.

Requires node (tested on v8.9.4) and npm (tested on v5.6.0) already installed. Get it here: https://nodejs.org/en/

Download or clone project.  Navigate to installed directory and run "npm install"

To start, navigate to installed directory and type: "node index.js"

Defaults to port 3000

Access the Adminstration UI via: http://localhost:3000/simple

Point OBS browser capture to: http://localhost:3000/timer 

# Controller support
PinTracker now integrates with a Controller to interface with the PinTimer Widget.  Leveraging the npm package "node-gamepad" found here: https://www.npmjs.com/package/node-gamepad

This page shows a list of supported controllers.

We are currently using the Logitech F310 Gamepad Controller.  This, sadly, wasn't already in the NPM package, but I was able to find it in node-gamepad's GitHub here: https://github.com/carldanley/node-gamepad
