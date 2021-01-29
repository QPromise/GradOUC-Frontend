// miniprogram/pages/core/scoreRank/scoreRank.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabCur: 0,
    scrollLeft:0 ,
    sno:app.cache.sno,
    name:app.cache.name,
    avg_score: 0,
    not_in_exclude_course_avg_score:0,
    rank:0,
    rank_rate:0,
    same_student:0,
    add_same_rank:0,
    add_same_rank_rate:0,
    all_student:0,
    research_list:[],
    common_courses:[],
    all_research_list:[],
    select_research_list:[],
    top_forty_percent_students:[],
    exclude_courses:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.getMyRank(0)
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
  refreshRank:function(){
    let that = this
    that.getMyRank(1)
  },
  getMyRank:function(type){
    let that = this
    let title = "排名加载中"
    if (type == 1){
      title = "排名刷新中"
    }
    wx.showLoading({
      title: title,
    })
    wx.request({
      url: app.local_server + "get_score_rank",
      data: {
        openid:app.globalData.openId,
        sno:app.cache.sno,
        passwd:app.cache.passwd,
        type:type
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res){
       // success
       //console.log(res)
       if(res.data.message == "success"){
        that.setData({
          sno:app.cache.sno,
          name:app.cache.name,
          avg_score: res.data.avg_score,
          not_in_exclude_course_avg_score: res.data.not_in_exclude_course_avg_score,
          rank:res.data.rank,
          rank_rate: (parseFloat(res.data.rank_rate) * 100).toFixed(2) ,
          same_student: res.data.same_student,
          add_same_rank: res.data.add_same_rank,
          add_same_rank_rate: (parseFloat(res.data.add_same_rank_rate) * 100).toFixed(2) ,
          all_student: res.data.all_student,
          research_list: res.data.research_list,
          exclude_courses: res.data.exclude_courses,
          top_forty_percent_students: res.data.top_forty_percent_students,
        })
        wx.hideLoading({
          complete: (res) => {},
        })
        wx.showToast({
          icon: 'none',
          title: '加载成功',
          duration: 2000
        });
       }
       else if (res.data.message == "incorrect") {
        wx.hideLoading({
          complete: (res) => {},
        })
        wx.showModal({
          title: "加载失败",
          content: '获取平均学分绩失败,请重新绑定后再试',
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
       else if (res.data.message == "illegal"){
        wx.hideLoading({
          complete: (res) => {},
        })
        wx.showModal({
          title: '提示',
          content: '当前所在年级不能查看排名',
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
        wx.hideLoading({
          complete: (res) => {},
        })
        wx.showModal({
          title: '提示',
          content: '可能是您的网络或者服务器出了问题，请稍后重试',
          showCancel: false,
          success(res) {
            if (res.confirm) {

            }
          }
        })
       }
      },
      fail: function() {
        wx.hideLoading({
          complete: (res) => {},
        })
        wx.showModal({
          title: '提示',
          content: '可能是您的网络或者服务器出了问题，请稍后重试',
          showCancel: false,
          success(res) {
            if (res.confirm) {

            }
          }
        })
      },
      complete: function() {
        
       // complete
      }
     })
  },
  getAllDepartmentResearch: function(e){
    let that = this
    wx.showLoading({
      title: "研究方向拉取中",
    })
    wx.request({
      url: app.local_server + "get_department_all_research",
      data: {
        openid:app.globalData.openId,
        sno:app.cache.sno,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res){
       // success
       if(res.data.message == "success"){
        that.setData({
          all_research_list: res.data.all_research_list
        })
        that.setData({
          modalName: e.currentTarget.dataset.target
        })
       }
       else if (res.data.message == "illegal"){
        wx.showModal({
          title: '提示',
          content: '当前所在年级不能查看排名',
          showCancel: false,
          success(res) {
            if (res.confirm) {
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
            }
          }
        })
       }
      },
      fail: function() {
        wx.showModal({
          title: '提示',
          content: '可能是您的网络或者服务器出了问题，请稍后重试',
          showCancel: false,
          success(res) {
            if (res.confirm) {
            }
          }
        })
      },
      complete: function() {
        wx.hideLoading({
          complete: (res) => {},
        })
       // complete
      }
     })
  },
  setResearchListChange(e) {
      //取下标值
      var index = parseInt(e.currentTarget.dataset.index);
      //原始的icon状态
      var checked = this.data.all_research_list[index].checked;
      //console.log(selected)
      var all_research_list= this.data.all_research_list;
      // 对勾选状态取反
      all_research_list[index].checked = !checked;
      // 写回经点击修改后的数组
      this.setData({
        all_research_list: all_research_list
      });
  },
  setSelectResearch:function(){
    let that = this
    let all_research_list = that.data.all_research_list
    let select_research_list = []
    for(let i = 0; i < all_research_list.length; i++){
      if(all_research_list[i].checked){
        select_research_list.push(all_research_list[i].value)
      }
    }
    wx.showLoading({
      title: '正在设置',
    })
    wx.request({
      url: app.local_server + 'set_join_rank_research/',
      method: 'POST',
      data: {
        openid: app.globalData.openId,
        research_list: select_research_list,
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: function (res) {
        if (res.data.message == "success"){
          that.setData({
            research_list:select_research_list,
            modalName: null
          })
          that.getMyRank(0)
        }
        else{
          wx.showModal({
            title: '提示',
            content: '可能是您的网络或者服务器出了问题，请稍后重试',
            showCancel: false,
            success(res) {
            }
          })
        }
      },
      fail: function (res) {
        wx.showModal({
          title: '提示',
          content: '可能是您的网络或者服务器出了问题，请稍后重试',
          showCancel: false,
          success(res) {
          }
        })
      },
      complete: function (res) {
      }
    }); 
     
  },
  getCommonCourses: function(e){
    let that = this
    wx.showLoading({
      title: "科目拉取中",
    })
    wx.request({
      url: app.local_server + "get_common_courses",
      data: {
        openid:app.globalData.openId,
        sno:app.cache.sno,
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      success: function(res){
       // success
       if(res.data.message == "success"){
        that.setData({
          common_courses: res.data.common_courses
        })
        that.setData({
          modalName: e.currentTarget.dataset.target
        })
       }
       else if (res.data.message == "illegal"){
        wx.showModal({
          title: '提示',
          content: '当前所在年级不能查看排名',
          showCancel: false,
          success(res) {
            if (res.confirm) {
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
            }
          }
        })
       }
      },
      fail: function() {
        wx.showModal({
          title: '提示',
          content: '可能是您的网络或者服务器出了问题，请稍后重试',
          showCancel: false,
          success(res) {
            if (res.confirm) {
            }
          }
        })
      },
      complete: function() {
        wx.hideLoading({
          complete: (res) => {},
        })
       // complete
      }
     })
  },
  setExcludeCoursesChange(e) {
    //取下标值
    var index = parseInt(e.currentTarget.dataset.index);
    //原始的icon状态
    var checked = this.data.common_courses[index].checked;
    //console.log(selected)
    var common_courses= this.data.common_courses;
    // 对勾选状态取反
    common_courses[index].checked = !checked;
    // 写回经点击修改后的数组
    this.setData({
      common_courses: common_courses
    });
},
  setExcludeCourses:function(){
  let that = this
  let common_courses = that.data.common_courses
  let select_common_courses = []
  for(let i = 0; i < common_courses.length; i++){
    if(common_courses[i].checked){
      select_common_courses.push(common_courses[i].value)
    }
  }
  wx.showLoading({
    title: '正在设置',
  })
  wx.request({
    url: app.local_server + 'set_exclude_courses/',
    method: 'POST',
    data: {
      openid: app.globalData.openId,
      select_common_courses: select_common_courses,
    },
    header: { "Content-Type": "application/x-www-form-urlencoded" },
    success: function (res) {
      if (res.data.message == "success"){
        that.setData({
          exclude_courses:select_common_courses,
          modalName: null
        })
        that.getMyRank(0)
      }
      else{
        wx.showModal({
          title: '提示',
          content: '可能是您的网络或者服务器出了问题，请稍后重试',
          showCancel: false,
          success(res) {
          }
        })
      }
    },
    fail: function (res) {
      wx.showModal({
        title: '提示',
        content: '可能是您的网络或者服务器出了问题，请稍后重试',
        showCancel: false,
        success(res) {
        }
      })
    },
    complete: function (res) {
    }
  }); 
   
},
  tabSelect(e) {
    this.setData({
      tabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id-1)*60
    })
  },

  hideModal(e) {
    this.setData({
      modalName: null
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
    return {
      title: '成绩排名',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/core/scoreRank/scoreRank'
    };
  }
})