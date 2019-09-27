// miniprogram/pages/index/index.js
const db = wx.cloud.database({
    env:'biggoose-d92594'
});
const _ = db.command;
// const gamesSignUp = db.collection('gamesSignUp');
// const gamesPlayer = db.collection('gamesPlayer');

Array.prototype.indexOf = function (val){
  for (var i = 0;i<this.length;i++){
    if (this[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function(val){
  var index = this.indexOf(val);
  if(index > -1){
    this.splice(index,1);
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
    _openid:[]
  },
onLoad: function (options) {
    wx.getSetting({
    success: (result)=>{
      if(result.authSetting['scope.userInfo']){
        wx.getUserInfo({
          withCredentials: 'false',
          lang: 'zh_CN',
          timeout:10000,
          success: (result)=>{
            // console.log(result)
             this.pageData._userInfo['_nickName'] = result.userInfo.nickName;
             this.pageData._userInfo['_avatarUrl'] = result.userInfo.avatarUrl;
          },
          fail: ()=>{},
          complete: ()=>{}
        })
      }
    },
    fail: ()=>{},
    complete: ()=>{}
  });
    wx.cloud.callFunction({
      name:'login',
      data:{},
      success:resb=>{
        this.getData(options.id,resb.result.openid);/**获取到用户openid后将该数据传入getdata函数获取比赛信息 */
      },
      fail:err=>{}
    })

    /**读取数据 */
  },/**先判断是否是登录，然后点击button，获取用户头像 */

  /**下拉刷新 */
  onPullDownRefresh: function(){
    this.getData(res => {
       wx.stopPullDownRefresh();
      });
  },

/**数据获取函数 */
getData: function(value,uid){
      
      if(!value){
        value = res=>{} /**如果callback不是一个函数则使用箭头函数构造一个空函数 */
      }
      wx.showLoading({
            title: '加载中...',
          });
      var _playerlists=[];/**用于存储查询返回的数据库内已报名的用户openid */
      db.collection('gamesSignUp').where({_id:value})
      .get().then(res => { 
          /**then是在执行完前面get()之后执行then之内的语句 */
          
          res.data[0].cutofftime = res.data[0].cutofftime.toLocaleString();
          res.data[0].starttime = res.data[0].starttime.toLocaleString();
          res.data[0].endtime = res.data[0].endtime.toLocaleString(); /**将数据库中的date格式输出为字符串 */
          res.data[0].latitude = res.data[0].fieldgeoinfo.latitude; 
          res.data[0].longitude = res.data[0].fieldgeoinfo.longitude;  /**构建map需要的经纬度 */
          // res.data[0].fieldgeoinfo = [{
          //       id : 0,
          //       iconPath: "../../images/icons/gps.png",
          //       latitude:  res.data[0].fieldgeoinfo.latitude,
          //       longitude:  res.data[0].fieldgeoinfo.longitude,
          //       width:30,
          //       height:30
          // }]
          /**构建地点marker坐标 */
          _playerlists = res.data[0].playerlist;
          this.userData._openid =  res.data[0].playerlist;
          this.onGetIntoPlayer(res.data[0].playerlist)
          /**将获取到的已报名的用户openid数组保存到pageData中 */
          // const _ = db.command
          //     /**嵌套查询用户表中符合_openid的player的用户信息 */
          //         gamesPlayer.where({
          //           _openid:_.in([_playerlists])
          //         })
          //         .get()
          //         .then(
          //           rest=>(  
          //             console.log(rest),
          //             this.setData({
          //               playernames:rest.data
          //             })
          //             ))
            this.setData({
              playInfo:res.data
            }),
            res => {value();}
              /**这里的逗号起到连接作用，和之前的语句形成一个语句串 */
              /**构建一个箭头函数把callbcak作为返回值，实现了可以空值调用getData函数也有返回值的目的 */
            wx.hideLoading();
              /**判断当前用户的openid是否在已报名列中，如果没有则显示“报名这个活动”，如果存在则显示“退出这个活动” */

            if(_playerlists.includes(uid)){
              this.setData({
                nickName:'insider',
                uopenid:uid,
                gameid:value
              })
            }else{
              this.setData({
                nickName:'nin'
              })
            }
    })
    return
  },
  /**查询返回报名用户的信息 */
  onGetIntoPlayer:function(value){

    /**嵌套查询用户表中符合_openid的player的用户信息 */
    db.collection('gamesPlayer').where({
          _openid:_.in(value)
        })
        .get()
        .then(
          res=>(  
            this.setData({
              playernames:res.data
            })
            ))
            return
  },


/**退出报名 */
onCheckOut:function(e){
  /**使用数组元素删除函数删除掉原所有报名者的数组，将数组重构 */
   _tmparr = this.onCleanUser(this.userData._openid,e.currentTarget.dataset.userid);
   /**错误点 */
    // this.userData._openid.remove(e.currentTarget.dataset.userid);
    // var _tmparr = [];
    // for(var i=0; i <this.userData._openid.length ; i++){
    //   _tmparr.push(this.userData._openid[i])
    // };
    
    console.log(_tmparr)
    // this.onDelPlayer(e.currentTarget.dataset.gameid,_tmparr)
},

/**数据清洗 */
onCleanUser:function(str,id){
    var _arr=[];
    str.remove(id)
    for(var i=0 ;i<str.length ; i++){
      _arr.push(str._openid[i])
        }
      return _arr

},

onDelPlayer:function(id,arr){
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
      // this.onRefresh()
    })
    return
},

onCheckIn:function(e){

},

onRefresh:function(){
    this.getData();
  },
  // onReachBottom:function(){
  //   this.getData();
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
              this.setData({
                nickName: result.userInfo.nickName /**获取用户名用于判断是否授权 */
              }),console.log(result)
            }
        })
      }}
    })
  },
})