var app = getApp();
const db = wx.cloud.database();
const _ = db.command;
var util = require('../../utils/formattime.js')
Page({
  data: {
      gamelists:null,
      showButton:false,
      canIUse: wx.canIUse('button.open-type.getUserInfo')
  },


  onLoad: function (options) {
    var that = this;
    /**调用全局userinfo变量 判断是否有获得数据没有就显示授权按钮，有就显示创建活动按钮*/
    wx.cloud.callFunction({
      name:'login',
      data:{},
       success:res=>{
         app.globalUserData.userInfo.uid =  res.result.openid
       },fail:err=>{}
    });
    
    that.getData();

  },

  getData: function(callback){
        var that = this;
        if(!callback){
          callback = res=>{} /**如果callback不是一个函数则使用箭头函数构造一个空函数 */
        }
        wx.showLoading({
              title: '加载中...',
            });
        db.collection('gamesSignUp').where({
          effect:"true"
        }).orderBy(
          'creattime','desc'
          ).get()
        .then(res => { /**then是在执行完前面get()之后执行then之内的语句 */
          // console.log(res)
            that.setData({
              gamelists:res.data
            }),
         /**这里的逗号起到连接作用，和之前的语句形成一个语句串 */
        res => {callback();}
        /**构建一个箭头函数把callbcak作为返回值，实现了可以空值调用getData函数也有返回值的目的 */
          wx.hideLoading();
        })
  },

toInfopage:function(options){
  var that = this;
   wx.navigateTo({
    url: "../info/info?id="+options.currentTarget.dataset.id,
    success: (result)=>{
    },
    fail: ()=>{},
    complete: ()=>{}
  });
},

bindGetUserInfo (e) {
  var that = this;
    wx.cloud.callFunction({
      name:'login',
      data:{},
       success:res=>{
         app.globalUserData.userInfo.uid =  res.result.openid
         wx.getSetting({
          success (res){
            if (res.authSetting['scope.userInfo']) {
              // 已经授权，可以直接调用 getUserInfo 获取头像昵称
              wx.getUserInfo({
                success: function(res) {
                  app.globalUserData.userInfo.nickName = res.userInfo.nickName;
                  app.globalUserData.userInfo.avatarUrl = res.userInfo.avatarUrl;
                }
              })
            }
          }
        })
       },fail:err=>{}
    });
    /**用全局用户变量是否获取到用户信息，有则显示创建活动，没有则显示授权按钮 */
    that.setData({
      showButton:true
    })
},
goAddPage:function(options){
  // console.log(options)
    wx.redirectTo({
      url:"../add/add"
    })

}
})