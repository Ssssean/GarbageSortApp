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
  appName: '我的环保树',
  width: wx.WIN_WIDTH,
  NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
  get:true,
  used:false,
  all:true,
  wait:false,
  complete:false,
  orderList:{
    get:[{
            registered:10,
            recover:50,
            remark:'15222222222',
            pic:'/images/help.png'
          },
          {
            registered:10,
            recover:40,
            weight:60,
            price:9,
            remark:'153333333',
            pic:'/images/help.png'
          },
          {
            registered:10,
            recover:40,
            weight:60,
            price:9,
            remark:'153333333',
            pic:'/images/help.png'
          },
          {
            registered:10,
            recover:40,
            weight:60,
            price:9,
            remark:'153333333',
            pic:'/images/help.png'
          },
          {
            registered:10,
            recover:40,
            weight:60,
            price:9,
            remark:'153333333',
            pic:'/images/help.png'
          }
    ],
    used:[{
            point:99,
            goods:{name:'移动话费10元',count:1},
            state:'兑换完成',
            pic:'/images/address.png'
          }
    ]
  },
  orderData:{
    all:[
      {
        time:'2019-12-3 13:50:33',
        status:true,
        name:'aaa',
        address:'徐州市贾汪区潘安镇xxx',
        phone:'15465321654',
        goods:'移动话费10元',
        兑换数量:'1',
        备注信息:'xxxxxxxxxxxxx'
      },
      {
        time:'2019-12-3 13:50:33',
        status:false,
        name:'aaa',
        address:'徐州市贾汪区潘安镇xxx',
        phone:'15465321654',
        goods:'移动话费10元',
        兑换数量:'1',
        备注信息:'xxxxxxxxxxxxx'
      }
    ]
  },
  index:3,
  page:0
});

exports.default = Page(Object.assign({}, {
  id: "home",
  data: _data,
  changeContent(e){
    const that = this;
    console.log(e.currentTarget.id)
    switch(e.currentTarget.id){
      case 'get':
        that.setData({
          get: true,
          used: false
        });
        break;
      case 'used':
        that.setData({
          used: true,
          get: false
        });
        break;
      case 'all':
        that.setData({
          all: true,
          wait:false,
          complete: false
        });
        break;
      case 'wait':
        that.setData({
          wait: true,
          all:false,
          complete: false
        });
        break;
      case 'complete':
        that.setData({
          complete: true,
          wait:false,
          all: false
        });
        break;
    }
  },
  dealOrder(){
    wx.navigateTo({
       url: `/pages/modules/common/myTree/dealOrder/dealOrder`
    });
  },
  onShow(){
    this.getOrderDetail()
  },
  getOrderDetail(){
    console.log(111111)
    const that = this;
    _$request.default.get("userljfl.order", `/page/${that.data.page}/status/${that.data.index}`, {}, {
        disabledLoadding: true,
        interceptCallback: that.getOrderData //拦截器
    }).then((res) => {
        console.log(res);
        const orderdata=[];
        that.setData({
          orderdata:res.data
        });
        
        // let _error = _$errcode.get(res);
        // if (_error.errcode == _$errcode.success) {
        //     that.setData({
        //         ['orderData[' + that.data.page + ']']: res.data
        //     });
        //     console.log(that.data.orderData);
        //     ++that.data.page;
        // }
    })
  }
})
)