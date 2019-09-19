// miniprogram/pages/index/index.js
const db = wx.cloud.database();
const gamesSignUp = db.collection('gamesSignUp');
Page({
  data: {
    gameList:null,
  },

  onLoad: function (options) {

  },

// /**数据获取函数 */
// getData: function(callback){
//   if(!callback){
//     callback = res=>{} /**如果callback不是一个函数则使用箭头函数构造一个空函数 */
//   }
//   wx.showLoading({
//         title: '加载中...',
//       });
//   gamesSignUp.get().then(res => { /**then是在执行完前面get()之后执行then之内的语句 */
//     res.data[0].cutofftime = res.data[0].cutofftime.toLocaleString();
//     res.data[0].starttime = res.data[0].starttime.toLocaleString();
//     res.data[0].endtime = res.data[0].endtime.toLocaleString(); /**将数据库中的date格式输出为字符串 */
//     res.data[0].latitude = res.data[0].fieldgeoinfo.latitude; 
//     res.data[0].longitude = res.data[0].fieldgeoinfo.longitude;  /**构建map需要的经纬度 */
//     res.data[0].fieldgeoinfo = [{
//           id : 0,
//           iconPath: "../../images/icons/gps.png",
//           latitude:  res.data[0].fieldgeoinfo.latitude,
//           longitude:  res.data[0].fieldgeoinfo.longitude,
//           width:30,
//           height:30
//     }]/**构建地点marker坐标 */
//     this.setData({
//       playInfo:res.data
//     }),/**这里的逗号起到连接作用，和之前的语句形成一个语句串 */
//    res => {callback();}/**构建一个箭头函数把callbcak作为返回值，实现了可以空值调用getData函数也有返回值的目的 */
//     wx.hideLoading();
//   })
// },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})