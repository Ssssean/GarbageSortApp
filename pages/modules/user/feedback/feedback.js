"use strict";

const _$app = getApp();
const _$util = require("../../../../packages/utils/util");
const _$errcode = require("../../../../config/errcode");
const _$request = _$util._interopRequireDefault(require("../../../../packages/utils/request"));

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = Page({
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        feedback: [
            "\u8BF7\u9009\u62E9\u53CD\u9988\u7C7B\u578B",
            "\u5546\u54C1\u76F8\u5173",
            //"\u7269\u6D41\u72B6\u51B5",
            "\u5BA2\u6237\u670D\u52A1",
            "\u529F\u80FD\u5F02\u5E38",
            "\u4EA7\u54C1\u5EFA\u8BAE",
            "\u5176\u4ED6\u7C7B\u578B"
        ],
        index: 0,
        confirm: false,
        phone: '',
        feedtext: ''
    },
    onLoad() {},
    onReady() {
        this.imessage = this.selectComponent("#imessage");
    },
    onShow() {
        _$app.toAuthPage();
    },
    bindPickerChange(e) {
        let that = this;
        let data = that.data.feedback;
        that.setData({
            index: e.detail.value,
            fname: data[e.detail.value]
        });
    },
    feedbackText(e) {
        this.setData({ feedtext: e.detail.value });
    },
    phoneNumber(e) {
        this.setData({ phone: e.detail.value });
    },
    sendFeedBack() {
        let that = this;

        _$request.default.post("user.feedback", null, {
            fktype: that.data.fname,
            fkcontent: that.data.feedtext,
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {

            } else {
                that.imessage.handleShow({ type: "error", content: _error.errmsg });
            }
        });
    }
});