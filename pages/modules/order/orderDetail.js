"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
//---------基础组件---------------
const _$app = getApp();
const _$util = require("../../../packages/utils/util");
const _$errcode = require("../../../config/errcode");
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));
//---------公共组件---------------
const _$searchShop = require("../common/search_shop");
const _$shop_common = require("../common/shop_common");
const _$imageError = require("../common/image_error");

const _$data = Object.assign({}, _$shop_common.data, _$searchShop.data, {
    title: "订单详情",
    isShow: false,
    shop_msg: [],
    shop_form: [],
    shop_progress: [],
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT
});

exports.default = Page(Object.assign({}, _$shop_common.methods, _$searchShop.methods, _$imageError.methods, {
    data: _$data,
    onLoad(query) {
        //this.setData({ domain: _$app.domain });
        //_$app.methods.init(_$app, this, "getDetail");
        this.getDetail();
    },
    getDetail() {
        const that = this;
        _$request.default.get("userOrder.detail", `/order_id/${this.options.oid}`).then((res) => {
            let _error = _$errcode.get(res);
            let _data = res.data;
            if (_error.errcode == _$errcode.success) {
                that.setData({
                    isShow: true,
                    step: _data.step,
                    shop_msg: _data.commodity,
                    shop_form: _data.form,
                    shop_progress: _data.order_step
                });
            }
        });

        that.getHotShop();
    },
    onCopyMsg({ currentTarget }) {
        let { dataset } = currentTarget;
        wx.setClipboardData({
            data: dataset.value,
            success(res) {
                _$app.toast('复制成功');
            }
        })
    }
}));