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

var Bus = require('./lib/Bus');
var MasterService = require('./lib/MasterService');
var PrintfileCleaner = require('./lib/PrintfileCleaner');
var logger = require('log2out').getLogger('Main');

var bus = new Bus();
var service = new MasterService(bus);
var pfCleaner = new PrintfileCleaner();

pfCleaner.cleanOldPrintFiles();

bus.connect(function(err) {
	if (err) {
		logger.err("Bus Init Error", err);
		process.exit(1);
	}
});

bus.on('initialized', function() {
	logger.debug("Initialized the Bus");
	service.onInit(function() {
		logger.debug("Finished Initialization");
	});
});

bus.on('message', function(msg) {
	logger.debug("Received msg", msg);
	service.onMessage(msg, function() {
		logger.debug("Finished Handling message");
	});
});

bus.on('error', function(err) {
	logger.error("Bus received an error", err);
	process.exit(1);
});
