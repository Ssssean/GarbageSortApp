"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _$util = require("../../../../packages/utils/util");
const _$errcode = require("../../../../config/errcode");
const _$searchShop = require("../../common/search_shop");

const _$data = Object.assign({}, _$searchShop.data, {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + "px",
    isHistory: false, // 是否存在搜索历史
    isHotSearch: false, // 是否启用热门搜索
    historySearch: [],
    keyword: "", // 关键字
    placeholder: "请输入或选择关键字"
});

exports.default = Page(Object.assign({}, _$searchShop.methods, {
    data: _$data,
    onLoad(query) {

        query.isHotSearch = query.isHotSearch == "true" ? true : false;

        if (query.isHotSearch) {
            this.getHotShop();
        }

        if (query.placeholder) {
            this.setData({
                isHotSearch: query.isHotSearch,
                placeholder: decodeURIComponent(query.placeholder)
            });
        }

        // 是否存在历史

        let _storage = this.storageSearchInfo();
        if (_storage.length > 0) {
            this.setData({
                isHistory: true,
                historySearch: _storage
            });
        }
    },
    // 点击搜索商品
    tapSearch(e) {
        var that = this;
        var keyword = null;
        if (e.detail.value) {
            keyword = e.detail.value;
        } else {
            keyword = _$util.data(e, "name");
        }

        keyword = keyword.trim();

        if (keyword !== "") {
            return this.searchShop(`/type/text/keyword/${keyword}`).then((res) => {
                let _status = _$errcode.get(res);
                if (_status.errcode == _$errcode.success) {
                    that.storageSearchInfo(keyword);
                    return res.data;
                } else {
                    wx.showAlert({
                        content: _status.errmsg
                    });
                }
            }).then((data) => {
                if (data) {
                    wx.navigateTo({
                        url: `/pages/modules/common/search/searchInfo`,
                        success(res) {
                            res.eventChannel.emit('setGoodsInfo', {
                                list: data,
                                showIcon: true,
                                title: keyword,
                                api: {
                                    url: "shop.search",
                                    params: `/type/text/keyword/${ keyword }`
                                }
                            });
                        }
                    });
                }
            });
        }
    },
    // 存储查询内容
    storageSearchInfo(keyword) {
        if (keyword) {
            let _storage = this.storageSearchInfo();
            if (_storage.findIndex(item => item == keyword) == -1) {
                _storage.push(keyword);
                wx.setStorageSync('__searchInfo', _storage);
            }
        } else {
            return wx.getStorageSync('__searchInfo') || [];
        }
    },
    // 点击热门商品搜索
    tapHotShop(e) {
        let data = _$util.data(e);
        if (data.name) {
            this.setData({
                keyword: data.name
            });
        }
        //this.searchShop(`/type/id/keyword/${data.id}`);
        // 直接跳转到产品页面
        wx.navigateTo({
            url: `/pages/modules/goods/goods?shop_id=${data.id}`
        });
    },
    // 取消搜索
    tapCancel() {
        wx.navigateBack({ delta: 1 });
    },
    // 删除搜索历史
    clearSearchHistory() {
        var that = this;
        wx.showConfirm({
            content: "确定要清空吗？",
            success(res) {
                if (res.confirm) {
                    wx.removeStorageSync('__searchInfo');
                    that.setData({
                        isHistory: false,
                        historySearch: []
                    });
                }
            }
        });
    }
}));