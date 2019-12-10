"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _$app = getApp();
const _$util = require("../../../packages/utils/util");
const _$session = _$util._interopRequireDefault(require("../../../packages/utils/session"));

exports.default = Page({
    data: {
        userName: "",
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + "px",

        myorderStatus: [
            { content: '等待预约', type: 'time', status: 1 },
            { content: '等待取件', type: 'publishgoods_fill', status: 2 },
            { content: '完成取件', type: 'tasklist_fill', status: 3 }
        ],

        userorder_data: [
            { icontype: 'shop_fill', iconcolor: '#00afec', text: '我的环保树', isGo: true, bindtap: 'Gotree' },
            { icontype: 'homepage_fill', iconcolor: '#00a161', text: '我的地址', isGo: true, bindtap: 'Goaddress' },
            { icontype: 'customerservice_fill', iconcolor: '#ed6c00', text: '在线客服', isGo: true, bindtap: 'kefu' },
            { icontype: 'prompt_fill', iconcolor: '#ff0000', text: '退出登录', isGo: false, bindtap: 'outlogin' },
        ],

        usertype: '',

    },

    onLoad() {
        let that = this;
        _$session.default.isSession(_$app.globalData).then((res) => {
            let usertype = res.userInfo.usertype;
            that.setData({
                usertype: usertype
            })

            if (usertype == 'e') {
                let text = '环保树订单';
                that.setData({
                    'userorder_data[0].text': text
                })
            }
        });
    },

    outlogin() {
        wx.showModal({
            title: '提示',
            content: '确定要退出登录吗？',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },

    //跳转到查看全部订单页面
    LookAllorder() {
        wx.navigateTo({
            url: "/pages/modules/user_ljfl/order/order",
        })
    },

    //我的环保树
    Gotree() {
        wx.navigateTo({
            url: '/pages/modules/user_ljfl/myTree/myTree'
        })
    },

    //我的地址
    Goaddress() {
        wx.navigateTo({
            url: "/pages/modules/reserve/address/address"
        })
    },

    //根据状态不同 都跳转到订单对应状态的页面
    GoOrderStatus(e) {
        // console.log(e);
        let status = e.currentTarget.dataset.status;
        wx.navigateTo({
            url: "/pages/modules/user_ljfl/order/order?status=" + status,
        })
    },
});