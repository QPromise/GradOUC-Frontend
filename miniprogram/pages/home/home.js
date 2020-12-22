//获取应用实例
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isTiptrue:false,
    swiimgs: [
    ],
    hiddenmodalput: true,
    getindex: 0,  //最新获取的消息序号，用户用户点击关闭通知
    shownews: false,
    text: "",
    size: 14,
    is_bind: app.cache.is_bind,//判断是否绑定用户了
    is_open_subscribe: app.cache.is_open_subscribe, //判断是否打开了成绩通知模式
    countDays:undefined,
  },

  shareconfirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  },
  //显示敬请期待
  showWaitingTips: function () {
    var that = this;
    // that.setData({
    //   hiddentips: false,
    // })
    wx.showModal({
      title: '提示',
      content: '即将推出，敬请期待！',
      showCancel: false,
      success(res) {
        if (res.confirm) {

        } else if (res.cancel) {

        }
      }
    })
  },
  //显示更多提示
  showMoreTips: function () {
    var that = this;
    wx.showModal({
      title: '提示',
      content: '随着版本的更新，以后会有更多的功能加进来，如果你有好的提议，请联系我。',
      showCancel: true,
      confirmText: '我有想法',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../feedback/feedback',
          })
        } else if (res.cancel) {

        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      is_bind: app.cache.is_bind,
    });
    this.getTopbarImg();
    this.guide();
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
    var that = this;
    that.getnews();//当重新回到此页面时，再次请求
    that.countDate();
    that.getIsOpenSubscribe();
  },
    /**
   * 检测系统是否开启成绩通知了
   */
  getIsOpenSubscribe: function(){
    let that = this
    wx.request({
      url: app.local_server + 'get_config/',
      success: function (res) {
        //console.log(res.data.is_open_subscribe)
        app.saveCache("is_open_subscribe", res.data.is_open_subscribe)
        that.setData({
          is_open_subscribe: res.data.is_open_subscribe
        })
        if (that.data.is_open_subscribe == 1 || that.data.is_open_subscribe == 2){
          that.failurePopup();
        }
      },
    })
  },
  /**
   * 检测成绩通知是否失效
   */
  failurePopup: function(){
    let that = this
    wx.request({
      url:app.local_server + "get_subscribe_status?openid="+app.globalData.openId,
      success: (res) =>{
        console.log(res.data.open_failure_popup, res.data.score_notice)
        if (res.data.open_failure_popup){
          if(!res.data.score_notice){
            wx.showModal({
              title: '订阅失效',
              content: '成绩通知订阅已经失效，系统检测到你已经错过一次成绩通知，请订阅成绩通知',
              showCancel: true,
              confirmText: '去订阅',
              cancelText: '取消提示',
              success(res) {
                if (res.confirm) {
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
                                wx.showModal({
                                  title: '订阅成功',
                                  content: '为方便后续多次成绩通知，建议去个人中心多次点击成绩通知按钮并同意去增加通知次数，不然很可能会错过下次的成绩通知',
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
                                wx.showToast({
                                  title: '成绩通知次数增加啦！',
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
                } else if (res.cancel) {
                  wx.showModal({
                    title: '提示',
                    content: '是否要关闭提示，关闭之后成绩通知订阅失效将不能通知你',
                    showCancel: true,
                    confirmText: '确定关闭',
                    cancelText: '不关闭',
                    success(res) {
                      if (res.confirm) {
                        wx.request({
                          url:app.local_server + "set_failure_popup_false?openid="+app.globalData.openId,
                          success: (res) =>{
                            if(res.data.message){
                               wx.showToast({
                              title: '成绩通知失效提示已关闭！',
                              icon: 'none',
                              duration: 1500
                          })
                        }
                        else{
                          wx.showToast({
                            title: '成绩通知失效提示关闭失败！',
                            icon: 'none',
                            duration: 1500
                        })
                        }
                          }
                        })
                      } else if (res.cancel) {
                        
                      }
                    }
                  })
                }
              }
            })
          }
        }
      }
    })

  },
   /**
   * 检测是否绑定了用户
   */
  showNeedBind:function(){
    var that = this;
    wx.showModal({
      title: '提示',
      content: '还没有绑定账号密码',
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
  },
  guide:function(){
    let firstOpen = app.cache.firstOpen
    console.log("是否首次打开本页面==", firstOpen)
    if(firstOpen == undefined || firstOpen == '') { //根据缓存周期决定是否显示新手引导
    this.setData({
      isTiptrue: true,
    })
  } else {
    this.setData({
      isTiptrue: false,
    })
  }

},
//考研倒计时
countDate:function() {
  var that = this
  var fuTime = new Date("2020/12/26 00:00:00");
  if (that.cmpDate(fuTime)){
    fuTime = new Date("2021/12/25 00:00:00");
  }
  console.log('compare date',that.cmpDate(fuTime))
  var now = new Date();
  var day = parseInt((fuTime - now) / 1000 / 60 / 60 / 24) + 1;
  var hour = parseInt((fuTime - now) % (1000 * 60 * 60 * 24) / 1000 / 60 / 60);
  var min = parseInt((fuTime - now) % (1000 * 60 * 60) / 1000 / 60);
  var sec = parseInt((fuTime - now) % (1000 * 60) / 1000);
  that.setData({
    countDays:day
  })
},
cmpDate: function (date) { // 现在是否大于指定的时间。
  var now = new Date()
  var date = new Date(date)
  return now > date
},
closeGuide:function() {
  app.saveCache('firstOpen', 'not');
  this.setData({
      isTiptrue: false
    })
  },
  /**
   * 我的课表
   */
goSchedule:function(){
    var that = this;
    if (that.data.is_bind){
      wx.navigateTo({
        url: '../core/schedule/schedule',
      })
    }
    else{
      that.showNeedBind();
    }
  },
  /**
   * 我的课程
   */
  goCourse:function(){
    var that = this;
    if (that.data.is_bind) {
      wx.navigateTo({
        url: '../core/course/course',
      })
    }
    else {
      that.showNeedBind();
    }
  },
  /**
   * 我的成绩
   */
  goScore: function () {
    var that = this;
    if (that.data.is_bind) {
      wx.navigateTo({
        url: '../core/score/score',
      })
    }
    else {
      that.showNeedBind();
    }
  },
  /**
   * 
   */
  goSchoolCourse: function () {
    var that = this;
    if (that.data.is_bind) {
      wx.navigateTo({
        url: '../core/schoolCourse/schoolCourse',
      })
    }
    else {
      that.showNeedBind();
    }
  },
  goCampusTours: function () {
    wx.navigateTo({
      url: '../core/campusTours/campusTours',
    })
  },
  goCar: function () {
    wx.navigateTo({
      url: '../core/car/car',
    })
  },
  goCalendar:function(){
    var that = this;
    wx.navigateTo({
      url: '../core/calendar/calendar',
    })
  },
  goLibrary: function () {
    var that = this;
    wx.navigateTo({
      url: '../core/library/library',
    })
  },
  goNews: function () {
    wx.navigateTo({
      url: '../core/news/news',
    })
  },
  navArticle: function (e) {
    wx.navigateTo({
      url: e.currentTarget.dataset.url + "?type=" + e.currentTarget.dataset.type,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: "研在OUC-查课表、查成绩、查考试...",
      path: '/pages/home/home',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！'
    };
    // 返回shareObj
    return shareObj;
  },
  //获取通知
  getnews: function () {
    var that = this;
    wx.request({
      url: app.local_server+"get_news/",
      success: function (res) {
        //consolconsole.log(res);
        //console.log(res.data.index);
        var newsindex = wx.getStorageSync("newsindex");
        //console.log(newsindex)
        if (newsindex != undefined && newsindex != "" && newsindex != null) {
          if (newsindex < res.data.index) {
            that.setData({
              text: res.data.news,
              getindex: res.data.index,
              shownews: true
            });
          } else {
            that.setData({
              shownews: false
            })
          }
        }
        else {
          wx.setStorageSync("newsindex", "0");
          that.getnews();
        }
      }
    });
  },
  navTo: function (e) {
    wx.navigateTo({
      url: '/pages/web/web?url=' + e.target.dataset.id,
    })
  },
  //获取推广轮播图片
  getTopbarImg: function () {
    var that = this;
    wx.request({
      url: app.local_server + "get_swiper/",
      success: function (res) {
        //consolconsole.log(res);
        let swis = new Array();
        for (let i = 0; i < res.data.length; i++) {
          swis[i] = new Object();
          swis[i].url = res.data[i].url;
          swis[i].image = app.local_server + res.data[i].image;
        }
        that.setData({ swiimgs: swis });
      }
    });
  }
})
