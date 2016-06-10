'use strict';
var PkerJS = PkerJS || {};

PkerJS.Hand = function(hh, options) {

        // data
        this.hand_id = null;
        this.tournament_id = 0;
        this.date = null;
        this.hand = [];
        // this.site=0;
        this.label = '';
        this.game_type = null;
        //this.blinds: null,
        //this.sbSize:"",
        //this.bbSize:"",
        //this.currency=""; // $, 
        //this.players : {},
        //this.streets: {},
        this.win = 0.0; // in tournaments last hand only
        this.loss = 0.0; // cash, zoom only
        this.buyin = 0.0; // tournaments only 

        // content
        this.header = '';
        this.body = '';



        //sanitize
        hh = hh.trim().replace(/\r\n|\r|\n/g, '\n');

        this.getHeader(hh);
        var holdem = this.header.match(/ Hold'em /);
        if (holdem === null) {
            console.log("not a holdem hand");
            this.header = '';
        }
        this.getBody(hh);

        if (this.header && typeof this.header === 'string') {
            this.getHandId();
            this.getDate();
            this.getLabel();
            this.getTournamentId();
            this.getGameType(); 
        }

        if (this.body && typeof this.body === 'string') {
            this.getHand();
            this.getWin();
            if (this.tournament_id) {
                this.getBuyin();
            } else {
                this.getLoss();
            }
        }

    }
    //http://www.phpied.com/3-ways-to-define-a-javascript-class/
PkerJS.Hand.prototype.getData = function() {
    return {
        hand_id: this.hand_id,
        tournament_id: this.tournament_id,
        game_type: this.game_type, 
        label: this.label,
        hand: this.hand,
        date: this.date,
        win: this.win,
        buyin: this.buyin,
        loss: this.loss
    };
};

PkerJS.Hand.prototype.__construct = function(hh, options) {
    var matches = null;
    matches = str.match(PkerJS.Parser.regs.header);
    if (matches === null) {
        console.log('getHeader: parse error hand');
        //throw 'Hand parser exception';
    } else {
        this.header = matches[0];
    }
};

PkerJS.Hand.prototype.getHeader = function(str) {
    var matches = null;

    matches = str.match(PkerJS.Parser.regs.header);
    if (matches === null) {
        console.log('getHeader: parse error hand');
        //throw 'Hand parser exception';
    } else {
        this.header = matches[0];
    }
};

PkerJS.Hand.prototype.getBody = function(str) {
    this.body = str.substr(this.header.length, str.length);
};

// header
PkerJS.Hand.prototype.getHandId = function() {

    var matches = null;
    matches = this.header.match(PkerJS.Parser.regs.hand_id);
    if (matches !== null && matches[1]) {
        this.hand_id = matches[1];
    } else {
        this.hand_id = null;
        console.log('getHandId: parse error hand');

    }

};
PkerJS.Hand.prototype.getGameType = function() {

    var isZoom = this.header.match(PkerJS.Parser.regs.zoomgame) !== null ? true : false;
    var isTournament = this.header.match(PkerJS.Parser.regs.tournament) !== null ? true : false;

    if (!isZoom && !isTournament) {
        this.game_type = PkerJS.Const.CASH;
    } else if (!isZoom && isTournament) {
        this.game_type = PkerJS.Const.TOURNAMENT;
    } else if (isZoom && !isTournament) {
        this.game_type = PkerJS.Const.ZOOM_CASH;
    } else if (isZoom && isTournament) {
        this.game_type = PkerJS.Const.ZOOM_TOURNAMENT;
    }
};
PkerJS.Hand.prototype.getBuyin = function() {

    var matches = null;
    matches = this.header.match(PkerJS.Parser.regs.buyin);

    if (matches === null) {
        console.log('getBuyin: parse error hand');
    } else {
        var str = matches[1].replace(/ USD/g, "").replace(/\$/g, "");
        var sum = 0.0;
        var ps = str.split("+");
        ps.forEach(function(e) {
            var s = parseFloat(e);
            if (!isNaN(s)) {
                sum = sum + s;
            }
        });
        this.buyin = parseFloat(sum);
    }

};
PkerJS.Hand.prototype.getDate = function() {

    var matches = null;
    matches = this.header.match(PkerJS.Parser.regs.date);
    if (matches !== null && matches[1]) {
        this.date = new Date(matches[1]);
    } else {
        this.date = null;
        console.log('getDate: parse error hand');

    }

};
PkerJS.Hand.prototype.getTournamentId = function() {

    var matches = null;
    matches = this.header.match(PkerJS.Parser.regs.tournament);
    if (matches !== null && matches[1]) {
        this.tournament_id = matches[1];
    } else {
        console.log('getTournamentId: parse error hand');

    }

};
PkerJS.Hand.prototype.getSite = function() {

    var matches = null;
    matches = this.header.match(PkerJS.Parser.regs.site);
    if (matches !== null && matches[1]) {
        this.site = PkerJS.Const.POKERSTARS;
    } else {
        console.log('getSite: parse error hand');
    }

};
PkerJS.Hand.prototype.getLabel = function() {

    var matches = null;
    matches = this.header.match(PkerJS.Parser.regs.gameLabel);
    if (matches !== null && matches[2]) {
        this.label = matches[2];


    } else {
        console.log('getLabel: parse error hand');
    }


};

// body
PkerJS.Hand.prototype.getHand = function() {

    var matches = null;
    matches = this.body.match(PkerJS.Parser.regs.userhand);
    if (matches !== null && matches[2]) {
        this.hand = [matches[1], matches[2]];
    } else {
        console.log('getHand: parse error hand');
    }


};

PkerJS.Hand.prototype.getWin = function() {
    var that = this;

    var winningReg = ['winning1', 'winning2', 'winning3'];
    winningReg.forEach(function(reg) {
        var match = PkerJS.Parser.regs[reg].exec(that.body);
        if (match != null && match[1]) {
            var v = parseFloat(match[1]);
            if (!isNaN(v)) {
                if (that.win > 0.0) {
                    console.log("multiple wins");
                }
                that.win = that.win > 0.0 ? parseFloat((that.win + v).toPrecision(2)) : v;
            }
        }
    });

    // split bounty
    var match = PkerJS.Parser.regs.winning5.exec(this.body);
    if (match != null && match) {
        var v = parseFloat(match);
        if (!isNaN(v)) {
            that.win = parseFloat(((v / 2) + that.win).toPrecision(2));
        }
    }



};

PkerJS.Hand.prototype.getLoss = function() {

    var that = this;
    var lossReg = ['loss1', 'loss2', 'loss3', 'loss4'];
    lossReg.forEach(function(reg) {
        var match = PkerJS.Parser.regs[reg].exec(that.body);
        if (match != null && match[1]) {
            var v = parseFloat(match[1]);
            if (!isNaN(v)) {
                that.loss = that.loss > 0.0 ? parseFloat((that.loss + v).toPrecision(2)) : v;
            }
        }
    });


};