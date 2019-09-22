// miniprogram/pages/add/add.js
import{$wuxForm} from '../../miniprogram_npm/wux-weapp/index'
var util = require('../../utils/formattime.js');
const db = wx.cloud.database();
const gamesSignUp = db.collection('gamesSignUp');

Page({
  data: {
      thumb: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC4AAAAuCAMAAABgZ9sFAAAAVFBMVEXx8fHMzMzr6+vn5+fv7+/t7e3d3d2+vr7W1tbHx8eysrKdnZ3p6enk5OTR0dG7u7u3t7ejo6PY2Njh4eHf39/T09PExMSvr6+goKCqqqqnp6e4uLgcLY/OAAAAnklEQVRIx+3RSRLDIAxE0QYhAbGZPNu5/z0zrXHiqiz5W72FqhqtVuuXAl3iOV7iPV/iSsAqZa9BS7YOmMXnNNX4TWGxRMn3R6SxRNgy0bzXOW8EBO8SAClsPdB3psqlvG+Lw7ONXg/pTld52BjgSSkA3PV2OOemjIDcZQWgVvONw60q7sIpR38EnHPSMDQ4MjDjLPozhAkGrVbr/z0ANjAF4AcbXmYAAAAASUVORK5CYII=',
      value1:[],
      value2:[],
      value3:[],
      value4:[],
      value5:true,
      displayValue1:'请选择比赛开始时间',
      displayValue2:'请选择比赛结束时间',
      displayValue3:'请选择报名截止时间',
      displayValue4:'请选择费用类型',
      payOption:['免费','AA','自付'],
      lang:'zh_CN',
      endTimeStart:null,
      nowTime:null,
      footballFileAddress:null
  },
  pageData:{
      _fieldGeoInfo:{},
      _fieldName:null,
      _fieldAddress:null,/**地理位置对象，保存地图选择后的值 */
      _startt:null,
      _endt:null,
      _cutofft:null,/**构建三个页面变量存储格式化后的时间 */
      _userInfo:{}
  },
  onLoad: function (options) {
    let _tmp = new Date();
    var time = util.formatTime(new Date());  
    this.setData({
      nowTime : time
    });/**传递当前时间给页面复用 */

    /**获得用户名和信息 */
    wx.getUserInfo({
      withCredentials: 'false',
      lang: 'zh_CN',
      timeout:10000,
      success: (result)=>{
        // console.log(result)
         this.pageData._userInfo['nickName'] = result.userInfo.nickName;
         this.pageData._userInfo['avatarUrl'] = result.userInfo.avatarUrl;
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  },
/**存储到数据库 */
  onSubmit: function(e){  
    let _creatTime = new Date();
    // console.log(e);
    // console.log(this.pageData._userInfo);
    if(!e.detail.value.title || !e.detail.value.maxnum || !e.detail.value.footballfield || !e.detail.value.starttime || !e.detail.value.endtime || !e.detail.value.cutofftime)
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
        gamesSignUp.add({
          data:{
          creattime: _creatTime,
          title:e.detail.value.title,
          maxnum:e.detail.value.maxnum,
          footballfield:e.detail.value.footballfield,
          starttime:this.pageData._startt,
          endtime:this.pageData._endt,
          cutofftime:this.pageData._cutofft,
          cost:e.detail.value.paytype,
          tips:e.detail.value.footballtext,
          fieldgeoinfo:this.pageData._fieldGeoInfo,
          fieldname:this.pageData._fieldName,
          fieldaddress:this.pageData._fieldAddress,
          effect:"true"
        }
        }).then(console.log)
      }else{
        gamesSignUp.add({
          data:{
          creattime: _creatTime,
          title:e.detail.value.title,
          maxnum:e.detail.value.maxnum,
          footballfield:e.detail.value.footballfield,
          starttime:this.pageData._startt,
          endtime:this.pageData._endt,
          cutofftime:this.pageData._cutofft,
          cost:e.detail.value.paytype,
          tips:e.detail.value.footballtext,
          fieldgeoinfo:this.pageData._fieldGeoInfo,
          fieldname:this.pageData._fieldName,
          fieldaddress:this.pageData._fieldAddress,
          playname:this.pageData._userInfo,
          effect:"true"
        }
        }).then(console.log)
      }
     
    }
  },
/**时间选择 */
  onChange(e) {
    // console.log(e)
    const { key, values } = e.detail
    const lang = values[key]

    this.setData({
        lang,
    })
},
onSwitchChange(field, e) {
  this.setData({
      [field]: e.detail.value
  })
//  console.log('radio发生change事件，携带value值为：', e.detail.value)
},

onChangeSwitch:function(e){
  this.onSwitchChange('value5',e)
},

setValue(values, key, mode) {
    this.setData({
        [`value${key}`]: values.value,
        [`displayValue${key}`]: values.label,
        [`displayValue${key}`]: values.displayValue.join(' '),
    })
},
onConfirmStart(e) {
    const { index, mode } = e.currentTarget.dataset
    this.setValue(e.detail, index, mode),
    this.setData({endTimeStart: e.detail.label});/**显示出选择后的时间 */
    this.pageData._startt = new Date(e.detail.date)/**将选择后的时间传递给页面变量 */
    // console.log(`onConfirm${index}`, e.detail)
},
onConfirmEnd(e) {
  const { index, mode } = e.currentTarget.dataset 
  this.setValue(e.detail, index, mode);
  this.pageData._endt = new Date(e.detail.date)

  // console.log(`onConfirm${index}`, e.detail.label)
},
onConfirmCutOff(e) {
  const { index, mode } = e.currentTarget.dataset 
  this.setValue(e.detail, index, mode);
  this.pageData._cutofft = new Date(e.detail.date)

  // console.log(`onConfirm${index}`, e.detail.label)
},
onConfirm(e) {
  const { index, mode } = e.currentTarget.dataset 
  this.setValue(e.detail, index, mode)
  // console.log(`onConfirm${index}`, e.detail.label)
},
/**时间戳的连选 */
onVisibleChange(e) {
    this.setData({ visible: e.detail.visible })
},
onClick() {
    this.setData({ visible: true })
},

/**选择地理位置 */
chooseLocation: function(e){
    wx.chooseLocation({
      success: (res) => {
        console.log(res)
        this.pageData._fieldGeoInfo = new db.Geo.Point(res.longitude,res.latitude);
        this.pageData._fieldAddress= res.address;
        this.pageData._fieldName= res.name;
        
        this.setData({
          footballFileAddress:res.name
        });
      /**返回页面地理名称 */
      },
      fail: () => {},
      complete: () => {}
    });
      
},

onPayValueChange(e){
  const { index } = e.currentTarget.dataset
  // console.log('onValueChanges', e.detail)
},
onPayConfirm(e) {
  const { index } = e.currentTarget.dataset
  // console.log(index);
  this.setPayValue(e.detail, index)
  // console.log(`onConfirm${index}`, e.detail)
},
setPayValue(values, key) {
  this.setData({
    [`value${key}`]: values.value,
    [`displayValue${key}`]: values.label,
  })
}


/**wux-from组件可以实现对form表格的重置操作，但原生的form表格不支持wux的重置 */
})