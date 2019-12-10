const _$util = require("../../../../packages/utils/util");
const _$session = _$util._interopRequireDefault(require("../../../../packages/utils/session"));
const _$app = getApp();
const _$request = _$util._interopRequireDefault(require("../../../../packages/utils/request"));
const _$errcode = require("../../../../config/errcode");

Page({

    /**
     * 页面的初始数据
     */
    data: {

        Cates: [
            { type: 'RECYCLABLE_WASTE', chinese: '可回收物', color: '#008dc2', image: '../../../../images/cate/kehuishou_tong.png' },
            { type: 'HAZARDOUS_WASTE', chinese: '有害垃圾', color: '#9d0400', image: '../../../../images/cate/youhai_tong.png' },
            { type: 'HOUSEHOLD_FOOD_WASTE', chinese: '湿垃圾', color: '#4a1000', image: '../../../../images/cate/shilaji_tong.png' },
            { type: 'RESIDUAL_WASTE', chinese: '干垃圾', color: '#231815', image: '../../../../images/cate/ganlaji_tong.png' },
        ],


        //存储搜索出来的分类数据
        searchlist: [

        ],

        //提示信息
        searchTishi: false,

        //回到顶部
        isSticky: false,
        scrollTop: 0,
        NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,

        inputvalue: null, //记录用户输入的内容
        page: 0, //当前页数
        isSearchlist: true,

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;
        that.clearInput(); //每次调用清空一下
        const eventChannel = that.getOpenerEventChannel();

        //接收录音和拍照识别功能发射的事件
        eventChannel.on('searchGarbageResult', function(data) {
            if (data.result.errcode == _$errcode.success && data.result.data != null && data.result.data.length > 0) {
                let res_data = data.result.data;
                let cates = that.data.Cates;
                let newdata = that.addforarray(res_data, cates, false);
                that.setData({
                    ['searchlist[' + that.data.page + ']']: newdata
                })
            } else {
                that.setData({
                    searchTishi: true
                })
            }

            //给输入框赋值
            if (data.result.extract == null) {
                that.setData({
                    searchTishi: true
                })
            } else {
                that.data.inputvalue = data.result.extract;
                that.setData({
                    isSearchlist: false, //关闭 调用 getSearchlist 这个接口的开关
                    inputvalue: data.result.extract, //语音识别和拍照识别返回的数据可以直接用， （这时候数据过多系统可能会触发到达底部事件（onReachBottom）从而调用getSearchlist接口，所以得屏蔽掉）
                })
            }

        });

        //接收录音里点击文字发出的事件  就等于再次调用文字搜索查询的接口
        eventChannel.on('searchVoiceTextResult', function(data) {
            if (data != null && data.result != '') {
                let text = data.result;
                that.setData({
                    inputvalue: text
                })

                that.getSearchlist();
            }
        })


    },


    //获取查询到的数据
    getSearchlist(params = {}) {
        let that = this;

        _$request.default.get("goods.getSearchlist", `/keywords/${that.data.inputvalue}/page/${that.data.page}`, {}, {
            disabledLoadding: false,
            interceptCallback: that.getList //拦截器
        }).then((res) => {
            // console.log(res);
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                let data = res.data;

                //当请求接口返回有数据时
                if (data.length > 0) {
                    let cates = that.data.Cates;

                    let newdata = that.addforarray(data, cates);

                    that.setData({
                        ['searchlist[' + that.data.page + ']']: newdata
                            // searchlist: data
                    })

                    // console.log(that.data.searchlist);
                    ++that.data.page;
                }

            } else if (params.ismore == true) {
                _$app.toast("没有更多了..");
            } else {
                that.setData({
                    searchTishi: true,
                })
            }

        })
    },

    //往接收到的数组数据里添加元素
    //data 为接口数据  cates本地定义的数据  ischinese是否追加垃圾分类(可回收物，干垃圾，湿垃圾，有害垃圾)的元素  如果是语音查询识别出来的数据里面就包括分类的类型字段 itemCategory
    addforarray(data = [], cates = [], ischinese = true) {

        for (let _data of data) {
            let color = ''; //追加底部颜色
            let image = ''; //追加图片url
            let chinese = ''; //追加垃圾分类

            for (let _cates of cates) {
                if (_data.type == _cates.type) {
                    color = _cates.color;
                    image = _cates.image;
                    if (ischinese) {
                        chinese = _cates.chinese;
                    }

                }
            }

            _data.color = color;
            _data.image = image;
            if (ischinese) {
                _data.chinese = chinese;
            }
        }

        return data;
    },

    //清除输入框
    clearInput() {
        this.setData({
            inputvalue: '', //清空输入
            page: 0, //页数置0
            searchlist: [], //
            searchTishi: false,
            isSearchlist: true,

        })
    },

    //监听输入框改变事件
    searchInput(e) {
        let that = this;
        //每次修改输入的值都重新请求一次接口

        this.setData({
            page: 0, //页数置0
            searchlist: [], //数据置空
            searchTishi: false,
            isSearchlist: true,
        })


        let text = e.detail.value;
        if (text && text != '') {
            that.setData({
                inputvalue: text
            })

            _$session.default.isSession(_$app.globalData).then((res) => {
                that.getSearchlist();
            });
        }


    },

    //到达底部
    onReachBottom(e) {
        let that = this;
        if (that.data.isSearchlist) {
            that.getSearchlist({ ismore: true });
        }
    },

    //监听滚动条滚动的事件
    onPageScroll(e) {
        //console.log(e);
        this.setData({ scrollTop: e.scrollTop, isSticky: e.scrollTop >= this.data.NAV_HEIGHT ? true : false });
    },

    onScrollTop(e) {
        wx.pageScrollTo({ scrollTop: 0, duration: 300 });
    }

})