//获取应用实例
var app = getApp();
Page({
  data: {
    indexxq: 0,
    arrayxq: ['崂山校区','鱼山校区'],
    xq: '崂山校区▼',
    fullscreen: false,
    latitude: 36.161300,
    longitude: 120.499592,
    buildlData: [],
    windowHeight: "",
    windowWidth: "",
    isSelectedBuild: -1,
    isSelectedBuildType: 0,
    imgCDN: app.globalData.imgCDN,
    islocation: true
  },
  xqChange: function (e) {
    var that = this;
    that.setData({
      xq: that.data.arrayxq[0] + '▲'
    });
    wx.showActionSheet({
      itemList: that.data.arrayxq,
      success: (e) => {
        that.data.indexxq = e.tapIndex
        if (that.data.indexxq == 0) {
          that.getData();
          that.setData({
            xq: that.data.arrayxq[0] + '▼'
          });
        }
        else {
          wx.showModal({
            title: '暂未开放',
            content: '由于对鱼山校区不熟悉且缺乏图片素材，开发过程可能有点长，希望有鱼山的同学可以提供下帮助，非常感谢。',
            showCancel: false,
            success(res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })
          that.setData({
            //buildlData: laoshan.map,
            xq: that.data.arrayxq[0] + '▼'
          });
          //app.globalData.map = laoshan.map
        }
      },
      fail: (e) => {
        that.setData({
          xq: that.data.arrayxq[0] + '▼'
        })
      }

    })
   
  },
  onLoad: function () {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        //获取当前设备宽度与高度，用于定位控键的位置
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth,
        })
        console.log(res.windowWidth)
      }
    })
    that.getData();
  },
  getData:function(){
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.local_server + "static/data/laoshan.json",
      success: (res) => {
        that.setData({
          buildlData: res.data.map,
          xq: that.data.arrayxq[that.data.indexxq] + '▼'
        })
        console.log(this.data.buildlData)
        app.globalData.map = res.data.map
        wx.hideLoading()
      },
      fail: (res) => {
        wx.hideLoading()
        wx.showModal({
          title: "加载失败",
          content: '获取地图数据失败，可能是服务器出了问题',
          showCancel: false,
          confirmText: "确定",
          success: function (res) {
            if (res.confirm) {
              wx.navigateBack({
              })
            }
          }
        })
      }
    })
  },
  onShow: function () {
  },
  regionchange(e) {
    console.log(e.type);
  },
  markertap(e) {
    // 选中 其对应的框
    this.setData({
      isSelectedBuild: e.markerId
    })
    console.log(e)
  },
  navigateSearch() {
    wx.navigateTo({
      url: 'search'
    })
  },
  openLocation: function (e) {
    wx.openLocation({
      latitude: Number(e.currentTarget.dataset["latitude"]),
      longitude: Number(e.currentTarget.dataset["longitude"]),
      name: "中国海洋大学",
      address: e.currentTarget.dataset["name"]
    })
  },
  location: function () {
    var that = this
    wx.getLocation({
      type: 'wgs84', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标  
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      }
    })
  },
  clickButton: function (e) {
    console.log(this.data.fullscreen)
    //打印所有关于点击对象的信息
    this.setData({
      fullscreen: !this.data.fullscreen
    })
  },
  changePage: function (event) {
    this.setData({
      isSelectedBuildType: event.currentTarget.id,
      isSelectedBuild: -1
    });
  },
  onShareAppMessage: function (res) {
    var title, path;
    title = '欢迎使用中国海洋大学校园导览'
    path = "pages/core/campusTours/campusTours"
    return {
      title: title,
      path: path,
    }
  },
})