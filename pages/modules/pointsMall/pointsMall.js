"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const _$app = getApp();
const _$util = require("../../../packages/utils/util");
const _$errcode = require("../../../config/errcode");
const _$session = _$util._interopRequireDefault(require("../../../packages/utils/session"));
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));

const _$pageScroll = require("../common/page_scroll");

const _data = Object.assign({}, _$pageScroll.data, {
  NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
  homeModules: {},
  appName: '积分商城',
  show: false,
  items: [],
  accordion: [
    {
      title: '排除重大事故',
      number: 20,
      state: 'abnormal',
      stateNum: 5,
      content: [
        {
          title: '防火墙无火烧或熏黑痕迹'
        }
      ]
    }, {
      title: '排除水泡车',
      number: 8,
      state: 'normal',
      stateNum: 5,
      content: [
        {
          title: '防火墙无火烧或熏黑痕迹'
        }
      ]
    }, {
      title: '排除水泡车',
      number: 8,
      state: 'normal',
      stateNum: 5,
      content: [
        {
          title: '防火墙无火烧或熏黑痕迹'
        }
      ]
    }
  ],
  title:"兑换商品",
  shopList:[],
  score:0
});

exports.default = Page(Object.assign({}, _$pageScroll.methods, {
  id: "home",
  data: _data,
  onLoad(){
    this.getInfo();
  },
  enterShopPage(e){
    wx.navigateTo({
      url: '/pages/modules/common/goodsDetail/goodsDetail?id='+e.currentTarget.dataset.id
    })
  },
  getInfo(){
    const that = this;
    _$request.default.get('shop.list').then((res)=>{
      const score = res.data.score;
      delete res.data['score'];
      const shopData = res.data
      that.setData({
        score:score,
        shopList:shopData
      })
    })
  },
  onShow(){
    this.getInfo();
  }
})
)