var app = getApp()
const typeName = {
  "1001": "研招网",
  "1002": "学术论坛",
  "1003": "后勤公告",
  
}
var id = ""
var type = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    id = options.id
    type = options.type
    wx.showLoading({
      title: '正在加载',
    })
    var that = this
    wx.request({
      url: app.local_server + 'get_schoolNewsDetail/',
      method: 'POST',
      data: {
        id:id,
        type: type
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: res => {
        wx.hideLoading();
        that.setData({
          content: res.data
        })
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: "加载失败",
          content: '获取失败，可能是服务器出了问题',
          showCancel: false,
          confirmText: "确定",
          success: function (res) {
            if (res.confirm) {
            }
          }
        });

      },
      complete: function (res) {

      }
    });
  },
  onShareAppMessage() {
    return {
      title: typeName[type] + '-' + this.data.content["title"],
      path: 'pages/core/news/content?id=' + id + "&type=" + type
    }
  }
})