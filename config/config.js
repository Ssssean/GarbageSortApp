'use strict';

let config = {
    'debug': false,
    'version': '1.0.3',
    //'payType': 'wxpay',
    'payType': 'wxpayTest', // 支付类型
    'trade_type': 'JSAPI', // 交易类型
    'host': 'https://zhdb.shnfan.com/',
    //'host': 'https://www.sdoushi.com/',
    'mapkey': ''
};

// 接口入口模块
config.suburl = `${config.host}weapp`;

module.exports = config;