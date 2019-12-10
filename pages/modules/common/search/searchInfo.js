// +----------------------------------------------------------------------
// | Sdoushi Weapp SearchInfo.js
// +----------------------------------------------------------------------
// | Copyright (c) 2010-2019 http://www.sdoushi.com All rights reserved.
// +----------------------------------------------------------------------
// | Create: 2019/7/20
// +----------------------------------------------------------------------
// | Author: sound-horizon <sound-horizon@foxmail.com>
// +----------------------------------------------------------------------
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

//-----------基础组件--------------
const _$app = getApp();
const _$util = require("../../../../packages/utils/util");
const _$errcode = require("../../../../config/errcode");
//-----------公共组件--------------
const _$filter = require("../../common/filter");
const _$pageScroll = require("../../common/page_scroll");
const _$shopCommon = require("../../common/shop_common");
const _$shopsPlus = require("../../common/shops_plus");

const _$data = Object.assign({}, _$shopCommon.data, _$shopsPlus.data, _$filter.data, _$pageScroll.data, {
    title: "",
    showTitleIcon: false,
    popup_NAV_HEIGHT: 0,
    _popup_NAV_HEIGHT: 0,
    popupHeight: 0,
    pop_0: false, // 订单类型
    pop_1: false, // 订单状态
    pop_2: false,
    //-------筛选条件-----------
    // customStyle: {
    //     'background-color': '#eee',
    //     'height': '58px'
    // },
    // navList: [{
    //     name: '商品类型',
    //     active: '',
    //     type: "menu",
    //     icon: 'slide_down',
    //     id: 0
    // }, {
    //     name: '排序方式',
    //     active: '',
    //     type: "menu",
    //     icon: 'slide_down',
    //     id: 1
    // }, {
    //     name: '筛 选',
    //     type: "menu",
    //     icon: 'slide_down',
    //     dot: false,
    //     id: 2
    // }],
    // 商品类型
    // shopType: {
    //     '40': '商标',
    //     '41': '专利',
    //     '42': '工商',
    //     '50': '版权'
    // },
    // // 排序方式
    // sortType: {
    //     "0": "全部",
    //     "1": "价格最低",
    //     "2": "价格最高"
    // },
    //------------------
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
    //------------------
    shop_type: "",
    sort_type: "",
    filters: [
        "shop_type",
        "sort_type", ["limit", "offset"]
    ]
});

exports.default = Page(Object.assign({}, _$shopCommon.methods, _$shopsPlus.methods, _$filter.methods, _$pageScroll.methods, {
    data: _$data,
    onLoad() {
        const that = this.onMessage();
        const _data = that.data;
        _data.popup_NAV_HEIGHT = _data._popup_NAV_HEIGHT = _data.NAV_HEIGHT + 46;
        _data.popupHeight = wx.WIN_HEIGHT - _data.popup_NAV_HEIGHT;

        that.setData({ popup_NAV_HEIGHT: _data.popup_NAV_HEIGHT, popupHeight: _data.popupHeight });
    },
    tapSearch({ currentTarget }) {
        let _page = _$app.prevPage();
        if (_page.id == 'home') {
            let { dataset } = currentTarget;
            wx.openSearch(dataset);
        } else {
            _$app.backPage();
        }
    },
    openPopup({ currentTarget }) {
        const that = this;
        let { dataset } = currentTarget;
        let _params = {};

        if (that._currentPopup != null) {
            let _idx = that._currentPopup.popId;
            delete that._currentPopup.popId;
            that.setData(that._currentPopup);
            if (_idx == dataset.idx) {
                return;
            }
        }

        _params[`pop_${dataset.idx}`] = true;
        _params['popup_NAV_HEIGHT'] = that.data._popup_NAV_HEIGHT + (that.data.isSticky ? 0 : 48);

        // 保存当前弹出框
        that._currentPopup = {
            popId: dataset.idx,
            [`pop_${dataset.idx}`]: false
        };

        that.setData(_params);
    },
    closePopup() {
        if (this._currentPopup) {
            this.setData({
                [`pop_${this._currentPopup.popId}`]: false
            });
        }
    },
    onBack(e) {
        _$app.backPage();
    }
}));