module.exports = {
    data: {
        scrollTop: 0,
        isSticky: false,
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT
    },
    methods: {
        /**
         * 滚动事件
         * @param {*} e 
         */
        onPageScroll(e) {
            //console.log(e);
            this.setData({ scrollTop: e.scrollTop, isSticky: e.scrollTop >= this.data.NAV_HEIGHT ? true : false });
        },
        /**
         * 到达底部事件
         * @param {*} e 
         */
        onReachBottom(e) {
			//console.log(e);
            if (this.getList) {
                this.getList({ isMore: true });
            }
        },
        onScrollTop(e) {
            wx.pageScrollTo({ scrollTop: 0, duration: 300 });
        }
    }
};