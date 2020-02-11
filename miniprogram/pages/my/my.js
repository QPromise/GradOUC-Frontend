const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    is_bind: app.cache.is_bind,
    name: null,
    sno:null,
    openId: null,
    gender: null,
    department: null,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  onShow: function () {
    var that = this;
    that.setData({
      is_bind: app.cache.is_bind,
      name: app.cache.name,
      sno: app.cache.sno
    })
    console.log(that.data.is_bind,that.data.name,that.data.sno)
    
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

  },

})

