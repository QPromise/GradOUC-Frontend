const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  onShow: function () {
  },
  onLoad: function () {
  },
  onShareAppMessage: function () {
    return {
      title: '联系我',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/feedback/feedback'
    };
  },
  setemail: function () {
    wx.setClipboardData({
      data: 'cs_qin@qq.com',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '邮箱复制成功！',
              duration: 1000
            });
          }
        })
      }
    })
  },
  setwx: function () {
    wx.setClipboardData({
      data: 'GradOUC',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '微信复制成功！',
              duration: 1000
            });
          }
        })
      }
    })
  },
  setqq: function () {
    wx.setClipboardData({
      data: '815221919',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: 'QQ复制成功！',
              duration: 1000
            });
          }
        })
      }
    })
  },
  setgz: function () {
    wx.setClipboardData({
      data: '',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '公众号复制成功！',
              duration: 1000
            });
          }
        })
      }
    })
  }
})