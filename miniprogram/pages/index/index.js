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
    today:undefined,
    course:[],
    loading:false,
    content: "",
    showTodayInfo:"",
    todayArr:["周一","周二","周三","周四","周五","周六","周日"]
  },

  shareconfirm: function () {
    this.setData({
      hiddenmodalput: true
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
    this.getDay();
    this.getTodayCourse();
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
    that.getIsOpenSubscribe();
    
  },
   /** 下拉刷新 */
   onPullDownRefresh:function(){
    var that = this
    wx.showNavigationBarLoading() 
    that.setData({
      is_bind: app.cache.is_bind,
    })
    that.getWeek(app.cache.begin_day)
    that.getTopbarImg()
    that.getDay()
    that.getnews()
    that.getIsOpenSubscribe()
    that.getTodayCourse()
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    })
  },
  getWeek:function(begin_day){
    var that = this;
    //当前周次设置
    var nowtime = new Date();  //当前时间 用于平时
    var nowtimestamp = Date.parse(nowtime);  //当前时间的时间戳（毫秒）最后三位000
    var day = ((nowtimestamp / 1000 - begin_day) / 86400); //与开学时间的时间差（天）
    var nowzc = Math.ceil(day / 7); //向上取整
    //if (nowzc > 21) nowzc = 21;
    app.saveCache("nowzc",nowzc);
  },
  // 现在是否大于指定的时间
  cmpDate: function () { 
    var now = parseInt(Date.parse(new Date()) / 1000)
    var date = parseInt(app.cache.begin_day)
    return now > date
  },
  //获取今天的课程
  getTodayCourse:function(){
    let that = this
    if(!that.cmpDate()){
      that.setData({
        content:"今天没有课程哦,去做点有意义的事情吧~"
      })
      return;
    }
    that.setData({
      loading:true
    })
    //选择学期
    var xj;
    var items = app.cache.xq;
    if (items.indexOf("夏秋") != -1){
      xj = 11
    }
    else{
      xj = 12
    }
    wx.request({
      url: app.local_server + 'get_today_course/',
      method: 'POST',
      data: {
        openid: app.globalData.openId,
        sno:app.cache.sno,
        passwd:app.cache.passwd,
        zc:app.cache.nowzc,
        xn:app.cache.xn,
        xj:xj,
        day:that.data.today
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: (res)=> {
        let that = this
        //console.log(res);
        if (res.data.message == "timeout"){
          that.setData({
            content: '请求超时啦'
          })
        }
        else if (res.data.message == "fault" && res.statusCode == 200) {
          that.setData({
            content: '获取课表失败,请重新绑定后再试'
          })
        }
        else if (res.data.message == "fault" && res.statusCode != 200){
          that.setData({
            content: '研究生系统目前无法访问'
          })
        }
        else if(res.data.message == "success" && res.statusCode == 200) {
          let tmp_course = res.data.course
          for(let i = 0; i < tmp_course.length; i++){
            if(tmp_course[i].name.length > 13){
              tmp_course[i].name = tmp_course[i].name.substring(0,11) + "..";
            }
            if (tmp_course[i].room.length > 10){
              tmp_course[i].room = tmp_course[i].room.substring(0,3) + ".." + tmp_course[i].room.substring(tmp_course[i].room.length - 6,tmp_course[i].room.length);
            }
          }
          if(app.cache.nowzc > 22){
            that.setData({
              showTodayInfo:""
            })
          }
          else{
            that.setData({
              showTodayInfo:"第" + app.cache.nowzc + "周 " + that.data.todayArr[that.data.today]
            })
          }
          that.setData({
            course:tmp_course,
            content:"今天没有课程哦,去做点有意义的事情吧~"
          }) 
        }
        else{
          that.setData({
            content: '服务器开小差啦'
          })
        }
      },
      fail: function (res) {
        that.setData({
          content: '网络出问题啦'
        })
      },
      complete: function (res) {
        that.setData({
          loading:false
        })
      }
    });
  },
 //获取当前日期
 getDay:function(){
   let that = this
  var today = parseInt(new Date().getDay());
  if (today == 0) {
   that.setData({
     today:6
   })
  } else{
   that.setData({
     today:today - 1 
   })
  }
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
        //console.log(res.data.open_failure_popup, res.data.score_notice)
        if (res.data.open_failure_popup){
          if(!res.data.score_notice){
            wx.showModal({
              title: '订阅失效',
              content: '成绩通知订阅已经失效，订阅一次的有效期为七天，请订阅成绩通知',
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
                           //console.log(res.code)
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
  goBind:function(){
    wx.navigateTo({
      url: '../my/login',
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
  scoreSubscribe: function(){
    let that = this
    wx.requestSubscribeMessage({
      tmplIds: ["LxOu_CBTn3H88ndcz_S9aeRO_lTaR3lgKrIU2VoOuZo"],
      success: (res) => {
       if (res['LxOu_CBTn3H88ndcz_S9aeRO_lTaR3lgKrIU2VoOuZo'] === 'accept'){
         //登录(获取用户授权码，服务端记录用户订阅次数用到)
         wx.login({
           success: function(res) {
             //console.log(res.code)
             //调用后端接口，记录订阅次数
             wx.request({
               url:app.local_server + "subscribe_score?openid="+app.globalData.openId,
               success: (res) =>{
                 if (res.data.message == "success")
                 {
                  wx.showModal({
                    title: '订阅成功',
                    content: '成绩将在出来后及时通知你，为方便后续多次成绩通知，建议多次点击成绩通知按钮并同意去增加通知次数，不然很可能会错过部分成绩通知',
                    showCancel: false,
                    success(res) {
                    }
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

                 }
                 else if (res.data.message == "repeated")
                 {
                  wx.showToast({
                    title: '成绩通知次数增加啦！记得多点几次呀！',
                    icon: 'none',
                    duration: 2500
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
      wx.requestSubscribeMessage({
        tmplIds: ["LxOu_CBTn3H88ndcz_S9aeRO_lTaR3lgKrIU2VoOuZo"],
        success: (res) => {
         if (res['LxOu_CBTn3H88ndcz_S9aeRO_lTaR3lgKrIU2VoOuZo'] === 'accept'){
           //登录(获取用户授权码，服务端记录用户订阅次数用到)
           wx.login({
             success: function(res) {
               //调用后端接口，记录订阅次数
               wx.request({
                 url:app.local_server + "subscribe_score?openid="+app.globalData.openId,
                 success: (res) =>{
                   if (res.data.message == "success")
                   {
                    wx.showModal({
                      title: '订阅成功',
                      content: '成绩将在出来后及时通知你，为方便后续多次成绩通知，建议去【个人中心】多次点击成绩通知按钮并同意去增加通知次数，不然很可能会错过部分成绩通知',
                      showCancel: false,
                      success(res) {
                      }
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
  
                   }
                   else if (res.data.message == "repeated")
                   {
                    wx.showModal({
                      title: '订阅成功',
                      content: '成绩通知次数增加啦！记得去【个人中心】多点几次呀！',
                      showCancel: false,
                      success(res) {
                      }
                    })
                   }
                 }
                 ,fail: (res)=>{
                  wx.showModal({
                    title: '订阅失败',
                    content: '可能是您的网络或者服务器出现了问题，请稍后重新订阅！',
                    showCancel: false,
                    success(res) {
                    }
                  })
                 }
               })
             }
           });
         }
         else{

         }
        }
     })
    }
    else {
      that.showNeedBind();
    }
  },
  goProfile: function () {
    var that = this;
    if (that.data.is_bind) {
      wx.navigateTo({
        url: '/pages/profile/profile',
      })
    }
    else {
      that.showNeedBind();
    }
  },
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
      url: '/pages/web/web?url=' + "https://mp.weixin.qq.com/s/mG1X9LpvCmrB3-1UZyOEEw",
    })
  },
    goWaimai:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/web/web?url=' + "https://mp.weixin.qq.com/s/WH09TrP5NdzTQnrWfRD7cg",
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
      path: '/pages/index/index',
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
        var newsindex = wx.getStorageSync("newsindex");
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
