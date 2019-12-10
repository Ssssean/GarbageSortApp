/**
 * 商品公共方法继承
 */
const _$app = getApp();
const _$util = require("../../../packages/utils/util");
const _$errcode = require("../../../config/errcode");
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));

module.exports = {
    data: {
        // 默认子类id
        class_type: 1,
        // 产品类型图片列表
        class_imgtype: {
            "1": "trademark",
            "2": "patent",
            "3": "copyright"
        },
        // 商品列表
        shops: [],
        // 是否存在子产品列表
        isChildrenShops: false,
        // 子商品列表
        childrenShops: [],
        // 子产品标题
        childrenShopTitle: "",
        domain: _$app.domain
    },
    methods: {
        /**
         * 获取商品
         * @param {EventTarget} e 
         */
        getShop(e) {
            const that = this;
            let _target = e.currentTarget ? e.currentTarget.dataset : e;
            let _restful = '';

            if (_target.classId && _target.id) {
                _restful = `/commodity_id/${_target.classId}/shoptype_id/${_target.id}`;
            } else if (_target.ids) {
                _restful = `/shop_ids/${_target.ids}`;
            }
            if (_restful) {
                // 设置商品
                _$request.default.get("commodity.getShop", _restful, {}, {
                    isLocalData: false
                }).then((res) => {
                    let _error = _$errcode.get(res);
                    if (_error.errcode == _$errcode.success) {
                        return { data: res.data, label: _target.text || '' };
                    } else {
                        return { data: [], label: "暂无商品" }
                    }
                }).then((view) => {
                    let _params = { shops: view.data };
                    if (_target.id) {
                        _params['children_id'] = _target.id;
                    }
                    if (_target.type) {
                        _params['class_type'] = _target.type;
                    }
                    if (_target.swiper) {
                        _params['swiperData'] = _target.swiper;
                    }
                    if (view.label) {
                        _params['activeCategoryName'] = view.label;
                    }
                    //console.log(_params);
                    // 选中子类
                    that.setData(_params);
                });
            }
        },
        /**
         * 进入商品页面
         * @param {EventTarget} e 
         */
        enterShopPage(e) {
            const that = this;
            let _target = e.currentTarget ? e.currentTarget.dataset : e;
            if (_target.isPopup) {
                //console.log(_target, that.data, this);
                _$request.default.get("commodity.getShop", `/commodity_id/${that.data.class_id}/shoptype_id/${that.data.children_id}/country_id/${_target.id}`)
                    .then((res) => {
                        let _error = _$errcode.get(res);
                        if (_error.errcode == _$errcode.success) {
                            that.setData({
                                isChildrenShops: true,
                                childrenShops: res.data,
                                childrenShopTitle: _target.text
                            });
                        } else {
                            that.imessage.handleShow({
                                type: "error",
                                content: _error.errmsg
                            });
                        }
                    });
            } else {
                wx.navigateTo({
                    url: `/pages/modules/goods/goods?shop_id=${_target.id}`
                });
            }
        },
        /**
         * 关闭子产品列表
         * @param {EventTarget} e 
         */
        closeChildrenShops(e) {
            this.setData({
                isChildrenShops: false
            });
        }
    }
};