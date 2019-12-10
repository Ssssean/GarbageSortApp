"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
const _$app = getApp();
const _$util = require("../../../../../packages/utils/util");
const _$urls = require("../../../../../config/urls");
const _$errcode = require("../../../../../config/errcode");
const _$session = _$util._interopRequireDefault(require("../../../../../packages/utils/session"));
const _$request = _$util._interopRequireDefault(require("../../../../../packages/utils/request"));
const _data = Object.assign({}, {
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
    appName: '兑换完成',
    width: wx.WIN_WIDTH,
    NAV_HEIGHT: wx.STATUS_BAR_HEIGHT + wx.DEFAULT_HEADER_HEIGHT,
    imagepath: '',
    id: '', //环保树的id
    DuihuanSuccessIndex: 2, //兑换换成对应的选项
});

exports.default = Page(Object.assign({}, {
    data: _data,

    onLoad: function(e) {
        // console.log(e);
        let id = e.id;
        const that = this;
        _$session.default.isSession(_$app.globalData).then((res) => {
            that.data.id = id;
        });

    },

    //存储实时有可能变更的图片地址
    uploadimage() {
        let that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success(res) {
                let tempFilePaths = res.tempFilePaths;
                let imagepath = tempFilePaths[0];
                that.setData({
                    imagepath: imagepath,
                })
            }
        })
    },

    submitDuihuan() {
        const that = this;
        let imagepath = that.data.imagepath;
        if (that.data.imagepath == '') {
            wx.showConfirm({
                content: "\u4e0a\u4f20\u56fe\u7247\u4e0d\u80fd\u4e3a\u7a7a",
                showCancel: false,
                confirmColor: '#ff0000',
                success: function success(res) {}
            });
            return;
        } else {
            wx.uploadFile({
                url: _$urls.get('reserve.uploadimage'),
                filePath: imagepath,
                header: {
                    "Content-Type": "multipart/form-data" //记得设置
                },
                name: 'file',
                complete: result => {
                    result.data = JSON.parse(result.data);
                    if (result.data.errcode == 0) {
                        if (result.data.data.path != '') {
                            wx.showModal({
                                title: '提示',
                                content: '\u786e\u5b9a\u8981\u63d0\u4ea4\u5151\u6362\u5b8c\u6210\u7684\u56fe\u7247\u5417?',
                                success(res) {
                                    if (res.confirm) {
                                        let imageurl = result.data.data.path;
                                        that.addImageOrder(that.data.id, imageurl);
                                    }
                                }
                            })
                        }
                    } else {
                        let errmsg = "上传失败," + result.data.errmsg; //获取错误信息
                        wx.showConfirm({
                            content: errmsg,
                            showCancel: false,
                            confirmColor: '#ff0000',
                            success: function success(res) {}
                        });
                    }
                }
            })

        }
    },
    addImageOrder(id, imageurl) {
        // console.log(id, imageurl);
        let that = this;
        //发送post请求 新增操作
        _$request.default.post("user_ljfl.treeOrderUpload", null, {
            shopid: id,
            epurl: imageurl,
        }).then((res) => {
            let _error = _$errcode.get(res);
            if (_error.errcode == _$errcode.success) {
                wx.showToast({
                    title: '兑换完成',
                    icon: 'success',
                    duration: 1000
                })
                let index = that.data.DuihuanSuccessIndex
                setTimeout(() => {
                    wx.navigateTo({
                        url: `/pages/modules/user_ljfl/myTree/myTree?status=` + index,
                    });
                }, 1000);
            }
        });
    }

}))