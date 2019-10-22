// miniprogram/pages/message/message.js

const app = getApp();

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    array: ['海洋与大气学院', '信息科学与工程学院', '化学化工学院', '海洋地球科学学院'],
    objectArray: [
      {
        id: 0,
        name: '海洋与大气学院'
      },
      {
        id: 1,
        name: '信息科学与工程学院'
      },
      {
        id: 2,
        name: '化学化工学院'
      },
      {
        id: 3,
        name: '海洋地球科学学院'
      }
    ],
    index: 0,
    openId: null,
    userInfo: null,
    nickName:'昵称',
    gender: null,
    department:null,
    newCommentsCount: 0,
    newThumbupCount: 0
  },

  goTest: function (e) {

  },

  goComments: function(){
    wx.navigateTo({
      url:'../comments/comments'
    })
  },

  goThumbup: function(){
    wx.navigateTo({
      url: '../thumbup/thumbup',
    })
  },
  goProfile:function(){
    wx.navigateTo({
      url: '../profile/profile',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.userInfo = app.globalData.userInfo;
    this.data.recordId = options.recordId;
    if (app.globalData.openId){
      //全局应用已有openId
      this.setData({
        openId: app.globalData.openId
      });
    } else {
      // 由于 login云函数 是网络请求，可能会在 Page.onLoad 之后才返回 
      // 所以此处加入 callback 以防止这种情况 
      app.openIdReadyCallback = res => {
        this.setData({
          openId: res.result.openid
        })
      }
    }
    this.setData({
      userInfo: app.globalData.userInfo
    })
    let that = this;
    //获取性别标签
    if (app.globalData.userInfo.gender == 1)
      this.setData({ gender: "../../images/boy.png" })
    else if (app.globalData.userInfo.gender == 2)
      this.setData({ gender: "../../images/girl.png" })
    else
      this.setData({ gender: "../../images/sex.png" })
    //获取新的评论点赞消息
    const db = wx.cloud.database();
    console.log("更新昵称");
    console.log(this.data.openId);
    console.log(that.data.openId);
    //更新昵称
    db.collection('profile').where({ "_openid": this.data.openId }).get({
      success: function (res) {
        if (res.data.length == 1) {
          console.log(res);
          console.log(res.data[0]);
          console.log(res.data[0].nickName);
          that.setData({ nickName: res.data[0].nickName });
          console.log(that.data, that.data.nickName);
        }
        else {
          console.log("数据库存在多个相同openid用户表:");
          that.setData({ nickName: that.userInfo.nickName })
        }
      }, fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    getMessage(this);

  },
  onShow: function () {
    let that = this;
    //获取性别标签
    if (app.globalData.userInfo.gender == 1)
      this.setData({ gender: "../../images/boy.png" })
    else if (app.globalData.userInfo.gender == 2)
      this.setData({ gender: "../../images/girl.png" })
    else
      this.setData({ gender: "../../images/sex.png" })
    //获取新的评论点赞消息
    const db = wx.cloud.database();
    console.log("更新昵称");
    console.log(this.data.openId);
    console.log(that.data.openId);
    //更新昵称
    db.collection('profile').where({ "_openid": this.data.openId }).get({
      success: function (res) {
        if (res.data.length == 1) {
          console.log(res);
          console.log(res.data[0]);
          console.log(res.data[0].nickName);
          that.setData({ nickName: res.data[0].nickName });
          console.log(that.data, that.data.nickName);
        }
        else {
          console.log("数据库存在多个相同openid用户表:");
          that.setData({ nickName: this.userInfo.nickName })
        }
      }, fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
    getMessage(this);
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})

//获取未读消息
function getMessage(that) {
  console.log("来到了message这里");
  //从全局拿到最新的评论数和点赞数
  that.setData({
    newCommentsCount: app.globalData.newCommentsCount,
    newThumbupCount: app.globalData.newThumbupCount
  });
  
  // setTimeout(function () {
  //   getMessage(that);
  // }, 10000);
}