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
  that.onGetUserInfo();
  that.pageData.indexId = options.id
  that.getData(that.pageData.indexId ,app.globalUserData.userInfo.uid)
    /**读取数据 */
  },/**先判断是否是登录，然后点击button，获取用户头像 */

  /**下拉刷新 */
  onPullDownRefresh: function(){
    var that = this;
    that.getData(res => {
       wx.stopPullDownRefresh();
      });
  },

/**数据获取函数 */
getData: function(value,uid){
  
  var that = this;
      if(!value){
        value = res=>{} /**如果callback不是一个函数则使用箭头函数构造一个空函数 */
      }
      wx.showLoading({
            title: '加载中...',
          });
      db.collection('gamesSignUp').where({_id:value})
      .get().then(res => { 
          /**then是在执行完前面get()之后执行then之内的语句 */
          res.data[0].latitude = res.data[0].fieldgeoinfo.latitude; 
          res.data[0].longitude = res.data[0].fieldgeoinfo.longitude; 
          that.onGetAllPlayer(res.data[0].playerlist) 
          that.onCheckInUser(res.data[0].playerlist,value)
          that.pageData.userObj=res.data[0].playerlist
            that.setData({
              playInfo:res.data
            }),
            res => {
              value();
            }
              /**这里的逗号起到连接作用，和之前的语句形成一个语句串 */
              /**构建一个箭头函数把callbcak作为返回值，实现了可以空值调用getData函数也有返回值的目的 */
            wx.hideLoading();
              /**判断当前用户的openid是否在已报名列中，如果没有则显示“报名这个活动”，如果存在则显示“退出这个活动” */
    })
    return
  },
  /**判断是否已报名 */
  onCheckInUser(value,gid){
    var that = this
      for(var i in  value){
            if(value.hasOwnProperty(i))
            {
              if(value[i]== app.globalUserData.userInfo.uid){
                that.setData({
                  nickName:'in',
                  gameid:gid,
                  uopenid:app.globalUserData.userInfo.uid
                })
                break
              }else{
                that.setData({
                  nickName:'nin',
                  gameid:gid,
                  uopenid:app.globalUserData.userInfo.uid
                })
              }
            }
    }
  },
/**获取到所有的用户组 */
onGetAllPlayer(value){
      var that = this
      let players=[]
      let count = 0
      for(var i in value){
        if(value.hasOwnProperty(i)){
          players.push(value[i])
        }
        count ++
      }
      while(count == 1){
        var singlePlayer = players[0]
        that.onGetSinglePlayer(singlePlayer)
        break
      }
      while(count > 1){
        that.onGetIntoPlayer(players)
        break
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
    that.onRefresh()
},
/**报名活动 */
onCheckIN:function(e){
  var that = this;
  let obj = that.pageData.userObj;
  obj[that.pageData.nName]=app.globalUserData.userInfo.uid;

  console.log(obj)
  that.updatePlayerList(e.currentTarget.dataset.gameid,obj)
  that.onRefresh()
},

/**数据库更新 */
updatePlayerList:function(id,obj){
  var that = this;
    /**准备回传构建的报名者用户数组更新数据库中对应的id记录 */
    db.collection('gamesSignUp').doc(
      id
    ).update({
        data:{
          playerlist:_.set(obj)/**知识点对数列或者对象局部更新 */
        },
        success:function(res){
          wx.showToast({
            title: '正在刷新',
            icon: 'none',
            duration:1500
          });
        },
        fail(){
          wx.showToast({
            title: '获取失败',
            icon: 'none'
          });
        }
    })
    
},

onRefresh:function(){
  var that = this;
  that.getData(that.pageData.indexId,app.globalUserData.userInfo.uid)
  },
  // onReachBottom:function(){
  //   that.getData();
  // }/**触底刷新 */
  
onGetUserInfo(){
  var that = this;
    wx.getSetting({
      success: (result)=>{
        if (result.authSetting['scope.userInfo']){
          wx.getUserInfo({
            withCredentials: 'false',
            lang: 'zh_CN',
            timeout:10000,
            success: (result)=>{
              that.pageData.nName =result.userInfo.nickName/**获取用户名用于判断是否授权 */
            }
        })
      }}
    })
  },
})