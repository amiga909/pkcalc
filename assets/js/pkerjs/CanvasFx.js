'use strict';
var PkerJS = PkerJS || {};


PkerJS.CanvasFx = {
	fx1: function(chart) {
		var seq = 0,
			delays = 0,
			durations = 450;

		// Once the chart is fully created we reset the sequence
		chart.on('created', function() {
			seq = 0;
		});

		// On each drawn element by Chartist we use the Chartist.Svg API to trigger SMIL animations
		chart.on('draw', function(data) {
			seq++;
			if (data.type === 'line') {
				// threshold plugin.. line invisible in green
				data.element.animate({

				});
			} else if (data.type === 'label' && data.axis === 'x') {
			
			} else if (data.type === 'label' && data.axis === 'y') {
				data.element.animate({

				});
			} else if (data.type === 'point') {
				data.element.animate({
					x1: {
						begin: 12,
						dur: durations,
						from: data.x - 30,
						to: data.x,
						easing: 'easeOutQuart'
					},
					x2: {
						begin: durations * 2,
						dur: durations,
						from: data.x + 30,
						to: data.x,
						easing: 'easeOutQuart'
					},
					opacity: {
						begin: durations * 2,
						dur: durations * 4,
						from: 0,
						to: 1,
						easing: 'easeOutQuart'
					}
				});
			} else if (data.type === 'grid') {
				// Using data.axis we get x or y which we can use to construct our animation definition objects


				var animations = {};


				data.element.animate(animations);
			} else if (data.type === 'area') {
				// Using data.axis we get x or y which we can use to construct our animation definition objects


				var animations = {};

/*
// nice fx, threshold plugin, green color..
				data.element.animate({
					opacity: {
						begin: 400,
						dur: 1200,
						from: 0,
						to: 1,
						easing: 'easeOutQuart'
					}
				});
*/
			}
		});


	}
}