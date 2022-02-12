// miniprogram/pages/core/score/rewardFile/rewardFile.js
const app = getApp();
let interstitialAd = null
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rewardFiles:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getRewardFiles()
    if (wx.createInterstitialAd) {
      interstitialAd = wx.createInterstitialAd({
        adUnitId: 'adunit-2ed68bcc4db0e8f1'
      })
      interstitialAd.onLoad(() => {})
      interstitialAd.onError((err) => {})
      interstitialAd.onClose(() => {})
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
    if (interstitialAd) {
      interstitialAd.show().catch((err) => {
        console.error(err)
      })
    }
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

  onPullDownRefresh: function () {
    let that = this
    wx.showNavigationBarLoading() 
    that.getRewardFiles()
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
    return {
      title: '奖助学金文件',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/core/score/rewardFile/rewardFile'
    };
  },
  getRewardFiles:function(){
    let that = this
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: app.local_server + 'get_reward_files/',
      method: 'GET',
      success: (res)=> {
        let that = this
        if (res.data.message == "fault") {
          wx.showModal({
            title: "加载失败",
            content: '获取文件列表失败',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                wx.navigateBack({})
              }
            }
          });
        }
        else if(res.data.message == "success" && res.statusCode == 200) {
          that.setData({
            rewardFiles:res.data.reward_files,
          }) 
        }
        else{
          wx.showModal({
            title: "加载失败",
            content: '获取文件列表失败',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                wx.navigateBack({})
              }
            }
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "加载失败",
          content: '获取文件列表失败，可能是您的网络或者服务器出了问题，请稍后重试',
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
        wx.hideLoading({
          complete: (res) => {},
        })
      }
    });
  },
  postFile:function(){
    wx.navigateTo({
      url: '/pages/web/web?url=' + "https://mp.weixin.qq.com/s/-4mtGrs-E-8Cffk_pv3d8A",
    })
  },
  openPdf: function (e) {
    let full_name = e.currentTarget.dataset.full_name
    console.log(full_name)
    wx.downloadFile({
      url:app.local_server + "static/reward_files/" + full_name,
      success: function (res) {
        var filePath = res.tempFilePath;
        wx.openDocument({
          filePath: filePath,
        });
      },
    });
  },
})