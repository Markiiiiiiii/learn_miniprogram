# 进度
## 待实现功能 10-07 提交
- list页面可以删除用户自己创建的活动
- 显示已过期的活动
- ~~增加分享按钮将info和list页面都可以到微信~~
***
## Fixed
#### 10-11
- add页面去除wux的datepicker组件，使用原生picker，构建xx月xx日 周x xx-xx格式选择
***
## Bug 
#### 10-15
- 第一次点击分享时会因为canvas的绘图没有完成，就生成了分享图。
#### 10-08
- ~~add页面中的data-picker和picker默认第一项时会报错 ：TypeError: Cannot read property '0' of null~~
#### 10-07
- ~~info页面单用户报名时点击“退出报名”按钮后页面不刷新~~
- ~~info返回到list页面时页面数据不刷新，已报名数未更新~~