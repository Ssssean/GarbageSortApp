"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const _$app = getApp();
const _$util = require("../../../../packages/utils/util");
const _$errcode = require("../../../../config/errcode");
const _$session = _$util._interopRequireDefault(require("../../../../packages/utils/session"));
const _$request = _$util._interopRequireDefault(require("../../../../packages/utils/request"));


const _data = Object.assign({}, {
  NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
  appName: '积分商城',
  items: [],
  number: '0520',
  title: "兑换商品",
  show:false,
  value:1,
  goodsDetail:{},
  shopId:0
});

exports.default = Page(Object.assign({},  {
    id: "home",
    data: _data,
    onLoad(e){
      console.log(e)

      const that = this;
      _$request.default.get('shop.detail',`/goodsid/${e.id}`).then((res)=>{
        
        let detail = res.data.shop_content.split(/[\n]/);
        console.log(res)
        that.setData({
          shopId:e.id,
          goodsDetail:res.data,
          shopDetail:detail
        })
      })
    },
    exchange(){
      this.setData({
        show:true
      })
    },
    handleChange({ detail }) {
      this.setData({
        value: detail.value
      })
    },
    toExchangeDetail(){
      const that = this;
      if(that.data.value !== 0){
        wx.navigateTo({
          url: '/pages/modules/common/goodsDetail/exchangeDetail/exchangeDetail',
          success(res){
            res.eventChannel.emit('setNewsDetail', {
                data: {
                  shopId:that.data.shopId,
                  value:that.data.value,
                  newsDetail:that.data.goodsDetail
                }
            });
          }
        })
        that.setData({
          show: false
        })
      }
    }
  })
)