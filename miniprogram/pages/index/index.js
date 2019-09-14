// miniprogram/pages/index/index.js
const db = wx.cloud.database();
const gamesSignUp = db.collection('gamesSignUp');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    playerName:null
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getData();
  },

  /**下拉刷新 */
  onPullDownRefresh: function(){
    this.getData(res => {
      wx.stopPullDownRefresh();
    } );
    
  },

/**数据刷新函数 */
  getData: function(callback){
    if(!callback){
      callback = res=>{} /**如果callback不是一个函数则赋予它一个函数 */
    }
    wx.showLoading({
          title: '加载中...',
        });
    gamesSignUp.get().then(res => {
      this.setData({
      playerName : res.data
    }),res => {
      callback();
    }
    wx.hideLoading();
    })
  },

  onSubmit: function(e){
    gamesSignUp.add({
      data:{
        player:e.detail.value.player
      }
    }).then(res=>{
      // wx.showToast({
      //   title: '报名成功',
      //   icon: 'success',
      // });
        
    })
  }
})