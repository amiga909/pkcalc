'use strict';
var PkerJS = PkerJS || {};

PkerJS.FileReader = {
	init: function() {},
	read: function(files, callback) {
		for(var i = 0; i < files.length; i++){ 
			this.readFile(files[i], callback);
		} ;
	},
	readFile: function(file, callback) {
		//console.log(data);
		//console.log(data[0].type);
		var mime = "";

		if (typeof file === "object" && file.type) {
			mime = file.type;
			if (mime.indexOf("/zip") > -1) {
				PkerJS.UnZipper.readZip(file, callback);
			} else if (mime.indexOf("text") > -1) {
				PkerJS.FileReader.readBlob(file, callback);
			} else {
				PkerJS.ErrorMessage.show("cannot read format " + mime, "sad");
				PkerJS.InputForm.$fileInputProgress.hide();
			}
		} else {
			PkerJS.InputForm.$fileInputProgress.hide();
			PkerJS.ErrorMessage.show("unknown read error", "sad");

		}


	},
	readBlob: function(blob, callback) {
		if (typeof blob === "object" && blob.size > 50) {
			var fileReader = new FileReader();
			fileReader.onload = function() {
				callback.call(this, this.result);
			};
			fileReader.readAsBinaryString(blob);
		}
	}
};