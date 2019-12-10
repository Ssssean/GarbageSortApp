"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _$app = getApp();
const _$util = require("../../../packages/utils/util");
const _$errcode = require("../../../config/errcode");
const _$session = _$util._interopRequireDefault(require("../../../packages/utils/session"));
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));

const _$pageScroll = require("../common/page_scroll");

const _data = Object.assign({}, _$pageScroll.data, {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
    homeModules: {},
    appName: '回收',
    showModalStatus: false,
    showVoiceArea: false,
    showContent: false,
    show: false,
    recoveryTitle: "线上回收流程",
    question: "常见问题",
    showIndex: 0,
    items: [],
    accordion: [{
        title: '快递员上门要运费怎么办？',
        number: 20,
        state: 'abnormal',
        stateNum: 5,
        content: [{
            title: '上门回收是免运费回收，所有的费用由我们承担，如遇小哥索要运费，可以联系我们处理。'
        }]
    }, {
        title: '包装说明',
        number: 8,
        state: 'normal',
        stateNum: 5,
        content: [{
            title: '目前我们回收的最低支持重量为5kg，如果不足建议和邻里合捐或者等到满足5kg之后再下单；请尽量提前物品需要装在一个大袋子里面，方便我们提高回收效率。'
        }]
    }, {
        title: '对旧衣服有什么要求？',
        number: 8,
        state: 'normal',
        stateNum: 5,
        content: [{
            title: '对旧衣服的新旧程度、大小、薄旧都没有要求。进行打包，包包，床单被罩，毛绒玩具等纺织品均可回收。'
        }]
    }]
});

exports.default = Page(Object.assign({}, _$pageScroll.methods, {
    id: "home",
    data: _data,
    panel: function(e) {
        if (e.currentTarget.dataset.index != this.data.showIndex) {
            this.setData({
                showIndex: e.currentTarget.dataset.index
            })
        } else {
            this.setData({
                showIndex: 0
            })
        }
    },
    Goreserve() {
        wx.navigateTo({
            url: "/pages/modules/reserve/reserve",
            success(res) {
                res.eventChannel.emit('reloadAddress');
            }
        })
    }
}))