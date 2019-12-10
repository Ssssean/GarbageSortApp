"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

//--------基础组件-------
const _$app = getApp();
const _$util = require("../../../packages/utils/util");
const _$errcode = require("../../../config/errcode");
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));
const _$session = _$util._interopRequireDefault(require("../../../packages/utils/session"));

//--------公共组件-------

const _$filter = require("../common/filter");
const _$authJump = require("../common/auth_jump");
const _$searchBar = require("../common/search_bar");
const _$pageScroll = require("../common/page_scroll");
const _$imageError = require("../common/image_error");

const _$data = Object.assign({}, _$pageScroll.data, _$filter.data, _$authJump.data, {
    // 订单标签
    orderTags: [{
        name: "全部",
        id: 0,
        count: 0
    }, {
        name: "紧急",
        id: 1,
        count: 0
    }, {
        name: "待缴费",
        id: 3,
        count: 0
    }, {
        name: "其他",
        id: 2,
        count: 0
    }],
    // 订单大类
    orderType: {
        '0': '全部',
        '58': '国内商标',
        '60': '国内专利',
        '59': '国际商标',
        '62': '国际专利',
        '63': '版权服务',
    },
    // 筛选条件
    navList: [{
        name: '订单类型',
        active: '',
        type: "menu",
        icon: 'slide_down',
        id: 0
    }, {
        name: '订单状态',
        active: '',
        type: "menu",
        icon: 'slide_down',
        id: 1
    }, {
        name: '筛 选',
        type: "menu",
        icon: 'slide_down',
        dot: false,
        id: 2
    }],
    //-----------------------------------------------
    // navList[key] => pop_key
    pop_0: false, // 订单类型
    pop_1: false, // 订单状态
    pop_2: false,
    orderBuffer: 0,
    customStyle: {
        'background-color': '#eee',
        'height': '96px'
            //,'line-height': '46px'
    },
    orderTagsStyle: {
        'height': '46px',
        'line-height': '46px'
    },
    popup_NAV_HEIGHT: 0,
    _popup_NAV_HEIGHT: 0,
    popupHeight: 0,
    scroHeight: parseInt(wx.DEFAULT_CONTENT_HEIGHT * 0.8),
    //--------------------------------------------------
    orders: [],
    statusList: [], // 状态列表
    noOrder: true, // 暂无订单
    currentPage: 0, //当前页数
    backAutoLoad: false, // 后退后禁止刷新
    //--------------------------------------------------
    // 订单列表筛选条件
    offset: 0, // 偏移值
    orderLabel: 0, // 当前标签
    content: "", // 关键字
    contract_id: "", // 订单编号
    start_time: "", // 开始日期
    end_time: "", // 结束日期
    leixing: "", // 类型
    shenqinghao: "", // 申请号
    status: [], // 选中的状态列表
    statusText: [],
    shop_type: []
});

