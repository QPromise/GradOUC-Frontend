// pages/More/Library/SearchResults.js
const app = getApp()
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
        else if (res.statusCode == 200) {
            wx.hideToast();
            var bookList = this.data.bookList
            bookList = bookList.concat(res.data.list)
            totalPages = Math.ceil(res.data["total_records"] / 20)
            that.setData({
              bookList: bookList
            })
        }
        else{
          app.showFailBackModel()
        }
      },
      fail: function (res) {
       app.showFailBackModel()
      },
      complete: function (res) {
        wx.hideToast();
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