var app = getApp()
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: 0,
    number: 0,
    hiddenmodalput: true,
    schoolCourses: [],
    array:[],
    courseInput:"",
    teacherInput:"",
    title: undefined,
    topHeight: 0,
    departmentArray: ['请选择','研究生院','海洋与大气学院', '信息科学与工程学院', '化学化工学院', '海洋地球科学学院',
      '水产学院', '海洋生命学院', '食品科学与工程学院', '医药学院', '工程学院', '环境科学与工程学院', '数学科学学院',
      '管理学院', '经济学院', '外国语学院', '文学与新闻传播学院', '法学院', '材料科学与工程学院', '马克思主义学院',
      '基础教学中心', 'MBA教育中心', 'MPA教育中心', '会计硕士教育中心', '旅游管理硕士教育中心', '国际事务与公共管理学院'
    ],
    departmentIndex:0,
    departmentValue: [-1,'11111111111111111111111111111111', '725A17BC55AA6516E0530B0AA8B65D70', '725A17BC55AB6516E0530B0AA8B65D70', 
    '725A17BC55AC6516E0530B0AA8B65D70', '725A17BC55AD6516E0530B0AA8B65D70', '725A17BC55AF6516E0530B0AA8B65D70', 
    '725A17BC55AE6516E0530B0AA8B65D70', '725A17BC55B06516E0530B0AA8B65D70', '725A17BC55B16516E0530B0AA8B65D70', 
    '725A17BC55B26516E0530B0AA8B65D70', '725A17BC55B36516E0530B0AA8B65D70', '725A17BC55B96516E0530B0AA8B65D70', 
    '725A17BC55B46516E0530B0AA8B65D70', '725A17BC55B56516E0530B0AA8B65D70', '725A17BC55B66516E0530B0AA8B65D70', 
    '725A17BC55B76516E0530B0AA8B65D70', '725A17BC55B86516E0530B0AA8B65D70', '725A17BC55A76516E0530B0AA8B65D70', 
    '725A17BC55A96516E0530B0AA8B65D70', '725A17BC55A86516E0530B0AA8B65D70', '725A17BC55BA6516E0530B0AA8B65D70', 
    '725A17BC55BC6516E0530B0AA8B65D70', '725A17BC55BB6516E0530B0AA8B65D70', '725A17BC55BD6516E0530B0AA8B65D70',
    '78DF02041620098FE0530B0AA8B68F2E']
  },
  bindCourseInput: function (e) {
    this.setData({
      courseInput: e.detail.value
    })
  },
  bindTeacherInput: function (e) {
    this.setData({
      teacherInput: e.detail.value
    })
    //console.log(this.data.teacherInput)
  },
  departmentChange: function (e) {
    //console.log('departmentPicker发送选择改变，携带值为', e.detail.value)
    //console.log(this.data.departmentArray[e.detail.value]);
    //console.log(this.data.departmentValue[e.detail.value]);
    try {
      this.setData({
        departmentIndex: e.detail.value,
        //departmentType: this.data.departmentArray[e.detail.value]
      })
      //console.log(this.data.departmentType);
    }
    catch (e) {
      console(e);
    }
  },
  onChange(e) {
    this.getCourses(e.detail.current)
  },
  onReachBottom: function () {
    page = page + 1
    this.getCourses(page)
  },
  bindSearch:function(){
    page = 1
    this.setData({
      number: 0,
      schoolCourses: []
    })
    this.getCourses(page)
  },
  getCourses: function (e) {
    if (this.data.pages < page &&e!=1) {
      wx.showToast({
        title: '没有更多数据',
        icon: 'none'
      })
      return
    }
    wx.showLoading({
      title: '正在加载',
    })
    let that = this
    let xq;
    let items = app.cache.xq;
    if (items.indexOf("夏秋") != -1){
      xq = 11
    }
    else{
      xq = 12
    }
    //console.log(xq)
    wx.request({
      url: app.local_server + 'get_school_course/',
      method: 'POST',
      data: {
        openid: app.globalData.openId,
        sno: app.cache.sno,
        passwd: app.cache.passwd,
        xn: app.cache.xn,
        xq: xq,
        pageId: e,
        kkyx: that.data.departmentValue[that.data.departmentIndex],
        kcmc:that.data.courseInput,
        jsxm:that.data.teacherInput
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: res => {
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
            content: '获取课程失败,请重新绑定后再试',
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
        else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_course == 0){
          wx.showModal({
            title: '提示',
            content: '没有找到任何课程',
            showCancel: false,
          })
        }
        else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_course == 1){
          var schoolCourses = that.data.schoolCourses
          schoolCourses = schoolCourses.concat(res.data.schoolCourses)
          that.setData({
            schoolCourses: schoolCourses,
            pages: res.data.pages_count,
            number: res.data.number
          })
        }
        else if (res.data.message == "success" && res.statusCode == 200 && res.data.have_course == 2) {
          wx.showModal({
            title: '提示',
            content: '研究生系统【全校开课】目前无法访问',
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
          content: '获取失败，可能是您的网络或者服务器出了问题，请稍后重试',
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
  },
  showdetail: function (e) {
    //console.log(e);
    var that = this;
    var noshow = false;
    var xn = e.currentTarget.dataset.xn;
    var xq = e.currentTarget.dataset.xq;
    var name = e.currentTarget.dataset.name;
    var id = e.currentTarget.dataset.id;
    var department = e.currentTarget.dataset.department;
    var capacity = e.currentTarget.dataset.capacity;
    var language = e.currentTarget.dataset.language;
    var teacher = e.currentTarget.dataset.teacher;
    var campus = e.currentTarget.dataset.campus;
    var info = e.currentTarget.dataset.info;
    if (name == "") noshow = true;
    that.setData({
      hiddenmodalput: noshow,
      xn: xn,
      xq: xq,
      name: name,
      id: id,
      teacher: teacher,
      department:department,
      capacity:capacity,
      language:language,
      campus:campus,
      info:info
    })
  },
  confirm: function () {
    this.setData({
      hiddenmodalput: true
    })
  },
  onShow: function () {
    
  },
  onLoad: function () {
    page = 1
  },
  onShareAppMessage() {
    return {
      title: '全校开课',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/core/schoolCourse/schoolCourse'
    };
  }
})