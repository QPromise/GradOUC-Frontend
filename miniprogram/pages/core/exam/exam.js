// miniprogram/pages/core/exam/exam.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput: true,
    content: "",
    snoName:"",
    name:"我的公共课考试安排",
    loading:false,
    exams:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let that = this
    // console.log(wx.getStorageSync(app.cache.sno + 'exams'))
    // console.log(wx.getStorageSync(app.cache.sno + 'exam') == "")
    if (wx.getStorageSync(app.cache.sno + 'exams')){
      let tmp_exams = wx.getStorageSync(app.cache.sno + 'exams')
          for(let i = 0; i < tmp_exams.length; i++){
            let cur_date = that.dateTransfer(tmp_exams[i].time)
            tmp_exams[i]["over"] = that.cmpDate(cur_date)
          }
          that.setData({
            exams:tmp_exams,
          }) 
    }
    else{
      that.getExam(app.cache.sno);
    }

  },
  snoNameInput: function (e) {
    this.setData({
      snoName: e.detail.value
    })
  },
  getOtherExam: function(){
    let that = this
    if (that.data.snoName != ""){
      that.getExam(that.data.snoName)
    }
  },
  // 现在是否大于指定的时间
  cmpDate: function (date) { 
    var now = parseInt(Date.parse(new Date()) / 1000)
    var date = parseInt(Date.parse(date) / 1000)
    return now > date
  },
  dateTransfer:function(str){
    let year = str.split("年")[0]
    str = str.split("年")[1]
    let month = str.split("月")[0]
    if(month < 10){
    month = "0" + month
    }
    str = str.split("月")[1]
    let day = str.split("日")[0]
    if(day < 10){
    day = "0" + day
    }
    str = str.split("日")[1]
    let time = str.split("-")[1]
    let date = year + "-" + month + "-" + day + " " + time + ":00"
    return date
},
  getExam:function(sno){
    let that = this
    that.setData({
      loading:true
    })
    wx.showLoading({
      title: '考试加载中',
    })
    wx.request({
      url: app.local_server + 'get_exam/',
      method: 'POST',
      data: {
        sno:sno,
        my_openid: app.globalData.openId,
        my_sno: app.cache.sno,
        my_passwd: app.cache.passwd
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: (res)=> {
        let that = this
        if (res.data.message == "fault") {
          wx.showModal({
            title: "加载失败",
            content: '获取考试信息失败',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                wx.navigateBack({})
              }
            }
          });
        }
        else if(res.data.message == "success" && res.statusCode == 200) {
          let tmp_exams = res.data.exams
          for(let i = 0; i < tmp_exams.length; i++){
            let cur_date = that.dateTransfer(tmp_exams[i].time)
            tmp_exams[i]["over"] = that.cmpDate(cur_date)
          }
          that.setData({
            exams:tmp_exams,
          }) 
          if(sno == app.cache.sno){
            that.setData({
              name:"我的公共课考试安排"
            })
            app.saveCache(app.cache.sno + "exams", tmp_exams)
          }
          else{
            that.setData({
              name: sno + "的公共课考试安排"
            })
          } 
        }
        else if(res.data.message == "empty" && res.statusCode == 200) {
          let tmp_exams = res.data.exams
    
          that.setData({
            exams:tmp_exams,
          }) 
          if(sno == app.cache.sno){
            app.saveCache(app.cache.sno + "exams", tmp_exams)
          }
        }
        else{
          wx.showModal({
            title: "加载失败",
            content: '获取考试信息失败',
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
          content: '获取考试信息失败，可能是您的网络或者服务器出了问题，请稍后重试',
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
        that.setData({
          loading:false
        })
        that.hideModal()
      }
    });
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  showdetail: function (e) {
    //console.log(e);
    var that = this;
    var noshow = false;
    var sno = e.currentTarget.dataset.sno;
    var department = e.currentTarget.dataset.department;
    var profession = e.currentTarget.dataset.profession;
    var course_num = e.currentTarget.dataset.course_num;
    var course_name = e.currentTarget.dataset.course_name;
    var area = e.currentTarget.dataset.area;
    var room_num = e.currentTarget.dataset.room_num;
    var seat_num = e.currentTarget.dataset.seat_num;
    var build = e.currentTarget.dataset.build;
    var room = e.currentTarget.dataset.room;
    var time = e.currentTarget.dataset.time;

    if (course_name == "") noshow = true;
    that.setData({
      hiddenmodalput: noshow,
      sno:sno,
      department:department,
      profession:profession,
      course_num: course_num,
      course_name: course_name,
      area: area,
      room_num: room_num,
      seat_num: seat_num,
      build: build,
      room: room,
      time: time,
    })
  },
  confirm: function () {
    this.setData({
      hiddenmodalput: true
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
    let that = this
    wx.showNavigationBarLoading() 
    that.getExam(app.cache.sno)
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
  onShareAppMessage() {
    return {
      title: '我的考试',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/core/exam/exam'
    };
  }
})