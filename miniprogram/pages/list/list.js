const db = wx.cloud.database();
const gamesSignUp = db.collection('gamesSignUp');
var util = require('../../utils/formattime.js')
Page({
  data: {

  },

  onLoad: function (options) {
    gamesSignUp.where({
      effect:"ture"
    }).orderBy(
      'creattime','desc'
    ).get().then(console.log);
 
  },

  onPullDownRefresh: function () {

  },


})