// +----------------------------------------------------------------------
// | Sdoushi Weapp Product.js
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

const _$app = getApp();

//--------基础组件-------
const _$errcode = require("../../../config/errcode");
const _$util = require("../../../packages/utils/util");
const _$session = _$util._interopRequireDefault(require("../../../packages/utils/session"));
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));
//--------公共组件-------
const _$shop_common = require("../common/shop_common");
const _$searchBar = require("../common/search_bar");
const _$imageError = require("../common/image_error");


const _$data = Object.assign({}, _$shop_common.data, _$searchBar.data, {
    // swiper当前index
    swiperCurrent: 0,
    // swiper数据
    swiperData: [],
    // 展开的大类id
    class_id: 0,
    // 默认子类id
    children_id: 0,
    // 产品类型
    categories: [],
    // 显示的商品子类名称
    activeCategoryName: "加载中"
});

exports.default = Page(Object.assign({}, _$shop_common.methods, _$searchBar.methods, _$imageError.methods, {
    data: _$data,
    onLoad() {
        const that = this;
        this.imessage = this.selectComponent("#imessage");
        _$session.default.isSession(_$app.globalData).then((res) => {
            that.getCommodityType();
        });

        wx.showShareMenu({ withShareTicket: true });
    },
    //onShow() {},
    /**
     * 展开类型触发
     * @param {EventTarget} e 
     */
    expandCommodityType(e) {
        if (e.detail.first) {
            let data = e.detail.first.dataset;
            this.data.class_id = data.classId; // 更新当前clase_id
            this.getShop({
                id: data.id,
                text: data.text,
                type: data.type,
                swiper: data.swiper,
                classId: data.classId
            });
        }
    },
    /**
     * 获取产品类型
     */

    getCommodityType() {
        const that = this;
        _$request.default.get("commodity.getType", null, {}, {
            disabledLoadding: true,
            interceptCallback: that.getCommodityType
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success && res.data.length > 0) {

                let _first = res.data[0];
                let _extract = res.extract;

                that.setData({
                    class_id: _first.id, // 大类id
                    categories: res.data // 子类列表
                });
                console.log(this.data.categories);

                return {
                    id: _extract.children_id,
                    type: _first.type,
                    classId: _first.id,
                    swiper: _first.img_url,
                    text: _extract.children_text
                };

            } else {
                wx.showAlert({
                    content: _error.errmsg
                });
            }
        }).then((obj) => {
            if (obj) {
                that.getShop(obj);
            }
        });
    },
    /**
     * 
     * @param {EventTarget} e 
     */
    tapSwiper(e) {

    },
    /**
     * 
     * @param {EventTarget} e 
     */
    swiperChange(e) {

    }
}));