
//获取应用实例
const app = getApp();
let rewardedVideoAd = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
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
    //显示等待提示
    // wx.showToast({
    //   title: '成绩加载中',
    //   icon: 'loading',
    //   duration: 15000
    // });
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
          var Eduarray = [];
          for (var i = 0; i < res.data.courses.length; i++) {
            var change = new Object();
            change.name = that.isOver16(res.data.courses[i].name);
            change.score = res.data.courses[i].score;
            change.type = res.data.courses[i].type;
            change.credit = res.data.courses[i].credit;
            change.teacher = res.data.courses[i].teacher;
            change.selected = res.data.courses[i].selected;
            change.disabled = res.data.courses[i].disabled;
            Eduarray[i] = change;
          }
          that.setData({
            arraycj: Eduarray
          });
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
          app.showErrorModal('服务器出现了问题', '提示');
        }
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: "加载失败",
          content: '获取成绩列表失败，可能是服务器出了问题',
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
