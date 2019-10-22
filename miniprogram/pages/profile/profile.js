var app = getApp()
Page({
  data: {
    typeArray: ['考生', '研究生', '本科生'],
    typeDict: [
      {
        id: 0,
        name: '考生'
      },
      {
        id: 1,
        name: '研究生'
      },
      {
        id: 2,
        name: '本科生'
      }
    ],
    typeIndex: 0,

    departmentArray: ['海洋与大气学院', '信息科学与工程学院', '化学化工学院', '海洋地球科学学院',
      '水产学院', '海洋生命学院', '食品科学与工程学院', '医药学院', '工程学院', '环境科学与工程学院', '数学科学学院',
      '管理学院', '经济学院', '外国语学院', '文学与新闻传播学院', '法学院', '材料科学与工程学院', '马克思主义学院',
      '基础教学中心','MBA教育中心','MPA教育中心', '会计硕士教育中心','旅游管理硕士教育中心', '国际事务与公共管理学院'
      ],
    departmentDict: [
      {
        id: 0,
        name: '海洋与大气学院'
      },
      {
        id: 1,
        name: '信息科学与工程学院'
      },
      {
        id: 2,
        name: '化学化工学院'
      },
      {
        id: 3,
        name: '海洋地球科学学院'
      },
      {
        id: 4,
        name: '水产学院'
      },
      {
        id: 5,
        name: '海洋生命学院'
      },
      {
        id: 6,
        name: '食品科学与工程学院'
      },
      {
        id: 7,
        name: '医药学院'
      },
      {
        id: 8,
        name: '工程学院'
      },
      {
        id: 9,
        name: '环境科学与工程学院'
      },
      {
        id: 10,
        name: '数学科学学院'
      },
      {
        id: 11,
        name: '管理学院'
      },
      {
        id: 12,
        name: '经济学院'
      },
      {
        id: 13,
        name: '外国语学院'
      },
      {
        id: 14,
        name: '文学与新闻传播学院'
      },
      {
        id: 15,
        name: '法学院'
      },
      {
        id: 16,
        name: '材料科学与工程学院'
      },
      {
        id: 17,
        name: '马克思主义学院'
      },
      {
        id: 18,
        name: '基础教学中心'
      },
      {
        id: 19,
        name: 'MBA教育中心'
      },
      {
        id: 20,
        name: 'MPA教育中心'
      },
      {
        id: 21,
        name: '会计硕士教育中心'
      },
      {
        id: 22,
        name: '旅游管理硕士教育中心'
      },
      {
        id: 23,
        name: '国际事务与公共管理学院'
      },

    ],
    departmentIndex: 0,

    studentType:'',
    departmentType:'',
    angle: 0,
    isLoading: true,
    openId:null,
  },
  onLoad: function () {
    if (app.globalData.openId) {
      //全局应用已有openId
      this.setData({
        openId: app.globalData.openId
      });
    } else {
      // 由于 login云函数 是网络请求，可能会在 Page.onLoad 之后才返回 
      // 所以此处加入 callback 以防止这种情况 
      app.openIdReadyCallback = res => {
        //开启未读消息自动刷新
        showMessage(res.result.openid);
        this.setData({
          openId: res.result.openid
        });
      }
    }
    this.setData({
      userInfo: app.globalData.userInfo
    })
  },
  bindStudentChange: function (e) {
    console.log('studentPicker发送选择改变，携带值为', e.detail.value)
    
    try{
      this.setData({
      typeIndex: e.detail.value,
      studentType: this.data.typeArray[e.detail.value]
    })
    }catch(e){
      console(e);
    }
  },
  bindDepartmentChange: function (e) {
    console.log('departmentPicker发送选择改变，携带值为', e.detail.value)
    console.log(this.data.departmentArray[e.detail.value]);
    try{
    this.setData({
      departmentIndex: e.detail.value,
      departmentType: this.data.departmentArray[e.detail.value]
    })
      console.log(this.data.departmentType);
    }
    catch(e){
      console(e);
    }
  },
  formSubmit: function (e) {
    let that = this;
    if (e.detail.value.nickname.length == 0 ) {
      wx.showToast({
        title: '昵称不能为空!',
        icon:'none',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1500)
    } else if(e.detail.value.nickname.length >= 10) 
    {
      wx.showToast({
        title: '昵称太长!',
        icon:'none',
        duration: 1500
      })
      setTimeout(function () {
        wx.hideToast()
      }, 1500)
    }
    else {
      
      wx.showLoading({
        title: '正在保存',
        mask: true
      });
      wx.cloud.callFunction({
        // 云函数名称
        name: 'updateProfile',
        // 传给云函数的参数
        data: {
          _openid: that.data.openId,
          nickName: e.detail.value.nickname,
          studentType:that.data.studentType,
          departmentType:that.data.departmentType,
          canPublish:1
        },
        success: function (res) {
          console.log("个人信息更新成功！");
          console.log(res);
          wx.hideLoading();
          wx.showToast({
            title: '保存成功!',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 1500)
        },
        fail: function(res){
          wx.hideLoading();
          wx.showToast({
            title: '保存成功!',
            icon: 'success',
            duration: 2000
          })
          setTimeout(function () {
            wx.hideToast()
          }, 1500)
        }
      });

      //修改信息后更改所有已发内容的departmentType
      wx.cloud.callFunction({
        // 云函数名称
        name: 'utterDocOperate',
        // 传给云函数的参数
        data: {
          operate: "updateDepartment",
          _openid: that.data.openId,
          departmentType: that.data.departmentType
        },
        success: function (res) {
          console.log("所有发布内容的院系更新成功！");
          console.log(res);
        },
        fail: function (res) {
        }
      });
     
      // wx.switchTab({
      //   url: '../message/message'
      // })
    }
    },

  onReady: function () {
    let that = this;
    wx.onAccelerometerChange(function (res) {
      var angle = -(res.x * 30).toFixed(1);
      if (angle > 14) {
        angle = 14;
      } else if (angle < -14) {
        angle = -14;
      }
      if (that.data.angle !== angle) {
        that.setData({
          angle: angle
        });
      }
    });
  },



})