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
        creattime:_.set(new Date()),
        footballfield:_.set(footballfield),
        starttime:_.set(_starttime),
        cutofftime:_.set(cutofftime),
        cost:_.set(costValue),
        tips:_.set(footballtext),
        fieldgeoinfo:_.set(_fieldGeoInfo),
        fieldname:_.set(_fieldName),
        fieldaddress:_.set(_fieldAddress),
        playerlist:_.set(players),
        effect:"true"
    }
    })
  }catch(err){
    console.error(err)
  }
}
}