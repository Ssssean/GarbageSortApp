const _$app = getApp();
const _$authJump = require("../../common/auth_jump");
const _$util = require("../../../../packages/utils/util");
const _$errcode = require("../../../../config/errcode");
const _$request = _$util._interopRequireDefault(require("../../../../packages/utils/request"));
const _$session = _$util._interopRequireDefault(require("../../../../packages/utils/session"));

const _$filter = require("../../common/filter");
const _$pageScroll = require("../../common/page_scroll");


const _$data = Object.assign({}, _$pageScroll.data, _$filter.data, _$authJump.data, {
    orderData: [], //存储订单数据
    page: 0, //分页
    //回到顶部
    isSticky: false,

    current: 0, //当前顶部导航栏状态值
    scrollTop: 0,

    //width: wx.WIN_WIDTH,

    //设置吸顶容器吸顶时距离顶部的距离
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,

    //设置swiper容器高度  重要
    WIN_HEIGHT: wx.DEFAULT_CONTENT_HEIGHT - wx.DEFAULT_HEADER_HEIGHT,
    //设置选中选项的样式
    activetabStyle: {
        'width': wx.WIN_WIDTH / 4 + 'px !important',
        'border-bottom': '3px solid #34be79',
        'color': '#34be79',
    },

    //设置每一小项的tab样式
    tabstyle: {
        'width': wx.WIN_WIDTH / 4 + 'px !important',
    },

    ClearStatus: 6, //取消预约的订单状态
    WaitStatus: 1, //等待预约
    StatusFail: 4, //预约失败
    usertype: '', //
    WaitPick: 2, //等待取件
    PickSuccess: 3, //完成取件
    Gostatus: false,

});



