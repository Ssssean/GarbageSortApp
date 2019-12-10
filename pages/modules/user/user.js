"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _$app = getApp();
const _$util = require("../../../packages/utils/util");

exports.default = Page({
    data: {
        userName: "",
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + "px",
    },
    onShow() {
        this.setUserName(_$app.globalData.userInfo.phone);
    },
    setUserName(uname) {
        if (uname)
            this.setData({ userName: uname });
    },
    authLogin(e) {
        _$app.toAuthPage(`?backMethod=navigateBack&backUrl=${ _$util.route(this) }`, true, true);
    },
    setting(e) {
        _$app.developing();
    }
});