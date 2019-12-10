'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = Component({
    behaviors: [],
    properties: {
        hideBackBtn: {
            type: Boolean,
            value: false
        }
    },
    options: {
        multipleSlots: true,
        styleIsolation: "apply-shared"
    },
    externalClasses: ['i-back-class'],
    ready: function ready() {
        this.setData({
            hideBackBtn: this.data.hideBackBtn,
            isback: getCurrentPages().length > 1
        });
    },
    methods: {
        navigateBack() {
            wx.navigateBack();
        }
    }
});