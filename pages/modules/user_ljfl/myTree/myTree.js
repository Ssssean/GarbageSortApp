"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _$app = getApp();
const _$util = require("../../../../packages/utils/util");
const _$errcode = require("../../../../config/errcode");
const _$session = _$util._interopRequireDefault(require("../../../../packages/utils/session"));
const _$request = _$util._interopRequireDefault(require("../../../../packages/utils/request"));
const _$pageScroll = require("../../common/page_scroll");
const _$filter = require("../../common/filter");
const _$authJump = require("../../common/auth_jump");


const _$data = Object.assign({}, _$pageScroll.data, _$filter.data, _$authJump.data, {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
    appName: '我的环保树',
    width: wx.WIN_WIDTH,
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
    page: 0,
    current: 0, //选项卡当前选中的一项
    usertype: '',
    scrollTop: 0,

    //设置选中选项的样式
    activetabStyle: {
        'width': wx.WIN_WIDTH / 2 + 'px !important',
        'border-bottom': '3px solid #34be79',
        'color': '#34be79',
    },

    //设置每一小项的tab样式
    tabstyle: {
        'width': wx.WIN_WIDTH / 2 + 'px !important',
    },
    mytreeData: [],

    DuihuanSuccess: 2, //员工端 兑换完成的状态
    userUsed: 1, //用户端 已使用
    useAcquired: 0, //用户端 已获取
    selectStatus: 0, //选择的顶部选项卡的下标
    //回到顶部
    isSticky: false,

});

exports.default = Page(Object.assign({}, _$pageScroll.methods, _$filter.methods, _$authJump.methods, {
    data: _$data,
    onLoad: function(e) {
        const that = this;

        //查看订单首次要授权，
        that.isAuthLogin(function() {});

        //加载数据
        if (e.status != undefined) {
            that.setData({
                current: e.status
            })
        }
    },

    onShow: function(e) {
        let that = this;
        _$session.default.isSession(_$app.globalData).then((res) => {
            //获取用户角色
            let usertype = res.userInfo.usertype;
            if (usertype == 'e') {
                that.setData({
                    'activetabStyle.width': that.data.width / 3 + 'px !important',
                    'tabstyle.width': that.data.width / 3 + 'px !important',
                    appName: '环保树订单',
                })
            }
            that.setData({
                usertype: res.userInfo.usertype
            })

            that.getMytreeData();
        });
    },

    handleChange(e) {
        let that = this;
        let current = that.data.current;
        if (e.detail.index !== this.options.status && e.detail.index !== current) { // this.data.current
            let index = e.detail.index;
            that.data.current = index;
            that.getMytreeData({ page: 0 });
        }

    },

    //获取我的环保树订单
    getMytreeData(params = {}) {
        let that = this;
        // 重新设置当前页
        if (params.page != undefined) {
            that.data.page = params.page;
            that.data.mytreeData.splice(params.page);
            that.setData({ mytreeData: [] }); // 清空列表
        }

        let index = that.data.current;
        _$request.default.get("userljfl.getMytreeData", `/page/${that.data.page}/status/${index}`, {}, {
            disabledLoadding: true,
            interceptCallback: that.getMytreeData //拦截器
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                that.setData({
                    ['mytreeData[' + that.data.page + ']']: res.data,
                    selectStatus: index
                });
                console.log(that.data.mytreeData);
                ++that.data.page;
            }
        })

    },


    navigateBack() {
        wx.navigateBack()
    },

    dealOrder() {
        wx.navigateTo({
            url: `/pages/modules/common/myTree/dealOrder/dealOrder`
        });
    },

    GochangeShop(e) {
        let id = e.target.dataset.id;
        wx.navigateTo({
            url: `/pages/modules/user_ljfl/myTree/dealOrder/dealOrder?id=` + id
        });
    }
}))