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

function ReadyEmitter(bus) {
	this.bus = bus;
	this.readyMessage = {
		type: settings.messageTypes.generic,
		event: 'guestServicesReady'
	};
}

ReadyEmitter.prototype.onInit = function(callback) {
	this.bus.send(this.readyMessage, callback);
}

ReadyEmitter.prototype.onMessage = function(message, callback) {
	if (message.type !== settings.messageTypes.generic || message.event !== 'guestServicesIsReady') {
		return callback();
	}
	this.bus.send(this.readyMessage, callback);
}

module.exports = ReadyEmitter;
