const _$util = require("../../../packages/utils/util");
module.exports = {
    methods: {
        /**
         * 商品图片加载错误
         * @param {EventTarget} e 
         */
        goodsPicLoadError(e) {
            this.onPicLoadError(e);
        },
        /**
         * 商品图片加载错误
         * @param {EventTarget} e 
         */
        onPicLoadError(e) {
            let _data = _$util.data(e);
            let _params = {};
            _params[_data.error] = `/images/home/${_data.src}`;
            this.setData(_params);
        }
    }
};