// +----------------------------------------------------------------------
// | Sdoushi Weapp Actions.js
// +----------------------------------------------------------------------
// | Copyright (c) 2010-2019 http://www.sdoushi.com All rights reserved.
// +----------------------------------------------------------------------
// | Create: 2019/7/16
// +----------------------------------------------------------------------
// | Author: sound-horizon <sound-horizon@foxmail.com>
// +----------------------------------------------------------------------
let actions = {
    get($error, $session, ...params) {
        if ($error.action) {
            if (!$session) {
                return;
            }
            switch ($error.action) {
                case "user.stoplogin": // 禁止登陆
                    //添加禁止登陆钩子
                    getApp().addHook("user.stoplogin", function(res) {
                        this.data.__hookStoplogin = false;
                        this.setData({ __hookStoplogin: true });
                    });
                    break;
            }
        } else {
            wx.showAlert({
                content: $error.errmsg || "响应超时"
            });
        }
    }
}


module.exports = actions;