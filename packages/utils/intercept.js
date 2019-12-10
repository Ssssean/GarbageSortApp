// +----------------------------------------------------------------------
// | Sdoushi Weapp Intercept.js 拦截器
// +----------------------------------------------------------------------
// | Copyright (c) 2010-2019 http://www.sdoushi.com All rights reserved.
// +----------------------------------------------------------------------
// | Create: 2019/7/16
// +----------------------------------------------------------------------
// | Author: sound-horizon <sound-horizon@foxmail.com>
// +----------------------------------------------------------------------

let intercept = {
    run(action, callback, args) {
        switch (action) {
            case "user.relogin": // 重新登录
                const _$session = require("session");
                const _globalData = getApp().globalData;
                _globalData.userInfo.openid = null;
                _$session.weappLogin(_globalData, true).then((res) => {
                    if (_globalData.components == undefined) {
                        _globalData.components = {};
                    }
                    callback && callback(res);
                });
                return true;
                break;
            case "user.stoplogin": // 禁止登陆
                //添加禁止登陆钩子
                getApp().addHook("user.stoplogin", function(res) {
                    this.data.__hookStoplogin = false;
                    this.setData({ __hookStoplogin: true });
                });
                break;
            case "system.clearCache": // 清理所有缓存
                wx.clearStorage();
                break;
            case "system.removeCache": // 删除指定缓存
                if (args)
                    wx.removeStorageSync(args);
                break;
            default:
                break;
        }
    }
}


module.exports = intercept;
13