'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _StyleHelper = require('../../libs/StyleHelper.js');

var _StyleHelper2 = _interopRequireDefault(_StyleHelper);

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

exports.default = Component({
    behaviors: [],
    properties: {
        customStyle: {
            type: Object | String,
            value: { borderBottom: '1px solid rgba(231, 231, 231, 0.6)', backgroundColor: '#fff' }
        },
        title: {
            type: String
        },
        hideBackBtn: {
            type: Boolean,
            value: false
        }
    },
    options: {
        multipleSlots: true,
        styleIsolation: "apply-shared"
    },
    // externalClasses: ['custom-nav-bar'],
    ready: function ready() {

        var height = wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT;
        var style = this.data.customStyle || {};
        style.height = height;
        style.paddingTop = wx.STATUS_BAR_HEIGHT;

        this.setData({
            hideBackBtn: this.data.hideBackBtn,
            isback: getCurrentPages().length > 1,
            //statusBarHeight: wx.STATUS_BAR_HEIGHT,
            selfCustomStyle: _StyleHelper2.default.getPlainStyle(style)
        });
    },
    methods: {
        navigateBack: () => {
            wx.navigateBack();
        }
    }
});