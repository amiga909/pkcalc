'use strict';
var PkerJS = PkerJS || {};


PkerJS.App = {

	init: function() {
		PkerJS.ErrorMessage.init();
		PkerJS.UnZipper.init();
		PkerJS.Parser.init();

		PkerJS.FileReader.init();
		PkerJS.InputForm.init();
		PkerJS.Canvas.init();
		PkerJS.ListView.init();
		this.initKeyShortcuts();
		this.initHelp();
		var user = this.getQueryStringVar('user');
		if (user) {
			PkerJS.InputForm.setPlayerNameByUrl(user);
		}



		//PkerJS.Canvas.drawProfitChart(JSON.parse(TEST_DATA.data6), 'debug');
		//PkerJS.Canvas.drawProfit(JSON.parse(TEST_DATA.data_Hands1_txt_mod), 'debug');		

	},
	initHelp: function() {

		var $help = $("#help-section");
		var $helpContent = $("#help-section-content");
		$help.on('click', function() {
			if ($helpContent.hasClass("visible") == true) {
				$helpContent.hide();
				$helpContent.removeClass("visible");
				$("#app-content").show();
			} else {
				$("#app-content").hide();
				$helpContent.show();
				$helpContent.addClass("visible");
			}
		});
		$("#close-help").on('click', function() {
			$helpContent.hide();
			$helpContent.removeClass("visible");
			$("#app-content").show();
		});
	},
	getQueryStringVar: function(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, "\\$&");
		var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
			results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, " "));
	},
	initKeyShortcuts: function() {
		$(document).keypress(function(e) {
			// enter key 
			if (e.which == 13) {
				e.preventDefault();
			}
		});
		$(PkerJS.InputForm.$playerName).keypress(function(e) {
			if (e.which == 13) {
				var name = PkerJS.InputForm.$playerName.val();
				PkerJS.InputForm.onPlayerNameChange(name);
			}
		});
	}
}


var TEST_DATA = {
	// JSON.stringify(chartData.rows);
	data6: '{"rows":{"profitAr":[5,-2,-2,-2.25,-2.5,-2.75],"dateAr":["2016.04.24 03:51","2016.04.24 03:53","2016.04.24 09:47","2016.04.24 09:49","2016.04.24 12:09","2016.04.24 12:17"]},"tournamentCnt":6}',
	data_Hands1_txt: '{"rows":{"profitAr":[-3.5,-5,-6.5,-8,-9.5,-13,-13.5,-15,-15.5,-19,-19.5,-20,-23.5,-25,-26.5,-28,-29.5,-31,-32.5,-36,-37.5,-41,-42.5,-44,-45.5,-46,-46.5,-50,-53.5,-57,-58.5,-60],"dateAr":["14.07.17 16:47","14.07.17 18:07","14.07.17 18:18","14.07.18 13:53","14.07.18 13:59","14.07.18 15:40","14.07.18 15:49","14.07.18 16:42","14.07.18 17:11","14.07.18 22:55","14.07.19 10:42","14.07.19 11:14","14.07.20 09:12","14.07.20 10:28","14.07.20 10:52","14.07.20 11:05","14.07.20 17:00","14.07.20 17:14","14.07.21 13:28","14.07.21 13:59","14.07.21 16:10","14.07.22 17:08","14.07.23 14:00","14.07.24 15:50","14.07.25 15:47","14.08.09 16:51","14.08.09 17:03","14.08.10 16:04","14.08.11 13:33","14.08.12 13:59","14.08.12 14:01","14.08.13 16:54"]},"tournamentCnt":999}',
	data_Hands1_txt_mod: '{"rows":{"profitAr":[-3.5,-5,-6.5,8,-5,-3,13.5,15,-1.5,-1,1.5,2,23.5,25,26.5,28,29.5,31,32.5,46,37.5,41,2.5,4,-5.5,-6,-10.5,-5,-51.5,-57,-58.5,-60],"dateAr":["14.07.17 16:47","14.07.17 18:07","14.07.17 18:18","14.07.18 13:53","14.07.18 13:59","14.07.18 15:40","14.07.18 15:49","14.07.18 16:42","14.07.18 17:11","14.07.18 22:55","14.07.19 10:42","14.07.19 11:14","14.07.20 09:12","14.07.20 10:28","14.07.20 10:52","14.07.20 11:05","14.07.20 17:00","14.07.20 17:14","14.07.21 13:28","14.07.21 13:59","14.07.21 16:10","14.07.22 17:08","14.07.23 14:00","14.07.24 15:50","14.07.25 15:47","14.08.09 16:51","14.08.09 17:03","14.08.10 16:04","14.08.11 13:33","14.08.12 13:59","14.08.12 14:01","14.08.13 16:54"]},"tournamentCnt":99}',
	data: null
};

/*
 
 
 */

/*
To DO: 


-- update chart
=> done

- fix parser! not only tourns!!
- parse all hands  (parser api regexes)

- date label just min/max and distribute evenly, smart ass.. 

- multi input
- add data instead of replace
=> halfway done
- tooltip data
- general summary data 
- handle large data sets, compress rows
=> halfway done
- fetch tournament info by id
- localstorage store
- chart anim 
=> halfway done
- help section
- iphone design 
- bower install 
- interface redesign (? optional paste text)
- fix navigation mobile

- data corrections!
- omaha cards!

*/