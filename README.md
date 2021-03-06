
# 小程序--足球活动报名
- [官方云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
## 云数据库 踩坑指南
- 需在云开发数据库中添加相关用户的_openid字段，否则将阻断用户的update操作
- 不能在js文件的顶部以Const name = collction('name')的方式调用数据库动作，否则将会造成无法多次调用的情况，出现对象循环复用的提示。
- 将访问动作以 db.collection('name').where().get()...的形式在函数内部调用。
-云开发数据库中对数组或者对象的数据类型使用UPDATE时要用set命令
```
  db.collection('data').doc(
      id
    ).update({
        data:{
          filed:_.set(obj)/**知识点对数列或者对象局部更新 */
        }
```
- 云开发对数据库操作做出了严格的限制，最大的权限仅仅是“所有用户可读，仅创建者可读写”，如果对于非创建者使用对数据的字段进行更新的时候需要使用部署云端的云函数对数据库进行操作。
```
const cloud = require('wx-server-sdk')
 
cloud.init()
const db = cloud.database();
 
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    return await db.collection("image").doc(event._id).update({
      data:{
        praise: event.dianza
      }
    })
  }catch(e){
    console.error(e)
  }
}
```
- 调用云函数
```
wx.cloud.callFunction({
   name: '你新建的云函数名字',
   data:{
    _id: obj._id,
    dianza: dianza
   },
   success: res => {
      console.log('更新数据成功')
   }
})
```
## Canvas小坑
- 微信用户头像默认是132x132尺寸
- 如果将用户头像绘制入画布时必须要将网络头像图片下载到本地存为临时文件
- wx.getImageInfo()是一个异步函数所以必须要将src放在外部赋值后调用


## iOS与Android的时间格式区别
- 由于iOS在对时间格式中支持 YY/MM/DD HH:MM格式所以使用YY-MM-DD HH:MM向数据库中插入数据时会出现NaN错误。
必须将其“-”修改为“/”格式。也可string.replace()方法用正则替换，例：date.replace(/-/g,"/")