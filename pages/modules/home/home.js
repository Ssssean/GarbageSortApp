// +----------------------------------------------------------------------
// | Sdoushi Weapp Home.js
// +----------------------------------------------------------------------
// | Copyright (c) 2010-2019 http://www.sdoushi.com All rights reserved.
// +----------------------------------------------------------------------
// | Create: 2019/7/20
// +----------------------------------------------------------------------
// | Author: sound-horizon <sound-horizon@foxmail.com>
// +----------------------------------------------------------------------

"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

const _$app = getApp();
const _$util = require("../../../packages/utils/util");
const _$errcode = require("../../../config/errcode");
const _$urls = require("../../../config/urls");
const _$session = _$util._interopRequireDefault(require("../../../packages/utils/session"));
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));

const _$pageScroll = require("../common/page_scroll");

// 根据wx提供的api创建录音管理对象
const recorderManager = wx.getRecorderManager();

const _data = Object.assign({}, _$pageScroll.data, {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
    homeModules: {},
    appName: '智慧多帮',
    showModalStatus: false,
    title: "新闻动态",
    showContent: 'voice',
    show: false,
    currentChecked: {},
    visible:false, 
    garbage: {
        recyclable: {
            title: "可回收物",
            dataType: "recyclable",
            dsec: "可回收物是指废纸张、废塑料、废玻璃品、废金属、废织物等适宜回收、可循环利用的生活废弃物",
            require: ["应尽量保持清洁干燥，避免污染", "立体包装应清空内容物，清洁后压扁投放", "已破碎的及废弃药品应连带包装或者包裹后投放"],
            pic_url: '/images/home/kehuishou.png'
        },
        harmful: {
            title: "有害垃圾",
            dataType: "harmful",
            dsec: "有害垃圾是指废电池、废灯管、废药品、废油漆及其容器等对人体健康或者自然环境造成直接或者潜在危害的生活废弃物",
            require: ["应注意轻放", "易破碎的及废弃药品应连带包装或包裹后投放", "压力灌装容器应排空内容物后投放"],
            pic_url: '/images/home/youhai.png'
        },
        wet: {
            title: "湿垃圾",
            dataType: "wet",
            dsec: "湿垃圾是指易腐垃圾，指食材废料、剩菜剩饭、过期食品、瓜皮果壳、花卉绿植、中药药渣等易腐的生物质生活废弃物",
            require: ["应从产生时就与其他品种垃圾分开收集", "投放前尽量沥干水分", "有外包装的应去除外包装投放"],
            pic_url: '/images/home/shilaji.png'
        },
        dry: {
            title: "干垃圾",
            dataType: "dry",
            dsec: "干垃圾即其他垃圾，指除可回收物、有害垃圾、湿垃圾意外的其他生活废弃物",
            require: ["投放前尽量沥干水分", "难以分辨类别的生活垃圾投放干垃圾容器内"],
            pic_url: '/images/home/ganlaji.png'
        }
    },
    news: [{
            title: "什么是智能垃圾桶，我们如何使用它。",
            pic_url: "/images/zuji.png",
            time: "2019.11.19",
            author: "ccc",
            content: "ddd",
            dataId: "1"
        },
        {
            title: "18年底全市将部署20万个只能垃圾桶，19年实现全面覆盖。",
            pic_url: "/images/zuji.png",
            time: "2019.11.19",
            author: "ccc",
            content: "ddd",
            dataId: "1"
        },
        {
            title: "aaa",
            pic_url: "/images/zuji.png",
            time: "2019.11.19",
            author: "ccc",
            content: "ddd",
            dataId: "1"
        }
    ],
    swiper: {
        items: [{ pic_url: "/images/home/ljfl_lunbotu_one.jpg" }]
    }

});

