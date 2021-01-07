const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    is_bind: app.cache.is_bind,
    is_open_subscribe:app.cache.is_open_subscribe,
    name: null,
    times:"--",
    sno:null,
    openId: null,
    gender: null,
    department: null,
    score_notice: false,
    customBar: app.globalData.CustomBar
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow: function () {
    var that = this;
    that.setData({
      is_bind: app.cache.is_bind,
      name: app.cache.name,
      sno: app.cache.sno,
    })
    that.getIsOpenSubscribe();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getIsOpenSubscribe: function(){
    let that = this
    wx.request({
      url: app.local_server + 'get_config/',
      success: function (res) {
        app.saveCache("is_open_subscribe", res.data.is_open_subscribe)
        that.setData({
          is_open_subscribe: res.data.is_open_subscribe
        })
        if (that.data.is_bind && (that.data.is_open_subscribe == 1 || that.data.is_open_subscribe == 2)){
          wx.request({
            url:app.local_server + "get_subscribe_status?openid="+app.globalData.openId,
            success: (res) =>{
              //console.log(res.data.score_notice)
              that.setData({
                score_notice:res.data.score_notice,
                times:res.data.times + "次"
              })
            }
            ,fail: (res)=>{
             that.setData({
               score_notice: false
             })
            }
          })
        }
      },
    })
  },
  scoreSubscribe: function(){
    let that = this
    wx.requestSubscribeMessage({
      tmplIds: ["LxOu_CBTn3H88ndcz_S9aeRO_lTaR3lgKrIU2VoOuZo"],
      success: (res) => {
       if (res['LxOu_CBTn3H88ndcz_S9aeRO_lTaR3lgKrIU2VoOuZo'] === 'accept'){
         //登录(获取用户授权码，服务端记录用户订阅次数用到)
         wx.login({
           success: function(res) {
             console.log(res.code)
             //调用后端接口，记录订阅次数
             wx.request({
               url:app.local_server + "subscribe_score?openid="+app.globalData.openId,
               success: (res) =>{
                 if (res.data.message == "success")
                 {
                  wx.request({
                    url:app.local_server + "get_subscribe_status?openid="+app.globalData.openId,
                    success: (res) =>{
                      //console.log(res.data.score_notice)
                      that.setData({
                        times:res.data.times + "次"
                      })
                    }
                  })
                  wx.showModal({
                    title: '订阅成功',
                    content: '成绩将在出来后及时通知你，为方便后续多次成绩通知，建议多次点击成绩通知按钮并同意去增加通知次数，不然很可能会错过部分成绩通知',
                    showCancel: false,
                    success(res) {
                    }
                  })
                  that.setData({
                    score_notice: true
                  })
                 }
                 else if (res.data.message == "fault")
                 {
                  wx.showModal({
                    title: '订阅失败',
                    content: '请重新绑定后再试',
                    showCancel: true,
                    confirmText: '去绑定',
                    cancelText: '取消',
                    success(res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../my/login',
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  that.setData({
                    score_notice: false
                  })
                 }
                 else if (res.data.message == "repeated")
                 {
                  wx.request({
                    url:app.local_server + "get_subscribe_status?openid="+app.globalData.openId,
                    success: (res) =>{
                      //console.log(res.data.score_notice)
                      that.setData({
                        times:res.data.times + "次"
                      })
                    }
                  })
                  wx.showToast({
                    title: '成绩通知次数增加啦！记得多点几次呀！',
                    icon: 'none',
                    duration: 2500
                })
                that.setData({
                  score_notice: true
                })
                 }
               }
               ,fail: (res)=>{
                that.setData({
                  score_notice: false
                })
                wx.showToast({
                  title: '订阅失败！',
                  icon: 'none',
                  duration: 1500
              })
               }
             })
           }
         });
       }
       else{
        wx.showToast({
          title: '增加成绩通知次数失败！',
          icon: 'none',
          duration: 1500
      })
       }
      }
   })
   that.setData({
     score_notice:that.data.score_notice
   })
  },
  toFeedback: function () {
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e',
      extraData: {
        id: '273731',
      },
    });
  },
  showAddTip:function(){
    this.setData({
      add_tips: true
    })
  },
  closeAddTip:function(){
    this.setData({
      add_tips: false
    })
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

  },

})

