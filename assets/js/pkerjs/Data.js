'use strict';
var PkerJS = PkerJS || {};

PkerJS.Data = {
	sortHashArrayByDate: function(data, order) {
		order = typeof order === 'undefined' ? 'asc' : order;
		var sorted = [];
		for (var item in data) {
			sorted.push(data[item]);
		}
		sorted = sorted.sort(function(a, b) {
			if (order == "asc") {
				return new Date(a.date) - new Date(b.date);
			} else if (order == "desc") {
				return new Date(b.date) - new Date(a.date);
			}
		});
		return sorted;
	},
	skimpArrayValues: function(labels, maxVisibleEntries) {
		var result = labels;
		var len = result.length;
		var minChunkSize = 1;
		maxVisibleEntries = typeof maxVisibleEntries === 'undefined' ? 10 : maxVisibleEntries;
		if (len > maxVisibleEntries) {
			minChunkSize = Math.floor(len * 2 / (maxVisibleEntries) + 1);
			minChunkSize = minChunkSize < 1 ? 1 : minChunkSize;
			_.each(result, function(label, index) {
				if (index % minChunkSize != 0 && index != 0) {
					result[index] = "";
				}
			});
			return result;
		} else {
			return result;
		}
	},
	padNumber: function(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
	},
	formatDate: function(date){
		return date.substr(2, 2) + "." +
				date.substr(5, 5) + " " +
				date.substr(11, 5);
	},
	toDateStr: function(date) {
		var d = new Date(date),
			month = '' + this.padNumber((d.getMonth() + 1), 2),
			day = '' + d.getDate(),
			year = d.getFullYear(),
			h = this.padNumber(d.getHours(), 2),
			m = this.padNumber(d.getMinutes(), 2),
			s = this.padNumber(d.getSeconds(), 2);

		if (month.length < 2) {
			month = '0' + month
		};
		if (day.length < 2) {
			day = '0' + day
		};

		return [year, month, day].join('.') + " " + [h, m].join(':');
	},

}