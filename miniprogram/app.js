//app.js
App({
  offline: false,
  network:"有网络",
  onLaunch: function () {
    this.setNavigation()
    this.checkNetwork()
    this.checkUpdate()
    this.refreshCacheAndGetOpenid()
    // // 5.获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo
    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }

    //   }
    // })
  },
  setNavigation:function(){
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
  },
  checkUpdate:function(){
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
    
  },
  checkNetwork:function(){
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
  },
  refreshCacheAndGetOpenid:function(){
    wx.showLoading({
      title: '基础数据载入中',
    })
     //获取数据加载到缓存
     let that = this;
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
         },
         fail:function(){
         },
         complete:function(){       
         }
       })
       var data = wx.getStorageInfoSync();
       if (data && data.keys.length) {
         data.keys.forEach(key=> {
           var value = wx.getStorageSync(key);
           if (value) {
             that.cache[key] = value;
           }
         });
       }
     } catch (e) {
       console.warn('获取缓存失败');
     }
      if (!wx.cloud) {
        console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      } else {
        wx.cloud.init({
          env: "nostalgic-meakb",
          traceUser: true,
        })
      }
      wx.cloud.callFunction({
        name: 'WeOceanLogin',
        complete: res => {
          try{
          console.log(res.result.openid);
          that.globalData.openId = res.result.openid;
          wx.hideLoading({
            complete: (res) => {},
          })
          that.msg("载入完成")
          if (this.openIdReadyCallback) {
            this.openIdReadyCallback(res)
          } 
        }
        catch (e) {
          wx.hideLoading({
            complete: (res) => {},
          })
          that.msg("载入失败，请重启应用")
          console.warn('获取openid失败');
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
  //toast
  msg:function(text,type){
    var type = typeof type === "undefined" ? '' : type
    var icon = 'none'
    if(type != ''){
      icon = type
    }
    wx.showToast({
      title: text,
      icon: icon,
      duration:2000
    })
  },
  refreshLimit:function(updateTimeKey){
    let that = this
    var time = (new Date()).getTime();
    if (wx.getStorageSync(updateTimeKey) != "") {
      var update_time = wx.getStorageSync(updateTimeKey);
      var gap = time - update_time;
      var season = that.globalData.refreshTimeLimit * 1 - Math.floor(gap / 1000);
    } else {
      var season = 0;
    }
    if (season > 0) {
      let minute = Math.floor(season / 60)
      if(minute > 0 ){
        wx.showToast({
          title: '操作太快啦,'+ minute + '分钟后再来吧',
          icon: 'none',
          duration: 1000,
          success: function () {
          }
        })
        return false
      }
      wx.showToast({
        title: '操作太快啦,' + season + '秒后再来吧',
        icon: 'none',
        duration: 1000,
        success: function () {
        }
      })
      return false
    }
    return true
  },
  formatNumber:function(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  },
  formatTime: function (date) {
    let that = this
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()
    return [year, month, day].map(that.formatNumber).join('-') + ' ' + [hour, minute, second].map(that.formatNumber).join(':')
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
  // https://gradouc-backend.leoqin.fun/
  server: 'https://leoqin.fun/', // http://127.0.0.1:8000/do_login
  local_server: 'https://gradouc-backend.leoqin.fun/',
  cache: {},
  globalData: {
    imgCDN: 'https://leoqin.fun/static/images/',
    map:[],
    openId: null,
    userInfo: null,
    refreshTimeLimit:30,
  }
})