var app = getApp()
var page = 1
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages: 0,
    hiddenmodalput: true,
    schoolCourses: [],
    array:[],
    courseInput:"",
    teacherInput:"",
    title: undefined,
    topHeight: 0,
    departmentArray: ['研究生院','海洋与大气学院', '信息科学与工程学院', '化学化工学院', '海洋地球科学学院',
      '水产学院', '海洋生命学院', '食品科学与工程学院', '医药学院', '工程学院', '环境科学与工程学院', '数学科学学院',
      '管理学院', '经济学院', '外国语学院', '文学与新闻传播学院', '法学院', '材料科学与工程学院', '马克思主义学院',
      '基础教学中心', 'MBA教育中心', 'MPA教育中心', '会计硕士教育中心', '旅游管理硕士教育中心', '国际事务与公共管理学院'
    ],
    departmentIndex:0,
    departmentValue: ['7FB22BE93D27C3CC2705BC17B2B01566', '725A17BC55AA6516E0530B0AA8B65D70', '725A17BC55AB6516E0530B0AA8B65D70', '725A17BC55AC6516E0530B0AA8B65D70', '725A17BC55AD6516E0530B0AA8B65D70', '725A17BC55AF6516E0530B0AA8B65D70', '725A17BC55AE6516E0530B0AA8B65D70', '725A17BC55B06516E0530B0AA8B65D70', '725A17BC55B16516E0530B0AA8B65D70', '725A17BC55B26516E0530B0AA8B65D70', '725A17BC55B36516E0530B0AA8B65D70', '725A17BC55B96516E0530B0AA8B65D70', '725A17BC55B46516E0530B0AA8B65D70', '725A17BC55B56516E0530B0AA8B65D70', '725A17BC55B66516E0530B0AA8B65D70', '725A17BC55B76516E0530B0AA8B65D70', '725A17BC55B86516E0530B0AA8B65D70', '725A17BC55A76516E0530B0AA8B65D70', '725A17BC55A96516E0530B0AA8B65D70', '725A17BC55A86516E0530B0AA8B65D70', '725A17BC55BA6516E0530B0AA8B65D70', '725A17BC55BC6516E0530B0AA8B65D70', '725A17BC55BB6516E0530B0AA8B65D70', '725A17BC55BD6516E0530B0AA8B65D70','78DF02041620098FE0530B0AA8B68F2E']
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
    console.log(this.data.teacherInput)
  },
  departmentChange: function (e) {
    console.log('departmentPicker发送选择改变，携带值为', e.detail.value)
    console.log(this.data.departmentArray[e.detail.value]);
    console.log(this.data.departmentValue[e.detail.value]);
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
    var that = this
    wx.request({
      url: app.local_server + 'get_schoolCourse/',
      method: 'POST',
      data: {
        pageId: e,
        kkyx: that.data.departmentValue[that.data.departmentIndex],
        kcmc:that.data.courseInput,
        jsxm:that.data.teacherInput
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: res => {
        wx.hideLoading();
        if (res.data.message == "success" && res.statusCode == 200 && res.data.have_course == 1){
          var schoolCourses = that.data.schoolCourses
          //拼接课程
          schoolCourses = schoolCourses.concat(res.data.schoolCourses)
          console.log(schoolCourses)
          that.setData({
            schoolCourses: schoolCourses,
            pages: res.data.pages_count
          })
  
        }

      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: "加载失败",
          content: '获取失败，可能是服务器出了问题',
          showCancel: false,
          confirmText: "确定",
          success: function (res) {
            if (res.confirm) {
            }
          }
        });

      },
      complete: function (res) {

      }
    });
  },
  onShow: function () {
    page = 1
  },
  onLoad: function () {
    
  },
  onShareAppMessage() {
    
  }
})