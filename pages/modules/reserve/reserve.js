const _$app = getApp();
const _$util = require("../../../packages/utils/util");
const _$errcode = require("../../../config/errcode");
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));
const _$session = _$util._interopRequireDefault(require("../../../packages/utils/session"));
const _$urls = require("../../../config/urls");
const _$authJump = require("../common/auth_jump");
const _$filter = require("../common/filter");


const _$data = Object.assign({}, _$filter.data, _$authJump.data, {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + 'px',
    region: [],
    addressData: {}, //获取默认选中的地址

    showMask1: false,
    customStyle: {
        'background': 'rgba(51, 51, 51, 0.9)',
    },
    iconColor: 'white',

    //货物种类
    Goodfeedback: [
        '请选择',
        '旧报纸',
        '书籍',
        '其他请备注'
    ],
    Goodindex: 0,

    //选择大约重量
    Weightfeedback: [
        '请选择',
        '0-5kg',
        '5-10kg',
        '10-50kg',
        '50kg以上',
    ],
    Weightindex: 0,

    //选择日期
    date: '',

    //开始时间和结束时间
    starttime: '',
    endtime: '',

    //存贮备注信息的内容
    feedbackText: '',

    //图片路径
    imagepath: '',


    isShowTextarea: true, //是否显示textarea

    orderid: '', //订单的id 根据订单的id可以判断是立即预约页面还是修改订单信息页面
    orderdingdanhao: '', //订单号
    ordercreate_time: '', //订单日期
    orderstatusname: '', //订单状态
    addressid: '', //选默认地址的id
    yuanaddressid: '', //原始的默认地址id
    isSubmitSuccess: false, //用户是否提交成功
    bindaddresTp: false, //用户是否进入了选择地址页面

});


