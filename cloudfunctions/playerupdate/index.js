// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  try{
    await db.collection('gamesSignUp')
    .doc(event._id)
    .update({
      data:{
        playerlist:_.set(event.playerobj)
      }
    })
  }catch(err){
    console.error(err)
  }
}