"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _$app = getApp();
const _$util = require("../../../../packages/utils/util");

exports.default = Page({
    data: {
        // 时间可选范围
        monthrange: [],
        // 默认选中的时间范围
        defaultMonthrange: [],
        //---------------------------
        height: wx.WIN_HEIGHT,
        headerHeight: wx.DEFAULT_HEADER_HEIGHT,
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT
    },
    onLoad() {
        const that = this;
        const eventChannel = that.getOpenerEventChannel();
        eventChannel.on('setDate', function(data) {
            // 计算时间范围
            let rangedate = new Date();
            let rangedate2 = new Date();
            let start = void 0,
                end = void 0;

            start = _$util.dateFormat(rangedate.setMonth(0));
            end = _$util.dateFormat(rangedate.setMonth(new Date().getMonth()));

            start = start.substring(0, 7);
            end = end.substring(0, 7);

            // 设置默认值
            that.data.monthrange.push(start, end);
            if (data[0]) {
                data[0] = data[0].replace(/-/g, "/");
                data[1] = data[1].replace(/-/g, "/");
            }
            that.setData({
                monthrange: that.data.monthrange,
                defaultMonthrange: data
            });
        });
    },
    onReady() {
        const that = this;
        let query = wx.createSelectorQuery();
        query.select("#calendar-contianer").boundingClientRect((rect) => {
            wx.pageScrollTo({
                scrollTop: rect.height - that.data.NAV_HEIGHT
            });
        }).exec();

    },
    format(date) {
        return date.replace(/\//g, "-");
    },
    selectedStartHandler({ detail }) {

    },
    selectedEndHandler({ detail }) {
        const that = this;
        console.log(detail, this.data.defaultMonthrange);
        setTimeout(res => {
            _$app.prevPage().setData({
                start_time: that.format(detail[0]),
                end_time: that.format(detail[1])
            });
            wx.navigateBack();
        }, 500);
    },
    failedHandler(err) {
        if (err === 1) {
            wx.showToast({ title: '您选择的时间有误，请重新选择' });
        }
    },
    navigateBack() {
        const that = this;
        let _date = that.data.defaultMonthrange;
        setTimeout(res => {
            _$app.prevPage().setData({
                start_time: that.format(_date[0]),
                end_time: that.format(_date[1])
            });
            wx.navigateBack();
        }, 500);
    }
});