const _$app = getApp();
const _$util = require("../../../packages/utils/util");
const _$errcode = require("../../../config/errcode");
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));

module.exports = {
    data: {
        shops_plus: [],
        __api: {},
        title: "",
        offset: 0, // 偏移值
        currentPage: 0 //当前页数
    },
    methods: {
        onMessage() {
            const that = this;

            const eventChannel = that.getOpenerEventChannel();
            eventChannel.on('setGoodsInfo', function(data) {
                that.setGoodsInfo(data);
            });

            if (that.options.params) {
                that.setData({ offset: 0, title: that.options.title || "" });
                that.data.__api = { url: "shop.search", params: that.options.params };
                that.getList();
            }

            return that;
        },
        /**
         * 首次设置商品内容
         */
        setGoodsInfo(data) {
            const that = this;
            if (data.list.length > 0) {
                that.setData({
                    title: data.title,
                    offset: data.offset || 10,
                    showTitleIcon: data.showIcon || false,
                    [`shops_plus[${that.data.currentPage}]`]: data.list
                });

                that.data.__api = data.api || {
                    url: "shop.search",
                    params: "/type/commodity/keyword/58"
                };

                ++that.data.currentPage;
            }
        },
        /**
         * 获取内容列表
         */
        getList(params = {}) {
            // 检测是否登录
            const that = this;
            const _params = {};
            // 重新设置当前页
            if (params.currentPage != undefined) {
                that.data.currentPage = params.currentPage;
                //that.data.orders.length = params.currentPage;
                that.data.orders.splice(params.currentPage);
                that.setData({ shops_plus: [] }); // 清空列表
            }

            // 重新设置偏移值
            if (params.offset != undefined) {
                that.data.offset = params.offset;
            }

            return _$request.default.get(this.data.__api.url, this.data.__api.params + that.getFilterCondition(), {}, {
                interceptCallback: that.getList
            }).then((res) => {
                let _error = _$errcode.get(res);
                if (_error.errcode == _$errcode.success) {

                    _params['domain'] = _$app.domain;
                    _params['offset'] = res.extract.offset || 0;

                    // 高效分页
                    _params[`shops_plus[${that.data.currentPage}]`] = res.data;
                    that.setData(_params);
                    ++that.data.currentPage; // 更新页

                } else if (params.isMore != true) {
                    that.setData({ shops_plus: [] });
                } else {
                    _$app.toast("没有更多了..");
                }
            });
        }
    }
}