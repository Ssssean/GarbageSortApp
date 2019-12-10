"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _$app = getApp();
const _$util = require("../../../packages/utils/util");
const _$errcode = require("../../../config/errcode");
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));
const _$session = _$util._interopRequireDefault(require("../../../packages/utils/session"));


const _$authJump = require("../common/auth_jump");

const _$data = Object.assign({}, _$authJump.data, {
    shopId: 0,
	editMode: false,
    noCartList: true,
    showDelModal: false,
    showSetItemModal: false,
    modalActions: [
        { name: '取消' },
        { name: '删除', color: '#ed3f14', loading: false }
    ],
    setItemModalActions: [
        { name: '取消' },
        { name: '确定', color: '#ed3f14', loading: false }
    ],
    // 产品类型图片列表
    class_imgtype: {
        "1": "trademark",
        "2": "patent",
        "3": "copyright"
    },
    tmpData: null,
    cartGoodsList: [],
    total_price: "0.00", // 全部应支付
    total_num: 0, // "选中的件数"
    real_total_num: 0, // 真实的购物车商品数量，不包含询价
    total_yuan_price: "0", // 全部原价
    isAllSelected: false,
    allSelect: false,
    tax_rate: 0, // 税率
    tax_vrate: "", // 显示税率百分比
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT
});

