// miniprogram/pages/add/add.js
import{$wuxForm} from '../../miniprogram_npm/wux-weapp/index'
var util = require('../../utils/utils.js');

Page({
  data: {
      value1:[],
      value2:[],
      value3:[],
      displayValue1:'请选择比赛开始时间',
      displayValue2:'请选择比赛结束时间',
      displayValue3:'请选择报名截止时间',
      lang:'zh_CN',
      endTimeStart:null,
      nowTime:null
  },

  onLoad: function (options) {
    var time = util.formatTime(new Date());  
    this.setData({
      nowTime : time
    });
  },

  onSubmit: function(event){
    console.log(event)
  },/**提交按钮 */
/**时间选择 */
  onChange(e) {
    console.log(e)
    const { key, values } = e.detail
    const lang = values[key]

    this.setData({
        lang,
    })
},
setValue(values, key, mode) {
    this.setData({
        [`value${key}`]: values.value,
        [`displayValue${key}`]: values.label,
        // [`displayValue${key}`]: values.displayValue.join(' '),
    })
},
onConfirmStart(e) {
    const { index, mode } = e.currentTarget.dataset
    this.setValue(e.detail, index, mode)
    this.setData({
      endTimeStart: e.detail.label
    })
    console.log(`onConfirm${index}`, e.detail)
},
onConfirm(e) {
  const { index, mode } = e.currentTarget.dataset
  this.setValue(e.detail, index, mode)
  console.log(`onConfirm${index}`, e.detail.label)
},
/**时间戳的连选 */
onVisibleChange(e) {
    this.setData({ visible: e.detail.visible })
},
onClick() {
    this.setData({ visible: true })
},

})