'use strict';
var PkerJS = PkerJS || {};

PkerJS.ErrorMessage = {
	durations: {
		visible: 8000,
		fadeout: 1000
	},
	errorCnt: 0,
	css: {
		container: '#canvasusrmsg_cont',
		content: '#canvasusrmsg'
	},
	moods: {
		sad: ['Bad Luck,', 'Ahhhhh not!', 'Sick..'],
		polite: ['Sorry,', 'Oh dear!'],
		blunt: ['Oops!', 'Whoops,', 'Outch!', 'Urgh...'],
		cool: ['Aw, Snap!', 'Geez...', 'Get outta here...'],
		calm: ['Hey..'],
		placatory: ['Well,', 'Dude...'],
		ashamed: ['Ahem...', 'Hmmm...'],
		angry: ['Ah Hell No!'],
		panicky: ['Mayday mayday!!', 'Sooo sick!!'],
	},
	topics: {
		'fileupload': ['A butterfly is in your hard disk.']
			/*
A golden screw was found in your wall
How much wood would a Woodchuck chuck, if a Woodchuck could chuck wood.
amiga: Software Failure. Guru Meditation #00000004, 8888AAC8
Always remember, Frodo, the data is trying to get back to its master. It wants to be found.
What we've got here is... failure to communicate. 
Dude, where's my chart
Houston, we got a problem. 
			*/
	},
	init: function() {
		this.$container = $(this.css.container);
		this.$content = $(this.css.content);
		this.errorCnt = 0;
		this.listen();
	},
	listen: function() {
		var that = this;
		that.$container.on('click', function() {
			that.resetContent();
		});
	},
	resetContent: function() {
		var that = this; if (that.timer > 0) {
			clearTimeout(that.timer);
		}
		that.$container.hide();
		that.$content.html('');
	},
	pickSalutation: function(mood, topic) {
		var m = this.moods[mood];
		var rand = Math.floor(Math.random() * m.length);
		return m[rand];
	},
	enhanceMsg: function(str) {
		// capitalize first letter
		str = str.charAt(0).toUpperCase() + str.slice(1);
		return str;
	},
	render: function(content, isFirst) {
		if (!isFirst) {
			this.$content.find("ul").append('<li>' + content + '</li>');
		} else {
			this.$content.html('<ul><li>' + content + '</li></ul>');
		}
	},
	show: function(msg, mood) {
		var that = this;
		var content = that.pickSalutation(mood) + " " + that.enhanceMsg(msg);
		var isFirst = that.$content.html() == '' ? true : false;
		that.render(content, isFirst);

		that.$container.show();
		if (that.timer > 0) {
			clearTimeout(that.timer);
		}
		that.timer = setTimeout(function() {
			that.$container.fadeOut(that.durations.fadeout, function() {
				that.resetContent();
				that.$content.html('');
				that.$container.hide();
			});
		}, that.durations.visible);


	},
}