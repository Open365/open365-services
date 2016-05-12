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

var settings = require('./settings');
var shell = require('child_process');
var Bus = require('./lib/Bus');

var application = process.argv[2];
console.log(application);
var bus = new Bus();

bus.connect(function(err) {
    if (err) {
        process.exit(1);
    }
});

var getData = function(script) {
    var proc = shell.spawn(script, [application], {detached: true, env: {'PYTHONIOENCODING': 'UTF-8', 'DISPLAY': ':2'}});

    proc.stdout.on('data', function(data) {
        var receivedText = data.toString('utf-8');
        var eventType = receivedText.split(":")[0];
        var text = receivedText.substring(receivedText.indexOf(":")+1, receivedText.length-1);
        var clipboardDataMessage = {
            type: settings.messageTypes.clipboard,
            event: eventType,
            value: text
        };
        bus.send(clipboardDataMessage, function(){});
    });

    proc.stderr.on('data', function(data) {
        console.log('stderr: ', data.toString('utf-8'));
    });

    proc.on('close', function(code) {
        console.log('child process exited with code: ', code);
    });
};

if( application === 'writer') {
    getData('office_clipboard.py');
} else {
    getData('system_clipboard.py');
}
