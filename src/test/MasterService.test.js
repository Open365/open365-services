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
var sinon = require('sinon');
var MasterService = require('../lib/MasterService');

suite('#MasterService', function() {
	var sut;
	var msg;
	var bus;
	var serviceFactory;
	var service1, service2, service3;

	setup(function() {
		service1 = {
			onMessage: sinon.stub().callsArg(1),
			onInit: sinon.stub().callsArg(0)
		};
		service2 = { onMessage: sinon.stub().callsArg(1) };
		service3 = { onInit: sinon.stub().callsArg(0) };
		serviceFactory = {
			getServices: function() {
				return [service1, service2, service3];
			}
		};
		bus = {};

		msg = {
			type: 1,
			event: 'EventName'
		};

		sut = new MasterService(bus, serviceFactory);
	})

	test('Should init services onInit', function(done) {
		sut.onInit(function(err) {
			assert.notOk(err);
			sinon.assert.calledWith(service1.onInit);
			sinon.assert.calledWith(service3.onInit);
			done();
		});
	});

	test('Should forward messages to sub services', function(done) {
		sut.onMessage(msg, function(err) {
			assert.notOk(err);
			sinon.assert.calledWith(service1.onMessage, msg);
			sinon.assert.calledWith(service2.onMessage, msg);
			done();
		});
	});
});
