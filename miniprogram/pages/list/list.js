var app = getApp();
const db = wx.cloud.database();
const gamesSignUp = db.collection('gamesSignUp');
var util = require('../../utils/formattime.js')
Page({
  data: {
      gamelists:null,
      userName:null,
      userAvatarUrl:null,
      canIUse: wx.canIUse('button.open-type.getUserInfo')
  },


  onLoad: function (options) {
    wx.getSetting({
      success (res){
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function(res) {
              // console.log(res.userInfo)
            }
          })
        }
      }
    })
    this.getData();
  },

  getData: function(callback){
    if(!callback){
      callback = res=>{} /**如果callback不是一个函数则使用箭头函数构造一个空函数 */
    }
    wx.showLoading({
          title: '加载中...',
        });
    gamesSignUp.where({effect:"true"}).orderBy('creattime','desc')
    .get()
    .then(res => { /**then是在执行完前面get()之后执行then之内的语句 */
      // console.log(res);
      this.data.gamelists=res.data;

      for(var i=0 ; i<res.data.length ; i++){
        this.data.gamelists[i].starttime = util.formatTime(res.data[i].starttime);
        this.data.gamelists[i].endtime = util.formatTime(res.data[i].endtime);
        this.data.gamelists[i].cutofftime = util.formatTime(res.data[i].cutofftime);
        this.data.gamelists[i].nowplayernums = res.data[i].playerlist.length;
       };
        this.setData({
          gamelists:res.data
        }),
      // res.data[0].cutofftime = res.data[0].cutofftime.toLocaleString();
      // res.data[0].starttime = res.data[0].starttime.toLocaleString();
      // res.data[0]. bvcx     5e4837™endtime = res.data[0].endtime.toLocaleString(); /**将数据库中的date格式输出为字符串 */
/**这里的逗号起到连接作用，和之前的语句形成一个语句串 */
     res => {callback();}/**构建一个箭头函数把callbcak作为返回值，实现了可以空值调用getData函数也有返回值的目的 */
      wx.hideLoading();
    })
  },

toInfopage:function(options){
   wx.navigateTo({
    url: "../info/info?id="+options.currentTarget.dataset.id,
    success: (result)=>{
    },
    fail: ()=>{},
    complete: ()=>{}
  });
},
bindGetUserInfo (e) {
  console.log(e.detail.userInfo)
  app.globalUserData.userInfo = e.detail.userInfo.nickName;
  

  this.setData({
    userName:e.detail.userInfo.nickName,
    userAvatarUrl:e.detail.userInfo.avatarUrl
  })
  
},
goAddPage:function(options){
  console.log(options)
    wx.navigateTo({
      url:"../add/add?name="+options.currentTarget.dataset.username+"&ava="+options.currentTarget.dataset.avatarurl
    })

}
})