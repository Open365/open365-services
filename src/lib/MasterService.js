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

var async = require('async');
var ServiceFactory = require('./ServiceFactory');

function MasterService(bus, serviceFactoryInj) {
	var factory = serviceFactoryInj || new ServiceFactory(bus);
	this.services = factory.getServices();
}

MasterService.prototype.onInit = function (callback) {
	var functions = [];
	this.services.forEach(function (service) {
		if (service.onInit) {
			functions.push(service.onInit.bind(service));
		}
	});

	async.parallel(functions, callback);
}

MasterService.prototype.onMessage = function (msg, callback) {
	var functions = [];
	this.services.forEach(function (service) {
		if (service.onMessage) {
			functions.push(service.onMessage.bind(service, msg));
		}
	});

	async.parallel(functions, callback);
}

module.exports = MasterService;
