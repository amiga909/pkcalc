'use strict';
var PkerJS = PkerJS || {};


PkerJS.Canvas = {
	chart: null,
	gDataTable: null,
	config: {
		'xAxisMax': 20
	},
	charts: {
		'profit': null,
		'profitConfig': {
			'xAxisMax': 25
		},
		'profitOptions': {
			showArea: true,
			//	axisX: {},
			axisY: {
				onlyInteger: true
			},
			fullWidth: true,
			chartPadding: {
				right: 40
			},
			lineSmooth: Chartist.Interpolation.simple({
				divisor: 8,
				fillHoles: false
			}),
			plugins: [
				Chartist.plugins.ctAxisTitle({
					axisX: {
						axisTitle: 'Time',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: 30
						},
						textAnchor: 'middle'
					},
					axisY: {
						axisTitle: 'Profit',
						axisClass: 'ct-axis-title',
						offset: {
							x: 0,
							y: -1
						},
						flipTitle: false
					}
				}),
				Chartist.plugins.ctThreshold({
					threshold: 0
				})
			]
		},
		'profitResponsiveOptions': [
			['screen and (min-width: 641px) and (max-width: 1024px)', {
				showLine: true,
				showPoint: true,
				axisX: {
					labelInterpolationFnc: function(value) {
						// on medium screens
						return value.slice(0, 8);
					}
				}
			}],
			['screen and (max-width: 640px)', {
				showLine: false,
				showPoint: true,
				axisX: {
					labelInterpolationFnc: function(value) {
						// on small screens
						return value.slice(3, 8);
					}
				}
			}]
		]
	},
	css: {
		container: '#chart'
	},
	init: function() {
		var that = this;
		this.$container = $(this.css.container);

	},

	draw: function(data, name) {
		if (typeof data === "object" && _.size(data) > 0) {
			this.drawProfitChart(data, name);
			PkerJS.ListView.render(data);
		} else {
			PkerJS.ErrorMessage.show("Invalid Input", "sad");
		}

	},

	prepareData: function(data) {
		data = data.hands ? data.hands : data;
		var result = [];
		var profit = 0.0;
		var rows = {
			profitAr: [],
			dateAr: []
		};
		var games = [];


		var i = 0;
		var date = null;

		for (i = 0; i < data.length; i++) {
			profit = profit + parseFloat(data[i].win - (data[i].buyin + data[i].loss));
			profit = parseFloat(profit.toFixed(3));
			rows.profitAr.push(profit);
			date = PkerJS.Data.toDateStr(data[i].date);
			rows.dateAr.push(PkerJS.Data.formatDate(date));
			games.push(data[i].tId);
		}
		result = {
			'rows': rows,
			'games': games,
			data: data
		};
		return result;
	},
	drawProfitChart: function(data, mode) {
		var that = this;
		var chartData = null;
		if (mode && mode == "debug") {
			chartData = data;
		} else {
			chartData = this.prepareData(data);
		}
		var labels = PkerJS.Data.skimpArrayValues(
			chartData.rows.dateAr,
			that.charts.profitConfig.xAxisMax
		);
		var series = [chartData.rows.profitAr];

		if (that.charts.profit) {
			that.charts.profit.update({
				'labels': labels,
				'series': series
			});
		} else {
			that.charts.profit = new Chartist.Line('#chart', {
				'labels': labels,
				'series': series
			}, that.charts.profitOptions, that.charts.profitResponsiveOptions);
			// PkerJS.CanvasFx.fx1(that.charts.profit);

		}

		$('#row-container').append('<pre>' + JSON.stringify(data.stat) + '<pre>');


	}

}