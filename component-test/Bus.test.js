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

var assert = require('chai').assert;
var Bus = require('../src/lib/Bus');

suite('#Bus', function() {
	var bus1, bus2;
	var settings;

	setup(function(done) {
		settings = {
			host: "127.0.0.1",
			port: 61613,
			login: 'guest',
			password: 'guest',
			destination: '/topic/test-destination'
		}

		// FIXME: This seems to introduce way too much boiler plate
		//        Maybe this is a sign, that the Bus class has a sucky API
		bus1 = new Bus(settings);
		bus2 = new Bus(settings);
		bus1.connect();
		bus2.connect();

		var bus1Connected = false;
		var bus2Connected = false;
		var func = function() {
			if (bus1Connected && bus2Connected) {
				done();
			}
		};
		bus1.on('initialized', function() {
			bus1Connected = true;
			func();
		})
		bus2.on('initialized', function() {
			bus2Connected = true;
			func();
		})
	});

	test('Should send and receive message', function(done) {
		var msg = {a: 1};
		bus2.on("message", function(m) {
			assert.deepEqual(m, msg);
			done();
		});
		bus1.send(msg, function(err) {
			assert.notOk(err);
		});
	});
});
