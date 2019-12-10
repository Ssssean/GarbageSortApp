/**
 * 搜索框公共方法继承
 */
module.exports = {
    data: {
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT + "px",
        placeholder: "搜索商标/专利/版权/认证.."
    },
    methods: {
        /**
         * 打开搜索
         * @param {EventTarget} e 
         */
        tapSearch({ currentTarget }) {
            let { dataset } = currentTarget;

            if (this.tapSearchBefore && typeof this.tapSearchBefore === "function") {
                this.tapSearchBefore();
            }

            wx.openSearch({
                from: dataset.from || "home",
                isHotSearch: dataset.isHotSearch,
                placeholder: encodeURIComponent(dataset.placeholder)
            });
        }
    }
};