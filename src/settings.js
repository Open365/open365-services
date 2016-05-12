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

var settings = {
	stomp: {
		host: process.env.BUS_ADDRESS_HOST,
		port: process.env.BUS_ADDRESS_PORT || 61613,
		login: process.env.EYEOS_BUS_MASTER_USER || 'guest',
		passcode: process.env.EYEOS_BUS_MASTER_PASSWD || 'somepassword',
		destination: process.env.BUS_SUBSCRIPTION
	},

	messageTypes: {
		file: 0,
		print: 1,
		launchApplication: 2,
		windowManagement: 3,
		installManagement:4,
		menu: 5,
		networkDriveManagement: 6,
		machineStateService: 7,
		shutDown: 8,
		clipboard: 9,

		// This is for those messages that doesn't fit in any of
		// the previous types and doesn't deserve its own type.
		generic: 99,
		// Messages used during developing (for benchmarks and whatever).
		// you should not use them in code for production purposes.
		killApplicationDoNotUseInProductionEver: 34423423
	},

	services: [
		__dirname + '/services/ApplicationLauncher',
		__dirname + '/services/ReadyEmitter'
	],

	printSettings: {
		folder: '/mnt/eyeos/print/',
		cleanTimer: 300000,
		user: process.env.EYEOS_UNIX_USER || 'user'
	},

	connectionFilepath: process.env.CONNECTION_FILEPATH || '/tmp/connected',
};

module.exports = settings;
