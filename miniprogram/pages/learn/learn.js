// miniprogram/pages/learn/learn.js
const db = wx.cloud.database();
const _ = db.command
Page({
  /**
   * 页面的初始数据
   */

  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

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

  },
/**
 * 条件查询 数据库中的count字段是string格式
 */
  query:function(){
    console.log("Query")
    db.collection("dataTest").where({
          count : _.nin([String(1),3,4])
      }).get().then(console.log)
},
/**
 * 使用字段查询，包含该字段的显示
 */
queryField:function(){
  console.log("Query")
  db.collection("dataTest").field({
        bit:true
    }).get().then(console.log)
},
/**
 * 使用正则对象条件查询 数据库中的count字段是string格式
 */
queryRegExp:function(){
    console.log("Query")
    db.collection("dataTest").where({
        name: new db.RegExp({
          regexp: 'name-[1-9]',
          options: 'i'
        })
      }).get().then(console.log)
},
/**
 * 增加地点地理信息
 */
addLoction:function(){
  db.collection("location").add({
    data:{
      location : db.Geo.Point(110.2322,10.0003)
    }
  }).then(res=>{
    db.collection("location").add({
      data:{
        location : db.Geo.Point(101.3322,11.2303)
      }
    })
  }).then(console.log)
},
/** 地理信息查询*/
loctionQuery:function(){
    console.log("地理查询开始")
    db.collection("location").get().then(res=>{
      console.log("纬度信息："+res.data[0].location.latitude)/**查询纬度 */
    })
}
})