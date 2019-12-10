// +----------------------------------------------------------------------
// | Sdoushi Weapp Session.js
// +----------------------------------------------------------------------
// | Copyright (c) 2010-2019 http://www.sdoushi.com All rights reserved.
// +----------------------------------------------------------------------
// | Create: 2019/7/3
// +----------------------------------------------------------------------
// | Author: sound-horizon <sound-horizon@foxmail.com>
// +----------------------------------------------------------------------
/**
 * Session.js 会话模块
 * @version 1.0
 * @desc    后续 session.weappLogin 使用一个 Promise 对象完成效率会更高一些
 */
const _$util = require("./util");
const _$errcode = require("../../config/errcode");
const _$request = _$util._interopRequireDefault(require("./request"));

let session = {
    /**
     * session.weappLogin 小程序用户登录
     * @progress => wx.login => return.getCode => myServer(save session key and openid) => return.{openid, utoken, weapp_user_id}
     * @param   {object}    extdata     扩展参数
     * @param   {boolen}    is_relogin  是否重新登录
     * @returns {Promise}   Object { utoken: String, extract: Object, userInfo: { openid: String,  weapp_user_id: Int, system_user_id: Int, phone: Int} }
     */
    //_isWeappLogin: false,
    weappLogin(extdata, is_relogin = false) {
        if (extdata.userInfo.openid == null) {
            wx.showLoading({ title: '\u52a0\u8f7d\u4e2d', mask: true });
            return this.getJsCode(extdata).then((js_code) => {
                // 根据code换取用户信息
                let _get = {};
                if (is_relogin) {
                    _get.utoken = encodeURIComponent(extdata.utoken); // 销毁之前的utoken
                }
                return _$request.default.get("user.weappLogin", `/js_code/${js_code}/is_relogin/${is_relogin}`, _get);
            }).then(function(res) {
                //let _components = extdata.components;
                // 本地存储用户信息
                wx.hideLoading();
                extdata.extract = res.extract || {};

                if (res.errcode == _$errcode.success) {

                    extdata.utoken = res.data.utoken;
                    extdata.userInfo.openid = res.data.weapp_user_id; // 小程序用户的openid
                    extdata.userInfo.weapp_user_id = res.data.uid; // 小程序用户的uid
                    extdata.userInfo.usertype = res.data.user_type;

                    // 系统用户id和手机号
                    if (res.data.system_user_id) {
                        extdata.userInfo.system_user_id = res.data.system_user_id;
                    } else {
                        delete extdata.userInfo.system_user_id;
                    }

                    if (res.data.phone) {
                        extdata.userInfo.phone = res.data.phone;
                    } else {
                        delete extdata.userInfo.phone;
                        delete extdata.userInfo.countryCode;
                    }

                    //delete extdata.components;

                }

                wx.setStorageSync("__appGlobalData", extdata);

                //extdata.components = _components;

                return extdata;
            });
        } else {
            return this.checkSession(extdata);
        }
    },
    /**
     * session.utoken2Phone
     * 通过utoken获取用户手机号码
     * @param {Object} app.globalData 
     * @param {Object} encrypted
     */
    utoken2Phone(extdata, encrypted) {
        const that = this;
        if (encrypted.errMsg == "getPhoneNumber:ok") {
            return that.checkSession(extdata).then((res) => {
                return _$request.default.post("user.authLogin", null, {
                    iv: encodeURIComponent(encrypted.iv),
                    encryptedData: encodeURIComponent(encrypted.encryptedData) // encodeURIComponent 解决小程序获取手机号-41003
                }, {
                    // 当被拦截器拦截后，重新调用
                    // interceptCallback() {
                    //     that.utoken2Phone(extdata, encrypted);
                    // }
                });
            });
        } else {
            return false;
        }
    },
    /**
     * session.getJsCode
     * @param {*} extdata 扩展参数
     */
    getJsCode(extdata) {
        return new Promise((resolve, reject) => {
            wx.login({
                success(res) {
                    if (res.code) {
                        resolve(res.code, extdata);
                    } else {
                        reject(res, extdata);
                    }
                },
                fail(res) {
                    reject(res, extdata);
                }
            });
        });
    },
    /**
     * session.checkSession
     * 检测会话是否失效，失效重新登录
     * @param   {Object} app.globalData 
     * @returns {Promise}
     */
    checkSession(extdata) {
        const that = this;
        return new Promise((resolve, reject) => {
            wx.checkSession({
                success() {
                    resolve(extdata);
                },
                fail() {
                    // relogin
                    extdata.userInfo.openid = null;
                    let result = that.weappLogin(extdata, true);
                    if (result) {
                        resolve(result);
                    }
                }
            });
        });
    },
    /**
     * session.getUserSessionInfo 获取小程序用户会话信息
     * @return  {Promise}
     */
    isSession: function(extdata) {
        const that = this;
        return that.checkSession(extdata).then(() => { // 检查微信端session是否失效
            return _$request.default.get("user.isSession").then((res) => { // 实时检查盛斗士服务端session是否失效
                if (res.data && res.data['openid'] == undefined) {
                    extdata.userInfo.openid = null;
                    return that.weappLogin(extdata, true);
                } else {
                    return extdata;
                }
            });
        });
    },
};

module.exports = session;