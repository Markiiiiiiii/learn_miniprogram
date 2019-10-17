var app = getApp();
const db = wx.cloud.database();
const _ = db.command;
var util = require('../../utils/formattime.js')
Page({
  data: {
    gamelists: null,
    showButton: -1,
    adminButton: -1,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    visible: false,
    // buttons
  },


  onLoad: function (options) {
    var that = this;
    /**调用全局userinfo变量 判断是否有获得数据没有就显示授权按钮，有就显示创建活动按钮*/
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        app.userInfo._openid = res.result.openid
      },
      fail: err => {}
    });
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              app.userInfo.nickName = res.userInfo.nickName;
              app.userInfo.avatarUrl = res.userInfo.avatarUrl;
            }
          })
        }
      }
    })
    if (app.userInfo.nickName || app.userInfo.avatarUrl) {
      that.setData({
        showButton: 1
      })
    }
    that.getData();
  },
  onShow: function () {
    this.onLoad()
  },
  getData: function (callback) {
    var that = this;
    let signedPlayer = 0;
    if (!callback) {
      callback = res => {} /**如果callback不是一个函数则使用箭头函数构造一个空函数 */
    }
    wx.showLoading({
      title: '加载中...',
    });
    db.collection('gamesSignUp')
      // .where({effect:"true"})
      .orderBy(
        'creattime', 'desc'
      ).limit(20).get()
      .then(res => {
        /**then是在执行完前面get()之后执行then之内的语句 */
        for (var i = 0; i < Object.keys(res.data).length; i++) {
          res.data[i].playernumb = Object.getOwnPropertyNames(res.data[i].playerlist).length
        } /**计算已报名人数 */
        that.setData({
          gamelists: res.data
        })
        /**这里的逗号起到连接作用，和之前的语句形成一个语句串 */
        res => {
          callback();
        }
        /**构建一个箭头函数把callbcak作为返回值，实现了可以空值调用getData函数也有返回值的目的 */
        wx.hideLoading();
      })
  },

  toInfopage: function (options) {
    var that = this;
    wx.navigateTo({
      url: "../info/info?id=" + options.currentTarget.dataset.id,
      success: (result) => {},
      fail: () => {},
      complete: () => {}
    });
  },

  bindGetUserInfo: function (e) {
    var that = this;
    that.onCheckUser(app.userInfo);
    /**用全局用户变量是否获取到用户信息，有则显示创建活动，没有则显示授权按钮 */
    that.setData({
      showButton: 1
    })
  },
  goAddPage: function (options) {
    wx.redirectTo({
      url: "../add/add"
    })

  },
  /**用户数据库内容信息检索更新 */
  onCheckUser: function (value) {
    var that = this;
    db.collection('gamesPlayer').where({
      _openid: value._openid
    }).get().then(
      res => {
        if (res.data.length == 0) {
          /**判断用户表中是否存在当前用户，没有则添加当前用户 */
          that.onAddPlayer(value);
        } else {
          /**判断用户的nickname和avatarURL是否有变化有的话更新数据库 */
          if (res.data[0].nickName != value.nickName || res.data[0].avatarUrl != value.avatarUrl) {
            /**检索用户的nickname和头像是否发生改变，如果发生改变则更新原有的信息*/
            that.updatePlayer(res.data[0]._id, value)
            db.collection('gamesPlayer').doc(res.data[0]._id)
              .update({
                data: {
                  nickName: _.set(value.nickName),
                  avatarUrl: _.set(value.avatarUrl)
                }
              })
              .then(console.log)
          }
          /** 判断用户是不是管理员身份，有的话显示创建活动按钮*/
          if(res.data[0].admin == "true"){
            that.setData({
              adminButton:1
            })

          }
        }
      });

    /**技巧：必须在数据表中设置一个_openid字段，来用于鉴权，如果没有该字段则数据库不执行更新动作 */
  },
  updatePlayer: function (id, value) {

    console.log(value)
    db.collection('gamesPlayer').doc(id)
      .update({
        data: {
          nickName: _.set(value.nickName),
          avatarUrl: _.set(value.avatarUrl)
        }
      })
      .then(res => console.log(res))
  },
  /**添加用户信息，tips：不能在添加语句中使用_openid字段，_openid必须由系统自动添加，用户添加则会出现执行错误。 */
  onAddPlayer: function (value) {
    var that = this;
    db.collection('gamesPlayer').add({
      data: {
        nickName: value.nickName,
        avatarUrl: value.avatarUrl
        // _openid:value._openid
      }
    }).then(console.log)
  },
  hide() {
    this.setData({
      visible: false,
    })
  },
  onChange(e) {
    this.setData({
      visible: e.detail.visible,
    })
  }
})