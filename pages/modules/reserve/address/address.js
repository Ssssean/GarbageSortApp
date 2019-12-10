const pages = getCurrentPages();
const currPage = pages[pages.length - 1]; //当前页面
const prevPage = pages[pages.length - 2]; //上一个页面

const _$app = getApp();
const _$util = require("../../../../packages/utils/util");
const _$errcode = require("../../../../config/errcode");
const _$request = _$util._interopRequireDefault(require("../../../../packages/utils/request"));
const _$session = _$util._interopRequireDefault(require("../../../../packages/utils/session"));

Page({

    /**
     * 页面的初始数据
     */
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        addressData: [], //存储用户地址
        status: 0, //用户默认选中的
        orderid: '', //订单的id
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(e) {
        let that = this;

        if (e && e.order != undefined) {
            let order = JSON.parse(e.order);
            let orderid = order.orderid;
            let addressid = order.addressid;
            that.setData({
                orderid: orderid,
                //     status: addressid
            })
        }
    },

    //获取用户的地址
    getUserAddress() {
        let that = this;
        let orderid = that.data.orderid;
        _$request.default.get("reserve.getUserAddress", null, {}, {
            disabledLoadding: false,
            interceptCallback: that.getUserAddress //拦截器
        }).then((res) => {
            // console.log(res);
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {

                that.setData({
                    addressData: res.data,
                    status: res.extract.statusid //赋值默认选中的
                })





            }
        })
    },

    //跳转到新增地址页面
    Goaddress() {
        wx.navigateTo({
            url: "/pages/modules/reserve/address/add/add",
        })
    },

    //点击单选按钮
    radio: function(e) {
        let that = this;
        let all = e.currentTarget.dataset.all

        that.setData({
            status: all.id
        })

        //如果没有订单的id,改变用户的默认地址，否则改变订单的默认地址
        let orderid = that.data.orderid,
            result;
        if (orderid == '') {
            result = that.setUserAddress(all.id);
        } else {
            result = that.setOrderAddress(all.id, orderid);
        }


        let pages = getCurrentPages(); //获取路由栈
        pages = pages[pages.length - 2]; //上一页的路由
        pages.setData({ //设置上一页addressData的值
            addressData: all
        });

        result.then(wx.navigateBack);
    },

    //改变用户的默认地址
    setUserAddress(type) {
        let that = this;
        //当radio发生改变时
        return _$request.default.get("reserve.radioChange", `/aid/${type}`, {}, {
            disabledLoadding: false,
            interceptCallback: that.setUserAddress //拦截器
        }).then((res) => {
            // console.log(res);
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                wx.showToast({
                    title: '设置成功',
                    icon: 'success',
                    duration: 2000
                })
            }
            return 1;
        })
    },

    //改变单条订单的默认地址
    setOrderAddress(type, orderid) {
        let that = this;
        //当radio发生改变时
        return _$request.default.get("reserve.radioChange", `/aid/${type}/orderid/${orderid}`, {}, {
            disabledLoadding: false,
            interceptCallback: that.setOrderAddress //拦截器
        }).then((res) => {
            // console.log(res);
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                wx.showToast({
                    title: '设置成功',
                    icon: 'success',
                    duration: 2000
                })
            }
            return 1;
        })
    },

    //删除地址的方法
    deleteAddress(e) {
        let that = this;
        wx.showConfirm({
            content: "\u5220\u9664\u540e\u65e0\u6cd5\u6062\u590d\uff0c\u786e\u5b9a\u8981\u5220\u9664\u5417?",
            confirmColor: '#ff0000',
            success: function success(res) {
                //点击确定的事件
                if (res.confirm) {
                    let del_id = e.currentTarget.dataset.id;
                    that.delete(del_id);
                    that.getUserAddress();
                }

            }
        });

    },

    delete(del_id) {
        _$request.default.get("reserve.deladdress", `/addid/${del_id}`, {}, {
            disabledLoadding: false,
            interceptCallback: that.delete //拦截器
        }).then((res) => {
            // console.log(res);
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                wx.showToast({
                    title: '删除成功',
                    icon: 'success',
                    duration: 2000
                })
            }
        })
    },


    //修改地址的方法
    editAddress(e) {
        let edit_id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: "/pages/modules/reserve/address/add/add?id=" + edit_id,
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
    onShow: function() {
        let that = this;
        _$session.default.isSession(_$app.globalData).then((res) => {
            // console.log(res);
            that.getUserAddress();
        });
    },

    navigateBack(e) {
        console.log(22222);
    }

})