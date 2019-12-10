const RECYCLABLE_WASTE = 'RECYCLABLE_WASTE'; //可回收物
const HAZARDOUS_WASTE = 'HAZARDOUS_WASTE'; //有害垃圾
const HOUSEHOLD_FOOD_WASTE = 'HOUSEHOLD_FOOD_WASTE'; //湿垃圾
const RESIDUAL_WASTE = 'RESIDUAL_WASTE'; //干垃圾


const _$util = require("../../../packages/utils/util");
const _$session = _$util._interopRequireDefault(require("../../../packages/utils/session"));
const _$app = getApp();
const _$request = _$util._interopRequireDefault(require("../../../packages/utils/request"));
const _$errcode = require("../../../config/errcode");
const _$urls = require("../../../config/urls");
// 根据wx提供的api创建录音管理对象
const recorderManager = wx.getRecorderManager();
Page({

    data: {
        tips: '请稍后',
        show1: true,
        animated: true,
        //回到顶部
        isSticky: false,
        scrollTop: 0,
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
        imgHeight: parseInt(wx.WIN_WIDTH / 1125 * 628),
        //设置swiper容器高度  重要
        WIN_HEIGHT: wx.DEFAULT_CONTENT_HEIGHT - wx.DEFAULT_HEADER_HEIGHT,
        height: wx.DEFAULT_CONTENT_HEIGHT,

        // 显示的商品子类名称
        activeCategoryName: "加载中",
        //当前选中的tabindex
        current: 0,
        //当前的页数
        page: 0,

        scrollTop: 0,

        noOrder: true, // 暂无订单

        customStyle: {
            'background-color': '#eee',
            'height': '46px',
            'line-height': '46px'
        },

        show: false,
        showContent: 'voice',


        //一级类的数据
        Cates: {
            0: { type: RECYCLABLE_WASTE, chinese: '可回收物' },
            1: { type: HAZARDOUS_WASTE, chinese: '有害垃圾' },
            2: { type: HOUSEHOLD_FOOD_WASTE, chinese: '湿垃圾' },
            3: { type: RESIDUAL_WASTE, chinese: '干垃圾' },

        },


        //存储垃圾分类的说明
        ljfl_cates: {
            0: {
                type: RECYCLABLE_WASTE,
                categoryName: '可回收物',
                categoryMess: '是指废纸章、废塑料、废玻璃、废金属、废织物等适宜回收、可循环利用的生活废弃物。',
                imageUrl: '../../../images/cate/kehuishou_tong.png',
                background: '#bcd2e9',
                yaoqiu: [{ text: '应尽量保持清洁干燥，避免污染' }, { text: '立体包装应清空内物，清洁后压扁投放' }, { text: '易破损活有裹尖锐边角的应包后投放' }],
            },
            1: {
                type: HAZARDOUS_WASTE,
                categoryName: '有害垃圾',
                categoryMess: '是指废电池、废灯管、废药品、废油漆及其容器等对人体健康或者自然环境造成直接或者潜在危害的生活废弃物。',
                imageUrl: '../../../images/cate/youhai_tong.png',
                background: '#ffb4b4',
                yaoqiu: [{ text: '应注意轻放' }, { text: '易破碎的及废弃药品应连带包装或包裹后投放' }, { text: '压力灌装容器应排空内容物后投放' }],
            },
            2: {
                type: HOUSEHOLD_FOOD_WASTE,
                categoryName: '湿垃圾',
                categoryMess: '是指易腐垃圾、指食材废料、剩菜剩饭、过期食品、瓜皮果核、花卉绿植、中药药渣等易腐的生物质生活废弃物。',
                imageUrl: '../../../images/cate/shilaji_tong.png',
                background: '#ddd3c0',
                yaoqiu: [{ text: '应从产生时就与其他品种垃圾分开收集' }, { text: '投放前尽量沥干水分' }, { text: '有外包装的应去除外包装投放' }],
            },
            3: {
                type: RESIDUAL_WASTE,
                categoryName: '干垃圾',
                categoryMess: '即其他垃圾，指除可回收物、有害垃圾、湿垃圾以外的其它生活废弃物。',
                imageUrl: '../../../images/cate/ganlaji_tong.png',
                background: '#d0d0d0',
                yaoqiu: [{ text: '投放前尽量沥干水分' }, { text: '难以分辨类别的生活垃圾投放干垃圾容器内' }],
            }

        },

        //当前选中的分类的说明的数据
        childcates: [],

        //存储子类列表的数据
        childlist: [

        ],


        components: {
            topSearchBar: {
                isHotSearch: true,
                placeholder: "搜索..",
                type: "search-bar",
                ver: "1.0",
            }
        },

        //左侧导航栏的样式
        tabStyle: {
            'color': '#333',
            'width:': '200rpx',
            'background-color': 'white',

        },
        activeTabStyle: {
            'color': '#00a161',
            'background-color': '#e6e6e5',
            'border-right': '1px solid #00a161'
        },

    },



    //改变列表
    handleChange(e) {
        // console.log(e);
        let that = this;
        that.data.current = e.detail.index

        //改变当前选中的大分类的说明
        that.setData({
            childcates: that.data.ljfl_cates[that.data.current]
        })

        //调用获取子分类
        that.getList({ page: 0 });
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        //加载第一大类的说明数据
        that.setData({
            childcates: that.data.ljfl_cates[that.data.current]
        })

        _$session.default.isSession(_$app.globalData).then((res) => {
            that.getList();
        });
    },


    getList(params = {}) {
        let that = this;

        // 重新设置当前页
        if (params.page != undefined) {
            that.data.page = params.page;
            //that.data.orders.length = params.currentPage;
            that.data.childlist.splice(params.page);
            that.setData({ childlist: [] }); // 清空列表
        }


        let current = that.data.current; // tabIndex
        let type = that.data.Cates[current].type; // tabIndex2type

        _$request.default.get("goods.getList", `/type/${type}/page/${that.data.page}`, {}, {
            disabledLoadding: true,
            interceptCallback: that.getList //拦截器
        }).then((res) => {
            // console.log(res);
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {

                that.setData({
                    ['childlist[' + that.data.page + ']']: res.data
                });

                ++that.data.page;

            }
        })

    },

    //语音识别和拍照识别
    tapIconsGroup(e) {
        console.log(e.currentTarget.dataset)
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
                        const tempFilePaths = res.tempFilePaths
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
                                result.data = JSON.parse(result.data)
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
                                        content: "没有识别出垃圾种类，请使用文字搜索或重新选择图片。"
                                    });
                                }
                            }
                        });
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

    //关闭识别窗口
    closePopup(e) {
        this.setData({ show: false });
        this.data.showContent = '';
    },

    //开始录音
    startRecord() {
        const that = this;
        // 开始录音，触发条件可以是按钮或其他，由你自己决定
        wx.getSetting({
            success(res) {
                // console.log(res.authSetting['scope.record'])
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

    //录音结束
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
                    if (result.errMsg == 'uploadFile:ok') {
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
                            content: result.errMsg
                        });
                    }
                }
            });
        });

    },
    //跳转到固定的识别的文字
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


    onReachBottom(e) {
        this.getList();
    },

    //监听滚动条滚动的事件
    onPageScroll(e) {
        //console.log(e);
        this.setData({ scrollTop: e.scrollTop, isSticky: e.scrollTop >= this.data.NAV_HEIGHT ? true : false });
    },

    //点击回到顶部的事件
    onScrollTop(e) {
        wx.pageScrollTo({ scrollTop: 0, duration: 300 });
    },

    tapSearch() {
        wx.navigateTo({
            url: '/pages/modules/common/ljflSearch/ljflSearch'
        })
    }

})