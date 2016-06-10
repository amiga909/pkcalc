'use strict';
var PkerJS = PkerJS || {};

PkerJS.Parser = {
	userName: "",
	hands: {},
	//tournaments: {}, 
	//tId: null,
	inputBuffer: "",
	regs: {
		'hand': /\*\*\*\*\*\*\*\*\*\*\* # [0-9]+ \*\*\*\*\*\*\*\*\*\*\*\*\*\*/g,
		'hand_1': /Hand #[0-9]+[\r\n|\r|\n]+/g,
		'hand_id': /PokerStars Hand #([0-9]+):/,
		'splitReg': null,
		// for the game info, get the first 3 lines just to be safe (for example, HEM adds an extra line above the original hh)
		'header': /^.*\n.*\n.*$/m,
		'site': /PokerStars/,
		'gameLabel': /PokerStars(.*) Hand .+: (.+) - /,
		'blinds': /([\$\d\.]+)\/([\$\d\.]+)/, //'sbAmount': matches[1],'bbAmount': matches[2]
		'buttonSeatNumber': /Seat #(\d) is the button$/m,
		'playersData': /^Seat (\d): (.+) \(([\$\d\.]+)[ \)]/mg, // 'seatNumber': parseInt(matches[1]),'username': matches[2],'stackAmount': matches[3]
		'streets': {
			'preflop': /^(.+:? posts [^\*]+\*\*\* HOLE CARDS \*\*\*[^\*]+)\*\*\*/m,
			'flop': /^\*\*\* FLOP \*\*\*([^\*]+)\*\*\*/m,
			'turn': /^\*\*\* TURN \*\*\*([^\*]+)\*\*\*/m,
			'river': /^\*\*\* RIVER \*\*\*([^\*]+)\*\*\*/m,
			'result': /^\*\*\* SUMMARY \*\*\*([^]+)$/m
		},
		'tournament': /Tournament #([0-9]+)./,
		'date': /([0-9]+\/[0-9]+\/[0-9]+ [0-9]+:[0-9]+:[0-9]+)/,
		'zoomgame': /Zoom Hand #/,


		// note, double escaped because of string manipulation before new RegExp
		'username': 'Dealt to _USER_', // /Dealt to USERNAME/
		'userhand': 'Dealt to _USER_ \\[([A-Z|0-9][a-z]) ([A-Z|0-9][a-z])\\]', //Dealt to selfway [Kc 8h]
		'winning1': '_USER_ wins .* _CASH_', // /USERNAME wins/
		'winning2': '_USER_ finished the tournament .* and received _CASH_',
		// cash game
		'winning3': '_USER_ .* won _CASH_',
		// cash game
		// not necessary! always followed by 'and won' in summary
		//	'winning4': '_USER_ .* collected _CASH_', // !!!: selfway collected $0.86 from pot, Seat 9: selfway collected ($0.86)
		// tournament bounty split
		'winning5': '_USER_, .* split the _CASH_',
		//'winning1_cash': /\$([0-9]+[\.|,]?[0-9]*) /,
		//'winning2_cash': /\$([0-9]+\.[0-9]+)/,
		'buyin': /Tournament #[0-9]+, ([^ ]+) /,
		'money': '\\$[\\(]?([0-9]+\\.[0-9]+)[\\(]?', // |£|€  // $4200.0
		'loss1': '_USER_: posts .* _CASH_', // selfway: posts big blind $0.10
		'loss2': '_USER_: bets .* _CASH_', // selfway: bets $0.90  
		'loss3': '_USER_: calls .* _CASH_', // selfway: calls $0.20
		'loss4': '_USER_: raises .* to _CASH_', // selfway: raises $0.20 to $0.30
	},
	// to do fulltilt
	regs_fulltilt: {
		'site': /Full Tilt Poker/,
		'hand_id': /Full Tilt Poker Hand #([0-9]+):/,
		'gameLabel': '/Full Tilt Poker[^-]+ - (.+) - \d\d:\d\d/',
		'buttonSeatNumber': '/^The button is in seat #(\d+)$/m',
	},
	init: function() {
		this.userName = "";
		this.hands = {};
		this.games = [];
	},
	setBuffer: function(b) {
		this.inputBuffer = b;
	},
	setUserName: function(userName) {
		var that = this;
		this.userName = userName;
		var regReplaceUserName = ['username', 'userhand', 'winning1', 'winning2', 'winning3',
			'winning5', 'loss1', 'loss2', 'loss3', 'loss4'
		];
		var regReplaceCash = ['winning1', 'winning2', 'winning3', 'winning4', 'winning5', 'loss1', 'loss2', 'loss3', 'loss4'];
		regReplaceUserName.forEach(function(r) {
			if (r in that.regs) {
				that.regs[r] = that.regs[r].replace("_USER_", that.userName);
			}
		});
		regReplaceCash.forEach(function(r) {
			if (r in that.regs) {
				that.regs[r] = that.regs[r].replace("_CASH_", that.regs.money);
			}
		});
		this.regs.userhand = new RegExp(this.regs.userhand);
		this.regs.username = new RegExp(this.regs.username + this.userName);

		this.regs.winning1 = new RegExp(this.regs.winning1);
		this.regs.winning2 = new RegExp(this.regs.winning2);
		this.regs.winning3 = new RegExp(this.regs.winning3);

		this.regs.winning5 = new RegExp(this.regs.winning5);


		this.regs.loss1 = new RegExp(this.regs.loss1);
		this.regs.loss2 = new RegExp(this.regs.loss2);
		this.regs.loss3 = new RegExp(this.regs.loss3);
		this.regs.loss4 = new RegExp(this.regs.loss4);
	},
	getSample: function(data) {
		// substr() accepts values that are larger than string length
		var sample = data.substring(0, 1000);
		return sample;
	},


	mergeHands: function(hands) {
		var that = this;
		var handId = "";
		hands.forEach(function(hand) {

			//if(gameId  === ''){
			//	that.games
			//}else{
			var game = new PkerJS.Game(hand);
			that.game[game.game_id] = game;
			//}

		});
	},
	removeEvenMoneyHands: function(hands) {
		var filtered = null;
		filtered = _.filter(hands, function(data) {
			return data.win > 0.0 || data.loss > 0.0 || data.buyin > 0.0;
		});
		return filtered;
	},
	removeMultipleBuyins: function(hands) {
		var filtered = hands;
		var lookUp = {};
		for (var i = 0; i < _.size(filtered); i++) {
			if (filtered[i].tournament_id > 0) {
				if (lookUp[filtered[i].tournament_id] !== true) {
					lookUp[filtered[i].tournament_id] = true;
				} else {
					if (filtered[i].win > 0.0) {
						// cash out hand or bounty win 
						filtered[i].buyin = 0.0;
					} else {
						filtered[i].doFilter = true;
					}
				}
			}
		}
		filtered = _.filter(filtered, function(data) {
			return data.doFilter !== true;
		});
		return filtered;
	},
	isValid: function(text) {
		var that = this;
		var isValid = false;
		var sample = this.getSample(text);
		if (that.regs.splitReg !== null) {
			isValid = true;
		} else {
			if (that.regs.hand.test(sample)) {
				that.regs.splitReg = that.regs.hand;
				isValid = true;
			} else if (that.regs.hand_1.test(sample)) {
				that.regs.splitReg = that.regs.hand_1;
				isValid = true;
			}
		}

		return isValid;
	},
	parse: function(text) {
		var that = this;
		var procHands = null;
		var result = null;
		var size = 0;

		if (that.regs.splitReg === null && !that.isValid(text)) {
			throw 'invalid format, no input parse splitter found';
		}

		var newHands = that.parseHands(text, that.regs.splitReg);
		if (that.hands.length > 0) {
			that.mergeHands(newHands);
		} else {
			that.hands = newHands;
		}
		size = _.size(that.hands);
		if (size > 0) {
			that.parseGames();
		}


		result = {
			'games': that.games,
			'hands': that.games,
			'stat': {
				'total_hands': size,
				'displayed_hands': _.size(that.games),
			}
		};
		return result;

	},
	parseHands: function(text, splitReg) {
		var that = this;
		var hand = null;
		var hands = {};
		var handChunks = text.split(splitReg);
		handChunks.forEach(function(block) {
			hand = new PkerJS.Hand(block);
			var data = hand.getData();
			hand = null;
			if (data.hand_id !== null && data.date !== null) {
				hands[data.hand_id] = data;
			}
		});
		return hands;

	},
	parseGames: function() {
		var that = this;
		that.games = that.removeEvenMoneyHands(that.hands);
		that.games = PkerJS.Data.sortHashArrayByDate(that.games);
		that.games = that.removeMultipleBuyins(that.games);
	}

};