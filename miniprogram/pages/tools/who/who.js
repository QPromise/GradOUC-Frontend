const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    timer:'',
    num:'00',
    data:[],
    min:100,
    press:'暂停',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.turn();
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this;
    var shareObj = {
      title: "研在OUC-谁去跑腿？",
      path: '/pages/tools/who/who',
      desc: '可查详细的课程表、详细成绩，更多查询功能欢迎体验！'
    };
    // 返回shareObj
    return shareObj;
  },
  //产生随机数
  random:function(min,max){
    var that = this;
    var range = max-min;
    var rand = Math.random();
    var num = min + Math.round(rand*range);
    return num;
  },
  //随机数转动
  turn:function(){
    var that = this;
    that.data.timer = setInterval(function(){
      that.setData({
        num: that.random(1, 99)
      })
    },50);
  },
  click:function(e){
    var that = this;
    if(that.data.press=='开始'){
      wx.showToast({
        title: '请点击开始',
        icon: 'none',
        duration: 1000,
      })
    }else{
      var num = e.currentTarget.dataset.num;
      if (num <= that.data.min) {
        that.setData({
          min: num,
        })
      }
      var data = that.data.data;
      data.push(num);
      that.setData({
        data: data,
      })
    }

  },
  stop:function(){
    var that = this;
    if(that.data.press == '暂停'){
      clearInterval(that.data.timer);
      that.setData({
        press:'开始'
      })
    } else if (that.data.press == '开始'){
      that.turn();
      that.setData({
        press: '暂停'
      })
    }
  },
  clear:function(){
    var that = this;
    that.setData({
      data:[],
      min:100,
    })
  }
})