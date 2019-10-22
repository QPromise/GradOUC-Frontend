var util = require('../../utils/util.js');
var th = require('../../utils/throttle/throttle.js');
// miniprogram/pages/publishTopics/publishTopics.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    content: null,
    visibility: null,
    imageList: null,
    openId:null,
    departmentType:null,
    canPublish:0,
    radioitems:[
      { text: '问答广场和我的问答，对所有人可见', value: 0, checked: true},
      { text: '我的问答，仅对自己可见' , value: 1, checked: false}
    ],
    currentvalue:0
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("来到了publishTopics这里");
    this.data.userInfo = app.globalData.userInfo;
    this.data.openId = app.globalData.openId;

    
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
 
  },
  chooseImages: function () {
    //回调函数里又有新的this对象，所以必须在外部保存this（即Page对象）引用
    let that = this;
    wx.chooseImage({
      count: 9,
      success: function (chooseRes) {
        //拼接图片列表
        let tempList = null;
        if (that.data.imageList == null) {
          //如果原来为空，直接赋值就好
          tempList = chooseRes.tempFilePaths;
        }else{
          //计算新增后图片总数
          let sum = that.data.imageList.length + chooseRes.tempFilePaths.length;
          if(sum > 9){
            tempList = that.data.imageList;
            util.showTip("图片最多不超过9张");
          }else{
            tempList = that.data.imageList.concat(chooseRes.tempFilePaths);
          }
        }      
        that.setData({
          imageList: tempList
        });
      },
      fail: function (res) {
        console.log("选择相片失败");
      }
    })
  },
  deleteImage: function(e){
    //获取删除id
    let index = e.target.dataset.id;
    this.data.imageList.splice(index,1);
    this.setData({
      imageList: this.data.imageList
    });
  },
  checkedradio: function (event) {
    this.setData({
      currentvalue: event.target.dataset.value
    });
  },
  clickRadio: function (event){
    let who = event.target.dataset.value;
    if(who == 0){
      this.data.radioitems[0].checked = true;
      this.data.radioitems[1].checked = false;
    }else if(who == 1){
      this.data.radioitems[0].checked = false;
      this.data.radioitems[1].checked = true;
    }
    this.setData({
      radioitems: this.data.radioitems,
      currentvalue: event.target.dataset.value
    });
  },
  
  
  formSubmit: th.throttle(function (that,e) {
    console.log(e.detail.value.content)
    if (e.detail.value.content == null || e.detail.value.content == ""){
      util.showTip("话题内容不能为空");
      return;
    } else if (e.detail.value.visibility == null || e.detail.value.visibility == ""){
      util.showTip("请选择话题发布的地方");
      return;
    }
    console.log('form发生了submit事件，提交数据：', e.detail.value);
    //内容
    that.data.content = e.detail.value.content;
    //可见性
    if (e.detail.value.visibility == 0) {
      that.data.visibility = true;
    }else{
      that.data.visibility = false;
    }    
    //发布时间
    let time = new Date();
    //发布话题
    if (that.data.imageList == null || that.data.imageList.length == 0){
      //没有图片
      //无需上传图片
      that.addUtteranceDoc(time, null);
    }else{
      //有图片
      //1.上传照片，2.添加话题记录到数据库
      //openId加生成唯一时间戳加图片索引作为图片的云路径前缀
      let openId = app.globalData.openId;
      let timeStamp = Date.parse(time).toString();
      //云路径前缀
      let imageCloudPathPrefix = 'CJRXHTreeHole/' + openId + '/' + timeStamp + '/';
      //获取要上传多少张图片
      let length = that.data.imageList.length;
      //新建图片数组，存该次所上传的所有照片
      let imageUrls = new Array(length);
      wx.showLoading({
        title: '上传中, 请稍后',
        mask:true
      });
      let then = that;
      //一张一张开始上传
      then.uploadImages(imageCloudPathPrefix, 0, then.data.imageList, length, time, imageUrls);
    }
  },1500),
  uploadImages: function (imageCloudPathPrefix, index, images, length, time, imageUrls) {
    let that = this;
    wx.cloud.uploadFile({
      cloudPath: imageCloudPathPrefix + index + '.png',
      filePath: images[index],
      success: function (res) {
        console.log("上传成功");
        //从上传结果中获取云端图片的路径url
        let imageUrl = res.fileID;
        //将图片url存入图片数组
        imageUrls[index] = imageUrl;
        console.log(imageUrls[index]);
      },
      fail: function (res) {
        console.log("上传失败");
      },
      complete: function (res) {
        if ((index + 1) == length) {
          //如果是最后一张，将该次上传记录添加到数据库
          that.addUtteranceDoc(time, imageUrls);
        }
        else if (imageUrls[index] == null) {
          //失败，删回之前上传的照片
          for (let i = 0; i < imageUrls.length; i++) {
            let fileId = util.getFileId(imageUrls[i]);
            //从存储真正删除该图片
            wx.cloud.deleteFile({
              fileList: [fileId],
              success: function (res) {
                console.log("删除照片成功");
              },
              fail: function (res) {
                console.log("删除照片失败");
              }
            });
          }
          util.showTip('上传失败，请重试！');
          return;
        }
        else {
          //否则，传下一张
          index = index + 1;
          that.uploadImages(imageCloudPathPrefix, index, images, length, time, imageUrls);
        }
      }
    });
  },
  findDepartment:()=>{
    let that = this;
    let openId = app.globalData.openId;
    
    
  },
  addUtteranceDoc: function (time, imageUrls) {
    let that = this;
    //头像
    let icon = that.data.userInfo.avatarUrl;
    //上传者昵称
    let name = that.data.userInfo.nickName;
    //话题内容
    let content = that.data.content; 
    //可见性
    let visibility = that.data.visibility;
    //评论数
    let commentNum = 0;
    //点赞数
    let praiseNum = 0; 
    //获取当前openId的departmentType
    console.log("获取departmentType");
    console.log(that.data.openId);
    console.log(this.data.openId);
    //更新院系
    const db = wx.cloud.database();
    db.collection('profile').where({ "_openid":that.data.openId}).get({
      success:(res)=>  {
        if (res.data.length == 1) {
          that.setData({ departmentType: res.data[0].departmentType });
          console.log(that.data, that.data.departmentType);
          //把上传的图片添加到数据库，并生成话题记录
          db.collection("utteranceDoc").add({
            data: {
              icon: icon,
              publisher: name,
              departmentType: that.data.departmentType,
              time: util.formatTime(time, "Y-M-D h:m:s"),
              content: content,
              imageUrls: imageUrls,
              visibility: visibility,
              commentNum: commentNum,
              praiseNum: praiseNum
            },
            success: function (res) {
              
              console.log("发布内容添加到数据库成功");
            },
            fail: function (res) {
              console.log("发布内容添加到数据库失败");
            },
            complete: function (res) {
              //上传完成
              wx.hideLoading();
              //跳转到记录显示页面
              wx.switchTab({
                url: '../index/index'
              })
            }
          });
        }
        else {
          console.log(res.data, res.data[0].departmentType);
          console.log("数据库存在多个相同openid用户表或者读取异常:");
          // that.setData({ nickName: that.userInfo.nickName })
          wx.showToast({
            icon: 'none',
            title: '请尝试重新登录或修改个人信息',
            duration:1500
          })
          setTimeout(function () {
            wx.hideToast()
          }, 1500)
        }
      }, fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败',
          duration:1500
        })
        setTimeout(function () {
          wx.hideToast()
        }, 1500)
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
   
  },
  formReset: function () {
    console.log('form发生了reset事件');
    //清空图片列表
    this.setData({
      imageList: null,
      currentvalue: -1
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})