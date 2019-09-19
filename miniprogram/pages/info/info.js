// miniprogram/pages/index/index.js
const db = wx.cloud.database();
const gamesSignUp = db.collection('gamesSignUp');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playInfo:null,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    nickName:null
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();/**读取数据 */

  },/**先判断是否是登录，然后点击button，获取用户头像 */

  /**下拉刷新 */
  onPullDownRefresh: function(){
    this.getData(res => {
       wx.stopPullDownRefresh();
      });
  },

/**数据获取函数 */
  getData: function(callback){
    if(!callback){
      callback = res=>{} /**如果callback不是一个函数则使用箭头函数构造一个空函数 */
    }
    wx.showLoading({
          title: '加载中...',
        });
    gamesSignUp.get().then(res => { /**then是在执行完前面get()之后执行then之内的语句 */
      res.data[0].cutofftime = res.data[0].cutofftime.toLocaleString();
      res.data[0].starttime = res.data[0].starttime.toLocaleString();
      res.data[0].endtime = res.data[0].endtime.toLocaleString(); /**将数据库中的date格式输出为字符串 */
      res.data[0].latitude = res.data[0].fieldgeoinfo.latitude; 
      res.data[0].longitude = res.data[0].fieldgeoinfo.longitude;  /**构建map需要的经纬度 */
      res.data[0].fieldgeoinfo = [{
            id : 0,
            iconPath: "../../images/icons/gps.png",
            latitude:  res.data[0].fieldgeoinfo.latitude,
            longitude:  res.data[0].fieldgeoinfo.longitude,
            width:30,
            height:30
      }]/**构建地点marker坐标 */
      this.setData({
        playInfo:res.data
      }),/**这里的逗号起到连接作用，和之前的语句形成一个语句串 */
     res => {callback();}/**构建一个箭头函数把callbcak作为返回值，实现了可以空值调用getData函数也有返回值的目的 */
      wx.hideLoading();
    })
  },

  // onSubmit: function(e){
  //   gamesSignUp.add({
  //     data:{
  //       player:e.detail.value.player
  //     }
  //   }).then(res=>{
  //     // wx.showToast({
  //     //   title: '报名成功',
  //     //   icon: 'success',
  //     // });
        
  //   })
  // },
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
              }),console.log(this.data.nickName)
            }
        })
      }}
    })
  },
  onRefresh:function(){
    this.getData();
  },
  onReachBottom:function(){
    this.getData();
  }/**触底刷新 */

})