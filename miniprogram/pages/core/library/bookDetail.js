// miniprogram/pages/core/library/bookDetail.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    bookDetail: {},
    bookAvailableDetail: [],
  },
  onShareAppMessage: function () {
    return {
      title: '书籍详细信息',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/core/library/bookDetail?detail=' + JSON.stringify(this.data.bookDetail)
    };
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var bookDetail = JSON.parse(options.detail)
    this.setData({
      bookDetail: bookDetail
    })
    wx.showToast({
      title:"加载中",
      icon: 'loading',
      duration: 4000
    });
    var that = this
    wx.request({
      url: app.local_server + 'get_bookDetail/',
      method: 'POST',
      data: {
          bookID: bookDetail.marcRecNo,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: res => {
        console.log(res);
        console.log(res.data);
        wx.hideToast();
        //有借阅的信息
        if (res.data.have_info == "1"){
        that.setData({
          bookAvailableDetail: res.data.bookAvailableDetail
          })
      }
      else{
          wx.showToast({
            title: '此书刊可能正在订购中或者处理中',
            icon: 'none'
          })
          return
      }
      },
      fail: function (res) {
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
        //停止刷新
        wx.stopPullDownRefresh();
        // 隐藏顶部刷新图标
        wx.hideNavigationBarLoading();
      },
      complete: function (res) {
        //停止刷新
        wx.stopPullDownRefresh();
        // 隐藏顶部刷新图标
        wx.hideNavigationBarLoading();
      }
    });

   
   
  }
})