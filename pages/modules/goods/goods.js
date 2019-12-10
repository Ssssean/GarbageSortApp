// +----------------------------------------------------------------------
// | Sdoushi Weapp Goods.js
// +----------------------------------------------------------------------
// | Copyright (c) 2010-2019 http://www.sdoushi.com All rights reserved.
// +----------------------------------------------------------------------
// | Create: 2019/7/23
// +----------------------------------------------------------------------
// | Todos: 加入收藏、打开客服
// +----------------------------------------------------------------------
// | Author: sound-horizon <sound-horizon@foxmail.com>
// +----------------------------------------------------------------------
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _$app = getApp();
const _$config = require("../../../config/config");
const _$errcode = require("../../../config/errcode");
const _$util = require("../../../packages/utils/util");
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));
const _$session = _$util._interopRequireDefault(require("../../../packages/utils/session"));

exports.default = Page({
    data: {
        isSticky: false,
        //----------------------------------------------
        isWhiteNavbar: false,
        backClass: "goods-back", // 切换后退的样式
        showTabs: false, // 切换是否显示tabs
        tabIndex: 0, // 当前tab项
        tabOpacity: 0, // 切换tabs是否透明
        srcollTop: 0, // 图片容器的marign-top，滚动时有效
        inkBarStyle: { // tabs样式
            'border-bottom': '2px solid #2d8cf0',
            'width': '50%',
            'top': '-4px'
        },
        cartStyle: {
            'position': 'absolute',
            'top': '14rpx',
            'font-size': '22rpx',
            'color': '#fff',
            'background-color': '#EF3935'
        },
        tabStyle: { // tab样式
            //'color': '#000'
        },
        // 默认导航条样式
        navBarStyle: {
            backgroundColor: 'rgba(255,255,255,.0)'
        },
        // 页面内容
        contentHeight: wx.DEFAULT_CONTENT_HEIGHT,
        // tabs的宽度
        tabsWidth: wx.WIN_WIDTH - 160,
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 100,
        _a_nav_height: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 100,
        _b_nav_height: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,

        //解决编辑器上弹页面的问题、直接给编辑器设置只读则setContents无效
        srcollViewTop: 0,
        viewOpacity: 'hidden',
        __applyReadOnly: false,
        __fileReadOnly: false,
        editor_fileReadOnly: false,
        editor_serviceReadOnly: false,
        editor_applyReadOnly: false,
        //----------------------------------------------
        client_pay_status: false,
        is_favicon: 0, //是否收藏
        is_popupShow: false, // 是否弹出框体
        is_showBuyBtn: false, // 是否显示购买按钮 false-显示加入购物车，true-显示购买
        shopNum: 0, // 购物车数量
        iphonex: false, // 是否是ipx
        goodsDetail: {}, // 商品明细
        buyNumber: 1, // 购买的数量
        itemNum: 10, // 小项数量
        //---------------------------------------------
        serviceImages: [], // 服务流程内的图片
        tax_rate: 0, // 税率
        tax_vrate: "", // 展示税率
    },
    /**
     * Page.onLoad
     * @param {getObject} query 
     */
    onLoad(query) {
        //const that = this;
        // let params = {
        //     domain: _$app.domain,
        //     isAuthLogin: _$app.isAuthLogin()
        // };
        // if (wx.IPHONEX == 0) {
        //     params.iphonex = true;
        // }
        //that.setData(params);
        // _$app.methods.init(_$app, this, "getShopInfo", query);
		wx.showShareMenu({ withShareTicket: true });
    },
    /**
     * 统一管理视图中的editor
     */
    _editors: [],
    _pageEditorNum: 5,
    onEditors(e) {
        const that = this;
        //const { currentTarget = {} } = e;
        that._editors.push(e);
        if (that._editors.length === that._pageEditorNum) {
            //_$app.methods.init(_$app, this, "getShopInfo", this.options);
            _$session.default.isSession(_$app.globalData).then((res) => {
                that.getShopInfo();
            });
        }
    },
    /**
     * 禁止用户滑动
     */
    onStopTouchMove() {
        return false;
    },
    /**
     * 编辑器加载完成
     * @param {EventTarget} e 
     */
    _editorCtx: {},
    onEditorReady(data) {
        const that = this;
        if (typeof data == 'object') {
            that._editors.forEach((item) => {
                let _target = item.currentTarget;

                let { dataset = {} } = _target;
                let _editorCtx = that._editorCtx[_target.id];
                if (_editorCtx && _editorCtx.inited) {
                    return;
                }
                wx.createSelectorQuery().select(`#${_target.id}`).context(function(editor) {
                    // 是否自动渲染
                    if (dataset.autoLoad) {
                        // todo 当编辑器 ReadOnly 设置true时，setContents将失效
                        editor.context.setContents({
                            html: data[dataset.id],
                            success() {
                                let _data = { viewOpacity: "visible", srcollViewTop: 0 };
                                _data[`${_target.id}ReadOnly`] = true;
                                that.setData(_data);
                            }
                        });
                        // 切换tab时渲染    
                    } else {
                        that._editorCtx[_target.id] = {
                            context: editor.context,
                            inited: true,
                            seted: false
                        };
                    }
                }).exec();
            });
            that._editors.length = 0;
        }
    },
    onScrollTop() {
        this.setData({
            srcollViewTop: 0
        });
    },
    /**
     * 滚动效果
     * @param {EventTarget} t 
     */
    bindScroll(t) {
        let _t = t.detail;
        let _setNavigationBarColor = null;
        let _setData = null;
        let _num = 0.0060240963855422;
        if (_t.scrollTop >= this.data._a_nav_height) {

            if (this.data.isWhiteNavbar == false) {
                _setData = {
                    showTabs: true,
                    isSticky: true,
                    tabOpacity: 1,
                    srcollTop: 0,
                    backClass: "",
                    navBarStyle: {
                        backgroundColor: 'rgba(255,255,255,1)'
                    },
                    NAV_HEIGHT: this.data._b_nav_height
                };
                _setNavigationBarColor = { frontColor: '#000000', backgroundColor: '#ffffff' };
                this.data.isWhiteNavbar = true;
            }

        } else {
            _setData = {
                showTabs: false,
                isSticky: false,
                srcollTop: -_t.scrollTop,
                tabOpacity: _t.scrollTop * _num,
                backClass: "goods-back",
                navBarStyle: {
                    backgroundColor: `rgba(255,255,255,${ _t.scrollTop * _num})`
                },
                NAV_HEIGHT: this.data._a_nav_height
            };
            _setNavigationBarColor = { frontColor: '#ffffff', backgroundColor: '#ffffff' };
            this.data.isWhiteNavbar = false;
        }

        if (_setData != null) {
            //console.log(`setNavigationBarColor: ${_setData.showTabs}`);
            this.setData(_setData);
            wx.setNavigationBarColor(_setNavigationBarColor);
        }
    },
    /**
     * 获取商品信息
     */
    getShopInfo() {
        const that = this;
        const query = this.options;

        let params = {
            domain: _$app.domain,
            isAuthLogin: _$app.isAuthLogin()
        };

        if (wx.IPHONEX == 0) {
            params.iphonex = true;
        }

        _$request.default.get("shop.getShopInfo", `/shopid/${query.shop_id}`, {}, {
            disabledLoadding: true,
            interceptCallback: that.getShopInfo
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {

                if (res.data.service) {
                    let _regexp = /<img(.*?)src="(.*?)"(.*?)>/g;
                    // 替换编辑器内部的图片
                    //res.data.service = res.data.service.replace(_regexp, `<img src="${_$config.host}$2" class="editor-img" />`);

                    // 提取编辑器内部图片到image标签
                    let regResult = res.data.service.match_all(_regexp);
                    let serviceImages = [];
                    regResult.forEach((image) => {
                        if (image[2]) {
                            serviceImages.push(image[2].indexOf("http") == -1 ? `${_$config.host + image[2]}` : image[2]);
                        }
                    });
                    res.data.service = res.data.service.replace(_regexp, "");
                    that.setData({ serviceImages: serviceImages });
                }

                //that.data.tax_rate = res.extract.tax_rate;
                //that.data.tax_vrate = res.extract.tax_rate_view;

                params = Object.assign(params, {
                    shopNum: res.extract.num || false,
                    client_pay_status: res.extract.client_pay_status,
                    goodsDetail: res.data
                });

                that.setData(params);

                //console.log(that.data);

                return res.data;
            }
        }).then((data) => {
            that.onEditorReady(data);
        });
    },
    /**
     * 改变购买数量
     * @param {EventTarget.detail} detail 
     */
    changeBuyNumber({ detail }) {
        this.setData({
            buyNumber: detail.value
        })
    },
    changeItemNumber({ detail }) {
        this.setData({
            itemNum: detail.value
        })
    },
    /**
     * 是否关闭popup
     */
    closePopup() {
        this.setData({
            is_popupShow: false
        });
    },
    /**
     * 添加购物车与支付之前的操作
     * @param   {Boolean} is
     * @returns {Int}     phone
     */
    beforeTo(is) {
        let phone = this.authLogin();
        if (phone) {
            this.setData({
                buyNumber: 1,
                is_showBuyBtn: is,
                is_popupShow: true
            });
        }
        return phone;
    },
    /**
     * 添加到购物车
     * @param {EventTarget} e 
     */
    toAddShopCar(e) {
        this.beforeTo(false);
    },
    /**
     * 立即购买
     * @param {EventTarget} e 
     */
    tobuy(e) {
        this.beforeTo(true);
    },
    /**
     * 加入购物车
     * @param {EventTarget} e 
     */
    addShopCar(e) {
        const that = this;
        let _data = that.data;

        _$request.default.get("cart.addCart", `/shop_id/${_data.goodsDetail.id}/cart_nums/${_data.buyNumber}${_data.goodsDetail.is_xiaoxiang == 1 ? "/xx_num/" + _data.itemNum : ""}`).then((res) => {
            let _error = _$errcode.get(res);
            let _toast = { mask: true };
            if (_error.errcode == _$errcode.success) {
                _toast.title = "已加入购物车";
            } else {
                _toast.icon = 'none';
                _toast.title = "加入购物车失败";
            }
            _toast.success = () => {
                that.setData({
                    is_popupShow: false,
                    shopNum: res.data.num
                });
            }
            wx.showToast(_toast);
        });
    },
    /**
     * 立即购买
     * @param {EventTarget} e 
     */
    buyNow(e) {
        const that = this;
        let _data = that.data;
        _$request.default.get("userOrder.getPayPrices", `/str_shop_ids/${_data.goodsDetail.id}-${_data.itemNum}-${_data.buyNumber}`).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                that.closePopup();
                wx['navigateTo']({
                    url: "/pages/modules/shopcart/confirmOrder",
                    success(page) {
                        let goods = {};
                        goods[res.data.goods.checkbox] = res.data.goods;
                        page.eventChannel.emit('myGoods', {
                            order_type: 1,
                            tax_rate: res.extract.tax_rate, // 税率
                            tax_rate_view: res.extract.tax_rate_view, // 显示百分比税率
                            goods: goods,
                            carts: {
                                checkedCarts: `${_data.goodsDetail.id}-${_data.itemNum}-${_data.buyNumber}`,
                                checkedNum: 1,
                                checkedStatus: `${_data.goodsDetail.id}-1`
                            },
                            total_num: 1,
                            total_price: res.data.total_price,
                            total_yuan_price: res.data.total_yuan_price
                        });
                    }
                });
            } else {
                wx.showToast({
                    icon: "none",
                    mask: true,
                    title: _error.errmsg
                });
            }
        });
    },
    /**
     * 跳转到购物车
     * @param {EventTarget} e 
     */
    goShopCar(e) {
        wx.navigateTo({
            url: "/pages/modules/shopcart/shopcart"
        });
    },
    /**
     * 切换tab
     * @param {EventTarget} e 
     */
    tabChange(e) {
        let _params = {
            tabIndex: e.detail.index
        }
        _params.isSticky = e.detail.index > 0 ? false : true;

        this.setData(_params);
    },
    /**
     * 切换tab内容
     * @param {EventTarget} e 
     */
    tabContentChange(e) {
        const that = this;
        const _detail = e.detail;
        const _currentItemId = `editor_${_detail.currentItemId}`;
        that.setData({ tabIndex: _detail.current });

        let _editorCtx = that._editorCtx[_currentItemId];
        if (_editorCtx && _editorCtx.seted == false) {
            let _data = {};
            _data[`${_currentItemId}ReadOnly`] = true;
            that._editorCtx[_currentItemId].context.setContents({
                html: that.data.goodsDetail[_detail.currentItemId]
            });
            _editorCtx.seted = true;
            that.setData(_data);
        }

    },
    /**
     * 预览图片
     * @param {EventTarget} e 
     */
    previewqrTap(e) {
        wx.previewImage({
            urls: [e.currentTarget.dataset.img]
        });
    },
    /**
     * 授权登录
     */
    authLogin() {
        return _$app.toAuthPage(`?backMethod=navigateBack&backUrl=${ _$util.route(this) }`);
    },
    /**
     * 添加收藏
     * @param {EventTarget} e 
     */
    addfav(e) {

    },
    /**
     * 移除收藏
     * @param {EventTarget} e 
     */
    delfav(e) {

    }
});