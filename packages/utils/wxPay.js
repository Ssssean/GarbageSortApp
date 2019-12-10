// +----------------------------------------------------------------------
// | Sdoushi Weapp WxPay.js
// +----------------------------------------------------------------------
// | Copyright (c) 2010-2019 http://www.sdoushi.com All rights reserved.
// +----------------------------------------------------------------------
// | Create: 2019/7/3
// +----------------------------------------------------------------------
// | Author: sound-horizon <sound-horizon@foxmail.com>
// +----------------------------------------------------------------------

/**
 * WxPay.js 小程序支付模块
 * @version 1.0
 */

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _$util = require("./util");
const _$errcode = require("../../config/errcode");
const _$config = require("../../config/config");
const _$request = _$util._interopRequireDefault(require("./request"));

exports.default = {
    pay(post, success, fail) {
        _$request.default.post("userOrder.create", `/pay_mode/${_$config.payType}/trade_type/JSAPI`, post).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                let _params = res.data;
                wx.requestPayment({
                    timeStamp: _params.time_stamp,
                    nonceStr: _params.nonce_str,
                    'package': `prepay_id=${_params.prepay_id}`,
                    signType: 'MD5',
                    paySign: _params.pay_sign,
                    success() {
                        success && success(res);
                    },
                    fail(msg) { // {"errMsg": "requestPayment:fail 等待超时，请重试"}
                        msg = msg.errMsg.replace(/requestPayment:fail\s+/, "");
                        if (msg == 'cancel') {
                            msg = '您取消了支付';
                        }
                        fail && fail(res, msg);
                    }
                });
            } else {
                fail && fail(res, _error.errmsg || "未知错误");
            }
        });
    }
};