var app = getApp()
const typeName = {
  "1001": "研招网",
  "1002": "学术论坛",
  "1003": "后勤公告",
  "1004": "校园通知",
  "1005": "研究生院"
  
}
var id = ""
var type = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: undefined,
    news_url:""
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
          content: res.data,
          news_url:  res.data.news_url
        })
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: "加载失败",
          content: '获取失败，可能是您的网络或者服务器出了问题，请稍后重试',
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
  getNewsUrl: function () {
    let that = this
    wx.setClipboardData({
      data: that.data.news_url,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '网址复制成功！',
              duration: 1000
            });
          }
        })
      }
    })
  },
  onShareAppMessage() {
    return {
      title: typeName[type] + '-' + this.data.content["title"],
      path: 'pages/core/news/content?id=' + id + "&type=" + type
    }
  }
})