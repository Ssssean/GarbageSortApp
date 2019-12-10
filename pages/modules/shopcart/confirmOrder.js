"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _$app = getApp();
const _$errcode = require("../../../config/errcode");
const _$util = require("../../../packages/utils/util");
const _$wxpay = require("../../../packages/utils/wxPay");

exports.default = Page({
    data: {
        confirmModal: false,
        statusModal: false,
        modalActions: [
            { name: '取消' },
            { name: '付款', color: '#ed3f14', loading: false }
        ],
        modalStatusActions: [
            { name: '支付成功' },
            { name: '继续购买', color: '#ed3f14', loading: false }
        ],
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + "px",
        invoice: [{
                id: 44,
                name: "需要"
            },
            {
                id: 0,
                name: "不需要"
            }
        ],
        goods: [],
        total_num: 0,
        taitou: "", // 发票抬头
        total_price: "0.00",
        total_yuan_price: "0.00",
        invoiceChecked: '不需要',
        defaultChecked: '不需要',
        tax_rate: 0,
        tax_vrate: "",
        h_cart_ids: "", // 购物车列表字符串
        beforeFormat: {} // 格式化之前的数据
    },
    onLoad(query) {
        const that = this;
        const eventChannel = that.getOpenerEventChannel();
        eventChannel.on('myGoods', function(data) {

            console.log(data);

            that.data.h_cart_ids = data.carts.checkedCarts;
            that.data.order_type = data.order_type; // 下单类型

            that.beforeFormat = {
                total_price: data.total_price,
                total_yuan_price: data.total_yuan_price
            };

            let goods = Object.values(data.goods);
            // 快递费用
            let _kdPrice = that.getKdPrice(goods);
            // 应付金额
            let _total_final_price = _$util.calc.add(data.total_price, _kdPrice, 2);
            // 优惠金额
            let _total_yh_price = _$util.calc.sub(data.total_yuan_price, data.total_price, 2);

            //console.log(data.total_price, _kdPrice);

            that.setData({
                domain: _$app.domain,
                goods: goods,
                kdPrice: _kdPrice,
                total_num: data.total_num,
                tax_rate: data.tax_rate,
                tax_vrate: data.tax_rate_view,
                total_final_price: _$util.calc.dealNumber(_total_final_price),
                total_yuan_price: _$util.calc.dealNumber(data.total_yuan_price),
                total_yh_price: _$util.calc.dealNumber(_total_yh_price),
            });
        });
    },
    /**
     * 是否开发票
     * @param {eventDetil} param0 
     */
    changeInvoice({ detail }) {
        const that = this;
        let isInvoice = detail.value;
        let _params = { invoiceChecked: isInvoice, taitou: "" };

        // 应付金额 * 0.06 + 应付金额 (不包含快递费)
        if (isInvoice != that.data.defaultChecked) {
            _params['total_final_price'] = _$util.calc.add(_$util.calc.mul(that.beforeFormat.total_price, that.data.tax_rate), that.beforeFormat.total_price);
        } else {
            _params['total_final_price'] = _$util.calc.add(that.beforeFormat.total_price, that.data.kdPrice, 2);
        }

        _params['total_final_price'] = _$util.calc.dealNumber(_params['total_final_price']);


        this.setData(_params);
    },
    /**
     * 从商品中取出快递费
     * @param   {Array} data 
     * @returns {String|Int}
     */
    getKdPrice(data) {
        let _price = 0;
        data.forEach(element => {
            if (element.kd_price) {
                _price = _$util.calc.add(_price, element.kd_price, 2, true);
            }
        });
        if (typeof _price == "string") {
            return _price;
        } else {
            return (_price).toFixed(2);
        }
    },
    /**
     * 付款之前
     */
    beforePay() {
        this.setData({ confirmModal: true });
    },
    /**
     * 付款
     * @param {*} param0 
     */
    pay({ detail }) {
        const that = this;
        switch (detail.index) {
            case 0:
                that.setData({ confirmModal: false });
                break;
            case 1: // 付款
                const data = that.data;
                that.setData({ confirmModal: false });
                _$wxpay.default.pay({
                    "category": "wxpay",
                    "kuaidi": data.kdPrice,
                    "taitou": data.taitou.trim(),
                    "Cart[h_cart_ids]": data.h_cart_ids,
                    "Cart[category]": 146,
                    "price": data.total_final_price,
                    "order_type": data.order_type,
                    "invoice": data.invoiceChecked == data.defaultChecked ? 0 : 1
                }, (res) => {

                    _$util.toast({
                        icon: 'success',
                        duration: 0,
                        mask: true,
                        content: '支付成功，请登录后台完善订单'
                    });

                    setTimeout(() => {
                        _$util.toast.hide();
                        _$app.switchTab("/pages/modules/order/order");
                    }, 3000);


                    // wx.showToast({
                    //     title: '支付成功，请登录后台完善订单',
                    //     icon: 'success',
                    //     duration: 4000,
                    //     mask: true,
                    //     success() {
                    //         _$app.switchTab("/pages/modules/order/order");
                    //     }
                    // });


                }, (res, msg) => {
                    _$util.message({ type: "error", content: msg });
                });
                break;
        }
    },
    payStatus({ detail }) {

    }
});