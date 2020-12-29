const list = require("../../../utils/tiangou.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    random:0,
    content:'',
    arr:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id || 0
    let info = wx.getSystemInfoSync()
    this.setData({
      id:id,
      winHeight: info.windowHeight
    })
    this.get(true)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
    var shareObj = {
      title: "研在OUC-这里有一本舔狗日记，你要不要看看？",
      path: 'pages/tools/tiangou/tiangou?id=' + this.data.random,
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！'
    };
    // 返回shareObj
    return shareObj;
  },
  //切换
  get:function(first){
    let len = list.tiangou.length
    let random = Math.floor(Math.random() * len)
    if(first === true && this.data.id > 0){
      random = this.data.id
    }
    let content = list.tiangou[random]
    let arr = content.split(/\*\*/)
    this.setData({
      random:random,
      content: content,
      arr:arr
    })
  },
  copy:function(){
    wx.setClipboardData({
      data: this.data.content
    })
  }
})