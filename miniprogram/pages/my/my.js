const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    is_bind: app.cache.is_bind,
    is_open_subscribe:app.cache.is_open_subscribe,
    name: null,
    times:"--",
    sno:null,
    openId: null,
    gender: null,
    department: null,
    score_notice: false,
    customBar: app.globalData.CustomBar,
    showUserAgreement: false,
    userAgreement:'<p><strong>一、特别提示</strong></p><p>&nbsp;&nbsp;&nbsp; 在此特别提醒您，本小程序非官方，与除小程序提供者的其他任何个人或机构均无关系，仅为大家获取信息提供方便。在您通过学号密码绑定使用本小程序&ldquo;研在OUC&rdquo;(以下简称&ldquo;本小程序&rdquo;，为小程序提供后端服务的远程服务器以下简称为&ldquo;远程服务器&rdquo;，小程序的宿主服务商以下简称为&ldquo;小程序服务商&rdquo;，本小程序和远程服务器的提供者以下简称为&ldquo;服务提供者&rdquo;)之前、或者在您已经通过绑定使用本小程序并决定继续使用小程序提供的服务之前，请仔细阅读本协议的内容，确保您正确理解了本协议各条款的含义。</p><p>&nbsp;&nbsp;&nbsp; 请您审慎阅读本协议各条款。在您看到本协议时，有以下两个情形：</p><p>&nbsp;&nbsp;&nbsp; 1.如果您还未绑定使用本小程序：在此情形下您不接受并同意本协议所有条款，您将无权使用本小程序提供的所有服务。</p><p>&nbsp;&nbsp;&nbsp; 2.如果您已经绑定使用过本小程序：在此情形下您不接受并同意本协议所有条款，直接删除小程序清除信息即可，您不能继续使用本小程序提供的所有服务。</p><p><strong>二、个人信息保护</strong></p><p>&nbsp;&nbsp;&nbsp; 1.在使用本小程序服务时，可能需要您提供一些必要的个人信息，本小程序将这些个人信息分为两类管理：</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (1)远程服务器不必要保存的信息，包括您主动提供的个人信息(例如绑定时的各种账号、密码等)，以下简称&ldquo;不必要信息&rdquo;。</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (2)远程服务器必须要保存的信息，包括但不限于您在使用本小程序时与远程服务器交互产生的信息(例如远程服务器的调试日志信息、向小程序服务商请求的头像、昵称等公开信息等)，以下简称&ldquo;必要信息&rdquo;。</p><p>&nbsp;&nbsp;&nbsp; 2.对于不必要信息，本小程序会将其存储在小程序服务商提供给小程序使用的本地加密缓存中，其信息安全由小程序服务商确保。远程服务器不保存不必要信息。</p><p>&nbsp;&nbsp;&nbsp; 3.对于必要信息，在使用本小程序的服务时，尽量将其保存在小程序服务商提供给小程序的本地缓存中，必要时会将其保存在远程服务器的数据库中，我们将尽力保护您的个人信息。未经用户同意不向任何第三方透露，以下特定情形除外，本小程序免责：</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (1)根据法律法规规定或有权机关的指示提供用户的个人隐私信息；</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (2)用户个人信息已经经过处理无法识别特定个人且不能复原；</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (3)用户自行向第三方透露个人隐私信息直接或间接导致的个人信息泄露；</p><p>&nbsp;&nbsp;&nbsp; 4.您同意小程序在以下情形中使用您的个人信息：</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (1)本小程序及远程服务器向用户发布重要通知时；</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (2)服务提供者内部进行审计、数据研究以改进产品、服务和与用户之间的沟通时；</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (3)本小程序及其服务器在提供服务，必须用到个人隐私信息时；</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; (4)适用于法律规定的其他事项；</p><p><strong>三、服务协议</strong></p><p>&nbsp;&nbsp;&nbsp; 1.在使用本小程序及远程服务器提供的服务时，可能要求您提供您在其他第三方的个人信息(包括但不限于第三方的账号、密码等)，如果您提供了您在其他第三方的个人信息，并且使用了相关服务，视为您授权同意本小程序及远程服务器以您的身份代为向第三方获取本小程序及远程服务器提供相关服务所需要的信息，由此产生的纠纷由您与第三方自行解决。</p><p>&nbsp;&nbsp;&nbsp; 2.您不得在本小程序内发布违反法律法规的、不实的、虚假的、冒充的、骚扰性的、中伤性的、辱骂性的等不合适内容。未经服务提供者同意，不得发布带有商业性质的广告、推广等信息。</p><p>&nbsp;&nbsp;&nbsp; 3.由于各种不可抗力(如通信中断等)造成的损失，服务提供者不承担责任。</p><p>&nbsp;&nbsp;&nbsp; 4.本小程序提供的服务仅限您本人使用，不得出借、转让、出售、出租本小程序提供的服务，由此产生的一切后果由您自行承担。</p><p>&nbsp;&nbsp;&nbsp; 5.您不得利用本小程序提供的服务盗取他人的各种信息。禁止利用本小程序的漏洞，从事出于任何目的的活动。</p><p>&nbsp;&nbsp;&nbsp; 6.除与服务提供者另有约定外，您不得将本小程序及远程服务器的数据用于商业性活动。</p><p>&nbsp;&nbsp;&nbsp; 7.您不得利用任何装置、软件或者程序干扰本小程序及远程服务器正常运行和提供服务。</p><p>&nbsp;&nbsp;&nbsp; 服务提供者有权在您违反以上协议内容情况下，在不提前通知您时，对您发布的内容进行删除、屏蔽处理，对您的账号功能进行限制、封禁处理。</p><p><strong>四、其他条款</strong></p><p>&nbsp;&nbsp;&nbsp; 1.本协议条款为动态条款，在提供服务的过程中可能会发生变更，更改时会以适当的方式通知您。</p><p>&nbsp;&nbsp;&nbsp; 2.服务提供者在紧急、必要的情况下发出的通知、声明等信息视为本条款的一部分，与本条款具有相同的效力。</p>',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  preventTouchMove: function () {},
  openUserAgreement() {
    this.setData({
      showUserAgreement: true,
    });
  },
  closeUserAgreement() {
    this.setData({
      showUserAgreement: false,
    });
  },
  onShow: function () {
    var that = this;
    that.setData({
      is_bind: app.cache.is_bind,
      name: app.cache.name,
      sno: app.cache.sno,
    })
    that.getIsOpenSubscribe();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  getIsOpenSubscribe: function(){
    let that = this
    wx.request({
      url: app.local_server + 'get_config/',
      success: function (res) {
        app.saveCache("is_open_subscribe", res.data.is_open_subscribe)
        that.setData({
          is_open_subscribe: res.data.is_open_subscribe
        })
        if (that.data.is_bind && (that.data.is_open_subscribe == 1 || that.data.is_open_subscribe == 2)){
          wx.request({
            url:app.local_server + "get_subscribe_status?openid="+app.globalData.openId,
            success: (res) =>{
              //console.log(res.data.score_notice)
              that.setData({
                score_notice:res.data.score_notice,
                times:res.data.times + "次"
              })
            }
            ,fail: (res)=>{
             that.setData({
               score_notice: false
             })
            }
          })
        }
      },
    })
  },
  scoreSubscribe: function(){
    let that = this
    wx.requestSubscribeMessage({
      tmplIds: ["LxOu_CBTn3H88ndcz_S9aeRO_lTaR3lgKrIU2VoOuZo"],
      success: (res) => {
       if (res['LxOu_CBTn3H88ndcz_S9aeRO_lTaR3lgKrIU2VoOuZo'] === 'accept'){
         //登录(获取用户授权码，服务端记录用户订阅次数用到)
         wx.login({
           success: function(res) {
             console.log(res.code)
             //调用后端接口，记录订阅次数
             wx.request({
               url:app.local_server + "subscribe_score?openid="+app.globalData.openId,
               success: (res) =>{
                 if (res.data.message == "success")
                 {
                  wx.request({
                    url:app.local_server + "get_subscribe_status?openid="+app.globalData.openId,
                    success: (res) =>{
                      //console.log(res.data.score_notice)
                      that.setData({
                        times:res.data.times + "次"
                      })
                      console.log(that.data.times)
                    }
                  })
                  wx.showModal({
                    title: '订阅成功',
                    content: '成绩将在出来后及时通知你，为防止错过成绩通知，请点击成绩通知按钮增加通知次数(保证次数大于一次)',
                    showCancel: false,
                    success(res) {
                    }
                  })
                  that.setData({
                    score_notice: true
                  })
                 }
                 else if (res.data.message == "fault")
                 {
                  wx.showModal({
                    title: '订阅失败',
                    content: '请重新绑定后再试',
                    showCancel: true,
                    confirmText: '去绑定',
                    cancelText: '取消',
                    success(res) {
                      if (res.confirm) {
                        wx.navigateTo({
                          url: '../my/login',
                        })
                      } else if (res.cancel) {
                      }
                    }
                  })
                  that.setData({
                    score_notice: false
                  })
                 }
                 else if (res.data.message == "repeated")
                 {
                  wx.request({
                    url:app.local_server + "get_subscribe_status?openid="+app.globalData.openId,
                    success: (res) =>{
                      //console.log(res.data.score_notice)
                      that.setData({
                        times:res.data.times + "次"
                      })
                    }
                  })
                  wx.showToast({
                    title: '成绩通知次数增加啦！记得多点几次呀！',
                    icon: 'none',
                    duration: 2500
                })
                that.setData({
                  score_notice: true
                })
                 }
               }
               ,fail: (res)=>{
                that.setData({
                  score_notice: false
                })
                wx.showToast({
                  title: '订阅失败！',
                  icon: 'none',
                  duration: 1500
              })
               }
             })
           }
         });
       }
       else{
        wx.showToast({
          title: '增加成绩通知次数失败！',
          icon: 'none',
          duration: 1500
      })
       }
      }
   })
   that.setData({
     score_notice:that.data.score_notice
   })
  },
  toFeedback: function () {
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e',
      extraData: {
        id: '273731',
      },
    });
  },
  showAddTip:function(){
    this.setData({
      add_tips: true
    })
  },
  closeAddTip:function(){
    this.setData({
      add_tips: false
    })
  },
  exit:function(){
    let that = this
    wx.showModal({
      title: '提示',
      content: '退出绑定后你的个人数据将被清空，是否退出绑定？',
      showCancel: true,
      confirmText: '确认',
      cancelText: '取消',
      success(res) {
        if (res.confirm) {
          // wx.clearStorageSync()
          // app.cache = {}
          app.saveCache("is_bind", false)
          that.setData({
            is_bind: false
          })
          wx.showToast({
            title: '退出绑定成功',
            icon: 'loading',
            duration: 2000,
            success: function () {
              wx.reLaunch({
                url: '/pages/my/my',
              })
            }
          })
        } else if (res.cancel) {
        }
      }
    })
    
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

  },

})

