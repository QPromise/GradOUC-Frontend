//获取应用实例
const app = getApp();
//console.log('now_day',parseInt(new Date().getDay()));
Page({
  data: {
    indexxq: 0,
    arrayxq: ['2019-2020夏秋'],
    indexzc: 0,
    arrayzc: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    kcb:null,
    hiddenmodalput: true, //课程详细
    name: "",
    leader: "",
    room: "",
    time: "",
    today:undefined,
    arrayth: [
      { week: "周一", date: "" },
      { week: "周二", date: "" },
      { week: "周三", date: "" },
      { week: "周四", date: "" },
      { week: "周五", date: "" },
      { week: "周六", date: "" },
      { week: "周日", date: "" }],
    arraykcb: [],
    trans:0.75
  },
 //获取当前日期
  getDay:function(){
    var today = parseInt(new Date().getDay());
    if (today == 0) {
     this.setData({
       today:6
     })
    } else{
     this.setData({
       today:today - 1 
     })
    }
  },
  //改变了周次
  zcChange: function (e) {
    var that = this;
    that.setData({
      indexzc: e.detail.value,
    });
    that.reFreshKCB();
  },
  // 现在是否大于指定的时间
  cmpDate: function () { 
    var now = parseInt(Date.parse(new Date()) / 1000)
    var date = parseInt(app.cache.begin_day)
    return now > date
  },
  
  //加载页面
  onLoad: function () {
    var that = this;
    //获取开学和放假日期，计算当前周
    if(app.cache.nowzc > 22){
      that.setData({
        arrayxq: [app.cache.xq],
        indexzc: 21,
      });
      wx.showModal({
        title: '提示',
        content: '本学期课程已结束，课表不再更新',
        showCancel: false,
        success(res) {
          if (res.confirm) {
          } 
        }
      })

    }
    else{
      that.setData({
        arrayxq: [app.cache.xq],
        indexzc: app.cache.nowzc - 1,
      });

    }
    //计算当前选择周1至周5日期
    that.caculateDate();
  },

  onReady: function () {
    var that = this;
    that.getDay();
    setTimeout(function () {
      //console.log("延迟1s调用============");
      var weeks = that.data.arrayzc[that.data.indexzc];
      //console.log("onReady weeks:" + weeks);
      if (!that.cmpDate()) {
        wx.showModal({
          title: '提示',
          content: '本学期课程已结束，课表无法查看，如需查看课程可以到【我的课程】中进行查看。',
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
        that.reFreshKCB();
      }
    }, 500)
    
  },

  //计算日期
  caculateDate: function () {
    var that = this;
    //计算当前选择周1至周5日期
    var selzc = that.data.arrayzc[that.data.indexzc];
    var everyMonday = (selzc - 1) * 7; //周次x7,获取没周一距离开学那天的天数
    var itemF = new Date(app.cache.begin_day * 1000);
    var YearY = itemF.getFullYear();
    var MonthM = itemF.getMonth() + 1 < 10 ? '0' + (itemF.getMonth() + 1) : itemF.getMonth() + 1;
    var DayD = itemF.getDate();
    var firstDayTime = new Date(YearY + "/" + MonthM + "/" + DayD + " 00:00:00");  //IOS系统的坑，用‘-’会加载不出来，只能用‘/’
    var firstDayTime = firstDayTime.valueOf();
    var addtoarrayth = that.data.arrayth;
    for (var i = 0; i < 7; i++) {
      var nextDate = new Date(firstDayTime + (everyMonday + i) * 24 * 60 * 60 * 1000); //后一天
      var nextMonth = nextDate.getMonth() + 1 < 10 ? '0' + (nextDate.getMonth() + 1) : nextDate.getMonth() + 1;
      var nextDay = nextDate.getDate() < 10 ? '0' + nextDate.getDate() : nextDate.getDate();
      addtoarrayth[i].date = nextMonth + "." + nextDay;
    }
    that.setData({
      arrayth: addtoarrayth,
    });
  },
  onShareAppMessage: function () {
    return {
      title: '我的课表',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！',
      path: '/pages/core/schedule/schedule'
    };
  },
  //课程表刷新
  reFreshKCB: function () {
    var that = this;
    //先清空课程表 为显示出刷新的效果
    that.setData({
      arraykcb: []
    });
    //计算当前选择周1至周5日期
    that.caculateDate();
    //显示等待提示
    wx.showLoading({
      title: '课表加载中',
    })
    //选择学期
    var xj;
    var items = that.data.arrayxq[0];
    //console.log(items.indexOf("夏秋"))
    if (items.indexOf("夏秋") != -1){
      xj = 11
    }
    else{
      xj = 12
    }
    //console.log(xj)
    wx.request({
      url: app.local_server + 'get_schedule/',
      method: 'POST',
      data: {
        openid: app.globalData.openId,
        sno:app.cache.sno,
        passwd:app.cache.passwd,
        zc:that.data.arrayzc[that.data.indexzc],
        xn:app.cache.xn,
        xj:xj
      },
      header: { "Content-Type": "application/x-www-form-urlencoded" },
      success: (res)=> {
        wx.hideLoading();
        //console.log(res);
        if (res.data.message == "timeout"){
          wx.showModal({
            title: '请求超时',
            content: '可能是研究生系统问题，请稍后重试',
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
            content: '获取课表失败,请重新绑定后再试',
            showCancel: true,
            confirmText: "前往绑定",
            success: (res)=> {
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
        else if (res.data.message == "fault" && res.statusCode != 200){
          wx.showModal({
            title: "提示",
            content: '研究生系统目前无法访问',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                })
              } 
            }
          });
        }
        else if(res.data.message == "success" && res.statusCode == 200) {
          //对课程表进行上色并更新显示数据
          that.beautifyAndResetKcb(res.data.schedule); 
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
        wx.showModal({
          title:"加载失败",
          content: '获取课表失败，可能是您的网络或者服务器出了问题，请稍后重试',
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
        wx.hideLoading();
      }
    });

  },
  onShow: function () {
  },
  //判断课程和教室字数加起来是否超出小方块
  isOverLength: function (name, room) {
    if (name.length + room.length > 16) {
      if (room.length > 13){
        return 1; //两个都需要缩短
      }
      else{
        return 2; //只缩短课程名称
      }
    }
    return 3; //两个都不需要缩短
  },
  //显示课程的详细信息
  showdetail: function (e) {
    var that = this;
    var name = e.currentTarget.dataset.name_long;
    var room = e.currentTarget.dataset.room_long;
    var leader = e.currentTarget.dataset.leader;
    var time = e.currentTarget.dataset.time;
    var period = e.currentTarget.dataset.period;
    if (name == "") {
    } else {
      that.setData({
        hiddenmodalput: false,
        name: name,
        room: room,
        leader: leader,
        time: time,
        period:period
      })
    }
  },
  //是否隐藏课程详细
  confirm: function () {
    this.setData({
      hiddenmodalput: true,
    })
  },
  //对课程表数据进行上色渲染
  beautifyAndResetKcb: function (data) {
    //console.log("课表",data);
    let that = this;
    let trans = that.data.trans;  //透明度设置获取
    var tdcolors = [
      'rgba(72,61,139,' + trans + ')', 'rgba(100,149,237,' + trans + ')', 'rgba(0,139,139,' + trans + ')',
      'rgba(216,191,216,' + trans + ')', 'rgba(106,96,205,' + trans + ')', 'rgba(240,128,128,' + trans + ')',
      'rgba(210,180,140,' + trans + ')', 'rgba(144,238,144,' + trans + ')', 'rgba(255,165,0,' + trans + ')',
      'rgba(0,206,209,' + trans + ')',
      'rgba(204,154,168,' + trans + ')', 'rgba(231,202,202,' + trans + ')', 'rgba(126,171,117,' + trans + ')', 'rgba(127,156,172,' + trans + ')',
      'rgba(0,107,86,' + trans + ')', 'rgba(125,147,186,' + trans + ')', 'rgba(64,75,115,' + trans + ')'
    ];
    //对同一科目进行标号
    let index = 1;
    for (let row = 0; row < 12; row++) {
      for (let i = 0; i < 7; i++) {
        if (data[row][i].name != "" && data[row][i].index == "") {
          let tmp_name = data[row][i].name;
          for (let h = row; h < 12; h++) {//向下搜寻相同课程，名称
            for (let j = 0; j < 7; j++) {
              if (data[h][j].name == tmp_name && data[h][j].index == "") {
                data[h][j].index = index;//标号
              }
            }
          }
          index++;
        }
      }
    }
    // { name: "", room: "", leader: "", time: "", color: "" }
    // console.log("添加的颜色：");
    // console.log(data);
    var ontime = [
      "08:00~08:50", "09:00~09:50",
      "10:10~11:00", "11:10~12:00",
      "13:30~14:20", "14:30~15:20",
      "15:30~16:20", "16:30~17:20",
      "17:30~18:20", "18:30~19:20",
      "19:30~20:20", "20:30~21:20"];
    var changeKCB = new Array();
    for (var row = 0; row < 12; row++) {
      changeKCB[row] = new Array();
      for (var i = 0; i < 7; i++) {
        changeKCB[row][i] = new Object();
        let over_type = that.isOverLength(data[row][i].name, data[row][i].room)
        if (over_type == 1)
          {
          changeKCB[row][i].name_short = data[row][i].name.substring(0,5) + "..";
          changeKCB[row][i].room_short = data[row][i].room.substring(0,2) + ".." + data[row][i].room.substring(data[row][i].room.length - 8,data[row][i].room.length);
          }
        else if (over_type == 2){
          changeKCB[row][i].name_short = data[row][i].name.substring(0,5) + "..";
          changeKCB[row][i].room_short = data[row][i].room;
        }
        else if (over_type == 3){
          changeKCB[row][i].name_short = data[row][i].name;
          changeKCB[row][i].room_short = data[row][i].room;
          }
        changeKCB[row][i].name_long = data[row][i].name;
        changeKCB[row][i].room_long = data[row][i].room;
        changeKCB[row][i].leader = data[row][i].leader;
        changeKCB[row][i].period = data[row][i].period;
        changeKCB[row][i].color = tdcolors[(data[row][i].index - 1) % tdcolors.length];
        changeKCB[row][i].time = ontime[row]
      }
      that.setData({ arraykcb: changeKCB});
    }
  },
  
  //colorUI
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

})