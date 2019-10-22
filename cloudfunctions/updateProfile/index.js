// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'nostalgic-meakb'
  })
const db = cloud.database();
const _ = db.command
// 云函数入口函数
exports.main = async (event, context) => {
  try{
  const wxContext = cloud.getWXContext()
  await db.collection('profile').where({ "_openid": event._openid }).update({
    data: {
      nickName: event.nickName,
      studentType:event.studentType,
      departmentType:event.departmentType,
      canPublish:event.canPublish
    }
    })}
    catch (e) {
      console.error(e)
    }
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}