let app = getApp()
let inputValue = ""
const typeList = ["任意词","书名", "作者"]
const typeListConvert = {
  "任意词":"any",
  "书名": "02",
  "作者": "03",
}
var typeListIndex = 0
Page({

  /**
   * 页面的初始数据
   */
  data: {
    barCodeRes: "",
    type: typeList[typeListIndex] + "▼"
  },
  onShareAppMessage: function () {
    return {
      title: '图书馆藏书查询',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/core/library/library'
    };
  },
  selectType() {
    var that = this
    this.setData({
      type: typeList[typeListIndex] + "▲"
    })
    wx.showActionSheet({
      itemList: typeList,
      success: (e) => {
        typeListIndex = e.tapIndex
        that.setData({
          type: typeList[typeListIndex] + "▼"
        })
      },
      fail: (e) => {
        that.setData({
          type: typeList[typeListIndex] + "▼"
        })
      }

    })
  },
  inputChange(e) {
    inputValue = e.detail.value
  },
  searchByName() {
    //判断输入内容是否为空或全是空格
    if (inputValue.match(/^[ ]*$/) ) {
      wx.showToast({
        icon: 'none',
        title: '搜索内容不能为空',
        duration: 1000
      });
      return
    }
    wx.navigateTo({
      url: 'searchResults?bookName=' + inputValue + "&type=" + typeListConvert[typeList[typeListIndex]],
    })
  },
  scanBarcode() {
    var that = this
    wx.scanCode({
      success: function (res) {
        wx.navigateTo({
          url: 'searchResults?bookName=' + res.result + "&type=05",
        })
      }
    })
  },
  // onReady: function() {
  //   app = getApp()
  // }
})