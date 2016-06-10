'use strict';
var PkerJS = PkerJS || {};

PkerJS.UnZipper = {
	requestFileSystem: null,
	init: function() {
		this.creationMethod = "Blob"; // File
		this.requestFileSystem = window.webkitRequestFileSystem || window.mozRequestFileSystem || window.requestFileSystem;
		if (typeof this.requestFileSystem == "undefined") {
			this.creationMethod = "Blob";
		}

	},

	createTempFile: function(callback) {
		var tmpFilename = "tmp.dat";
		this.requestFileSystem(TEMPORARY, 4 * 1024 * 1024 * 1024, function(filesystem) {
			function create() {
				filesystem.root.getFile(tmpFilename, {
					create: true
				}, function(zipFile) {
					callback(zipFile);
				});
			}

			filesystem.root.getFile(tmpFilename, null, function(entry) {
				entry.remove(create, create);
			}, create);
		});
	},
	readZip: function(zip, callback) {
		var that = this;
		unZipperModel.getEntries(zip, function(entries) {
			entries.forEach(function(entry) {
				console.log("reading " + entry.filename + " ... ");
				if (entry.directory === false) {
					unZipperModel.getEntryFile(entry, that.creationMethod, function(blob) {
						if (blob.size > 0) {
							PkerJS.FileReader.readBlob(blob, callback);
						} else {
							console.log("did not process " + entry.filename + " ... ");
						}
					});
				}
			});
		});

	}

};

var unZipperModel = (function() {
	var URL = window.webkitURL || window.mozURL || URL;

	return {
		getEntries: function(file, onend) {
			zip.createReader(new zip.BlobReader(file), function(zipReader) {
				zipReader.getEntries(onend);
			}, onerror);
		},
		getEntryFile: function(entry, creationMethod, onend, onprogress) {
			var writer, zipFileEntry;

			function getData() {
				entry.getData(writer, function(blob) {
					var blobURL = creationMethod == "Blob" ? URL.createObjectURL(blob) : zipFileEntry.toURL();
					onend(blob);

				}, onprogress);
			}

			if (creationMethod == "Blob") {
				writer = new zip.BlobWriter();
				getData();
			} else {
				createTempFile(function(fileEntry) {
					zipFileEntry = fileEntry;
					writer = new zip.FileWriter(zipFileEntry);
					getData();
				});
			}
		}
	};
})();