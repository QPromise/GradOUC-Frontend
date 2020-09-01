// miniprogram/pages/profile/profile.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sno:null,
    name:"",
    profession:"",
    research:"",
    supervisor:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '信息加载中',
    })
    let that = this
    that.setData({
      sno: app.cache.sno,
    })
    that.getProfile()
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
  getProfile: function () {
    var that = this;
    wx.request({
      url: app.local_server + 'get_profile/',
      method: 'POST',
      data: {
        sno:app.cache.sno,
        passwd: app.cache.passwd
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        wx.hideLoading();
        console.log("success", res);
        console.log(res.data.info);
        if (res.data.message == "timeout"){
          wx.showModal({
            title: '请求超时',
            content: '可能是研究生系统问题，请稍后重试',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                })
              }
            }
          })
        }
        else if (res.data.message == "fault" && res.statusCode == 200) {
          wx.showModal({
            title: "加载失败",
            content: '获取信息失败,请重新绑定后再试',
            showCancel: true,
            confirmText: "前往绑定",
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../my/login',
                })
              }
            }
          });
        }
        else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_info == 0){
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
        }
        else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_info == 1) {
          let info = res.data.info
          that.setData({
            name: info["name"],
            profession:info["profession"],
            research:info["research"],
            supervisor:info["supervisor"]
          })
        }
        else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_info == 2) {
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
        }
        else if (res.data.message == "fault" && res.statusCode != 200) {
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
        }
        else{
          app.showErrorModal('服务器出现了问题', '提示');
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: "加载失败",
          content: '获取信息失败，可能是服务器出了问题',
          showCancel: false,
          confirmText: "确定",
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
                
              })
            }
          }
        });

      },
      complete: function (res) {
        console.log("complete", res);
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