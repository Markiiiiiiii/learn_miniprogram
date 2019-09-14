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
      });
  },

/**数据刷新函数 */
  getData: function(callback){
    if(!callback){
      callback = res=>{} /**如果callback不是一个函数则使用箭头函数构造一个空函数 */
    }
    wx.showLoading({
          title: '加载中...',
        });
    gamesSignUp.get().then(res => { /**then是在执行完前面get()之后执行then之内的语句 */
      this.setData({
      playerName : res.data
    }),/**这里的逗号起到连接作用，和之前的语句形成一个语句串 */
    res => {callback();}/**构建一个箭头函数把callbcak作为返回值，实现了可以空值调用getData函数也有返回值的目的 */
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