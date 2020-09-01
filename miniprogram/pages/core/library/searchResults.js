// pages/More/Library/SearchResults.js
var app = getApp()
var page = 1
var totalPages = Infinity
var data = ""
var type = ""
Page({
  data: {
    bookList: []
  },
  onReachBottom: function () {
    page = page + 1
    this.searchBook({
      page: page
    })
  },
  goBookDetail(e) {
    wx.navigateTo({
      url: 'bookDetail?detail=' +JSON.stringify(this.data.bookList[e.currentTarget.dataset.index]),
    })
  },
  // onShareAppMessage: function () {
  //   return {
  //     title: '书籍查找结果',
  //     desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
  //     path: '/pages/core/library/searchResults?bookName = ' + inputValue + "&type=" + typeListConvert[typeList[typeListIndex]]
  //   };
  // },
  searchBook(e) {
    if (page > totalPages) {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none'
      })
      return
    }
    wx.showToast({
      title: '搜索中',
      icon: 'loading',
      duration: 5000
    });
    var that = this
    wx.request({
      url: app.local_server + 'search_book/',
      method: 'POST',
      data: {
        page: e.page,
        keyword: data,
        type: type
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: res => {
        if (res.data.total_records == 0) {
          wx.hideToast();
          wx.showModal({
            title: "提醒",
            content: '没有搜到任何书籍',
            showCancel:false,
            confirmText: "确定",
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../core/library/library',
                })
              }
            }
          });
        }
        else {
            wx.hideToast();
            var bookList = this.data.bookList
            bookList = bookList.concat(res.data.list)
            totalPages = Math.ceil(res.data["total_records"] / 20)
            that.setData({
              bookList: bookList
            })
        }
      },
      fail: function (res) {
        wx.hideToast();
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
  },

  onLoad: function (options) {
    page = 1
    totalPages = Infinity
    if (options.bookName) {
      data = options.bookName
      type = options.type
    } else {
      data = options.isbn
    }
    this.searchBook({
      page: 1
    })
  },

})