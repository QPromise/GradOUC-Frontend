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
    credit: "",
    select: "",
    xn: "",
    xq: "",
    teacher: "",
    type: "",
    process:"",
    index: 0,
    index2: 0,
    arrDict:{},
    school_require_credit:0.0,
    select_credit:0.0,
    get_credit:0.0
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
    //显示等待提示
    // wx.showToast({
    //   title: '正在获取课程',
    //   icon: 'loading',
    //   duration: 15000
    // });
    wx.showLoading({
      title: '课程加载中',
    })
    that.requestEDU();

  },

  //请求单独作为一个方法
  requestEDU: function () {
    var that = this;
    wx.request({
      url: app.local_server + 'get_course/',
      method: 'POST',
      data: {
        openid: app.globalData.openId,
        sno:app.cache.sno,
        passwd: app.cache.passwd
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        wx.hideLoading();
        //console.log("success", res);
        //console.log(res.data.courses);
        if (res.data.message == "timeout"){
          wx.showModal({
            title: '请求超时',
            content: '可能是你的网络问题，请稍后重试',
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
            content: '获取课表失败,请重新绑定后再试',
            showCancel: true,
            confirmText: "前往绑定",
            success: (res) => {
              if (res.confirm) {
                wx.navigateTo({
                  url: '../../my/login',
                })
              }
              if(res.cancel){
                wx.navigateBack({
                })
              }
            }
          });
        }
        else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_class == 0){
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
        }
        else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_class == 1) {
          var Eduarray = [];
          let arrDict = {};
          for (var i = 0; i< res.data.courses.length; i++) {
            let key = res.data.courses[i].xn + res.data.courses[i].xq;
            if (key == ""){
              key = "其它";
            }
            arrDict[key] = [];
          }
          for (var i = 0; i< res.data.courses.length; i++) {
              var change = new Object();
              change.name = that.isOver16(res.data.courses[i].name);
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
              if (key == ""){
                key = "其它";
              }
              arrDict[key].push(change);
          }
          //console.log(Eduarray);
         // console.log(arrDict);
         if (res.data.get_credit == 0){
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
              select_credit:res.data.select_credit
            })
          }
        }
        }
        else{
          let i = 0;
        numDH();
        function numDH() {
          console.log(res.data.get_credit, i < res.data.get_credit)
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
              select_credit:res.data.select_credit
            })
          }
        }
        }
         const orderedArrDict = {}; 
         Object.keys(arrDict).sort().forEach(function(key) { orderedArrDict[key] = arrDict[key]; });
          that.setData({
            arrDict:orderedArrDict,
          });


          
        }
        else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_class == 2) {
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
        }
        else if (res.data.message == "fault" && res.statusCode != 200) {
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
        //console.log("complete", res);
      }
    });

  },
  isOver16: function (str) {
    if (str.length > 16) {
      return str.substring(0, 15) + "...";
    }
    else return str;
  },
  showdetail: function (e) {
    //console.log(e);
    var that = this;
    var noshow = false;
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    var credit = e.currentTarget.dataset.credit;
    var select = e.currentTarget.dataset.select;
    var xn = e.currentTarget.dataset.xn;
    var xq = e.currentTarget.dataset.xq;
    var teacher = e.currentTarget.dataset.teacher;
    var type = e.currentTarget.dataset.type;
    var process = e.currentTarget.dataset.process;
    if (name == "") noshow = true;
    that.setData({
      hiddenmodalput: noshow,
      name: name,
      id: id,
      type: type,
      credit: credit,
      select: select,
      xn: xn,
      xq: xq,
      teacher: teacher,
      process:process
    })
  },
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  }
})