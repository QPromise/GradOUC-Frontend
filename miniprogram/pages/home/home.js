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
    console.log(this.data.is_bind);
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
  var fuTime = new Date("2019/12/21 00:00:00");
  if (that.cmpDate(fuTime)){
    fuTime = new Date("2020/12/19 00:00:00");
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
    wx.navigateTo({
      url: '../core/schoolCourse/schoolCourse',
    })
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
        console.log(res);
        console.log(res.data.index);
        var newsindex = wx.getStorageSync("newsindex");
        console.log(newsindex)
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
        console.log(res);
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
