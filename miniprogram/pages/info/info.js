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
    nickName:null,
    playernames:null,
    uopenid:null,
    gameid:null
    },
  pageData:{
      indexId:null,
      playerArray:[],
      _userInfo:{}
  },
  userData:{
    _openid:[],
    uid:null
  },

onLoad: function (options) {
  var that = this;
  //   wx.getSetting({
  //   success: (result)=>{
  //     if(result.authSetting['scope.userInfo']){
  //       wx.getUserInfo({
  //         withCredentials: 'false',
  //         lang: 'zh_CN',
  //         timeout:10000,
  //         success: (result)=>{
  //           // console.log(result)
  //            that.pageData._userInfo['_nickName'] = result.userInfo.nickName;
  //            that.pageData._userInfo['_avatarUrl'] = result.userInfo.avatarUrl;
  //         },
  //         fail: ()=>{},
  //         complete: ()=>{}
  //       })
  //     }
  //   },
  //   fail: ()=>{},
  //   complete: ()=>{}
  // });
  //   wx.cloud.callFunction({
  //     name:'login',
  //     data:{},
  //     success:resb=>{
  //       that.getData(options.id,resb.result.openid);/**获取到用户openid后将该数据传入getdata函数获取比赛信息 */
  //     },
  //     fail:err=>{}
  //   })
    that.getData(options.id,app.globalUserData.userInfo.uid)
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
      var checkplayer={};/**用于存储查询返回的数据库内已报名的用户openid */
      db.collection('gamesSignUp').where({_id:value})
      .get().then(res => { 
          /**then是在执行完前面get()之后执行then之内的语句 */
          res.data[0].latitude = res.data[0].fieldgeoinfo.latitude; 
          res.data[0].longitude = res.data[0].fieldgeoinfo.longitude;  /**构建map需要的经纬度 */
          checkplayer : res.data[0].playerlist;/**已修改为对象 */
          that.userData._openid =  res.data[0].playerlist;
          that.onGetIntoPlayer(res.data[0].playerlist)/**！！！未完成！！！需要将返回的数据传递到查询 */
    
          console.log(res.data)
            that.setData({
              playInfo:res.data
            }),
            res => {value();}
              /**这里的逗号起到连接作用，和之前的语句形成一个语句串 */
              /**构建一个箭头函数把callbcak作为返回值，实现了可以空值调用getData函数也有返回值的目的 */
            wx.hideLoading();
              /**判断当前用户的openid是否在已报名列中，如果没有则显示“报名这个活动”，如果存在则显示“退出这个活动” */

            if(checkplayer.hasOwnProperty(uid)){
              that.setData({
                nickName:'in',
                uopenid:uid,
                gameid:value
              })
            }else{
              that.setData({
                nickName:'nin'
              })
            }
    })
    return
  },
  /**查询返回报名用户的信息 */
  onGetIntoPlayer:function(value){
    var that = this;
    /**嵌套查询用户表中符合_openid的player的用户信息 */
    db.collection('gamesPlayer').where({
          _openid:_.in(value)
        })
        .get()
        .then(
          res=>(  
            that.setData({
              playernames:res.data
            })
            ))
            return
  },


/**退出报名 */
onCheckOut:function(e){
  var that = this;
  /**清洗现有的已报名用户数组，将符合的id剔除后重构已报名用户数组 */
    var _tmparr=[]
    for(let i of that.userData._openid)
      {
        if (i !== e.currentTarget.dataset.userid){
          _tmparr.push(i)
        }
      }

    that.onDelPlayer(e.currentTarget.dataset.gameid,_tmparr)
    that.onRefresh()
},
/**报名活动 */
onCheckIN:function(e){
  var that = this;
  var _tmparr=[]
  wx.cloud.callFunction({
    name:'login',
    data:{},
    success:res=>{

      for(let i of that.userData._openid)
      {
        if (i !== res.result.openid){
          _tmparr.push(i)
        }
      }
      _tmparr.push(res.result.openid)
    
      that.onDelPlayer(that.data.playInfo[0]._id,_tmparr)
    }
    })
  that.onRefresh()
},

/**s数据库中将更新后的报名用户数组更新到playerlist字段 */
onDelPlayer:function(id,arr){
  var that = this;
    /**将对象构建成一个数组_tmparr */
    /**准备回传构建的报名者用户数组更新数据库中对应的id记录 */
    db.collection('gamesSignUp').doc(
      id
    )
    .update({
        data:{
          playerlist:arr
        }
    })
    .then(res=>{
      // that.onRefresh()
    })
    return
},


onRefresh:function(){
  var that = this;
  wx.cloud.callFunction({
    name:'login',
    data:{},
    success:res=>{
    that.getData(that.data.playInfo[0]._id,res.result.openid);}})
  },
  // onReachBottom:function(){
  //   that.getData();
  // }/**触底刷新 */
bindGetUserInfo(){
    wx.getSetting({
      success: (result)=>{
        if (result.authSetting['scope.userInfo']){
          wx.getUserInfo({
            withCredentials: 'false',
            lang: 'zh_CN',
            timeout:10000,
            success: (result)=>{
              that.setData({
                nickName: result.userInfo.nickName /**获取用户名用于判断是否授权 */
              }),console.log(result)
            }
        })
      }}
    })
  },
})