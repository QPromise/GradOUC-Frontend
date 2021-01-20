//获取应用实例
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    id: "",
    name: "",
    full_name:"",
    credit: "",
    select: "",
    xn: "",
    xq: "",
    teacher: "",
    type: "",
    process: "",
    index: 0,
    index2: 0,
    arrDict: {},
    unplannedArrDict: {},
    unplannedCourses: [],
    loading: false,
    school_require_credit: 0.0,
    select_credit: 0.0,
    get_credit: 0.0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.refreshEDU();
  },

  onShow: function () {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    let that = this
    wx.showNavigationBarLoading() 
    that.refreshEDU()
    //模拟加载
    setTimeout(function () {
      wx.hideNavigationBarLoading(); //完成停止加载
      wx.stopPullDownRefresh(); //停止下拉刷新
    })
  
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '我的课程',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/core/course/course'
    };
  },
  //课程刷新
  refreshEDU: function () {
    var that = this;
    that.requestEDU();

  },

  //请求单独作为一个方法
  requestEDU: function () {
    var that = this;
    wx.showLoading({
      title: '课程加载中',
    })
    that.setData({
      loading:true
    })
    wx.request({
      url: app.local_server + 'get_course/',
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
        //console.log("success", res);
        //console.log(res.data.courses);
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
        } else if (res.data.message == "fault" && res.statusCode == 200) {
          wx.showModal({
            title: "加载失败",
            content: '获取课程失败,请重新绑定后再试',
            showCancel: true,
            confirmText: "前往绑定",
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../my/login',
                })
              }
              if (res.cancel) {
                wx.navigateBack({})
              }
            }
          });
        } else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_class == 0) {
          wx.showModal({
            title: '提示',
            content: '当前没有课程',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({

                })
              }
            }
          })
        } else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_class == 1) {
          let Eduarray = [];
          let arrDict = {};
          let unplannedArrDict = {};
          let unplannedCourses = [];
          if (res.data.unplanned_courses.length > 0) {
            that.setData({
              unplannedCourses: res.data.unplanned_courses
            })
            for (var i = 0; i < res.data.unplanned_courses.length; i++) {
              let key = res.data.unplanned_courses[i].xn + res.data.unplanned_courses[i].xq;
              if (key == "") {
                key = "其它";
              }
              unplannedArrDict[key] = [];
            }
            for (var i = 0; i < res.data.unplanned_courses.length; i++) {
              var change = new Object();
              change.name = that.isOver13(res.data.unplanned_courses[i].name);
              change.full_name = res.data.unplanned_courses[i].name;
              change.id = res.data.unplanned_courses[i].id;
              change.type = res.data.unplanned_courses[i].type;
              change.process = res.data.unplanned_courses[i].process;
              change.select = res.data.unplanned_courses[i].select;
              change.credit = res.data.unplanned_courses[i].credit;
              change.teacher = res.data.unplanned_courses[i].teacher;
              change.xn = res.data.unplanned_courses[i].xn;
              change.xq = res.data.unplanned_courses[i].xq;
              unplannedCourses[i] = change;
              let key = res.data.unplanned_courses[i].xn + res.data.unplanned_courses[i].xq;
              if (key == "") {
                key = "其它";
              }
              unplannedArrDict[key].push(change);
            }
            const orderedUnplannedArrDict = {};
            Object.keys(unplannedArrDict).sort().forEach(function (key) {
            orderedUnplannedArrDict[key] = unplannedArrDict[key];
          });
          that.setData({
            unplannedArrDict: orderedUnplannedArrDict,
          });
          }
          else{
            that.setData({
              unplannedCourses: res.data.unplanned_courses
            })
          }
          for (var i = 0; i < res.data.courses.length; i++) {
            let key = res.data.courses[i].xn + res.data.courses[i].xq;
            if (key == "") {
              key = "其它";
            }
            arrDict[key] = [];
          }
          for (var i = 0; i < res.data.courses.length; i++) {
            var change = new Object();
            change.name = that.isOver13(res.data.courses[i].name);
            change.full_name = res.data.courses[i].name;
            change.id = res.data.courses[i].id;
            change.type = res.data.courses[i].type;
            change.process = res.data.courses[i].process;
            change.select = res.data.courses[i].select;
            change.credit = res.data.courses[i].credit;
            change.teacher = res.data.courses[i].teacher;
            change.xn = res.data.courses[i].xn;
            change.xq = res.data.courses[i].xq;
            Eduarray[i] = change;
            let key = res.data.courses[i].xn + res.data.courses[i].xq;
            if (key == "") {
              key = "其它";
            }
            arrDict[key].push(change);
          }
          //console.log(Eduarray);
          // console.log(arrDict);
          if (res.data.get_credit == 0) {
            that.setData({
              get_credit: res.data.get_credit
            })
            let i = 0;
            numDH();
            function numDH() {
              if (i < Math.min(res.data.school_require_credit, res.data.select_credit)) {
                setTimeout(function () {
                  that.setData({
                    school_require_credit: i,
                    select_credit: i
                  })
                  i++
                  numDH();
                }, 20)
              } else {
                that.setData({
                  school_require_credit: res.data.school_require_credit,
                  select_credit: res.data.select_credit
                })
              }
            }
          } else {
            let i = 0;
            numDH();
            function numDH() {
              //console.log(res.data.get_credit, i < res.data.get_credit)
              if (i < res.data.get_credit) {
                setTimeout(function () {
                  that.setData({
                    school_require_credit: i,
                    get_credit: i,
                    select_credit: i
                  })
                  i++
                  numDH();
                }, 20)
              } else {
                that.setData({
                  school_require_credit: res.data.school_require_credit,
                  get_credit: res.data.get_credit,
                  select_credit: res.data.select_credit
                })
              }
            }
          }
          const orderedArrDict = {};
          Object.keys(arrDict).sort().forEach(function (key) {
            orderedArrDict[key] = arrDict[key];
          });
          that.setData({
            arrDict: orderedArrDict,
          });

        } else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_class == 2) {
          wx.showModal({
            title: '提示',
            content: '研究生系统【我的课程】目前无法访问',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({

                })
              }
            }
          })
        } else if (res.data.message == "fault" && res.statusCode != 200) {
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
          wx.showModal({
            title: '提示',
            content: '可能是您的网络或者服务器出了问题，请稍后重试',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({

                })
              }
            }
          })
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: "加载失败",
          content: '获取课程失败，可能是您的网络或者服务器出了问题，请稍后重试',
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
        that.setData({
          loading:false
        })
      }
    });

  },
  isOver13: function (str) {
    if (str.length > 13) {
      return str.substring(0, 12) + "...";
    } else return str;
  },
  showdetail: function (e) {
    //console.log(e);
    var that = this;
    var noshow = false;
    var full_name = e.currentTarget.dataset.full_name;
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    var credit = e.currentTarget.dataset.credit;
    var select = e.currentTarget.dataset.select;
    var xn = e.currentTarget.dataset.xn;
    var xq = e.currentTarget.dataset.xq;
    var teacher = e.currentTarget.dataset.teacher;
    var type = e.currentTarget.dataset.type;
    var process = e.currentTarget.dataset.process;
    if (full_name == "") noshow = true;
    that.setData({
      hiddenmodalput: noshow,
      full_name:full_name,
      name: name,
      id: id,
      type: type,
      credit: credit,
      select: select,
      xn: xn,
      xq: xq,
      teacher: teacher,
      process: process
    })
  },
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  }
})