var app = getApp()
var page = 1
const typeName = {
  "1001": "研招网",
  "1002": "学术论坛",
  "1003": "后勤公告",
  "1004": "学校新闻",
  "1005": "研究生院"
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: 0,
    news: [],
    title: undefined,
    topHeight: 0,
    type:undefined,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  goContent(e) {
    var id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: 'content?id=' + id + "&type=" + this.data.type,
    })
  },
  onChange(e) {
    this.getNews(e.detail.current)
  },
  onReachBottom: function () {
    page = page + 1
    this.getNews(page)
  },
  getNews: function (e) {
    if (this.data.pages < page && e !=1) {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '正在加载',
    })
    var that = this
    wx.request({
      url: app.local_server + 'get_schoolNews/',
      method: 'POST',
      data: {
        page: e,
        type:that.data.type
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: res => {
        var news = that.data.news
        news = news.concat(res.data.news)
        that.setData({
          news: news,
          pages:res.data.pages_count
        })

      },
      fail: function (res) {
        app.showFailBackModel()

      },
      complete: function (res) {
        wx.hideLoading();
      }
    });
  },
  onShow: function () {
    
  },
  onLoad: function (options) {
    page = 1
    var type = options.type
    var that = this
    that.setData({
      type:type,
      title:typeName[type]
    })
    that.getNews(1)
  },
  onShareAppMessage() {
    return {
      title: typeName[this.data.type],
      path: 'pages/core/news/news' + "?type=" + this.data.type
    }
  }
})