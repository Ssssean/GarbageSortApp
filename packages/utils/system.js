"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = {
    /*
     * 扩展小程序参数
     * */
    attachInfo() {
        var res = wx.getSystemInfoSync();

        wx.WIN_WIDTH = res.screenWidth;
        wx.WIN_HEIGHT = res.screenHeight;
        wx.IS_IOS = /ios/i.test(res.system);
        wx.IS_ANDROID = /android/i.test(res.system);
        wx.STATUS_BAR_HEIGHT = res.statusBarHeight;
        wx.DEFAULT_HEADER_HEIGHT = 46; // res.screenHeight - res.windowHeight - res.statusBarHeight
        wx.DEFAULT_CONTENT_HEIGHT = res.screenHeight - res.statusBarHeight - wx.DEFAULT_HEADER_HEIGHT;
        wx.IS_APP = true;
        wx.IPHONEX = res.model.search("iPhone X");

        wx.showAlert = (options) => {
            options.showCancel = false;
            wx.showModal(options);
        };

        wx.showConfirm = (options) => {
            wx.showModal(options);
        };

        wx.openSearch = (params) => {
            let _params = [];
            for (let i in params) {
                _params.push(`${i}=${params[i]}`);
            }
            wx.navigateTo({
                url: `/pages/modules/common/search/search?${_params.join("&")}`
            });
        };
    }
};