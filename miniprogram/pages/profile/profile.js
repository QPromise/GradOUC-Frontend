// miniprogram/pages/profile/profile.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sno: null,
    name: "",
    profession: "",
    research: "",
    supervisor: "",
    loading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      sno: app.cache.sno
    })
    let update_time = wx.getStorageSync(app.cache.sno + 'self_info_update_time')
    if (update_time != "") {
      var name = wx.getStorageSync(app.cache.sno + 'name');
      var profession = wx.getStorageSync(app.cache.sno + 'profession');
      var research = wx.getStorageSync(app.cache.sno + 'research');
      var supervisor = wx.getStorageSync(app.cache.sno + 'supervisor');
      that.setData({
        name: name,
        profession: profession,
        research: research,
        supervisor: supervisor,
      })
    } else {
      that.refreshProfile()
    }
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
  refreshProfile: function(){
    let that = this
    let canUpdate = app.refreshLimit(app.cache.sno + 'self_info_update_time')
    if (canUpdate){
      that.getProfile()
    }
  },
  getProfile: function () {
    var that = this;
    if(that.data.loading){
      return
    }
    that.setData({
      loading:true
    })
    wx.showLoading({
      title: '信息加载中',
    })
    wx.request({
      url: app.local_server + 'get_profile/',
      method: 'POST',
      data: {
        openid: app.globalData.openId,
        sno: app.cache.sno,
        passwd: app.cache.passwd
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.message == "timeout") {
          wx.showModal({
            title: '请求超时',
            content: '可能是研究生系统问题，请稍后重试',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({})
              }
            }
          })
        } else if (res.data.message == "incorrect" && res.statusCode == 200) {
          wx.showModal({
            title: "加载失败",
            content: '获取信息失败,请重新绑定后再试',
            showCancel: true,
            confirmText: "前往绑定",
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../my/login',
                })
              }
              if (res.cancel) {
                wx.navigateBack({})
              }
            }
          });
        } else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_info == 0) {
          wx.showModal({
            title: '提示',
            content: '当前没有个人信息',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({

                })
              }
            }
          })
        } else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_info == 1) {
          let info = res.data.info
          that.setData({
            name: info["name"],
            profession: info["profession"],
            research: info["research"],
            supervisor: info["supervisor"]
          })
          var time = (new Date()).getTime();
          wx.setStorageSync(app.cache.sno + 'self_info_update_time', time);
          wx.setStorageSync(app.cache.sno + 'name', info["name"]);
          wx.setStorageSync(app.cache.sno + 'profession', info["profession"]);
          wx.setStorageSync(app.cache.sno + 'research', info["research"]);
          wx.setStorageSync(app.cache.sno + 'supervisor', info["supervisor"]);
          app.msg("加载成功")

        } else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_info == 2) {
          that.setData({
            have_info: res.data.have_info
          })
          wx.showModal({
            title: '提示',
            content: '研究生系统【培养计划】目前无法访问',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({

                })
              }
            }
          })
        } else if (res.data.message == "fault" && res.statusCode != 200) {
          that.setData({
            have_info: res.data.have_info
          })
          wx.showModal({
            title: '提示',
            content: '研究生系统目前无法访问',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({

                })
              }
            }
          })
        } else {
          app.showFailBackModel()
        }
      },
      fail: function (res) {
        wx.hideLoading();
        app.showFailBackModel()
      },
      complete: function (res) {
        that.setData({
          loading:false
        }) 
        //console.log("complete", res);
      }
    });

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
    let that = this
    wx.showNavigationBarLoading() 
    that.refreshProfile()
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    })
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

  }
})