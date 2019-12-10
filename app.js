// +----------------------------------------------------------------------
// | Sdoushi Weapp App.js
// +----------------------------------------------------------------------
// | Copyright (c) 2010-2019 http://www.sdoushi.com All rights reserved.
// +----------------------------------------------------------------------
// | Create: 2019/7/1
// +----------------------------------------------------------------------
// | Author: sound-horizon <sound-horizon@foxmail.com>
// +----------------------------------------------------------------------
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

const _$util = require("./packages/utils/util");
const _$errcode = require("./config/errcode");

const _$config = _$util._interopRequireDefault(require("./config/config"));
const _$system = _$util._interopRequireDefault(require("./packages/utils/system"));
//const _$session = _$util._interopRequireDefault(require("./packages/utils/session"));
//const _$requset = _$util._interopRequireDefault(require("./packages/utils/request"));

exports.default = App({
	domain: _$config.default.host,
	globalData: {
		utoken: null,
		//components: null, // 首页组件结构
		userInfo: {}
	},
	methods: {
		/**
		 * 异步初始
		 * @param {App}     app 
		 * @param {Page}    page 
		 * @param {String}  method
		 */
		init(app, page, method, params) {
			var that = page;
			if (app.globalData.components) {
				that[method](app.globalData.components, params);
			} else {
				app.methods.launchCallback = function(struct) {
					that[method](struct, params);
					app.methods.launchCallback = function(struct) {};
				}
			}
		},
		launchCallback(struct) { /*console.log(struct);*/ }
	},
	// 钩子列表
	hooks: {},
	/**
	 * 添加钩子
	 * @param hookid    钩子id
	 * @param callback  callback
	 */
	addHook(hookid, callback) {
		this.hooks[hookid] = callback || hookid;
		return true;
	},
	/**
	 * 执行钩子
	 * @param hookid    钩子id
	 * @param $page     页面对象
	 */
	runHook(hookid, $page) {
		let _run = this.hooks[hookid];
		if (_run && typeof _run == 'function' && $page) {
			_run.apply($page);
			delete this.hooks[hookid]; // 释放钩子
		}
	},
	onUpdate() {
		const updateManager = wx.getUpdateManager();
		updateManager.onCheckForUpdate(function(res) {
			if (res.hasUpdate) {
				wx.showLoading({
					title: '正在更新，请稍后..',
					mask: true
				});
			}
		});

		updateManager.onUpdateReady(function() {
			wx.hideLoading();
			wx.showModal({
				title: '更新提示',
				content: '新版本已经准备好，是否重启应用？',
				showCancel: false,
				success(res) {
					if (res.confirm) {
						updateManager.applyUpdate();
					}
				}
			});
		});

		updateManager.onUpdateFailed(function() {
			wx.hideLoading();
			wx.showModal({
				title: '更新提示',
				content: '更新失败！',
				showCancel: false,
				success(res) {
					if (res.confirm) {
						updateManager.applyUpdate();
					}
				}
			});
		});
	},
	onLaunch() {
		const that = this;
		_$system.default.attachInfo();
		that.onUpdate();
		that.globalData = wx.getStorageSync('__appGlobalData') || that.globalData;

	
		// // weapp_user login
		// _$session.default.weappLogin(that.globalData).then((res) => {
		//     return res;
		// }).then((res) => {
		//     // 获取首页结构
		//     return _$requset.default.get("home.getComponents", null, { "utoken": res.utoken }, {
		//         isLocalData: true, // 线上版本这里改成false
		//         isLocalStorage: true,
		//         returnCacheData: true
		//     });
		// }).then((struct) => {
		//     //设置首页界面
		//     if (struct.errcode === _$errcode.success) {
		//         that.globalData.components = struct.data;
		//         that.methods.launchCallback(that.globalData.components);
		//     } else {
		//         wx.showAlert({
		//             content: _$errcode.code["-3"].errmsg
		//         });
		//     }
		// });
	},
	/**
	 * 跳转到户授权登录
	 * @param   {String}    query     ?backMethod=取消后跳转的方式&backUrl=取消后跳转的路径
	 * @param   {Boolean}   relogin   是否重新授权
	 * @param   {String}    method    navigateTo|redirectTo
	 * @returns {String|Boolean}    曾经授权过将返回手机号码
	 */
	toAuthPage(query = "", relogin = false, isChange = false, method = "navigateTo") {
		let phone = this.globalData.userInfo.phone;
		if (phone == undefined || relogin == true) {
			// 跳转至授权登录页面
			wx[method]({
				url: `/pages/modules/user/login/login${query}`,
				events: {},
				success(res) {
					if (isChange) {
						res.eventChannel.emit('setPageConfig', {
							navTitle: "切换账号",
							promptMsg: "部分功能需要授权才能使用",
							authLoginBtn: "切换微信账号登录"
						});
					}
				}
			});

			return false;
		}

		return phone;
	},
	/**
	 * 切换小程序tab
	 * @param {string} url 
	 * @param {callback} success 
	 */
	switchTab(url, success) {
		wx.switchTab({
			url: url,
			success(e) {
				success && success();
			}
		});
	},
	/**
	 * 选择日历
	 * @param {strng} params 
	 */
	seletCalendar(params) {
		wx.navigateTo({
			url: '/pages/modules/common/v-calendar/v-calendar',
			success(res) {
				res.eventChannel.emit('setDate', params);
			}
		});
	},
	/**
	 * 是否已经授权登录
	 * @returns Boolean
	 */
	isAuthLogin() {
		return this.globalData.userInfo.phone ? true : false;
	},
	/**
	 * 获取上一页对象
	 * @param {*} size 
	 */
	prevPage(size = 2) {
		let pages = getCurrentPages();
		let pagesize = pages.length - size;
		if (pagesize >= 0) {
			return pages[pagesize];
		}
		return null;
	},
	/**
	 * 后退
	 * @param {object} params 
	 */
	backPage(params = {}) {
		wx.navigateBack(params);
	},
	/**
	 * 解析json
	 * @param {string} string 
	 */
	parseJson(string) {
		return JSON.parse(string);
	},
	/**
	 * 字符串转json
	 * @param {object} data 
	 */
	toJson(data) {
		return JSON.stringify(data);
	},
	/**
	 * 获取url参数
	 */
	getQueryString() {
		let _options = this.globalData.page_options;
		if (_options) {
			delete this.globalData.page_options;
			return _options;
		} else {
			return "";
		}
	},
	/**
	 * 设置url参数
	 * @param {string} url 
	 */
	setQueryString(url) {
		if (url.indexOf('?') != -1) {
			this.globalData.page_options = this.parseQueryString(url);
		}
	},
	/**
	 * 解析url参数
	 * @param {string} url 
	 */
	parseQueryString(url) {
		let json = {};
		let arr = url.substr(url.indexOf('?') + 1).split('&');
		arr.forEach(item => {
			let tmp = item.split('=');
			json[tmp[0]] = tmp[1];
		});
		return json;
	},
	/**
	 * 轻提示
	 * @param {*} msg 
	 */
	toast(msg) {
		wx.showToast({
			title: msg,
			icon: 'none',
			mask: true
		});
	},
	/**
	 * 完善提示
	 */
	developing() {
		this.toast('此功能正在完善');
	}
});