exports.default = Page(Object.assign({}, _$pageScroll.methods, _$filter.methods, _$authJump.methods, {

    /**
     * 页面的初始数据
     */
    data: _$data,
    navigateBack() {
        wx.navigateBack()
    },

    //监听滚动条滚动的事件
    onPageScroll(e) {
        //console.log(e);
        this.setData({ scrollTop: e.scrollTop, isSticky: e.scrollTop >= this.data.NAV_HEIGHT ? true : false });
    },

    //点击回到顶部的事件
    onScrollTop(e) {
        wx.pageScrollTo({ scrollTop: 0, duration: 300 });
    },

    //点击切换顶部状态
    handleChange(e) {
        let that = this;
        let current = that.data.current;
        if (e.detail.index !== this.options.status && e.detail.index !== current) { // this.data.current

            let index = e.detail.index;
            that.data.current = index;
            that.getOrderData({ page: 0 });
        }
    },

    // toAuthPage() {
    //     _$app.toAuthPage(`?backMethod=navigateBack&backUrl=${ "/" + this['route'] }`);
    // },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(e) {
        const that = this;
        //查看订单首次要授权，
        that.isAuthLogin(function() {});

        if (e.status != undefined) {
            that.setData({
                current: e.status,
            })
        }

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(e) {
        const that = this;
        _$session.default.isSession(_$app.globalData).then((res) => {
            let usertype = res.userInfo.usertype;
            that.setData({
                usertype: res.userInfo.usertype
            })
            that.reloadList({ page: 0 });
        });

    },


    //获取订单信息 index 获取哪种状态的数据
    reloadList(params) {
        const that = this;
        let index = that.data.current;
        if (that.isAuthShow()) {
            that.getOrderData(params);
        }

    },

    //获取订单列表数据
    getOrderData(params = {}) {
        let that = this;
        // 重新设置当前页
        if (params.page != undefined) {
            that.data.page = params.page;
            //that.data.orders.length = params.currentPage;
            that.data.orderData.splice(params.page);
            that.setData({ orderData: [] }); // 清空列表
        }

        let index = that.data.current;
        _$request.default.get("userljfl.order", `/page/${that.data.page}/status/${index}`, {}, {
            disabledLoadding: true,
            interceptCallback: that.getOrderData //拦截器
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                that.setData({
                    ['orderData[' + that.data.page + ']']: res.data
                });
                console.log(that.data.orderData, 666);
                ++that.data.page;
            }
        })
    },

    //取消预约的方法   等待预约 改变为 取消预约
    Clearstart(e) {
        let that = this;
        let orderid = e.target.dataset.id; //获取要修改的订单的id
        let status = e.target.dataset.status; //获取要修改的订单的id
        let page = e.target.dataset.page; //获取取消预约订单 所在的第几页
        let index = e.target.dataset.index; //获取取消预约订单所在的第几页下的第几条数据

        wx.showModal({
            title: '提示',
            content: '\u786e\u5b9a\u8981\u53d6\u6d88\u9884\u7ea6\u8ba2\u5355\u5417\uff1f',
            success(res) {
                if (res.confirm) {
                    that.updateOrderStatus(orderid, status, '', page, index);
                }
            }
        })


    },

    //修改订单状态的方法（统一方法）把当前订单的状态传到服务端  success只有点击预约成功时才会有值
    updateOrderStatus(orderid, status, success = '', page = "", index = "") {
        let that = this;
        _$request.default.get("userljfl.updateOrderStatus", `/orderid/${orderid}/status/${status}/success/${success}`, {}, {
            disabledLoadding: false,
            interceptCallback: that.updateOrderStatus //拦截器
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                //只修改当前需要取消预约订单的数据
                // orderData.page.index = res.data;
                that.setData({
                    ['orderData[' + page + '][' + index + ']']: res.data //只改变状态
                })
            }

            //如果服务端判断的当前订单的状态不是，
            if (_error.errcode == 2) {
                let errmess = res.errmsg;
                wx.showConfirm({
                    content: errmess,
                    showCancel: false,
                    confirmColor: '#ff0000',
                    success: function success(res) {}
                });
                return;
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },



    // 员工端 的预约失败，需要跳到填写失败原因的页面
    GoWaiError(e) {
        let orderid = e.target.dataset.id;
        let status = e.target.dataset.status;
        let order = JSON.stringify({
                orderid: orderid,
                status: status,
            })
            //跳转到  提交填写订单预约失败的原因 页面
        wx.navigateTo({
            url: "/pages/modules/user_ljfl/order/submitOrderfail/submitOrderfail?order=" + order,
        })
    },

    //客户端 跳转到订单预约失败后的 修改订单信息页面
    GoeditOrder(e) {
        let orderid = e.target.dataset.id;
        wx.navigateTo({
            url: "/pages/modules/reserve/reserve?orderid=" + orderid,
            success(res) {
                res.eventChannel.emit('reloadAddress');
            }
        })
    },

    //客户端 再次预约的方法 预约失败 改变为 等待预约
    Gotwo(e) {
        let that = this;
        let orderid = e.target.dataset.id;
        let status = e.target.dataset.status;
        let page = e.target.dataset.page; //获取当前订单所在的第几页
        let index = e.target.dataset.index; //获取当前订单所在的下标
        wx.showModal({
            title: '提示',
            content: '\u8bf7\u67e5\u770b\u597d\u8ba2\u5355\u4fe1\u606f\uff0c\u786e\u5b9a\u8981\u518d\u6b21\u9884\u7ea6\u5417\uff1f',
            success(res) {
                if (res.confirm) {
                    that.updateOrderStatus(orderid, status, '', page, index);
                }
            }
        })

    },

    // 员工端  预约成功的方法  等待预约 改变为 等待取件
    GoWaitSuccess(e) {
        let that = this;
        let orderid = e.target.dataset.id;
        let status = e.target.dataset.status;
        let page = e.target.dataset.page; //获取当前订单所在的第几页
        let index = e.target.dataset.index; //获取当前订单所在的下标
        let success = 1; //预约成功的标识
        wx.showModal({
            title: '提示',
            content: '\u9884\u7ea6\u6210\u529f\u540e\u4f1a\u53d8\u6210\u7b49\u5f85\u53d6\u4ef6\uff0c\u786e\u5b9a\u8981\u66f4\u6539\u5417?',
            success(res) {
                if (res.confirm) {
                    that.updateOrderStatus(orderid, status, success, page, index);
                }
            }
        })

    },

    //员工端 完成取件
    GoPickSuccess(e) {
        let that = this;
        let orderid = e.target.dataset.id;
        let status = e.target.dataset.status;

        let order = JSON.stringify({
            orderid: orderid,
            status: status,
        })

        wx.navigateTo({
            url: "/pages/modules/user_ljfl/order/orderPickSuccess/orderPickSuccess?order=" + order,
        })
    },

    //拨打电话
    Gophone() {
        wx.showModal({
            title: '提示',
            content: '\u786e\u5b9a\u8981\u62e8\u6253\u5ba2\u670d\u7535\u8bdd\u5417?',
            success(res) {
                if (res.confirm) {
                    wx.makePhoneCall({
                        phoneNumber: '18020543213',
                    })
                }
            }
        })

    },

}));