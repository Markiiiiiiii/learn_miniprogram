// miniprogram/pages/add/add.js
var app = getApp();
import{$wuxForm} from '../../miniprogram_npm/wux-weapp/index'
var util = require('../../utils/formattime.js');
const db = wx.cloud.database({
  env:'biggoose-d92594'
});
const _ = db.command;
const mYears = new Date().getFullYear();

Page({
  data: {
      thumb: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=',
      value5:true,
      dateString:'去设置',
      dateString1:'*与开始时间一致',
      lang:'zh_CN',
      endTimeStart:null,
      nowTime:null,
      footballFileAddress:null,
      index:0,
      array:['AA','免费','自付'],/**修改使用原生picker单选框 */
      multiArray:[['获取日期'],['0','1','2','3','4','5','6'],['0','10','20','30']],
      multiIndex:[0,0,0],
      multiArray1:[['获取日期'],['0','1','2','3','4','5','6'],['0','10','20','30']],
      multiIndex1:[0,0,0]
  },
  pageData:{
      _fieldGeoInfo:{},
      _fieldName:null,
      _fieldAddress:null,/**地理位置对象，保存地图选择后的值 */
      _userInfo:{},
      _starttime:null,
      _cutofftime:null
  },


  onLoad: function (options) {
    var that = this;
    let _tmp = new Date();
    var time = util.formatTime(new Date());  
    that.setData({
      nowTime : time
    });/**传递当前时间给页面复用 */
  },

onReady:function(){
  var that = this;
  that.onCheckUser(this.pageData._userInfo)  
},

/**用户数据库内容信息检索更新 */
onCheckUser:function(value){
  var that = this;
  that.pageData._userInfo['_nickName'] = app.userInfo.nickName;
  that.pageData._userInfo['_avatarUrl'] = app.userInfo.avatarUrl;
  db.collection('gamesPlayer').where({
          _openid: value._openid
      }).get().then(
        res=>{
         if(res.data.length == 0){/**判断用户表中是否存在当前用户，没有则添加当前用户 */
            that.onAddPlayer(value);
         }else{
          //  console.log(value)
          if(res.data[0].nickName !=value._nickName || res.data[0].avatarUrl != value._avatarUrl)
          {
            // console.log(res.data)
            db.collection('gamesPlayer').doc(
              res.data[0]._id
            )
            .update({
              data:{
              nickName:value._nickName,
              avatarUrl:value._avatarUrl
            },
            })
            .then(console.log)
         } 
         }
      });
        
/**技巧：必须在数据表中设置一个_openid字段，来用于鉴权，如果没有该字段则数据库不执行更新动作 */
},
/**添加用户信息，tips：不能在添加语句中使用_openid字段，_openid必须由系统自动添加，用户添加则会出现执行错误。 */
onAddPlayer: function(value){
  var that = this;
  // console.log(value._nickName);
  db.collection('gamesPlayer').add({
          data:{
            nickName:value._nickName,
            avatarUrl:value._avatarUrl
            // _openid:value._openid
          }
        }).then(console.log)
},
/**存储到数据库 */
onSubmit: function(e){  
  /**判断是否选择报名截止时间，如果没有则与开始时间一致 */
    let that = this;
    console.log(that.pageData)
    if(typeof(e.detail.value.cutofftime) == "object"){
        var cutofftime =  that.pageData._starttime
    }else{
        cutofftime = that.pageData._cutofftime
    }
    let costValue = that.data.array[that.data.index]
    let tmp = {};
    tmp[app.userInfo.nickName] = app.userInfo._openid
    if(!e.detail.value.title || !e.detail.value.maxnum || !e.detail.value.footballfield || !e.detail.value.starttime)
    {
      wx.showModal({
        title: '提示',
        content: '请输入*必填内容',
        success: (result) => {
          if(result.confirm){
          }
        }
      })
    }else{
      if(!e.detail.value.join){
        db.collection('gamesSignUp').add({
          data:{
          creattime: new Date(),
          title:e.detail.value.title,
          maxnum:e.detail.value.maxnum,
          footballfield:e.detail.value.footballfield,
          starttime:that.pageData._starttime,
          cutofftime:cutofftime,
          cost:costValue,
          tips:e.detail.value.footballtext,
          fieldgeoinfo:that.pageData._fieldGeoInfo,
          fieldname:that.pageData._fieldName,
          fieldaddress:that.pageData._fieldAddress,
          playerlist:{},
          effect:"true"
        },
        success:function(res){
          wx.redirectTo({
            url: '../list/list',
            success: (result)=>{}
          });
        },
        fail:console.error
        })
      }else{
        db.collection('gamesSignUp').add({
          data:{
          creattime: new Date(),
          title:e.detail.value.title,
          maxnum:e.detail.value.maxnum,
          footballfield:e.detail.value.footballfield,
          starttime:that.pageData._starttime,
          cutofftime:cutofftime,
          cost:costValue,
          tips:e.detail.value.footballtext,
          fieldgeoinfo:that.pageData._fieldGeoInfo,
          fieldname:that.pageData._fieldName,
          fieldaddress:that.pageData._fieldAddress,
          playerlist:tmp,/**活动创建者本身也参加活动 */
          effect:"true"
        },
        success:function(res){
          wx.redirectTo({
            url:'../list/list',
            success:(result)=>{}
          });
        },
        fail:console.error
        })
      };
    }

  
  },

onChangeSwitch:function(e){
  var that = this;
  that.onSwitchChange('value5',e)
},

/**选择地理位置 */
chooseLocation: function(e){
  var that = this;
    wx.chooseLocation({
      success: (res) => {
        // console.log(res)
        that.pageData._fieldGeoInfo = new db.Geo.Point(res.longitude,res.latitude);
        that.pageData._fieldAddress= res.address;
        that.pageData._fieldName= res.name;
        
        that.setData({
          footballFileAddress:res.name
        });
      /**返回页面地理名称 */
      },
      fail: () => {},
      complete: () => {}
    });
      
},

bindPickerChange:function(e){
  var that = this;
  that.setData({
    index:e.detail.value
  })
},
bindMultiPickerChange: function (e) {
  var that = this;
  var mArray = that.data.multiArray;
  var mIndex = that.data.multiIndex;
  var dateString = mArray[0][mIndex[0]]+mArray[1][mIndex[1]]+":"+mArray[2][mIndex[2]]
  that.setData({
    dateString: dateString
  });
  /**重新构建日期型字符串 */
  var reMonday= mArray[0][mIndex[0]].match(/\d+/g)
  var reHour = mArray[1][mIndex[1]]
  var reMintus = mArray[2][mIndex[2]]
    if(reMonday[0]<10){
      reMonday[0] = "0"+reMonday[0]
    }
    if(reMonday[1]<10){
      reMonday[1] = "0"+reMonday[1]
    }
    if(reHour<10){
      reHour ="0"+reHour
    }
    if(reMintus<10){
      reMintus="0"+reMintus
    }
    var reDate =mYears+"/"+reMonday[0]+"/"+reMonday[1]+" "+reHour+":"+reMintus
   /**生成时间戳 */
    that.pageData._starttime =  new Date(reDate).valueOf()
  //  that.setData({
  //   multiIndex:reStampe
  //  })
},
bindMultiPickerChange1: function (e) {
  var that = this;
  var mArray = that.data.multiArray1;
  var mIndex = that.data.multiIndex1;
  var dateString = mArray[0][mIndex[0]]+mArray[1][mIndex[1]]+":"+mArray[2][mIndex[2]]
  that.setData({
    dateString1: dateString
  });
  /**重新构建日期型字符串 */
  var reMonday= mArray[0][mIndex[0]].match(/\d+/g)
    if(reMonday[0]<10){
      reMonday[0] = "0"+reMonday[0]
    }
    if(reMonday[1]<10){
      reMonday[1] = "0"+reMonday[1]
    }
    var reDate =mYears+"/"+reMonday[0]+"/"+reMonday[1]+" "+mArray[1][mIndex[1]]+":"+mArray[2][mIndex[2]]
    /**生成时间戳 */
    that.pageData._cutofftime =  new Date(reDate).valueOf()
  //  that.setData({
  //   multiIndex1:reStampe1
  //  })
},
/**设置自定义的日期格式选择器 */
bindMultiPickerColumnChange: function (e) {
  var that = this;
    /**自定义多选日期组件构建数组 */
  var mDate = new Date();
  var mMonday=[];
  var mHours = [];
  var mMintes = [];
  /**月份-日期-星期步进 --30天内  */
  for(let i=0 ;i<=30 ;i++){
    var tmpdate =new Date(mDate);
    tmpdate.setDate(tmpdate.getDate()+i);
    var md = (tmpdate.getMonth()+1)+"月"+tmpdate.getDate()+"日 周"+"日一二三四五六".charAt(tmpdate.getDay())
    mMonday.push(md);
  }
    /**自定义多选日期组件构建数组 */
    var data = {
      multiArray: that.data.multiArray,
      multiIndex: that.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
/**判断第1列的值，改变第二列的小时选项 */
    if(e.detail.column === 0 ){/**判断是否在第一列 */
        if(e.detail.value ===0){/**判断是否在第一列0位 */
     that.onLoadNowTimes(mHours,mMintes);/**以当前的时间和分钟显示第二、三列 */
    }else{
      that.onLoadAllTimes(mHours,mMintes);/**移动出第一列0位后使用24小时和全分钟显示第二、三列 */
    }
    }else{
      that.onLoadAllTimes(mHours,mMintes);
    }
    data.multiArray[0]= mMonday;
    data.multiArray[1]=mHours;
    data.multiArray[2]=mMintes;
    that.setData(data)
  },
  bindMultiPickerColumnChange1: function (e) {
    var that = this;
      /**自定义多选日期组件构建数组 */
    var mDate = new Date();
    var mMonday=[];
    var mHours = [];
    var mMintes = [];
    /**月份-日期-星期步进 --30天内  */
    for(let i=0 ;i<=30 ;i++){
      var tmpdate =new Date(mDate);
      tmpdate.setDate(tmpdate.getDate()+i);
      var md = (tmpdate.getMonth()+1)+"月"+tmpdate.getDate()+"日 周"+"日一二三四五六".charAt(tmpdate.getDay())
      mMonday.push(md);
    }
      /**自定义多选日期组件构建数组 */
      var data = {
        multiArray1: that.data.multiArray1,
        multiIndex1: that.data.multiIndex1
      };
      data.multiIndex1[e.detail.column] = e.detail.value;
  /**判断第1列的值，改变第二列的小时选项 */
      if(e.detail.column === 0 ){/**判断是否在第一列 */
          if(e.detail.value ===0){/**判断是否在第一列0位 */
       that.onLoadNowTimes(mHours,mMintes);/**以当前的时间和分钟显示第二、三列 */
      }else{
        that.onLoadAllTimes(mHours,mMintes);/**移动出第一列0位后使用24小时和全分钟显示第二、三列 */
      }
      }else{
        that.onLoadAllTimes(mHours,mMintes);
      }
      data.multiArray1[0]= mMonday;
      data.multiArray1[1]=mHours;
      data.multiArray1[2]=mMintes;
      that.setData(data)
    },

  onLoadNowTimes:function(hours,mintes){
    var mDate = new Date();
  /**判断当前时间, picker中小时和分钟选项从当前时间显示 */
    var currentHours = mDate.getHours();
    var currentMintes = mDate.getMinutes();
    // console.log (currentHours,currentMintes)
    var minutesIndex ;
    if(currentMintes>0 && currentMintes<=10){
      minutesIndex=10;
    }else if(currentMintes>10 && currentMintes<=20){
      minutesIndex=20;
    }else if(currentMintes>20 && currentMintes<=30){
      minutesIndex=30;
    }else if(currentMintes>30 && currentMintes<=40){
      minutesIndex=40;
    }else if(currentMintes>40 && currentMintes<=50){
      minutesIndex=50;
    }else{
      minutesIndex=60;
    }
    /**判断当前分钟数是否满足小时进步 */
    if (minutesIndex == 60){
      /**小时步进 --24小时*/
      for (var i =currentHours+1 ;i<24;i++){
        hours.push(i);
      }
      /**分钟步进 --15分钟*/
      for (var i=0 ; i<60; i+=10){
        mintes.push(i);
      }
    }else{
      for(var i=currentHours;i<24;i++){
        hours.push(i);
      }
      for(var i=0;i<60;i+=10){
        mintes.push(i);
      }
    }
    return hours,mintes
  },
onLoadAllTimes:function(hours,mintes){
  /**显示所有的小时和分钟picker */
    for(var i =0 ; i <24;i++){
      hours.push(i);
    }
    for(var i=0;i<60;i+=10){
      mintes.push(i);
    }
    return hours,mintes
}
})