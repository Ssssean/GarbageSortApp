"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _$app = getApp();
const _$util = require("../../../../packages/utils/util");
const _$errcode = require("../../../../config/errcode");
const _$actions = require("../../../../packages/utils/actions");
//const _$request = _$util._interopRequireDefault(require("../../../../packages/utils/request"));
const _$session = _$util._interopRequireDefault(require("../../../../packages/utils/session"));

exports.default = Page({
    data: {
        navTitle: "授权登录",
        logoSrc: "/images/logo.png",
        promptMsg: "首次进入需要授权才能使用",
        authLoginBtn: "授权微信账号登录",
        otherLoginBtn: "已有账号，手机号登录",
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + "px",
        backMethod: "switchTab",
        backUrl: "/pages/modules/home/home"
    },
    onLoad(query) {
        const that = this;
        const eventChannel = that.getOpenerEventChannel();
        if (query) {
            that.setData(query);
        }
        eventChannel.on('setPageConfig', function(data) {
            that.setData(data);
        });
    },
    onShow() {
        // 载入页面前，检查服务端是否还存在会话
        _$session.default.isSession(_$app.globalData);
    },
    tapCancel(e) {
        let dataset = _$util.data(e);
        wx[dataset.backMethod]({ url: dataset.backUrl });
    },
    // 缓存信息
    _saveUserInfo(result) {
        if (result) {
            Object.assign(_$app.globalData.userInfo, result);
            let _components = _$app.globalData.components; // 临时存储
            delete _$app.globalData.components;
            wx.setStorageSync("__appGlobalData", _$app.globalData);
            _$app.globalData.components = _components;
            return true;
        }
        return false;
    },
    runAuthLogin(e) {
        const that = this;
        const _prevPage = _$app.prevPage();
        let result = _$session.default.utoken2Phone(_$app.globalData, e.detail);
        if (result) {
            result.then((res) => {
                let _error = _$errcode.get(res);
                if (_error.errcode === _$errcode.success) {
                    if (that._saveUserInfo(res.data)) {
                        _$app.backPage({
                            success() {
                                _prevPage['AuthLoginCallback'] && _prevPage['AuthLoginCallback']();
                            }
                        });
                    }
                } else {
                    _$util.message({ type: "error", content: _error.errmsg });
                    _$actions.get(_error, _$session.default, _$app.globalData);
                }
            });
        }
    },

    userNameLogin(e) {
        _$app.developing();
    }
});