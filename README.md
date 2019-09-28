
# 小程序--足球活动报名
- [官方云开发文档](https://developers.weixin.qq.com/miniprogram/dev/wxcloud/basis/getting-started.html)
## 云数据库 踩坑指南
- 需在云开发数据库中添加相关用户的_openid字段，否则将阻断用户的update操作
- 不能在js文件的顶部以Const name = collction('name')的方式调用数据库动作，否则将会造成无法多次调用的情况，出现对象循环复用的提示。
- 将访问动作以 db.collection('name').where().get()...的形式在函数内部调用。