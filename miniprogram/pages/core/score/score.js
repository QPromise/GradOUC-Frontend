
//获取应用实例
const app = getApp();
let rewardedVideoAd = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: '',
    avatarUrl: '',
    isCanDraw: false,

    loadFull:false,
    hiddenmodalput: true,
    name: "",
    help_status: false,
    credit: "",
    score: "",
    teacher: "",
    type:"",
    mean :"正在加载...",
    have_class:null,
    arraycj: [],
    heads: ["选择","课程名", "课程性质", "学分", "成绩"],
    legalCourseLen: 0,
  },
  getUserInfo(e) {
    if(this.data.nickName == ""){
      // wx.showModal({
      //   title: '嗨，同学',
      //   content: '生成成绩单仅需要你的头像和昵称，请放心同意系统使用相应权限。',
      //   showCancel: false,
      //   success(res) {
      //     if (res.confirm) {
      //     }
      //   }
      // })
      wx.showToast({
        title: '生成成绩单仅需要你的头像和昵称，请放心同意系统使用相应权限。',
        icon: 'none',
        duration: 2500,
        success: function () {
        }
      })
      try{
      this.setData({
        nickName: e.detail.userInfo.nickName,
        avatarUrl: e.detail.userInfo.avatarUrl
      })
      wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl)
      wx.setStorageSync('nickName', e.detail.userInfo.nickName)
    }
      catch(error){
        
      }
  }
    if(this.data.nickName != ""){
      wx.hideToast({
        complete: (res) => {},
      })
      this.setData({
        isCanDraw: !this.data.isCanDraw
      })
    }
  },
  createShareImage() {
    this.setData({
      isCanDraw: !this.data.isCanDraw
    })
  },
  goDetail:function(){
    var that = this;
    wx.navigateTo({
      url: '/pages/web/web?url=' + "https://mp.weixin.qq.com/s/zCD7AycGgEqp1a3-8imOgQ",
    })
  },
  bindCheckbox: function (e) {
    //取下标值
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var selected = this.data.arraycj[index].selected;
    //console.log(selected)
    var arraycj = this.data.arraycj;
    // 对勾选状态取反
    arraycj[index].selected = !selected;
    // 写回经点击修改后的数组
    this.setData({
      arraycj: arraycj
    });
    this.calXFJ()
  },
  calXFJ: function () {
    var arraycj = this.data.arraycj;
    var i;
    //总的学分
    var totalCredit = 0;
    //总的学分绩
    var totalXFJ = 0;
    //平均学分绩
    var averXFJ = 0;
    for (i = 0; i < arraycj.length; i++) {
      arraycj[i].credit = parseFloat(arraycj[i].credit)
      //如果选中了并且学分大于0
      if (arraycj[i].selected && arraycj[i].credit) {
        totalCredit += arraycj[i].credit;
        totalXFJ += arraycj[i].score * arraycj[i].credit;
      }
    }
    //总学分不为0的情况
    if (totalCredit != 0 ){
      averXFJ = totalXFJ/totalCredit;
      this.setData({
        mean: averXFJ.toFixed(4)
      }) 
    }
    else{
      this.setData({
        mean: 0
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.refreshCJ();
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: '我的成绩',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/core/score/score'
    };
  },
  cacheScore: function(courses, aveScore){
    let that = this
    let cacheCourses = []
    let legal = 0
    let fontSize = "26rpx"
    let gapUnit = 40
    let legalCourseLen = that.data.legalCourseLen
    if (legalCourseLen < 13){
      fontSize = "26rpx"
      gapUnit = 50
  }
    else if(legalCourseLen >= 13 && legalCourseLen <= 14){
        fontSize = "26rpx"
        gapUnit = 40
    }
    else if (legalCourseLen > 14 && legalCourseLen < 18){
        fontSize = "20rpx"
        gapUnit = 32
    }
    else if (legalCourseLen >= 18 && legalCourseLen <= 22){
      fontSize = "16rpx"
      gapUnit = 26
  }
    else if (legalCourseLen > 22 && legalCourseLen < 31){
      fontSize = "12rpx"
      gapUnit = 20
    }
    else if (legalCourseLen >= 31 && legalCourseLen < 37){
      fontSize = "9rpx"
      gapUnit = 16
    }
    console.log(legalCourseLen)
    let curScore = new Object()
    curScore.type = "text"
    curScore.text = aveScore + ""
    curScore.css = new Object()
    curScore.css.top = "225rpx"
    curScore.css.left = "375rpx"
    curScore.css.align = "center"
    curScore.css.fontSize = '28rpx'
    curScore.css.color = 'white'
    cacheCourses.push(curScore);

    for (var i = 0; i < courses.length; i++) {
      if (courses[i].score == "未选"){
        continue
      }
      let curCourse = new Object()
      curCourse.type = "text"
      if (courses[i].name.length > 12)
      {
        curCourse.text = courses[i].name.substring(0, 11) + "..."
      }
      else{
        curCourse.text = courses[i].name
      }
      curCourse.css = new Object()
      curCourse.css.top = (335 + gapUnit * legal)+ "rpx"
      curCourse.css.left = "170rpx"
      curCourse.css.fontSize = fontSize
      curCourse.css.color = '#3c3c3c'
      let curScore = new Object()
      curScore.type = "text"
      curScore.text = courses[i].score+ ""
      curScore.css = new Object()
      curScore.css.top = (335 + gapUnit * legal)+ "rpx"
      curScore.css.right = "180rpx"
      curScore.css.fontSize = fontSize
      curScore.css.color = '#3c3c3c'
      cacheCourses.push(curCourse, curScore);
      legal += 1
    } 
    // if (cacheCourses.length > 29){
    //   cacheCourses = cacheCourses.slice(0, 27)
    //   let curScore = new Object()
    //   curScore.type = "text"
    //   curScore.text = "(ー`´ー)后面的课程看不见啦~"
    //   curScore.css = new Object()
    //   curScore.css.top = (335 + 40 * 13 + 10)+ "rpx"
    //   curScore.css.left = "375rpx"
    //   curScore.css.align = "center"
    //   curScore.css.fontSize = '20rpx'
    //   curScore.css.color = 'gray'
    //   cacheCourses.push(curScore);
    // }
    app.saveCache("cacheCourses", cacheCourses)
  },
  bindPickerChange: function (e) {
    var that = this;
    that.setData({
      cjnowxq: e.detail.value
    });
    that.refreshCJ();
  },
  //成绩刷新
  refreshCJ: function () {
    var that = this;
    wx.showLoading({
      title: '成绩加载中',
    })
    that.requestCJ();

  },
  //成绩请求单独作为一个方法
  requestCJ: function () {
    var that = this;
    wx.request({
      url: app.local_server + 'get_score/',
      method: 'POST',
      data: {
        openid: app.globalData.openId,
        sno: app.cache.sno,
        passwd: app.cache.passwd
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        wx.hideLoading();
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
            content: '获取成绩列表失败,请重新绑定后再试',
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
        else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_class == 0) {
          that.setData({
            have_class: res.data.have_class
          })
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
          that.setData({
            have_class: res.data.have_class,
            mean:res.data.mean
          })
          let Eduarray = [];
          let legalCourseLen = 0;
          for (var i = 0; i < res.data.courses.length; i++) {
            var change = new Object();
            change.name = that.isOver16(res.data.courses[i].name);
            if (res.data.courses[i].score != "未选")
            {
              legalCourseLen += 1
            }
            change.score = res.data.courses[i].score;
            change.type = res.data.courses[i].type;
            change.credit = res.data.courses[i].credit;
            change.teacher = res.data.courses[i].teacher;
            change.selected = res.data.courses[i].selected;
            change.disabled = res.data.courses[i].disabled;
            Eduarray[i] = change;
          }
          that.setData({
            arraycj: Eduarray,
            legalCourseLen: legalCourseLen,
            loadFull:true
          });
          that.cacheScore(res.data.courses, res.data.mean);
        }
        else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_class == 2) {
          that.setData({
            have_class: res.data.have_class
          })
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
          that.setData({
            have_class: res.data.have_class
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
          content: '获取成绩列表失败，可能是您的网络或者服务器出了问题，请稍后重试',
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
      }
    });
    //停止刷新
    wx.stopPullDownRefresh();
    // 隐藏顶部刷新图标
    wx.hideNavigationBarLoading();
  },
  isOver16: function (str) {
    if (str.length > 16) {
      return str.substring(0, 15) + "...";
    }
    else return str;
  },
  
})
