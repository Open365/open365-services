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

var fs = require('fs');
var logger = require('log2out').getLogger('PdfCodeInjector');

function PdfCodeInjector (filename) {
	this.filename = filename;
}

PdfCodeInjector.prototype.addJs = function (js) {
	var catalog = new Buffer([0x2f, 0x43, 0x61, 0x74, 0x61, 0x6c, 0x6f, 0x67]); // This is the string 'Catalog'
	var pdfBuffer = fs.readFileSync(this.filename);
	var i = pdfBuffer.length;
	var len = i;
	var curMatch = catalog.length-1;

	while (i-- && curMatch > -1) {
		if (pdfBuffer[i] == catalog[curMatch]) {
			curMatch--;
		} else {
			curMatch = catalog.length-1;
		}
	}

	curMatch = 0;
	while (i++ < len - 1) {
		var ch = pdfBuffer[i];
		var chNext = pdfBuffer[i + 1];

		var R = 'R'.charCodeAt(0);
		var space =  ' '.charCodeAt(0);
		var enter =  '\n'.charCodeAt(0);
		if (ch == R && (chNext == space || chNext == enter)) {
			i += 2;
			break;
		}
	}

	if (i == len) {
		logger.err("Failed to inject JS into the PDF file");
		return;
	}

	var part0 = pdfBuffer.slice(0, i);
	var part1 = pdfBuffer.slice(i);

	fs.writeFileSync(this.filename, Buffer.concat([part0, new Buffer(js), part1]));
};

module.exports = PdfCodeInjector;
