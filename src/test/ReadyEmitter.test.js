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

var sinon = require('sinon');

var ReadyEmitter = require('../services/ReadyEmitter');
var settings = require('../settings');
var messageTypes = settings.messageTypes;

suite('#ReadyEmitter', function() {
	var sut;
	var bus;
	var readyMessage;

	setup(function() {
		readyMessage = {
			type: messageTypes.generic,
			event: 'guestServicesReady'
		};
		bus = {
			send: sinon.stub().callsArg(1)
		};
		sut = new ReadyEmitter(bus);
	});

	test('Should send a ready message on startup', function(done) {
		sut.onInit(function() {
			sinon.assert.calledWith(bus.send, readyMessage);
			done();
		});
	});

	test('Should send a ready message on query message', function(done) {
		var query = {
			type: messageTypes.generic,
			event: 'guestServicesIsReady'
		};
		sut.onMessage(query, function() {
			sinon.assert.calledWith(bus.send, readyMessage);
			done();
		});
	});
});
