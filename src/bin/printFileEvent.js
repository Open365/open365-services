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
var messageTypes = require('../settings').messageTypes;
var printSettings = require('../settings').printSettings;
var PrintService = require('../lib/PrintService');

var file = process.argv[2];
var printService = new PrintService(file, printSettings.folder);

// Event / Bus settings
var path = 'print:///' + file.replace(printSettings.tmp_folder, "");
var event = new Event("printFile", messageTypes.print, {path: path});

// Send event notification to throu the BUS
var callback = function() {
    console.log("Sending print notification through BUS...");
    event.send(function() {
        console.log("Event sent...");
        process.exit(0);
    });
};

printService.addAutoPrintingToPdf();
printService.moveFileToPrintingFolder(callback);
