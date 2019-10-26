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
        title:_.set(event.title),
        maxnum:_.set(event.maxnum),
        creattime:new Date(),
        footballfield:_.set(event.footballfield),
        starttime:_.set(event.starttime),
        cutofftime:_.set(event.cutofftime),
        cost:_.set(event.cost),
        tips:_.set(event.footballtext),
        ifjoin:_.set(event.ifjoin),
        fieldgeoinfo:_.set(event.fieldGeoInfo),
        fieldname:_.set(event.fieldName),
        fieldaddress:_.set(event.fieldAddress),
        playerlist:_.set(event.players),
    }
    })
  }catch(err){
    console.error(err)
  }
}
