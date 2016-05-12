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

var settings = require('../settings');
var log2out = require('log2out');
var childProcess = require('child_process');

function ApplicationLauncher(bus, childProcessInj) {
	this.bus = bus;
	this.logger = log2out.getLogger("ApplicationLauncher");
	this.childProcess = childProcessInj || childProcess;

	this.errorMessage = {
		type: settings.messageTypes.launchApplication,
		event: 'applicationLauncherWrongAppPathError'
	};
}

ApplicationLauncher.prototype.onMessage = function(message, callback) {
	if (message.type !== settings.messageTypes.launchApplication || message.event) {
		return callback();
	}

	var self = this;
	var app = message.application;
	if (!app) {
		self.logger.error("Recevied an LaunchApplication message without an application");
		self.bus.send(self.errorMessage, callback);
		return;
	}

	this.childProcess.exec(app, function(err, stdout, stderr) {
		if (err) {
			self.logger.error("Failed to execute", app, err);
			self.bus.send(self.errorMessage, callback);
			return;
		}

		self.logger.info("Launched", app, "successfully");
		self.logger.debug("Stdout:", stdout);
		self.logger.debug("Stderr:", stderr);

		var msg = {
			type: settings.messageTypes.launchApplication,
			event: 'applicationLaunchedSuccessfully'
		};
		self.bus.send(msg, callback);
		return;
	});
};

module.exports = ApplicationLauncher;
