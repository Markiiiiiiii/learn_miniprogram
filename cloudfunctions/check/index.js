// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database();
const _ = db.command;
const nowTime = new Date().valueOf();
// 云函数入口函数
exports.main = async (event, context) => {
  try{
      await db.collection('gamesSignUp').where({
        effect:"true"
      }).orderBy(
        'creattime','asc'
      ).get().then(
        res=>{
        for(var i=0;i<res.data.length;i++){
          if(res.data[i].starttime < nowTime){
            console.log(res.data[i].starttime)
            db.collection('gamesSignUp').where({_id:res.data[i]._id}).update({
              data:{
                effect:"false"
              }
            })
            }
          }
      }
      )
  }catch(err){
    console.error(err)}
}