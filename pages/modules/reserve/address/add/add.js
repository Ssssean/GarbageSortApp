const _$app = getApp();
const _$util = require("../../../../../packages/utils/util");
const _$errcode = require("../../../../../config/errcode");
const _$request = _$util._interopRequireDefault(require("../../../../../packages/utils/request"));

Page({

    /**
     * 页面的初始数据
     */
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
        region: [],
        id: 0,
        addressData: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(e) {
        let that = this;

        // //修改页面跳转携带过来的id
        let address_id = e.id;

        if (address_id) {
            that.setData({
                id: address_id
            })
            that.getAddress(address_id);
        } else {
            that.setData({
                region: ['江苏省', '徐州市', '贾汪区'],
            })

        }
    },

    //请求要修改的数据赋给修改页面
    getAddress(aid = '') {
        let that = this;
        _$request.default.get("reserve.getUserAddress", `/aid/${aid}`, {}, {
            disabledLoadding: false,
            interceptCallback: that.getAddress //拦截器
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                that.setData({
                    addressData: res.data,
                    region: [res.data.district]
                })

            }
        })
    },

    bindRegionChange(e) {
        console.log(e);
        let val = e.detail.value;

        this.setData({
            region: val
        })
    },


    //提交的方法
    bindSave(e) {
        let that = this;

        let name = e.detail.value.name;
        let mobile_phone = e.detail.value.phone;
        let district = that.data.region;
        let home = e.detail.value.address;

        //验证提交的信息
        if (name == '') {
            wx.showConfirm({
                content: "\u8BF7\u586B\u5199\u6536\u4EF6\u4EBA",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        }


        if (mobile_phone == '') {
            wx.showConfirm({
                content: "\u8BF7\u586B\u5199\u624B\u673A\u53F7\u7801",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        }

        if (home == '') {
            wx.showConfirm({
                content: "\u8BF7\u586B\u5199\u8BE6\u7EC6\u5730\u5740",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        }



        //判断id是否等于0从而判断是否是修改操作
        if (that.data.id == 0) {
            _$request.default.post("reserve.saveaddress", null, {
                name: name,
                mobile_phone: mobile_phone,
                district: district,
                home: home,
            }).then((res) => {
                let _error = _$errcode.get(res);
                if (_error.errcode == _$errcode.success) {
                    wx.showToast({
                        title: '新增地址成功',
                        icon: 'success',
                        duration: 2000
                    })
                    wx.navigateBack();
                }
            });
        } else {
            _$request.default.post("reserve.saveaddress", null, {
                aid: that.data.id,
                name: name,
                mobile_phone: mobile_phone,
                district: district,
                home: home,
            }).then((res) => {
                let _error = _$errcode.get(res);
                if (_error.errcode == _$errcode.success) {
                    wx.showToast({
                        title: '修改地址成功',
                        icon: 'success',
                        duration: 2000
                    })

                    wx.navigateBack();
                }
            });
        }





    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function(e) {

    },


})