exports.default = Page(Object.assign({}, _$searchBar.methods, _$pageScroll.methods, _$imageError.methods, _$filter.methods, _$authJump.methods, {
    data: _$data,
    onLoad() {
        const that = this;
        let _data = this.data;
        _data.popup_NAV_HEIGHT = _data._popup_NAV_HEIGHT = _data.NAV_HEIGHT + 134;
        _data.popupHeight = wx.WIN_HEIGHT - _data.popup_NAV_HEIGHT;

        let _params = { popup_NAV_HEIGHT: _data.popup_NAV_HEIGHT, popupHeight: _data.popupHeight };
        that.setData(_params);

        // 处理首次授权才加载
        if (that.isAuthLogin(function() { that.getStatusList() && that.reloadList(); })) {
            that.getStatusList();
        }

    },
    onShow(query) {
        const that = this;
        if (that.data.backAutoLoad) {
            that.setData({ orderBuffer: 1 });
            that.data.backAutoLoad = false;
            return;
        }
        //_$app.methods.init(_$app, this, "reloadList");

        _$session.default.isSession(_$app.globalData).then(() => {
            let _call = that.reloadList();
            if (_call) {
                _call.then((res) => {
                    that.setData({ orderBuffer: 1 });
                });
            }
        });
    },
    onHide() {
        this.setData({ orderBuffer: 0 });
        //wx.pageScrollTo({ scrollTop: 0, duration: 0 });
    },
    /**
     * 进入页面搜索，防止刷新页面
     */
    tapSearchBefore() {
        this.data.backAutoLoad = true;
    },
    /**
     * 重载列表
     */
    reloadList() {
        // 处理首次授权，才加载
        if (this.isAuthShow()) {
            return this.getList({ currentPage: 0, orderLabel: this.data.orderLabel, offset: 0 });
        }
    },
    /**
     * 获取状态列表
     */
    getStatusList() {
        const that = this;
        _$request.default.get("userOrder.statusList", "/type/1", {}, {
            disabledLoadding: true,
            interceptCallback: that.getStatusList
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                that.setData({
                    statusList: res.data
                });
            }
        });
    },
    getOrderTypeValue({ value, index }) {
        value = value.join();
        index = index.join();
        return index == 0 ? "订单类型" : value;
    },
    /**
     * 订单类型筛选改变
     * @param {*} param0 
     */
    onOrderTypeChange({ detail }) {
        if (detail.index) {
            let popId = this._currentPopup.popId;
            this.data.shop_type = detail.index;

            this.setData({
                [`navList[${popId}].count`]: 1,
                [`navList[${popId}].name`]: this.getOrderTypeValue(detail)
            });

            this.reloadList();
            this.closePopup();
        }
    },
    /**
     * 状态筛选改变
     * @param {*} param0 
     */
    onStatusChange({ detail }) {
        if (detail.index) {
            this.data.status = detail.index;
            this.data.statusText = detail.value;
        }
    },
    /**
     * 重置状态筛选
     * @param {*} param0 
     */
    onStatusReset({ currentTarget }) {
        let { dataset } = currentTarget;
        this.data.status.length = 0;
        this.data.statusText.length = 0;
        this.setData({
            status: this.data.status,
            [`navList[${dataset.idx}].count`]: "",
            [`navList[${dataset.idx}].name`]: this.getStatusValue()
        });
        this.reloadList();
        this.closePopup();
    },
    /**
     * 提交状态筛选
     * @param {*} param0 
     */
    getStatusValue() {
        let _statusText = this.data.statusText;
        return _statusText.length > 0 ? _statusText.join("、") : "订单状态";
    },
    onStatusFilter({ currentTarget }) {
        let { dataset } = currentTarget;
        this.setData({
            [`navList[${dataset.idx}].name`]: this.getStatusValue(),
            [`navList[${dataset.idx}].count`]: this.data.status.length
        });

        this.reloadList();
        this.closePopup();
    },
    /**
     * 获取订单列表
     */
    getList(params = {}) {
        // 检测是否登录
        const that = this;
        let _params = {};
        // 重新设置当前页
        if (params.currentPage != undefined) {
            that.data.currentPage = params.currentPage;
            //that.data.orders.length = params.currentPage;
            that.data.orders.splice(params.currentPage);
            that.setData({ orders: [] }); // 清空列表
        }

        // 重新设置偏移值
        if (params.offset != undefined) {
            that.data.offset = params.offset;
        }

        return _$request.default.get("userOrder.list", that.getFilterCondition(), {}, {
            disabledLoadding: true,
            interceptCallback: that.getList
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                // 订单标签
                if (params.orderLabel) {
                    _params['orderLabel'] = params.orderLabel;
                }
                _params['domain'] = _$app.domain;
                _params['noOrder'] = false;
                _params['offset'] = res.extract.offset;
                // 高效分页
                //console.log(`orders[${that.data.currentPage}]`);
                _params[`orders[${that.data.currentPage}]`] = res.data;

                that.setData(_params);
                ++that.data.currentPage; // 更新页

            } else if (params.isMore != true) {
                that.setData({ noOrder: true });
            } else {
                _$app.toast("没有更多了..");
            }
        });
    },
    /**
     * 改变标签
     * @param {event.detail} param0 
     */
    orderTagChange({ detail }) {
        const that = this;
        //that.data.orderLabel = detail.key; // 预先更新标签
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300,
            success() {
                that.setData({ orderLabel: detail.key });
                that.reloadList(); // 重载列表
            }
        });
    },
    /**
     * 打开条件弹出框
     * @param {*} e 
     */
    _currentPopup: null,
    openPopup({ currentTarget }) {
        const that = this;

        if (!that.isAuthShow()) {
            return;
        }

        let { dataset } = currentTarget;
        let _params = {};

        if (that._currentPopup != null) {
            let _idx = that._currentPopup.popId;
            delete that._currentPopup.popId;
            that.setData(that._currentPopup);
            if (_idx == dataset.idx) {
                return;
            }
        }

        switch (dataset.idx) {
            case 0:
                break;
            case 1:
                if (that.data.statusList.length == 0) {
                    _$app.toast('暂无订单..');
                    return;
                }
                break;
            default:
                break;
        }

        _params[`pop_${dataset.idx}`] = true;
        _params['popup_NAV_HEIGHT'] = that.data._popup_NAV_HEIGHT + (that.data.isSticky ? -38 : 0);

        // 保存当前弹出框
        that._currentPopup = {
            popId: dataset.idx,
            [`pop_${dataset.idx}`]: false
        };

        that.setData(_params);
    },
    closePopup() {
        if (this._currentPopup) {
            this.setData({
                [`pop_${this._currentPopup.popId}`]: false
            });
        }
    },
    /**
     * 隐藏弹出框
     * @param {*} e 
     */
    onPopupHidden(e) {
        this._currentPopup = null;
    },
    /**
     * 选择日期
     * @param {*} param0 currentTarget, deital
     */
    onSeletDate({ currentTarget, deital }) {
        let _data = this.data;
        _data.backAutoLoad = true;

        if (_data.start_time == "" || _data.end_time == "") {
            let _start = new Date();
            let _end = new Date();
            _start.setDate(1);

            _data.start_time = _start.format("yyyy/MM/dd");
            _data.end_time = _end.format("yyyy/MM/dd");
        }

        _$app.seletCalendar([_data.start_time, _data.end_time]);
    },
    onInput({ detail, currentTarget }) {
        let { dataset } = currentTarget;
        this.setData({
            [dataset.key]: detail.detail.value
        });
    },
    onFormReset({ currentTarget }) {
        let { dataset } = currentTarget;
        this.setData({
            contract_id: "",
            start_time: "",
            end_time: "",
            leixing: "",
            [`navList[${dataset.idx}].count`]: ""
        });
        this.reloadList();
        this.closePopup();
    },
    onFormFilter({ currentTarget }) {
        let { dataset } = currentTarget;
        if (this.isInFilter()) {
            this.reloadList();
            this.setData({
                [`navList[${dataset.idx}].count`]: 1
            });
        }
        this.closePopup();
    },
    /**
     * 是否存在筛选条件
     */
    isInFilter() {
        let data = this.data;
        return data.start_time || data.end_time || data.leixing || data.contract_id || data.shenqinghao || data.content
    },
    /**
     * 进入订单明细
     * @param {event.currentTarget} param0 
     */
    enterDetail({ currentTarget }) {
        let { dataset } = currentTarget;
        this.data.backAutoLoad = true;
        wx.navigateTo({
            url: `/pages/modules/order/orderDetail?oid=${dataset.item.order_id}`,
            success(res) {

            }
        });
    }
}));