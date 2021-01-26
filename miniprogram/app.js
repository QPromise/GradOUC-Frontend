//app.js
App({
  offline: false,
  network:"有网络",
  onLaunch: function () {
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
    let capsule = wx.getMenuButtonBoundingClientRect();
		if (capsule) {
		 	this.globalData.Custom = capsule;
			this.globalData.CustomBar = capsule.bottom + capsule.top - e.statusBarHeight;
		} else {
			this.globalData.CustomBar = e.statusBarHeight + 50;
		}
      }
    })
    //1.获取缓存
    var that = this;
    try {
      //var end_day = wx.getStorageSync("end_day");//从本地获取学期结束日期
      //if (this.cmpDate(end_day) || !end_day) { // 当前缓存学期时间失效，重新获取。
      //重新设置缓存，包括本学期开始时间，结束时间，学年，学期
      wx.request({
        url: that.local_server + 'get_config/',
        success: function (res) {
          that.saveCache("begin_day", res.data.begin_day)
          that.saveCache("end_day", res.data.end_day)
          that.saveCache("xn", res.data.xn)
          that.saveCache("xq", res.data.xq)
          that.saveCache("is_open_subscribe", res.data.is_open_subscribe)
          that.saveCache("get_score_rank_nj_min", res.data.get_score_rank_nj_min)
          that.saveCache("get_score_rank_nj_max", res.data.get_score_rank_nj_max)
          that.getWeek(res.data.begin_day)
          console.log(that.cache);
        },
      })
      var data = wx.getStorageInfoSync();
      if (data && data.keys.length) {
        data.keys.forEach(key=> {
          var value = wx.getStorageSync(key);
          if (value) {
            that.cache[key] = value;
          }
        });
        // if (that.cache.version !== that.version) {
        //   that.cache = {};
        //   wx.clearStorage();
        // } else {
        //   that._user.wx = that.cache.userinfo.userInfo || {};
        //   that.processData(that.cache.userdata);
        // }
      }
    } catch (e) {
      console.warn('获取缓存失败');
    }
    //2.检查网络
    wx.getNetworkType({ //判断是否有网络
      success: res=> {
        if (res.networkType == "none") { //无网络
          this.offline = true;
          this.network = "没有网络，请检查您的网络是否良好";
          this.showErrorModal(this.network, "提醒");
        } else { // 有网络则请求服务器
          this.offline = false;
          console.log(this.network);
        }
      },

    });
    //3.检查更新
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
      //console.log(res.hasUpdate);
      if (res.hasUpdate){
        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本来袭，请重启应用更新！',
            showCancel: false,
            success: res=> {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate();
              }
            }
          })
        })
        updateManager.onUpdateFailed(function () {
        console.log("新版本下载失败！");
          // 新版本下载失败
        })
      }
      else{
        console.log("当前版本已是最新版本！");
      }
    })
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        env: "nostalgic-meakb",
        traceUser: true,
      })
    }
    // 4.获取用户openid
    wx.cloud.callFunction({
      name: 'WeOceanLogin',
      complete: res => {
        console.log(res.result.openid);
        that.globalData.openId = res.result.openid;
        if (this.openIdReadyCallback) {
          this.openIdReadyCallback(res)
        }
      }
    })

    // 5.获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
          
          // wx.switchTab({
          //   url: '/pages/home/home'
          // });
        }

      }
    })
  },
  getWeek:function(begin_day){
    var that = this;
    //当前周次设置
    var nowtime = new Date();  //当前时间 用于平时
    var nowtimestamp = Date.parse(nowtime);  //当前时间的时间戳（毫秒）最后三位000
    var day = ((nowtimestamp / 1000 - begin_day) / 86400); //与开学时间的时间差（天）
    var nowzc = Math.ceil(day / 7); //向上取整
    //if (nowzc > 21) nowzc = 21;
    that.saveCache("nowzc",nowzc);
  },
  cmpDate: function (date) { // 现在是否大于指定的时间。
    var now = new Date()
    var date = new Date(date)
    return now > date
  },
  saveCache: function (key, value) {
    if (!key || value == undefined || value == null) { return; }
    var that = this;
    that.cache[key] = value;
    wx.setStorageSync(key,value);
  },
  removeAllCache:function(){
    var that = this;
    that.cache = {};
    wx.clearStorageSync();
  },
  removeCache: function (key) {
    if (!key) { return; }
    var that = this;
    that.cache[key] = '';
    wx.removeStorageSync(key);
  },
  showErrorModal: function (content, title) {
    wx.showModal({
      title: title || '加载失败',
      content: content || '未知错误',
      showCancel: false
    });
  },
  showFailBackModel: function(){
    wx.showModal({
      title: '加载失败',
      content: '可能是您的网络或者服务器出了问题，请稍后重试',
      showCancel: false,
      success(res) {
        if (res.confirm) {
          wx.navigateBack({

          })
        }
      }
    })
  },
  showLoadToast: function (title, duration) {
    wx.showToast({
      title: title || '加载中',
      icon: 'loading',
      mask: true,
      duration: duration || 10000
    });
  }, 

  server: 'https://leoqin.fun/',
  // http://127.0.0.1:8000/do_login
  //'https://leoqin.fun/static/images/'
  local_server: 'https://leoqin.fun/',
  cache: {},
  globalData: {
    imgCDN: 'https://leoqin.fun/static/images/',
    map:[],
    openId: null,
    userInfo: null,
  }
})