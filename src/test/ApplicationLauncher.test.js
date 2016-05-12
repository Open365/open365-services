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

var ApplicationLauncher = require('../services/ApplicationLauncher');
var settings = require('../settings');
var messageTypes = settings.messageTypes;

suite('#ApplicationLauncher', function() {
	var sut;
	var bus;
	var errorMessage;
	var childProcess;

	setup(function() {
		errorMessage = {
			type: messageTypes.launchApplication,
			event: 'applicationLauncherWrongAppPathError'
		};
		bus = {
			send: sinon.stub().callsArg(1)
		};
		childProcess = {
			exec: sinon.stub().callsArg(1)
		};
		sut = new ApplicationLauncher(bus, childProcess);
	});

	test('Should send an error message when missing application', function(done) {
		var query = {
			type: messageTypes.launchApplication
		};
		sut.onMessage(query, function() {
			sinon.assert.calledWith(bus.send, errorMessage);
			done();
		});
	});

	test('Should send launched successfully message on launching an app', function(done) {
		var query = {
			type: messageTypes.launchApplication,
			application: 'files'
		};
		var response = {
			type: messageTypes.launchApplication,
			event: 'applicationLaunchedSuccessfully'
		};
		sut.onMessage(query, function() {
			sinon.assert.calledWith(bus.send, response);
			done();
		});
	});

	test('Should launch the application on proper message', function(done) {
		var query = {
			type: messageTypes.launchApplication,
			application: 'files'
		};
		sut.onMessage(query, function() {
			sinon.assert.calledWith(childProcess.exec, 'files');
			done();
		});
	});
});
