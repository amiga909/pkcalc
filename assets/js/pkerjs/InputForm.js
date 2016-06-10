'use strict';
var PkerJS = PkerJS || {};

PkerJS.InputForm = {
	playerName: "",
	css: {
		fileInput: "#file-input",
		fileInputText: "#file-input-text",
		playerName: "#player_name",
		fileInputProgress: "#file-input-progress",
		fileInputFilename: '#file-input-filename',
		fileList: "#file-list",
		playerNameIcon: '#player_name_icon',
		playerNameIconLabel: '#player_name_icon_label',
		creationMethod: "#creation-method-input",

	},
	init: function(userName) {
		this.playerName = "";
		this.$playerName = $(this.css.playerName);
		this.$fileInput = $(this.css.fileInput);
		this.$fileInputText = $(this.css.fileInputText);
		this.$fileInputProgress = $(this.css.fileInputProgress);
		this.$fileInputFilename = $(this.css.fileInputFilename);
		this.$playerNameIcon = $(this.css.playerNameIcon);
		this.$playerNameIconLabel = $(this.css.playerNameIconLabel);

		this.listen();
	},
	listen: function() {
		var that = this;
		that.$fileInput.on("change", function() {
			var filename = this.value.replace(/C:\\fakepath\\/i, '');
			that.showFilename(filename);
			that.onOpenFile();
		});
		that.$fileInputText.on("change", function() {
			that.onReadFinish.call(that, this.value);
			that.$fileInputText.val('');
		});

		this.playerName = this.$playerName.val();
		that.$playerName.on("change", function() {
			that.onPlayerNameChange(this.value);
		});

		//that.$creationMethod.on("change", function() {
		//	that.creationMethod = this.value;
		//});

	},
	isValidated: function() {
		if (this.playerName == "") {
			return false;
		} else {
			this.hideInvalid();
			return true;
		}
	},
	hideInvalid: function() {
		this.$playerNameIcon.css("color", "#26a69a");
		this.$playerNameIconLabel.hide();
	},
	showInvalid: function() {
		this.$playerNameIcon.css("color", "#ef5350");
		this.$playerNameIconLabel.show();
	},
	setPlayerNameByUrl: function(name) {
		this.setPlayerName(name);
		this.$playerName.val(name);
	},
	setPlayerName: function(name) {
		this.playerName = name;
	},
	showFilename: function(filename) {
		this.$fileInputFilename.val(filename);
	},
	onPlayerNameChange: function(name) {
		var that = this;
		that.setPlayerName(name);
		if (PkerJS.Parser.inputBuffer != "") {
			that.onReadFinish(PkerJS.Parser.inputBuffer);
		}
	},
	onReadFinish: function(data) {
		var parsed = null;
		PkerJS.Parser.setBuffer(data);
		PkerJS.InputForm.$fileInputProgress.hide();
		if (PkerJS.InputForm.isValidated()) {
			PkerJS.Parser.setUserName(PkerJS.InputForm.playerName);
			if (PkerJS.Parser.isValid(data)) {
				parsed = PkerJS.Parser.parse(data);
				PkerJS.Canvas.draw(parsed, PkerJS.InputForm.playerName);
			} else {
				PkerJS.ErrorMessage.show("no data found for Player '" +
					PkerJS.InputForm.playerName + "'", "sad");
			}
		} else {
			PkerJS.InputForm.showInvalid();
		}
	},
	onOpenFile: function() {
		var that = this;
		if (that.$fileInput[0].files.length) {
			that.$fileInputProgress.show();
			//that.$fileInput.disabled = true;
			PkerJS.FileReader.read(that.$fileInput[0].files, that.onReadFinish);
		}
	}
}