"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const _$util = require("../../../../packages/utils/util");
const _$errcode = require("../../../../config/errcode");
const _$searchShop = require("../search_shop");
const _$request = _$util._interopRequireDefault(require("../../../../packages/utils/request"));

const _$data = Object.assign({}, _$searchShop.data, {
  NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + "px",
  newsDetail:{}
});

exports.default = Page(Object.assign({}, _$searchShop.methods, {
  data: _$data,
  onLoad(e) {
    console.log(e)
    const that = this;

    _$request.default.get('news.detail',`/newid/${e.id}`).then( (res)=>{
      console.log(res.data)
      that.setData({
        newsDetail:res.data
      })
    })
  }
}));