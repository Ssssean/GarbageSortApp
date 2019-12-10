/**
 * 授权跳转
 */
const _$app = getApp();

module.exports = {
    data: {
        authShow: true // 是否授权
    },
    methods: {
        /**
         * 是否已授权
         * @param {function} callback 进入授权页面后，当授权完成之后，执行的回调函数
         */
        isAuthLogin(callback) {
            let _auth = _$app.isAuthLogin();
            if (_auth == false) {
                this.setData({ authShow: _auth });
                if (callback) {
                    this.data['__AuthLoginCallback'] = callback;
                }
            }
            return _auth;
        },
        /**
         * 更新授权显示
         */
        isAuthShow() {
            let _auth = _$app.isAuthLogin();
            this.setData({ authShow: _auth });
            return _auth;
        },
        /**
         * 跳转到授权页面
         */
        toAuthPage() {
            _$app.toAuthPage(`?backMethod=navigateBack&backUrl=${ "/" + this['route'] }`);
        },
        /**
         * 执行授权成功后的，回调函数
         */
        AuthLoginCallback() {
            this.setData({ authShow: true });
            if (this.data['__AuthLoginCallback']) {
                this.data['__AuthLoginCallback']();
            }
        }
    }
};