exports.default = Page(Object.assign({}, _$filter.methods, _$authJump.methods, {
    data: _$data,
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(e) {
        const that = this;

        if (e && e.orderid != undefined) {
            that.setData({
                orderid: e.orderid
            });
        }

        //首次要授权，
        that.isAuthLogin(function() {})
        const eventChannel = that.getOpenerEventChannel();
        eventChannel.on('reloadAddress', function(data) {
            _$session.default.isSession(_$app.globalData).then((res) => {
                that.reloadAddress();
            });
        });

        // _$session.default.isSession(_$app.globalData).then((res) => {
        //     that.reloadAddress();
        //     that.setData({
        //         onshow: false
        //     })
        // });
    },
    /**
     * 生命周期函数--监听页面显示
     */
    // onShow: function(options) {
    //     console.log('我是onshow被执行了');
    //     //操作地址成功，跳回回首页面，只更新地址数据isaddress: true
    //     let that = this;
    //     that.getAddress();

    // },

    reloadAddress() {
        let that = this;
        if (that.isAuthShow()) {
            that.getAddress({ onload: true });
        }
    },

    //获取默认选中的地址 参数是否只渲染地址
    getAddress(params = {}) {
        let that = this;
        //修改操作 根据订单id查询当前订单的信息
        if (that.data.orderid != undefined && that.data.orderid != '') {
            _$request.default.get("user.getOneOrder", `/orderid/${that.data.orderid}`, {}, {
                disabledLoadding: false,
                interceptCallback: that.getAddress //拦截器
            }).then((res) => {
                console.log(res);
                let _error = _$errcode.get(res);
                if (_error.errcode == _$errcode.success) {
                    //如果是第一次加载页面
                    if (params.onload == true) {
                        let address = {
                            name: res.data.name,
                            mobile_phone: res.data.mobile_phone,
                            district: res.data.district,
                            home: res.data.home,
                        };

                        that.setData({
                            addressData: address, //只渲染地址数据
                            addressid: res.data.aid, //默认地址的id
                            yuanaddressid: res.data.aid, //获取订单第一次进来默认选中的地址，当用户离开并且没有保存订单时，应该重新把原地址id存到这条订单中

                            orderdingdanhao: res.data.orderno,
                            ordercreate_time: res.data.create_time,
                            orderstatusname: res.data.status_name, //订单状态
                            Goodindex: that.getIndexArray(res.data.shopcate, that.data.Goodfeedback), //获取商品种类的下标
                            Weightindex: that.getIndexArray(res.data.shopweight, that.data.Weightfeedback), //获取重量的下标
                            starttime: that.getreTime(res.data.homedate),
                            date: that.getreTime(res.data.homedate),
                            feedbackText: res.data.noteinfo,
                            orderimagepath: 'https://zhdb.shnfan.com' + res.data.shopurl,
                        })

                    } else {
                        let address = {
                            name: res.data.address.name,
                            mobile_phone: res.data.address.mobile_phone,
                            district: res.data.address.district,
                            home: res.data.address.home,
                        };

                        that.setData({
                            addressData: address, //只渲染地址数据
                            addressid: res.data.aid, //默认地址的id
                        })
                    }

                }
            })
        } else {
            that.getTomorrow();
            that.getEnddate();
            //当radio值没有改变时，不会传新的aid,就直接返回默认选中地址的信息
            _$request.default.get("reserve.radioChange", null, {}, {
                disabledLoadding: true,
                interceptCallback: that.getAddress //拦截器
            }).then((res) => {
                console.log(res);
                let _error = _$errcode.get(res);
                if (_error.errcode == _$errcode.success) {
                    that.setData({
                        addressData: res.data,
                        addressid: res.data.id
                    })
                }
            })
        }

    },

    //根据元素获取对应的下标
    getIndexArray(value, array) {
        for (let i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return i;
            }
        }
    },

    //获取备注信息的数据
    feedbackText(e) {
        let that = this;
        that.setData({
            feedbackText: e.detail.value,

        });
    },

    //获取当前日的后一天的日期的方法
    getTomorrow() {
        let that = this;
        let day = new Date();
        day.setTime(day.getTime() + 24 * 60 * 60 * 1000);
        let Tomorrow = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();

        that.setData({
            date: Tomorrow,
            starttime: Tomorrow,
        });
    },

    //获取最后一天的日期的方法(一年后的当前日期)
    getEnddate() {
        let that = this;
        let day = new Date();
        day.setTime(day.getTime() + 365 * 24 * 60 * 60 * 1000);
        let endday = day.getFullYear() + "-" + (day.getMonth() + 1) + "-" + day.getDate();

        that.setData({
            endtime: endday
        });
    },

    //跳转到我的地址页面
    adressTap(e) {
        // console.log(e);
        let that = this;
        that.setData({
            bindaddresTp: true //进入了选择地址页面
        })
        let orderid = e.currentTarget.dataset.id;
        let addressid = e.currentTarget.dataset.addressid;
        // console.log(orderid, addressid);
        if (orderid != 0 && addressid != 0) {
            let order = JSON.stringify({
                orderid: orderid,
                addressid: addressid
            })
            wx.navigateTo({
                url: '/pages/modules/reserve/address/address?order=' + order,
            })
        } else {
            wx.navigateTo({
                url: '/pages/modules/reserve/address/address',
            })
        }

    },

    bindPickerChange(e) {
        let val = e.detail.value;
        this.setData({
            region: val
        })

    },

    //地区覆盖说明
    handleShowMask1(e) {
        let show = e.currentTarget.dataset.show

        this.setData({
            showMask1: show,
        })

        //如果show是true 就隐藏textarea
        if (show) {
            this.setData({
                isShowTextarea: false,
            })
        } else {
            this.setData({
                isShowTextarea: true,
            })
        }

    },

    //货物种类 
    GoodPickerChange(e) {
        let that = this;
        that.setData({
            Goodindex: e.detail.value,

        });
    },

    //大约重量
    WeightPickerChange(e) {
        let that = this;
        that.setData({
            Weightindex: e.detail.value,
        });
    },

    //选择日期
    bindDateChange(e) {
        this.setData({
            date: e.detail.value
        })
    },

    //日期格式2019-10-1 00:00:00 转换成时间戳
    setRepDate(date = '') {
        if (date) {
            let newdate = date.replace(/-/g, '/'); //把 - 替换成 /
            let repdate = Date.parse(newdate) / 1000;
            return repdate;
        }
    },

    //日间戳转换成日期格式
    getreTime(redate) {
        let ontime = _$util.formatTime(new Date(redate * 1000));
        ontime = ontime.substr(0, 10);
        return ontime;
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    //存储实时有可能变更的图片地址
    uploadimage() {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                let tempFilePaths = res.tempFilePaths;
                let imagepath = tempFilePaths[0];
                that.setData({
                    imagepath: imagepath,
                })
            }
        })
    },


    //点击立即预约
    AppointmentTap() {
        let that = this;
        //取表单内容
        let imagepath = that.data.imagepath;
        let Good = that.data.Goodfeedback[that.data.Goodindex]; //取货物种类
        let Weight = that.data.Weightfeedback[that.data.Weightindex]; //取大约重量
        let date = that.data.date; //取上门日期
        let feedbackText = that.data.feedbackText; //取备注信息
        let addressData = that.data.addressData; //取选择地址
        let repdate = that.setRepDate(date);

        //验证
        if (addressData == '') {
            wx.showConfirm({
                content: "\u9ed8\u8ba4\u5730\u5740\u4e0d\u80fd\u4e3a\u7a7a",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        }

        let district = that.data.addressData.district;
        let home = that.data.addressData.home;
        let mobile_phone = that.data.addressData.mobile_phone;
        let name = that.data.addressData.name;
        let addressid = that.data.addressid;

        if (Good == '请选择' || Good == '') {
            wx.showConfirm({
                content: "\u8d27\u7269\u79cd\u7c7b\u4e0d\u80fd\u4e3a\u7a7a",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        }

        if (Weight == '请选择' || Weight == '') {
            wx.showConfirm({
                content: "\u5927\u7ea6\u91cd\u91cf\u4e0d\u80fd\u4e3a\u7a7a",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        }

        if (date == '') {
            wx.showConfirm({
                content: "\u4e0a\u95e8\u65e5\u671f\u4e0d\u80fd\u4e3a\u7a7a",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        }

        //判断上传图片是否为空
        let orderid = that.data.orderid; //获取订单的id
        if (orderid == '') { //如果是新增操作
            if (imagepath == '') { //没有上传图片
                wx.showConfirm({
                    content: "\u4e0a\u4f20\u56fe\u7247\u4e0d\u80fd\u4e3a\u7a7a",
                    showCancel: false,
                    confirmColor: '#ff0000',
                    success: function success(res) {}
                });
                return;
            } else {
                //上传了新图片
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
                                    content: '确定要预约吗？预约后会生成订单',
                                    success(res) {
                                        if (res.confirm) {
                                            let imageurl = result.data.data.path;
                                            that.addOrder(addressid, name, home, mobile_phone, district, Good, Weight, repdate, feedbackText, imageurl);
                                        }
                                    }
                                })
                            }
                        } else {
                            let errmsg = "上传失败," + result.data.errmsg; //获取错误信息
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
        } else {
            //如果是修改操作并且没有上传新图片
            if (imagepath == '') {
                wx.showModal({
                    title: '提示',
                    content: '确定要提交修改后的信息吗?',
                    success(res) {
                        if (res.confirm) {
                            that.updateOrder(orderid, name, home, mobile_phone, district, addressid, Good, Weight, repdate, feedbackText, '');
                        }
                    }
                })
            } else {
                //如果上传了新图片
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
                                    content: '确定要提交修改后的信息吗?',
                                    success(res) {
                                        if (res.confirm) {
                                            let imageurl = result.data.data.path;
                                            that.updateOrder(orderid, name, home, mobile_phone, district, addressid, Good, Weight, repdate, feedbackText, imageurl);
                                        }
                                    }
                                })
                            }
                        } else {
                            let errmsg = "上传失败," + result.data.errmsg; //获取错误信息
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
        }

    },

    updateOrder(orderid, name, home, mobile_phone, district, addressid, Good, Weight, repdate, feedbackText, imageurl) {
        let that = this;
        //修改订单信息操作
        _$request.default.post("reserve.saveorder", null, {
            orderid: orderid,
            aid: addressid, //选择默认地址的id
            shopcate: Good, //货物种类
            shopweight: Weight, //货物重量
            homedate: repdate, //上门时间
            noteinfo: feedbackText, //备注信息
            shopurl: imageurl, //如果有值就是上传新的图片，为空就是没有上传新的图片
            name: name, //名字
            home: home, //详细地址
            mobile_phone: mobile_phone, //手机号
            district: district, //地区
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                that.setData({
                    isSubmitSuccess: true //提交成功
                })
                wx.showToast({
                    title: '修改订单成功',
                    icon: 'success',
                    duration: 2000
                })
                setTimeout(() => {
                    wx.navigateBack();
                }, 1500);
            }
        });
    },

    //新增的方法
    addOrder(addressid, name, home, mobile_phone, district, Good, Weight, repdate, feedbackText, imageurl) {
        let that = this;
        //发送post请求 新增操作
        _$request.default.post("reserve.saveorder", null, {
            aid: addressid, //选择默认地址的id
            shopcate: Good, //货物种类
            shopweight: Weight, //货物重量
            homedate: repdate, //上门时间
            noteinfo: feedbackText, //备注信息
            shopurl: imageurl, //图片路径
            name: name, //名字
            home: home, //详细地址
            mobile_phone: mobile_phone, //手机号
            district: district, //地区
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                that.setData({
                    isSubmitSuccess: true //提交成功
                })

                wx.showToast({
                    title: '新增订单成功',
                    icon: 'success',
                    duration: 2000
                })
                setTimeout(() => {
                    wx.navigateBack();
                }, 1500);
            }
        });

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        // console.log('我离开了这个也页面');
        let that = this;
        let orderid = that.data.orderid;
        let bindaddresTp = that.data.bindaddresTp; //是否进入了选择地址页面
        let yuanaddressid = that.data.yuanaddressid; //获取默认选择的id,可能订单改变了默认地址的选中，但是没有真正的保存订单，这个时候就得恢复当前订单和原地址之间的关系
        let isSubmitSuccess = that.data.isSubmitSuccess;
        if (orderid != '' && yuanaddressid != '' && isSubmitSuccess == false && bindaddresTp == true) { //是修改操作，原默认地址有值，并且没有保存订单，并且进入了选择地址页面
            console.log(orderid, yuanaddressid, 123654);
            that.refreshOrderaddress(orderid, yuanaddressid);
        }
    },

    refreshOrderaddress(orderid, yuanaddressid) {
        let that = this;
        _$request.default.get("userljfl.refreshOrderaddress", `/orderid/${orderid}/addressid/${yuanaddressid}`, {}, {
            disabledLoadding: false,
            interceptCallback: that.refreshOrderaddress //拦截器
        }).then((res) => {
            console.log(res);
        })
    }

}));