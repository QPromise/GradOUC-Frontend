Component({
  properties: {
    //属性值可以在组件使用时指定
    isCanDraw: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal) {
        newVal && this.drawPic()
      }
    }
  },
  data: {
    isModal: false, //是否显示拒绝保存图片后的弹窗
    imgDraw: {}, //绘制图片的大对象
    sharePath: '', //生成的分享图
    visible: false
  },
  methods: {
    handlePhotoSaved() {
      this.savePhoto(this.data.sharePath)
    },
    handleClose() {
      this.setData({
        visible: false
      })
    },
    drawPic() {
      if (this.data.sharePath) { //如果已经绘制过了本地保存有图片不需要重新绘制
        this.setData({
          visible: true
        })
        this.triggerEvent('initData') 
        return
      }
      wx.showLoading({
        title: '生成中'
      })
      //console.log(wx.getStorageSync('cacheCourses'))
      let tmpViews = [
        {
          type: 'image',
          url: wx.getStorageSync('avatarUrl') || '../../images/backup_avatar.png',//wx.getStorageSync('avatarUrl') || 
          css: {
            top: '40rpx',
            left: '328rpx',
            width: '86rpx',
            height: '86rpx',
            borderWidth: '6rpx',
            borderColor: '#FFF',
            borderRadius: '96rpx'
          }
        },
        {
          type: 'text',
          text: wx.getStorageSync('nickName') || wx.getStorageSync('name'),
          css: {
            top: '125rpx',
            fontSize: '28rpx',
            left: '375rpx',
            align: 'center',
            color: '#3c3c3c'
          }
        },
      ]
      this.setData({
        imgDraw: {
          width: '750rpx',
          height: '1315rpx',
          background: '../../images/score_background1.png',
          views: tmpViews.concat(wx.getStorageSync('cacheCourses') || [])
        }
      })
    },
    onImgErr(e) {
      wx.hideLoading()
      wx.showToast({
        title: '生成分享图失败，请刷新页面重试'
      })
    },
    onImgOK(e) {
      wx.hideLoading()
      this.setData({
        sharePath: e.detail.path,
        visible: true,
      })
      //通知外部绘制完成，重置isCanDraw为false
      this.triggerEvent('initData') 
    },
    preventDefault() { },
    // 保存图片
    savePhoto(path) {
      wx.showLoading({
        title: '正在保存...',
        mask: true
      })
      this.setData({
        isDrawImage: false
      })
      wx.saveImageToPhotosAlbum({
        filePath: path,
        success: (res) => {
          wx.showToast({
            title: '保存成功',
            icon: 'none'
          })
          setTimeout(() => {
            this.setData({
              visible: false
            })
          }, 500)
        },
        fail: (res) => {
          wx.getSetting({
            success: res => {
              let authSetting = res.authSetting
              if (!authSetting['scope.writePhotosAlbum']) {
                this.setData({
                  isModal: true
                })
              }
            }
          })
          setTimeout(() => {
            wx.hideLoading()
            this.setData({
              visible: false
            })
          }, 500)
        }
      })
    }
  }
})
