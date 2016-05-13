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
var path = require('path');
var PdfCodeInjector = require('../lib/pdfCodeInjector');
var logger = require('log2out').getLogger('PrintService');

function PrintService (file, printFolder, pdfCodeInjector) {
    logger.debug('Initializing print service...');

    this.file = file;
    this.printFolder = printFolder || '/mnt/eyeos/print';
    this.pdfCodeInjector = pdfCodeInjector || new PdfCodeInjector(file);
}

// Inject auto-printing code to the PDF file
PrintService.prototype.addAutoPrintingToPdf = function () {
    logger.debug('Adding auto-print to pdf file: ', this.file);
    var embeddedJsInPdf = ["  /Names << % the Javascript entry",
        "    /JavaScript <<",
        "      /Names [",
        "        (EmbeddedJS)",
        "        <<",
        "          /S /JavaScript",
        "          /JS (",
        "            this.print(true);",
        "          )",
        "        >>",
        "      ]",
        "    >>",
        "  >> % end of the javascript entry\n"].join("\n");

    try {
        this.pdfCodeInjector.addJs(embeddedJsInPdf);
    } catch (err) {
        logger.error("Can't inject js inside pdf: ", err);
    }
};

// Move the file to the printing folder
PrintService.prototype.moveFileToPrintingFolder = function (callback) {

    logger.debug('Moving file to print folder: ', this.printFolder);

    var self = this;

    // Create the print dir if it doesnt' exist
    try {
        fs.mkdirpSync(this.printFolder);
    } catch (err) {
        logger.error('Error creating folders: ', err);
        return;
    }

    var filename = path.basename(this.file);
    var printFilePath = path.join(self.printFolder, filename);

    // Move the document to the print folder
    fs.rename(this.file, printFilePath, function (err) {
        if (err) {
            logger.error("Can't move file " + filename + " to print folder " + self.printFolder, err);
        } else {
            logger.debug("Moved file " + filename + " to print folder " + self.printFolder);

            try {
                logger.debug("Changing file permission.");
                fs.chmodSync(printFilePath, 666);
            } catch (err) {
                logger.error("Error changing permissions: ", err);
                return;
            }

            // Notify the Desktop via BUS that a file is ready for printing
            callback.call(null);
        }
    });
};

module.exports = PrintService;
