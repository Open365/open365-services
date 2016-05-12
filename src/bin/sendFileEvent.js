#!/bin/env node

/*
    Copyright (c) 2016 eyeOS

    This file is part of Open365.

    Open365 is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as
    published by the Free Software Foundation, either version 3 of the
    License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with this program. If not, see <http://www.gnu.org/licenses/>.
*/

var Event = require('../lib/Event');
var fs = require('fs');
var messageTypes = require('../settings').messageTypes;

if (process.argv.length !== 4 || !process.argv[2] || !process.argv[3]) {
	console.log("Usage " + process.argv[1] + "<eventName> <path>");
	process.exit(1);
}

var eventName = process.argv[2];
var path = process.argv[3];
if (path.indexOf(process.env.HOME) === 0) {
	path = fs.realpathSync(process.argv[3]);
	path = path.substr(process.env.HOME.length);
	if (eventName === "fileOpened") {
		// Remove '/' character
		path = path.substr(1);
		// This solves the bugfix to open files from dolphin
		path = "files/" + path;
	}
}

var event = new Event(eventName, messageTypes.file, {path: path});
event.send(function() {
	console.log("Sent the event");
	process.exit(0);
});
