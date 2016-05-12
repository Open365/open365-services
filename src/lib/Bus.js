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

var Stomp = require('eyeos-stomp').Stomp;
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var settings = require('../settings');
var log2out = require('log2out');

function Bus(injSettings) {
	this.settings = injSettings || settings.stomp;
	this.stomp = new Stomp(this.settings);
	this.logger = log2out.getLogger('Bus');
}
util.inherits(Bus, EventEmitter);

Bus.prototype.connect = function () {
	var self = this;

	this.stomp.on('connected', function() {
		self.logger.debug("Connected");
		var headers = {
			destination: self.settings.destination
		};
		if (!headers.destination) {
			self.logger.error("Destination", headers.destination, "is not valid");
			self.emit('error', new Error("Destination is not valid"));
			return;
		}

		self.stomp.subscribe(headers);
		self.logger.debug("Subscribed to Bus", headers.destination);
		self.emit('initialized');
	});

	this.stomp.on('error', function(err) {
		self.emit('error', err);
	});

	this.stomp.on('message', function(msg) {
		try {
			var json = JSON.parse(msg.body);
		} catch (e) {
			self.logger.error("Failed to parse", msg.body, e);
			return;
		}

		self.emit('message', json);
	});

	this.logger.debug("Starting to connect");
	this.stomp.connect();
}

Bus.prototype.send = function (msg, callback) {
	if (typeof msg === 'object') {
		msg = JSON.stringify(msg);
	}

	var frame = this.stomp.send({
		destination: this.settings.destination,
		body: msg
	}, true /*receipt*/);

	var self = this;
	var receiptId = frame.headers.receipt;
	var handler = function(id) {
		if (id === receiptId) {
			self.stomp.removeListener('receipt', handler);
			return callback();
		}
	}
	this.stomp.on("receipt", handler);
}

module.exports = Bus;
