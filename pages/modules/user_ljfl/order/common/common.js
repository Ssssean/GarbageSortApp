const _$app = getApp();
const _$util = require("../../../../../packages/utils/util");
const _$errcode = require("../../../../../config/errcode");
const _$request = _$util._interopRequireDefault(require("../../../../../packages/utils/request"));

Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderid: '', //订单id
        title: '', //顶部导航栏的内容
        failmess: '', //提交的失败的原因
        status: '', //等待预约的状态
        //设置吸顶容器吸顶时距离顶部的距离
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(e) {
        let that = this;
        //获取预约失败的orderid
        let idtitle = JSON.parse(e.idtitle);
        let orderid = idtitle.orderid;
        let title = idtitle.title;
        let status = idtitle.status;
        that.setData({
            orderid: orderid,
            title: title,
            status: status,
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(e) {

    },

    //监听员工输入的内容
    Failmess(e) {
        let that = this;
        that.setData({
            failmess: e.detail.value,
        });
    },

    //监听提交失败的内容
    WaitFailSubmit() {
        let that = this;
        let orderid = that.data.orderid;
        let shopfail = that.data.failmess;
        let status = that.data.status;

        if (shopfail == "") {
            wx.showConfirm({
                content: "\u5931\u8d25\u5185\u5bb9\u4e0d\u80fd\u4e3a\u7a7a",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        }

        _$request.default.post("userljfl.orderWaitFail", null, {
            orderid: orderid,
            shopfail: shopfail,
            status: status,
        }).then((res) => {
            // console.log(res);
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000
                })
                wx.navigateBack()
            }
        });

    },
})