exports.default = Page(Object.assign({}, _$pageScroll.methods, {
    id: "home",
    data: _data,
    onLoad() {
        const that = this;

        _$session.default.isSession(_$app.globalData).then((res) => {
            _$app.runHook("user.stoplogin", this);
            console.log(res)
            _$request.default.get("news.list").then((res) => {
                console.log(res)
                that.setData({
                    news: res.data
                })
            })
        })

        wx.showShareMenu({ withShareTicket: true });
    },
    // click swiper
    tapSwiper(e) {},
    // swiper change
    swiperChange(e) {
        this.setData({
            swiperCurrent: e.detail.current
        });
    },
    // click homeicon/searchType
    tapIconsGroup(e) {
        switch (e.currentTarget.dataset.type) {
            case "word":
                wx.navigateTo({
                    url: `/pages/modules/common/ljflSearch/ljflSearch`
                });
                break;
            case "voice":
                this.setData({ show: true, showContent: 'voice' });
                break;
            case "photo":
                wx.chooseImage({
                    count: 1,
                    sizeType: ['original', 'compressed'],
                    sourceType: ['album', 'camera'],
                    success(res) {
                        // tempFilePath可以作为img标签的src属性显示图片
                        const tempFilePaths = res.tempFilePaths;
                        setTimeout(() => {
                            wx.showLoading({
                                title: '图片识别中...',
                                mask: true
                            });
                        }, 500);
                        wx.uploadFile({
                            url: _$urls.get('photo.Identification'), // 该服务在后面搭建。另外，小程序发布时要求后台服务提供https服务！这里的地址仅为开发环境配置。
                            filePath: tempFilePaths[0],
                            name: 'file',
                            complete: result => {
                                wx.hideLoading();
                                result.data = JSON.parse(result.data);
                                if (result.data.errcode == 0 && 　result.data.data.length > 0) {
                                    wx.navigateTo({
                                        url: `/pages/modules/common/ljflSearch/ljflSearch`,
                                        success(res) {
                                            res.eventChannel.emit('searchGarbageResult', {
                                                result: result.data
                                            });

                                        }
                                    });
                                } else {

                                    wx.showAlert({
                                        content: "没有识别出垃圾种类，请使用文字查询或重新选择图片。"
                                    });
                                }
                            }
                        });
                    },
                    fail() {
                        wx.hideLoading();
                    }
                })
                break;
            case "recyclable":
                this.setData({
                    show: true,
                    showContent: 'content',
                    currentChecked: this.data.garbage.recyclable
                })
                break;
            case "harmful":
                this.setData({
                    show: true,
                    showContent: 'content',
                    currentChecked: this.data.garbage.harmful
                })
                break;
            case "dry":
                this.setData({
                    show: true,
                    showContent: 'content',
                    currentChecked: this.data.garbage.dry
                })
                break;
            case "wet":
                this.setData({
                    show: true,
                    showContent: 'content',
                    currentChecked: this.data.garbage.wet
                })
                break;
            default:
                this.setData({ show: true, showContent: 'content' });
                break;
        }
    },
    // search
    tapSearch(e) {
        let dataset = e.currentTarget.dataset;
        wx.openSearch({
            from: "home",
            isHotSearch: dataset.isHotSearch,
            placeholder: encodeURIComponent(dataset.placeholder)
        });
    },
    tapBlock({ currentTarget }) {
        let { dataset } = currentTarget;
        this.handle(dataset.params);
    },
    handle(params) {
        if (params.link && typeof params.link == 'string') {
            wx.navigateTo({
                url: `/pages/modules/${params.link}`
            });
        } else if (params.api && typeof params.api == 'object') {
            _$request.default.get(params.api.url, params.api.params).then((res) => {
                let _status = _$errcode.get(res);
                if (_status.errcode == _$errcode.success) {
                    switch (params.api.url) {
                        case "shop.search":
                            wx.navigateTo({
                                url: `/pages/modules/common/search/searchInfo`,
                                success(page) {
                                    page.eventChannel.emit('setGoodsInfo', {
                                        title: params.title,
                                        list: res.data,
                                        offset: res.extract.offset,
                                        api: params.api
                                    });
                                }
                            });
                            break;
                    }
                } else {
                    wx.showAlert({
                        content: _status.errmsg
                    });
                }
            });
        }
    },
    closePopup(e) {
        this.setData({ show: false });
        this.data.showContent = '';
    },
    handleShow() {
        this.setData({
            show: false
        })
    },
    searchGarbage(e) {
        wx.navigateTo({
            url: `/pages/modules/common/ljflSearch/ljflSearch`,
            success(res) {
                res.eventChannel.emit('searchVoiceTextResult', {
                    result: e.currentTarget.dataset.content
                });
            }
        });
    },
    showNewsDetails(e) {
        console.log(e)
        const that = this;
        wx.navigateTo({
            url: '/pages/modules/common/newsDetail/index?id=' + e.currentTarget.dataset.id
        })
    },
    stopRecord() {
        recorderManager.stop();

        // 监听语音识别结束后的行为
        recorderManager.onStop(recorderResponse => {
            wx.showLoading({
                title: '语言识别中...'
            })
            setInterval(function() {
                    wx.hideLoading();
                }, 5000)
                // tempFilePath 是录制的音频文件
            const { tempFilePath } = recorderResponse;
            // 上传音频文件，完成语音识别翻译
            wx.uploadFile({
                url: _$urls.get('voice.Identification'), // 该服务在后面搭建。另外，小程序发布时要求后台服务提供https服务！这里的地址仅为开发环境配置。
                filePath: tempFilePath,
                name: 'file',
                complete: result => {
                    wx.hideLoading()
                    result.data = JSON.parse(result.data);
                    if (result.errMsg == 'uploadFile:ok' && _$util.isEmpty(result.data.data)) {
                        wx.navigateTo({
                            url: `/pages/modules/common/ljflSearch/ljflSearch`,
                            success(res) {
                                res.eventChannel.emit('searchGarbageResult', {
                                    result: result.data
                                });
                            }
                        });
                    } else {
                        wx.showAlert({
                            content: "没有识别出垃圾种类，请使用文字查询或重新录音。"
                        });
                    }
                }
            });
        });

    },
    startRecord() {
        const that = this;
        // 开始录音，触发条件可以是按钮或其他，由你自己决定
        wx.getSetting({
            success(res) {
                if (res.authSetting['scope.record']) {
                    wx.vibrateLong();
                    recorderManager.start({
                        duration: 10000 // 最长录制时间
                            // 其他参数可以默认，更多参数可以查看https://developers.weixin.qq.com/miniprogram/dev/api/media/recorder/RecorderManager.start.html
                    });
                    // that.stopRecord()
                } else if (res.authSetting['scope.record'] == false) {
                    wx.showAlert({
                        content: "请同意授权后再使用语音查询功能。"
                    });
                }
            }
        })

    },
    onHide() {
        this.setData({
            show: false,
            showContent: ""
        })
    },
    catchtouchmove() {},
    drawerVisible(){
        this.setData({
            visible : !this.data.visible
        })
    }
}));