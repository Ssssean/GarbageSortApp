var errCode = [{
        errcode: 0,
        msg: "\u8c03\u7528\u6210\u529f"
    },
    {
        errcode: 1,
        action: "user.relogin",
        errmsg: "\u60a8\u65e0\u6743\u8bbf\u95ee\u8be5\u63a5\u53e3\uff0c\u7a0d\u540e\u518d\u6b21\u5c1d\u8bd5\u4f7f\u7528"
    },
    {
        errcode: 2,
        errmsg: "\u67e5\u8be2\u7684\u6570\u636e\u4e0d\u5b58\u5728"
    }
];

// 请求接口未定义
errCode['-1'] = {
    errcode: -1,
    errmsg: "\u8bf7\u6c42\u63a5\u53e3\u672a\u5b9a\u4e49"
};

// 无效的响应参数
errCode['-2'] = {
    errcode: -2,
    errmsg: "\u65e0\u6548\u7684\u54cd\u5e94\u53c2\u6570"
};

// 初始化首页失败
errCode['-3'] = {
    errcode: -3,
    errmsg: "\u521d\u59cb\u5316\u9996\u9875\u5931\u8d25"
};

errCode['5'] = {
    errcode: 5,
    errmsg: "\u7981\u6b62\u767b\u9646",
    action: "user.stoplogin"
};

function getError(response) {
    let errcode = errCode[response.errcode];
    return errcode || response;
}

module.exports = {
    success: 0,
    code: errCode,
    get: getError
};