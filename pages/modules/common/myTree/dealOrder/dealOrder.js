"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const _$urls = require("../../../../../config/urls");

const _data = Object.assign({}, {
  NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
  appName: '兑换完成',
  width: wx.WIN_WIDTH,
  NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
  images:[]
});

exports.default = Page(Object.assign({}, {
  id: "home",
  data: _data,
  chooseImage(e) {
    const that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],  //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        var images = this.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下1张照片
        images = images.length <= 1 ? images : images.slice(1, 2)
        that.setData({
          images:images
        })
        console.log(images)
      }
    })
  },
  navigateBack() {
    wx.navigateBack()
  },
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },
  submitOrder(){
    const that = this;
    wx.showLoading({
      title: '请稍候...',
      mask: true
    });
    wx.uploadFile({
      url: _$urls.get('photo.Identification'), // 该服务在后面搭建。另外，小程序发布时要求后台服务提供https服务！这里的地址仅为开发环境配置。
      filePath: that.data.images[0],
      name: 'file',
      success: result => {
        console.log(result)
        wx.hideLoading();
        wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
        })

        setTimeout(()=>{
          wx.navigateBack()
        },2000)
          // result.data = JSON.parse(result.data);
          // if (result.data.errcode == 0 && 　result.data.data.length > 0) {
          //     wx.navigateTo({
          //         url: `/pages/modules/common/ljflSearch/ljflSearch`,
          //         success(res) {
          //             res.eventChannel.emit('searchGarbageResult', {
          //                 result: result.data
          //             });

          //         }
          //     });
          // } else {

          //     wx.showAlert({
          //         content: "没有识别出垃圾种类，请使用文字查询或重新选择图片。"
          //     });
          // }
      },
      fail:result=>{
        wx.showAlert({
          content: "提交失败，请重新提交"
        });
      }
    });
  }
})
)