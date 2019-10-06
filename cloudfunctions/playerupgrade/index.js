// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    await db.collection('gamesPlayer')
    .doc(event._id)
    .update({
      data:{
        nickName:_.set(event.nickname),
        avatarUrl:_.set(event.avatarUrl)
      }
    })
  }catch(err){
    console.error(err)
  }
}