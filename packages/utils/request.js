"use strict";

const _mlwxappId = wx.getAccountInfoSync();

const _$mock = require("mock");
const _$data = require("data");
const _$urls = require("../../config/urls");
const _$errcode = require("../../config/errcode");
const _$intercept = require("intercept");

const assign = obj => {
    return Object.assign({}, obj);
};

/**
 * 异步请求
 * @param {string} 请求key 
 * @param {string} RESTful参数
 * @param {object} GET|POST请求参数 
 * @param {object} 请求附加操作 
 * @returns Promise
 */
function serverRequest(key, RESTful, params = {}, extparams = {}) {
    let url = _$urls.get(key);

    extparams = Object.assign({
            isLocalData: false, // 是否调用本地测试数据
            isLocalStorage: false, // 是否使用本地存储
            returnCacheData: false, // 是否返回缓存数据
            disabledLoadding: false,
            interceptCallback: function() {} // 拦截器回调函数
        },
        extparams
    );

    return new Promise((resolve, reject) => {
        const _sKey = `__${key}${ RESTful ? RESTful : "" }`;
        if (url) {
            if (extparams.isLocalData == true || _$urls.debug) {
                let res = _$mock.mock(_$data[key]);
                if (extparams.isLocalStorage) {
                    if (res.extract) {
                        res.extract["_sKey"] = _sKey;
                    }
                    wx.setStorageSync(_sKey, res);
                }
                resolve(res);
            } else {
                // 如果有缓存数据，直接返回
                if (extparams.returnCacheData) {
                    let _storage = wx.getStorageSync(_sKey);
                    if (_storage) {
                        resolve(_storage);
                        return;
                    }
                }

                let _params = Object.assign({ data: null, method: "GET", dataType: 'json', responseType: 'text', header: {} },
                    params
                );

                let _$app = getApp();


                if (_$app.globalData.extract && _$app.globalData.extract.sessid) {
                    _params.header['Cookie'] = `PHPSESSID=${_$app.globalData.extract.sessid}`;
                }

                _params.url =
                    url + (RESTful || "") + "?appid=" + _mlwxappId.miniProgram.appId + (_$app.globalData.utoken ? `&utoken=${encodeURIComponent(_$app.globalData.utoken)}` : "");

                _params.success = res => {
                    if (extparams.disabledLoadding == false)
                        wx.hideLoading();
                    // 检测这个多少是否包含这个属性使用 hasOwnProperty 方法
                    if (res.data.constructor === Array || res.data.constructor === Object) {

                        if (extparams.isLocalStorage && res.data.data) {
                            if (res.data.extract) {
                                res.data.extract["_sKey"] = _sKey;
                            }
                            wx.setStorageSync(_sKey, res.data);
                        }

                        /**
                         * 是否存附加 @action 参数，该参数用于服务端控制系统内置动作
                         * '@action' => array( "action" => "system.removeCache", "args" => "__userOrder.statusList" );
                         * @param {string} action
                         * @param {string} args
                         */
                        let _error = assign(_$errcode.get(res.data));
                        if (res.data.extract && res.data.extract['@action']) {
                            let _$action = res.data.extract['@action'];
                            _error.action = _$action.action;
                            _error.actionArgs = _$action.args;
                        }

                        // 拦截服务端接口返回异常结果
                        if (_error.action && _$intercept.run(_error.action, extparams.interceptCallback, _error.actionArgs) === true) {
                            return;
                        }

                        resolve(res.data);

                    } else {
                        let response = _$errcode.code['-2'];
                        log_error(key, response);
                        resolve(response);
                    }
                };

                _params.fail = function(res) {
                    if (extparams.disabledLoadding == false)
                        wx.hideLoading();
                    //resolve.apply(null, arguments);
                    if (res.errcode == undefined) {
                        res.errcode = "-100";
                        res.errmsg = res.errMsg;
                    }
                    resolve(res);
                };

                if (extparams.disabledLoadding == false)
                    wx.showLoading({ title: '\u52a0\u8f7d\u4e2d', mask: true });
                wx.request(_params);
            }
        } else {
            let response = _$errcode.code['-1'];
            log_error(key, response);
            resolve(response);
        }
    });
}

function log_error(key, response) {
    console.error(`${key} ${JSON.stringify(response)}`);
}

function serverGet(key, RESTful = "", data = {}, extparams = {}) {
    return serverRequest(key, RESTful, { data: data }, extparams);
}

function serverPost(key, RESTful = "", data = {}, extparams = {}) {
    return serverRequest(
        key,
        RESTful, {
            data: data,
            method: "POST",
            header: { "content-type": "application/x-www-form-urlencoded" }
        },
        extparams
    );
}

module.exports = {
    get: serverGet,
    post: serverPost
};