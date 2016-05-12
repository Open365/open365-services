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

var Bus = require('./Bus');
var log2out = require('log2out');

function Event(eventName, eventType, data) {
	this.logger = log2out.getLogger('Event');
	this.bus = new Bus();
	this.eventType = eventType;
	this.eventName = eventName;
	this.data = data;
}

Event.prototype.send = function(cb) {
	var self = this;

	this.bus.connect(function(err) {
		if (err) {
			self.logger.err("Bus Init Error", err);
			process.exit(1);
		}
	});

	this.bus.on('initialized', function() {
		self.logger.debug("Initialized the Bus");
		self.bus.send({
			type: self.eventType,
			event: self.eventName,
			value: self.data
		}, cb);
	});
};

module.exports = Event;
