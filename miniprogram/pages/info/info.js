// miniprogram/pages/index/index.js
var app = getApp();
var util = require('../../utils/formattime.js');
const db = wx.cloud.database({
    env:'biggoose-d92594'
});
const _ = db.command;

/**为数组增加自删功能 */
Array.prototype.indexOf = function (val){
  var that = this;
  for (var i = 0;i<that.length;i++){
    if (that[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function(val){
  var that = this;
  var index = that.indexOf(val);
  if(index > -1){
    that.splice(index,1);
  }
};

Page({

  /**
   * 页面的初始数据
   */
  data: {
      playInfo:null,
      canIUse: wx.canIUse('button.open-type.getUserInfo'),
      nickName:'nin',
      playernames:null,
      uopenid:null,
      gameid:null
  },
  pageData:{
      indexId:null,
      playerArray:[],
      userObj:{},
      nName: null
  },
  userData:{
      _openid:[],
      uid:null
  },

onLoad: function (options) {
  var that = this;
  // that.onGetUserInfo();
  that.pageData.indexId = options.id
  that.getData(options.id ,app.userInfo._openid)    
  },

/**数据获取函数 */
getData: function(iid,uid){
  var that = this;
      if(!iid){
        value = res=>{} /**如果callback不是一个函数则使用箭头函数构造一个空函数 */
      }
      wx.showLoading({
            title: '加载中...',
          });
      db.collection('gamesSignUp').where({_id:iid})
      .get().then(res => { 
          /**then是在执行完前面get()之后执行then之内的语句 */
          // res.data[0].latitude = res.data[0].fieldgeoinfo.latitude; 
          // res.data[0].longitude = res.data[0].fieldgeoinfo.longitude; 
          that.onGetAllPlayer(res.data[0].playerlist) 
          that.onCheckInUser(res.data[0].playerlist,uid,iid)
          that.pageData.userObj=res.data[0].playerlist
            that.setData({
              playInfo:res.data
            }),
           
              /**这里的逗号起到连接作用，和之前的语句形成一个语句串 */
              /**构建一个箭头函数把callbcak作为返回值，实现了可以空值调用getData函数也有返回值的目的 */
            wx.hideLoading();
              /**判断当前用户的openid是否在已报名列中，如果没有则显示“报名这个活动”，如果存在则显示“退出这个活动” */
    })

  },
  /**判断是否已报名 */
  onCheckInUser(obj,uid,iId){
    var that = this
    if(JSON.stringify(obj)=='{}'){
      that.setData({
        nickName:'nin',
        gameid:iId,
        uopenid:uid
      })
    }else{
      for(var i in  obj){
            if(obj.hasOwnProperty(i))
            {
              if(obj[i]==uid){
                that.setData({
                  nickName:'in',
                  gameid:iId,
                  uopenid:uid
                })
                break
              }else{
                that.setData({
                  nickName:'nin',
                  gameid:iId,
                  uopenid:uid
                })
              }
            }
    }}
  },
/**获取到所有的用户组 */
onGetAllPlayer(value){
      var that = this
      let players=[]
      let count = 0
      if(JSON.stringify(value) == '{}'){
        that.setData({
          playernames:{}
        })
      }else{
      for(var i in value){
        if(value.hasOwnProperty(i)){
          players.push(value[i])
        }
        count ++
      }/**判断存储的已报名用户对象的长度 */
      while(count == 1){
        var singlePlayer = players[0]
        that.onGetSinglePlayer(singlePlayer)
        break
      }
      while(count > 1){
        that.onGetIntoPlayer(players)
        break
      }
    }
},

  /**查询返回报名用户的信息 */
  onGetIntoPlayer:function(value){
    /**嵌套查询用户表中符合_openid的player的用户信息 */
    var that = this;
    db.collection('gamesPlayer').where({
          _openid:_.in(value)
        })
        .get({
            success:function(res){
              that.setData({
                playernames:res.data
              })
            },
            fail(){
              wx.showToast({
                title: '获取失败',
                icon: 'none'
              });
            }
        })

  },

  onGetSinglePlayer:function(value){
    /**嵌套查询用户表中符合_openid的player的用户信息 */
    var that = this;
    db.collection('gamesPlayer').where({
          _openid:value
        })
        .get({
            success:function(res){
              that.setData({
                playernames:res.data
              })
            },
            fail(){
              wx.showToast({
                title: '获取失败',
                icon: 'none'
              });
            }
        })

  },

/**退出报名 */
onCheckOut:function(e){
  var that = this;
  let obj = that.pageData.userObj;
    for(var i in obj){
      if(obj[i] == e.currentTarget.dataset.userid){
        delete obj[i]
      }
    } 
    that.updatePlayerList(e.currentTarget.dataset.gameid,obj)
    // that.updateGameplayer(e.currentTarget.dataset.gameid)
    that.onRefresh()
    that.prePageRef()
},
/**报名活动 */
onCheckIN:function(e){
  var that = this;
  let obj = that.pageData.userObj;
  // that.onGetUserInfo();
  obj[app.userInfo.nickName]=app.userInfo._openid;
  that.updatePlayerList(e.currentTarget.dataset.gameid,obj)
  // that.updateGameplayer(e.currentTarget.dataset.gameid)
  that.onRefresh()
  that.prePageRef()
},
// /**用户数据库更新 */
// updateGameplayer:function(id){
//   var that = this;
//   db.collection('gamesPlayer').doc(id).get({
//     success:function(res){console.log(res)},
//     fail:function(res){console.log('error')}
//   })
// },

/**活动数据库更新 */
updatePlayerList:function(id,obj){
    var that = this;/**d使用云函数更新数据库 */
    wx.cloud.callFunction({
      name:'playerupdate',
      data:{
        _id:id,
        playerobj:obj
      },
      success:res =>{
        console.log(res)
      }
    })
},

onRefresh:function(){
  var that = this;
  console.log(that.pageData.indexId,app.userInfo._openid)
  setTimeout(() => {
    that.getData(that.pageData.indexId,app.userInfo._openid)
  }, 1000);
  },
/**触底刷新 */
onReachBottom:function(){
  var that = this;
  setTimeout(() => {
    that.getData(that.pageData.indexId,app.userInfo._openid)
  }, 1000);
  },
/**下拉刷新 */
onPullDownRefresh: function(){
    var that = this;
    setTimeout(() => {
      that.getData(that.pageData.indexId,app.userInfo._openid)
    }, 1000);
  },

openMap:function(e){
    wx.openLocation({
      latitude: e.currentTarget.dataset.latitude,
      longitude: e.currentTarget.dataset.longitude,
      scale: 18,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
},
/**刷新list页面数据 */
prePageRef:function(){
  var curPages =  getCurrentPages();
  if(curPages.length >1){
      var prePage = curPages[curPages.length -2];
      prePage.onShow()
  }
}
// onGetUserInfo(){
//   var that = this;
//     wx.getSetting({
//       success: (result)=>{
//         if (result.authSetting['scope.userInfo']){
//           wx.getUserInfo({
//             withCredentials: 'false',
//             lang: 'zh_CN',
//             timeout:10000,
//             success: (result)=>{
//               that.pageData.nName =result.userInfo.nickName/**获取用户名用于判断是否授权 */
//             }
//         })
//       }}
//     })
//   },
})