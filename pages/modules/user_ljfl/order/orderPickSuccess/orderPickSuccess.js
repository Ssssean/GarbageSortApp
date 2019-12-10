const _$urls = require("../../../../../config/urls");
const _$util = require("../../../../../packages/utils/util");
const _$request = _$util._interopRequireDefault(require("../../../../../packages/utils/request"));
const _$errcode = require("../../../../../config/errcode");


Page({

    /**
     * 页面的初始数据
     */
    data: {
        orderid: '', //订单id
        status: '', //完成取件的状态
        //设置吸顶容器吸顶时距离顶部的距离
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
        feedbackText: '', //获取备注信息
        imagepath: '', //图片地址
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(e) {
        let that = this;
        //获取预约失败的orderid
        let order = JSON.parse(e.order);
        let orderid = order.orderid;
        let status = order.status;
        that.setData({
            orderid: orderid,
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
    onShow: function() {

    },

    //获取备注信息的数据
    feedbackText(e) {
        let that = this;
        that.setData({
            feedbackText: e.detail.value,

        });
    },

    //存储实时有可能变更的图片地址
    uploadimage() {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                console.log(res);
                let tempFilePaths = res.tempFilePaths;
                let imagepath = tempFilePaths[0];
                that.setData({
                    imagepath: imagepath,
                })
            }
        })
    },

    //提交的方法
    bindSave(e) {
        let that = this;
        let weight = e.detail.value.weight;
        let price = e.detail.value.price;
        let feedbackText = that.data.feedbackText;
        let imagepath = that.data.imagepath;
        let orderid = that.data.orderid;
        let status = that.data.status;

        //验证
        if (weight == '') {
            wx.showConfirm({
                content: "\u63d0\u4ea4\u5931\u8d25\uff0c\u8d27\u7269\u91cd\u91cf\u4e0d\u80fd\u4e3a\u7a7a",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        }

        if (price == '') {
            wx.showConfirm({
                content: "\u63d0\u4ea4\u5931\u8d25\uff0c\u5e02\u573a\u5355\u4ef7\u4e0d\u80fd\u4e3a\u7a7a",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        }


        if (feedbackText == '') {
            wx.showConfirm({
                content: "\u63d0\u4ea4\u5931\u8d25\uff0c\u5907\u6ce8\u4fe1\u606f\u4e0d\u80fd\u4e3a\u7a7a",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        }

        if (imagepath == '') {
            wx.showConfirm({
                content: "\u63d0\u4ea4\u5931\u8d25\uff0c\u4e0a\u4f20\u56fe\u7247\u4e0d\u80fd\u4e3a\u7a7a",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        } else {
            wx.uploadFile({
                url: _$urls.get('reserve.uploadimage'),
                filePath: imagepath,
                header: {
                    "Content-Type": "multipart/form-data" //记得设置
                },
                name: 'file',
                complete: result => {
                    result.data = JSON.parse(result.data);
                    if (result.data.errcode == 0) {
                        if (result.data.data.path != '') {
                            wx.showModal({
                                title: '提示',
                                content: '确定要提交信息吗?',
                                success(res) {
                                    if (res.confirm) {
                                        let imageurl = result.data.data.path; //获取需要上传的图片地址
                                        that.appendOrderdata(orderid, status, weight, price, feedbackText, imageurl);
                                    }
                                }
                            })
                        }
                    } else {
                        let errmsg = "图片上传失败," + result.data.errmsg; //获取错误信息
                        wx.showConfirm({
                            content: errmsg,
                            showCancel: false,
                            confirmColor: '#ff0000',
                            success: function success(res) {}
                        });
                    }
                }
            })
        }

    },

    appendOrderdata(orderid, status, weight, price, feedbackText, imageurl) {
        _$request.default.post("userljfl.orderWaitFail", null, {
            orderid: orderid,
            status: status,
            rlweight: weight,
            price: price,
            epinfo: feedbackText,
            epurl: imageurl,
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                wx.showToast({
                    title: '提交成功',
                    icon: 'success',
                    duration: 2000
                })

                setTimeout(() => {
                    wx.navigateBack();
                }, 1500);
            }

            //如果服务端判断的当前订单的状态不是等待预约，就不能提交失败原因
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

        });
    }

})