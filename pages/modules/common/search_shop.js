const _$util = require("../../../packages/utils/util");
const _$errcode = require("../../../config/errcode");
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));

module.exports = {
    data: {
        hotShops: [] // 热门搜索列表
    },
    methods: {
        // 获取热门商品
        getHotShop() {
            const that = this;
            _$request.default.get("shop.hotShop", null, {}, {
                interceptCallback: that.getHotShop
            }).then((res) => {
                let _error = _$errcode.get(res);
                if (_error.errcode == _$errcode.success) {
                    that.setData({
                        hotShops: res.data
                    });
                }
            });
        },
        // 搜索商品
        searchShop(params) {
            return _$request.default.get("shop.search", params);
        }
    }
};