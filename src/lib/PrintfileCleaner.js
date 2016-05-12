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

var printSettings = require('../settings').printSettings;
var fs = require('fs');
var logger = require('log2out').getLogger('PrintfileCleaner');

function PrintfileCleaner() {
    logger.debug('Initializing printfile cleaner...');
}

PrintfileCleaner.prototype.cleanOldPrintFiles = function() {
    var folder = printSettings.folder;
    var timeLimit = printSettings.cleanTimer;
    var files = [];

	try { 
		files = fs.readdirSync(folder); 
	} catch(err) {
		logger.error("Could not read dir: ", folder, ": ", err);
		return; 
	}

	if (files.length > 0) {

		var deadLine = new Date().getTime() - timeLimit;

		for (var i=0;i<files.length;i++) {
			var filePath = folder + '/' + files[i];
			var fileStat = fs.statSync(filePath);
			var fileDate = new Date(fileStat['ctime']).getTime();

	        if (deadLine > fileDate) {
	            try {
	                logger.debug("Removing old print file: ", filePath);            
	                fs.unlinkSync(filePath);
	            } catch (e) {
	                logger.error("Could not remove file: ", e);
	            }
	        }
		}
	} 
};

module.exports = PrintfileCleaner;
