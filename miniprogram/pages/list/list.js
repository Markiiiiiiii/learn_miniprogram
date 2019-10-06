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
    // wx.cloud.callFunction({
    //   name:'login',
    //   data:{},
    //    success:res=>{
    //      app.globalUserData.userInfo._openid =  res.result.openid
    //    },fail:err=>{}
    // });
    
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
  console.log(app.globalUserData.userInfo)
  
   wx.navigateTo({
    url: "../info/info?id="+options.currentTarget.dataset.id,
    success: (result)=>{
    },
    fail: ()=>{},
    complete: ()=>{}
  });
},

bindGetUserInfo:function(){
  var that = this;
    wx.cloud.callFunction({
      name:'login',
      data:{},
       success:res=>{
         console.log(res)
         app.globalUserData.userInfo._openid =  res.result.openid
       },fail:err=>{}
    });
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
    that.onCheckUser(app.globalUserData.userInfo);
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

},
/**用户数据库内容信息检索更新 */
onCheckUser:function(value){
  var that = this;
  console.log(JSON.stringify(value))
  db.collection('gamesPlayer').where({
          _openid: value._openid
      }).get().then(
        res=>{
          
         if(res.data.length == 0){/**判断用户表中是否存在当前用户，没有则添加当前用户 */
            that.onAddPlayer(value);
         }else{
          //  console.log(value)
          if(res.data[0].nickName !=value.nickName || res.data[0].avatarUrl != value.avatarUrl)
          {
            console.log(value.nickName)
            // wx.cloud.callFunction({
            //   name:'playerupgrade',
            //   data:{
            //     _id:res.data[0]._id,
            //     nickName:value.nickName,
            //     avatarUrl:value.avatarUrl
            //   },success:res=>{
            //     console.log(res)
            //   }
            // })
            // that.updatePlayer(res.data[0]._id,value)
            // db.collection('gamesPlayer').doc(res.data[0]._id)
            // .update({
            //   data:{
            //     nickName:_.set(value.nickName),
            //     avatarUrl:_.set(value.avatarUrl)
            //   }
            // })
            // .then(console.log)
         } 
         }
      });
        
/**技巧：必须在数据表中设置一个_openid字段，来用于鉴权，如果没有该字段则数据库不执行更新动作 */
},
updatePlayer:function(id,value){

  console.log(value)
  db.collection('gamesPlayer').doc(id)
  .update({
    data:{
      nickName:_.set(value.nickName),
      avatarUrl:_.set(value.avatarUrl)
    }
  })
  .then(res=>console.log(res))
},
/**添加用户信息，tips：不能在添加语句中使用_openid字段，_openid必须由系统自动添加，用户添加则会出现执行错误。 */
onAddPlayer: function(value){
  var that = this;
  // console.log(value._nickName);
  db.collection('gamesPlayer').add({
          data:{
            nickName:value.nickName,
            avatarUrl:value.avatarUrl
            // _openid:value._openid
          }
        }).then(console.log)
},

})