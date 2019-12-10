"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const _$app = getApp();
const _$util = require("../../../../../packages/utils/util");
const _$errcode = require("../../../../../config/errcode");
const _$session = _$util._interopRequireDefault(require("../../../../../packages/utils/session"));
const _$request = _$util._interopRequireDefault(require("../../../../../packages/utils/request"));


const _data = Object.assign({}, {
  NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
  appName: '兑换信息',
  value: 1,
  price:99,
  addressData:{},
  shopDetail:[],
  feedbackText:'',
  shopId:0
});

exports.default = Page(Object.assign({}, {
  id: "home",
  data: _data,
  handleChange({ detail }) {
    this.setData({
      value: detail.value
    })
  },
  onLoad(e){
    const that = this;
    const eventChannel = that.getOpenerEventChannel();

    eventChannel.on('setNewsDetail', function(data) {
      console.log(data)
      that.setData({
        shopId:data.data.shopId,
        value : data.data.value,
        shopDetail:data.data.newsDetail
      })
    });

    
    
  },
  adressTap(){
    wx.navigateTo({
        url: '/pages/modules/reserve/address/address?path='+'/pages/modules/common/goodsDetail/exchangeDetail/exchangeDetail',
    })
  },
  //获取默认选中的地址
  getAddress() {
      let that = this;
      //当radio值没有改变时，不会传新的aid,就直接返回默认选中地址的信息
      _$request.default.get("reserve.radioChange", null, {}, {
          disabledLoadding: true,
          interceptCallback: that.getAddress //拦截器
      }).then((res) => {
          let _error = _$errcode.get(res);
          if (_error.errcode == _$errcode.success) {
              that.setData({
                  addressData: res.data
              })
          }


      })
  },
  onShow(){
    const that = this;
    _$session.default.isSession(_$app.globalData).then((res) => {
        that.getAddress();
    });
  },
  //获取备注信息的数据
  feedbackText(e) {
      let that = this;
      that.setData({
          feedbackText: e.detail.value,

      });
  },
  uploadOrder(){
    let that = this;
    //当radio值没有改变时，不会传新的aid,就直接返回默认选中地址的信息
    _$request.default.post("upload.order", null, {
      adrsname:that.data.addressData.name,
      district:that.data.addressData.district,
      mobile_phone:that.data.addressData.mobile_phone,
      shoptitle:that.data.shopDetail.shop_title,
      shopnum:that.data.value,
      shopnote:that.data.feedbackText,
      shop_score:that.data.value*that.data.shopDetail.shop_price,
      shopid:that.data.shopId,
      shopurl:that.data.shopDetail.shop_url
    }, {
        disabledLoadding: true,
        interceptCallback: that.getAddress //拦截器
    }).then((res) => {
        let _error = _$errcode.get(res);
        if (_error.errcode == _$errcode.success) {
            wx.showToast({
                title: '生成订单成功',
                icon: 'success',
                duration: 1500
            })
            setTimeout(()=>{
              wx.reLaunch({
                url: '/pages/modules/pointsMall/pointsMall'
              })
            },1500)
        }else{
          wx.showAlert({
              content: "提交失败，请检查积分或联系客服"
          });
        }


    })
  },
  orderConfirm(){
    const that = this;
    wx.showModal({
      title: '提示',
      content: '确定要预约吗？预约后会生成订单',
      success(res) {
        if (res.confirm) {
            that.uploadOrder();
        }
      }
    })
  }
})
)