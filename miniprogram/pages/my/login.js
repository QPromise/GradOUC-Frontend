//login.js
//获取应用实例
var app = getApp();
Page({
  data: {
    remind: '加载中',
    help_status: false,
    sno_focus: false,
    passwd_focus: false,
    is_hide_passwd: true,
    sno: '',
    passwd: '',
    angle: 0
  },
  onReady: function () {
    var that = this;
    setTimeout(function () {
      that.setData({
        remind: ''
      });
    }, 1000);
  },
  setwebsite: function () {
    wx.setClipboardData({
      data: 'http://id.ouc.edu.cn:8071/findPassword/index.action',
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '网址复制成功！',
              duration: 1000
            });
          }
        })
      }
    })
  },
  bind: function () {
    var that = this;
    if (app.g_status) {
      app.showErrorModal(app.g_status, '绑定失败');
      return false;
    }
    if (!that.data.sno || !that.data.passwd) {
      wx.showToast({
        icon:'none',
        title: '账号或密码不能为空',
        duration: 1000
      });
      //app.showErrorModal('账号或密码不能为空', '提醒');
      return false;
    }
    if (that.data.sno.length<=6 || that.data.passwd.length<6){
      wx.showToast({
        icon: 'none',
        title: '账号或密码格式不正确',
        duration: 1000
      });
      //app.showErrorModal('账号或密码格式不正确','提醒');
      return false;
    }
    wx.showLoading({
      title: '绑定中',
    })
    wx.request({
      method: 'POST',
      url: app.local_server + "do_login/",
      data: {
        openid: app.globalData.openId,
        sno: that.data.sno,
        passwd: that.data.passwd
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success:(res)=>{
        wx.hideLoading();
        console.log(res);
        var data = res.data;
        if (data.message == "timeout"){
          wx.showModal({
            title: '请求超时',
            content: '可能是研究生系统问题，请稍后重试',
            showCancel: false,
            success(res) {
              if (res.confirm) {
              
              }
            }
          })
        }
        else if (data.message == 'fault' && res.statusCode == 200){

          wx.showToast({
            icon: 'none',
            title: '账号或密码不正确',
            duration: 1500
          });
          //app.showErrorModal('账号或者密码不正确','提醒')
        }
        
        else if (data.message == 'success' && res.statusCode == 200){
          //console.log(app.removeAllCache);
          app.saveCache("sno",data.sno);
          app.saveCache("passwd", data.passwd);
          app.saveCache("name", data.name);
          app.saveCache("is_bind", true);

          wx.showToast({
            title: '绑定成功',
            icon: 'loading',
            duration: 1500,
            success: function () {
              wx.reLaunch({
                url: '/pages/my/my',
              })
            }
          })
        }
        else if (data.message == "fault" && res.statusCode != 200){
          wx.showToast({
            icon: 'none',
            title: '研究生系统当前无法访问',
            duration: 2000
          });
        }
        else{
          app.showErrorModal('可能是您的网络或者服务器出了问题，请稍后重试', '绑定失败');
        }
      },
      fail:(res)=>{
        wx.hideLoading();
        app.showErrorModal('可能是您的网络或者服务器出了问题，请稍后重试', '绑定失败');
      }

    });
  },
  snoInput: function (e) {
    this.setData({
      sno: e.detail.value
    });
    if (e.detail.value.length >= 12) {
      wx.hideKeyboard();
    }
  },
  passwdInput: function (e) {
    this.setData({
      passwd: e.detail.value
    });
  },
  inputFocus: function (e) {
    if (e.target.id == 'sno') {
      this.setData({
        'sno_focus': true
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': true
      });
    }
  },
  inputBlur: function (e) {
    if (e.target.id == 'sno') {
      this.setData({
        'sno_focus': false
      });
    } else if (e.target.id == 'passwd') {
      this.setData({
        'passwd_focus': false
      });
    }
  },
  tapHelp: function (e) {
    if (e.target.id == 'help') {
      this.hideHelp();
    }
  },
  showPasswd: function(e){
    var that = this;
    if(that.data.is_hide_passwd){
      this.setData({
        'is_hide_passwd': false
      });
    }
    else{
      this.setData({
        'is_hide_passwd': true
      });
    }
  },
  showHelp: function (e) {
    this.setData({
      'help_status': true
    });
  },
  hideHelp: function (e) {
    this.setData({
      'help_status': false
    });
  }
});