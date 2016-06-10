'use strict';
var PkerJS = PkerJS || {};

PkerJS.ListView = {
  css: {
    container: '#list-view'
  },
  cardImgMap: {
    'T': 10,
    'J': 11,
    'Q': 12,
    'K': 13,
    'A': 14
  },
  init: function() {
    var that = this;
    this.$container = $(this.css.container);
  },
  render: function(data) {
    var that = this;
    var content = '';
    if (data.hands && data.hands.length > 0) {
      _.each(data.hands, function(row) {  
        var cards = that.getPlayerCards(row.hand[0], row.hand[1]);
        var win = row.win != 0.0 ? '<span class="list-view-win">' + row.win + '</span>' : '';

        var loss = row.loss != 0.0 ? '<span class="list-view-loss">' + row.loss + '</span>' : '';
        loss = row.buyin != 0.0 ? '<span class="list-view-loss">' + row.buyin + '</span> (Buyin)' : loss;
          
        var gameType = row.game_type == 1 ? '' : row.game_type; 

          gameType = row.game_type == 2 ? 'Cash Game ' : gameType;
          gameType = row.game_type == 3 ? 'Zoom Cash Game ' : gameType;
          gameType = row.game_type == 4 ? 'Zoom Tournament ' : gameType;
 

        content += '<li class="collection-item avatar">' +
          '<span class="list-view-img">' +
          '<img src="assets/img/cards/' + cards[0] + '.png" alt="" class=" ">' +
          '<img src="assets/img/cards/' + cards[1] + '.png" alt="" class=" ">' +
          '</span>' +
          '<span class="list-view-id">#' +
          row.hand_id +
          '</span>' +
          '<span class="list-view-date">' +
          PkerJS.Data.toDateStr(row.date) +
          '</span>' +
          '<span class="list-view-title">' +
          gameType + "" + row.label +
          '</span>' +
          '<p class="list-view-body">' +
          win + loss +
          ' </p>' +
          '</li>';

      });
      this.$container.html('');

      this.$container.html(content);
    }
    this.$container.show();
  },
  getPlayerCards: function(handStr1, handStr2) {
    var that = this;
    if (handStr1) {
      _.each(that.cardImgMap, function(k, v) {
        handStr1 = handStr1.replace(v, k);
      });
    }
    if (handStr2) {
      _.each(that.cardImgMap, function(k, v) {
        handStr2 = handStr2.replace(v, k);
      });
    }
    return [handStr1, handStr2];
  }
};