exports.default = Page(Object.assign({}, _$authJump.methods, {
    data: _$data,
    onLoad(query) {
        const that = this;
        that.setData({ domain: _$app.domain });
        // 授权才加载
        if (that.isAuthLogin(function() { that.getCarts(); })) {
            //_$app.methods.init(_$app, this, "getCarts");
            _$session.default.isSession(_$app.globalData).then((res) => {
                that.getCarts();
            });
        }
    },
    onShow() {
        this.isAuthShow();
        //_$app.weappAuthLogin(`?backMethod=navigateBack&backUrl=${ _$util.route(this) }`);
    },
	/**
	 * 跳转到产品分类
	 */
    goBug() {
        _$app.switchTab("/pages/modules/product/product");
    },
	/**
	 * 进入编辑模式
	 */
	enterEdit() {
		this.setData({ "editMode": !this.data.editMode });
	},
    /**
     * 获取购物车
     */
    getCarts() {
        const that = this;
        _$request.default.get("cart.getCarts", null, {}, {
            disabledLoadding: true,
            interceptCallback: that.getCarts
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                let params = {
                    noCartList: false,
                    cartGoodsList: res.data
                };

                that.data.cartGoodsList = res.data;

                if (Object.keys(res.extract).length > 0) {
                    if (res.extract.price)
                        params['total_price'] = res.extract.price;
                    if (res.extract.yuan_price)
                        params['total_yuan_price'] = res.extract.yuan_price;

                    that.data.tax_rate = res.extract.tax_rate; // 税率
                    that.data.tax_vrate = res.extract.tax_rate_view; // 显示百分比税率
                }

                let _checknum = 0;
                let _realNum = 0;
                that.data.cartGoodsList.forEach((v, k) => {
                    if (v.is_xunjia != 1) {++_realNum; }
                    if (v.checked == true) {
                        ++_checknum;
                        that._setSelectStatus(v, k, "checkbox");
                    }
                });

                that.data.real_total_num = _realNum;

                if (_realNum == _checknum) {
                    params['allSelect'] = true;
                }

                if (_checknum > 0) {
                    params['total_num'] = _checknum;
                }

                that.setData(params);
            } else {
                that.setData({
                    noCartList: true
                })
            }
        });
    },
    /**
     * 获取选中的物品信息
     * @returns string
     */
    _selectCarts: {}, // 存放已选择的购物车
    /**
     * 获取选中的信息
     * @param {int}     type    0-默认，1-只返回数量, 2-返回选中的数据和选中的数据, 3 - 仅返回购物车id
     */
	_getSelectCartIds() {
		const that = this;
		let _keys = Object.keys(that._selectCarts);
		let _ids = [];
		if (_keys.length > 0) {
			_keys.forEach((k) => {
			    let _item = that._selectCarts[k];
				_ids.push(_item.checkbox);
			});
		}
		return _ids;
	},
    _getSelectCart(type = 0) {
        let _keys = Object.keys(this._selectCarts);
        if (type == 1) {
            return _keys.length;
        }
        const that = this;
        if (_keys.length > 0) {
            let _select = [];
            let _selectStr = [];
            _keys.forEach((k) => {
                let _item = that._selectCarts[k];
                _select.push(`${_item.checkbox}-${_item.xiaoxiang_num}-${_item.commodity_num}`);
                _selectStr.push(`${_item.checkbox}-${_item.checked ? 1 : 0}`);
            });
            if (type == 0)
                return _select.join();
            else if (type == 2) {
                return {
                    checkedNum: _keys.length,
                    checkedStatus: _selectStr.join(),
                    checkedCarts: _select.join() || ""
                }
            }
        } else {
            if (type == 0) {
                return "";
            } else {
                return {
                    checkedNum: 0,
                    checkedStatus: "",
                    checkedCarts: ""
                }
            }
        }
    },
    /**
     * 设置指定选中状态
     * @param   {object}    dataset 
     * @param   {int}       index
     * @param   {string}    key
     * @returns void
     */
    _setSelectStatus(dataset, index, key = "ck_cart_id") {
        if (!this._selectCarts[dataset[key]]) {
            this._selectCarts[dataset[key]] = this.data.cartGoodsList[index];
        }
    },
    /**
     * 移除指定选中状态
     * @param {object} dataset 
     * @param   {string}    key
     */
    _delSelectStatus(dataset, key = "ck_cart_id") {
		const that = this;
		let _keys = String(dataset[key]);
		if(_keys.indexOf(',') == -1) {
			delete this._selectCarts[_keys];	
		} else {
			_keys = _keys.split(",");
			_keys.forEach((k) => {
			    delete that._selectCarts[k];
			});
		}
    },
    /**
     * 全选购物车
     * @param {Element} param0 
     */
    allSelectCart(e) {
        const that = this;
        const { dataset = {} } = e.currentTarget;
        let _carts = { checkedCarts: [], checkedStatus: [] };

        that.data.isAllSelected = true;

        that.data.cartGoodsList.forEach((v, k) => {
            if (v.is_xunjia != 1) {
                v.checked = e.detail.current;
                _carts.checkedStatus.push(`${v.checkbox}-${v.checked ? 1 : 0}`);

                if (e.detail.current) {
                    _carts.checkedCarts.push(`${v.checkbox}-${v.xiaoxiang_num}-${v.commodity_num}`);
                    that._setSelectStatus(v, k, "checkbox");
                } else {
                    that._delSelectStatus(v, "checkbox");
                }
            }
        });


        that.computedPrice({
            invoice: "",
            ck_cart_id: "",
            ck_xx_num: "",
            ck_sb_num: "",
            str_cart_ids: _carts.checkedCarts.join(),
            str_cart_checked: _carts.checkedStatus.join()
        }, {
            "allSelect": e.detail.current,
            "total_num": _carts.checkedNum,
            "cartGoodsList": that.data.cartGoodsList
        }, {
            "total_price": "price",
            "total_yuan_price": "yuan_price"
        }, {
            "allSelect": false
        });

        this.data.isAllSelected = false;
    },
    /**
     * 选择购物车
     * @param {EventTarget} e 
     */
    selectCart(e) {

        if (this.data.isAllSelected) {
            return;
        }

        let _params = {};
        const that = this;
        const { dataset = {} } = e.currentTarget;

        if (dataset.itemObj.is_xunjia == 1) {
            _$util.message({ type: "error", content: "请询价后，再进行操作" });
            _params[dataset['item'] + ".checked"] = false;
            that.setData(_params);
            return false;
        }

        // 预先选中,获得正确的选中状态
        _params[dataset['item'] + ".checked"] = e.detail.current;
        that.setData(_params);

        let _extract = {
            "total_price": "price",
            "total_yuan_price": "yuan_price"
        };

        let _failExtract = {};
        _failExtract[dataset['item'] + ".checked"] = false;

        // 维护选中状态
        if (e.detail.current) {
            that._setSelectStatus(dataset, dataset.key);
        } else {
            that._delSelectStatus(dataset);
        }

        let _isChecked = e.detail.current ? 1 : 0;
        let _carts = that._getSelectCart();

        _params['allSelect'] = _carts.checkedNum == that.data.real_total_num ? true : false;

        this.computedPrice({
            invoice: "",
            ck_cart_id: "",
            ck_xx_num: "",
            ck_sb_num: "",
            str_cart_ids: _carts,
            str_cart_checked: `${dataset.ck_cart_id}-${_isChecked}` // 当 checkedStatus 为空时，说明购物车中没有选中的商品，则返回最后一个操作的对象
        }, _params, _extract, _failExtract);
    },
    /**
     * 改变购物车数量
     * @param {EventTarget} e 
     */
    changeCartBuyNumber(e) {
        const that = this;
        let { dataset = {} } = e.currentTarget;
        //dataset = Object.assign({}, dataset); // 不创建新的对象，delete 会删除 dataset 的引用
        let _params = {};
        // 同步data数据，并渲染视图，此时data并没有被赋值
        _params[dataset['item'] + ".commodity_num"] = e.detail.value;
        // 手动给data赋值
        that.data.cartGoodsList[dataset.key]['commodity_num'] = e.detail.value;

        let _extract = {
            "total_price": "price",
            "total_yuan_price": "yuan_price"
        };

        _extract[dataset['item'] + ".all_price"] = "xj_price";
        _extract[dataset['item'] + ".kd_price"] = "kd_price";

        this.computedPrice({
            invoice: "",
            ck_cart_id: dataset.ck_cart_id,
            ck_xx_num: dataset.ck_xx_num,
            ck_sb_num: e.detail.value, // 商品数量
            //str_cart_ids: dataset['itemObj'].checked ? that._getSelectCart() : ""
            str_cart_ids: that._getSelectCart()
        }, _params, _extract);
    },
    /**
     * 计算价格
     * @param {object}  post_data   post请求的参数
     * @param {object}  params      setData的参数
     * @param {object}  extract     setData扩展参数
     */
    computedPrice(post_data, params = {}, extract = {}, failExtract = null, callback = null) {
        const that = this;
        _$request.default.post("cart.totalPrice", null, post_data).then((res) => {
            let _error = _$errcode.get(res);

            if (_error.errcode == _$errcode.success) {
                for (let i in extract) {
                    if (res.data[extract[i]] != undefined) {
                        params[i] = res.data[extract[i]];
                    }
                }
                params.total_num = that._getSelectCart(1);
            } else {
                params.total_num = that._getSelectCart(1) - 1;
                params = failExtract;
            }

            that.setData(params);

            callback && callback(res.data);
        });
    },
    /**
     * 可能删除?
     * @param {event.currentTarget} dataset 
     */
    canDelete({ currentTarget }) {
        let { dataset = {} } = currentTarget;
        
		if(dataset.allDelete) {
			this.data.shopId = this._getSelectCartIds().join(",");
		} else {
			this.data.shopId = dataset.id;
		}
		
		if(this.data.shopId) {
			this.setData({ showDelModal: true });
		} else {
			_$util.message({ type: "error", content: "至少选择一个产品" });
		}
    },
    /**
     * 删除购物车上单品
     * @param {event.detail} detail 
     */
    delCart({ detail }) {
        const that = this;
        switch (detail.index) {
            case 0: // 取消
                that.cancelDelete();
                break;
            case 1: // 删除
                _$request.default.get("cart.delCart", `/id/${that.data.shopId}`).then((res) => {
                    let _error = _$errcode.get(res);
                    that.cancelDelete();
                    _$util.message({ type: _error.errcode == _$errcode.success ? "success" : "error", content: res.errmsg });
                    if (_error.errcode == _$errcode.success) {
						that._delSelectStatus({checkbox: that.data.shopId}, "checkbox"); // 清理选中状态
                        that.getCarts();
                    }
                });
                break;
        }
    },
	/**
     * 取消删除
     */
    cancelDelete() {
        this.setData({ showDelModal: false });
    },
    /**
     * 设置小项
     * @param {EventTarget} e
     */
    setSmallItem({ currentTarget }) {
        const that = this;
        const { dataset } = currentTarget;

        that.data.tmpData = dataset;
        that.setData({
            smallItemNumber: dataset.xiaoxiang_num,
            showSetItemModal: true
        })
    },
    /**
     * 改变小项数量
     * @param {EventTarget} e 
     */
    changeSmallItemNumber(e) {
        const that = this;
        let { dataset = {} } = e.currentTarget;
        if (e.detail.value < 10) {
            e.detail.value = 10;
        }
        that.setData({
            smallItemNumber: e.detail.value
        });
    },
    /**
     * 是否保存小项
     * @param {EventTarget} e
     */
    canSaveSmallItem({ detail }) {
        const that = this;
        switch (detail.index) {
            case 0: // 取消
                that.closeSmallItem();
                break;
            case 1:
                if (that.data.tmpData) {
                    let dataset = that.data.tmpData;
                    let _params = {};
                    let _extract = {
                        "total_price": "price",
                        "total_yuan_price": "yuan_price"
                    };

                    _params[dataset['item'] + ".xiaoxiang_num"] = that.data.smallItemNumber; // 更新小项数量
                    _extract[dataset['item'] + ".all_price"] = "xj_price";
                    _extract[dataset['item'] + ".xiaoxiang_price"] = "xx_price";


                    that.data.cartGoodsList[dataset['key']]['xiaoxiang_num'] = that.data.smallItemNumber; // 手动给data赋值

                    that.computedPrice({
                        invoice: "",
                        ck_cart_id: dataset.id, // 购物车id
                        ck_xx_num: that.data.smallItemNumber, // 小项数量
                        ck_sb_num: dataset.commodity_num, // 商品数量
                        str_cart_ids: that._getSelectCart()
                    }, _params, _extract, null, (res) => {
                        that.closeSmallItem();
                        _$util.message({ type: "success", content: "小项设置成功" });
                    });
                }
                break;
        }
    },
    closeSmallItem() {
        this.data.tmpData = {};
        this.setData({ showSetItemModal: false });
    },
    /**
     * 确认支付
     * @param {EventTarget} e
     */
    confirmOrder(e) {
        const that = this;
        if (that._getSelectCart(1) > 0) {
            wx['navigateTo']({
                url: "/pages/modules/shopcart/confirmOrder",
                success(res) {
                    res.eventChannel.emit('myGoods', {
                        order_type: 2,
                        tax_rate: that.data.tax_rate, // 税率
                        tax_rate_view: that.data.tax_vrate, // 显示百分比税率
                        goods: that._selectCarts,
                        carts: that._getSelectCart(2),
                        total_price: that.data.total_price,
                        total_num: that.data.total_num,
                        total_yuan_price: that.data.total_yuan_price
                    });
                }
            });
        } else {
            _$util.message({ type: "error", content: "至少选择一个产品" });
        }

    },
    /**
     * 商品图片加载错误
     * @param {EventTarget} e 
     */
    goodsPicLoadError(e) {
        let _data = _$util.data(e);
        let _params = {};
        _params[_data.error] = `/images/home/${_data.src}`;
        this.setData(_params);
    }
}));