// +----------------------------------------------------------------------
// | sdoushi
// +----------------------------------------------------------------------
// | Copyright (c) 2010-2019 http://www.sdoushi.com All rights reserved.
// +----------------------------------------------------------------------
// | Create: 2019/7/3 0003
// +----------------------------------------------------------------------
// | Author: sound-horizon <sound-horizon@foxmail.com>
// +----------------------------------------------------------------------

const _config = _interopRequireDefault(require("config"));
const subDomain = _config.default.suburl;
const urlDomain = `${subDomain}`;

const links = [{
    //"user.register": `${urlDomain}/User/register`, // 微信用户注册接口
    //"user.getOpenid": `${urlDomain}/User/getOpenidByCode`,

    /**
     * 获取用户会话信息
     */
    "user.isSession": `${urlDomain}/User/isSession`,
    /**
     * 小程序用户登录
     * @api     user.weappLogin
     * @method  RESTful
     * @param   String  js_code    code2session
     * @param   Boolen  is_relogin 是否重新登录
     * @returns Object  {data: { utoken: "用户会话标识", openid: "用户openid", weapp_user_id: "小程序用户id", system_user_id: "系统用户id", phone: "手机号码"}}
     */
    "user.weappLogin": `${urlDomain}/User/weappLogin`,
    /**
     * 授权用户登录
     * @api     user.authLogin
     * @method  POST|GET
     * @param   String  encryptedData {post}
     * @param   String  utoken  用户session标识 {get}   
     * @param   String  iv  {post}
     * @returns Object  { data: { openid: "用户openid", weapp_user_id: "小程序用户id", system_user_id: "系统用户id", phone: "手机号码", countryCode: "手机区号" } }
     */
    "user.authLogin": `${urlDomain}/User/AuthLogin`,
    /**
     * 获取首页组件
     * @api     home.getComponents
     * @method  GET
     * @returns Object  { data: { version: "首页版本", components: {} } }
     */
    "home.getComponents": `${urlDomain}/Home/getComponents`,
    /**
     * 商品搜索
     * @api     shop.search
     * @method  RESTful
     * @param   String      type    查询类型            {id|text}
     * @param   Mixed       keyword 关键字              当type=id时，keyword值为数值
     * @param   Int         idOnly  是否仅返回商品id    {1:ids列表|0:实际商品}
     * @returns Object  {data: { ids: "1,2,3" }}
     */
    "shop.search": `${urlDomain}/Shop/shopSearch`,
    /**
     * 热门商品
     * @api     shop.hotShop
     * @method  GET
     * @returns Object  {data: { id: "商品id", name: "商品名称" }}
     */
    "shop.hotShop": `${urlDomain}/Shop/hotShop`,
    /**
     * 用户反馈
     * @api     user.feedback
     * @method  POST
     * @returns Object
     */
    "user.feedback": `${urlDomain}/User/feedback`,
    /**
     * 获取商品类型
     * @api     commodity.getType
     * @method  RESTful
     * @returns Object
     */
    "commodity.getType": `${urlDomain}/commodity/getCommodityType`,
    /**
     * 根据商品类型获取商品列表
     * @api     commodity.getShop
     * @method  RESTful     /shoptype_id/${id}
     * @param   Int     shoptype_id    商品子类id
     * @param   Int     commodity_id   商品大类id
     * @param   Int     country_id     国家id
     * @returns Object
     */
    "commodity.getShop": `${urlDomain}/commodity/getShop`,
    /**
     * 根据商品ID获取商品信息
     * @api     shop.getShopInfo
     * @method  RESTful
     * @param   Int     shopid  商品id
     * @param   Int     commodity_id 大类id
     * @returns Object  
     * {
     *  "data": {"apply":"申请指南", "file": "所需文件", "oprice": "原始价格", "service": "服务流程", "id":"商品id"...}, 
     *  "extract": {"num": "购物车商品数量", "client_pay_status": "0：无权购买，1：立即咨询+加入购物车，2：立即购买+加入购物车，3：仅有立即咨询"}
     * }
     */


    "shop.getShopInfo": `${urlDomain}/shop/getShopInfo`,
    /**
     * 添加购物车
     * @api     cart.addCart
     * @method  RESTful
     * @param   Int     shopid  商品id
     * @param   Int     cart_nums  商品数量
     * @param   Int     dingdanhao 订单号
     * @returns Object  {"data": {"ids": [1,2,3]}}  ids - 购物车ids
     */
    "cart.addCart": `${urlDomain}/cart/addCart`,
    /**
     * 获取购物车列表
     * @api     cart.getCarts
     * @method  RESTful
     * @returns Object  
     * {  
     * "data": [{
     *      "all_price":"小计（处理后的价格）", "checkbox":"购物车id",  "commodity_num" :"采购数量", 
            "ext_price":"其它费", "guan_price":"官方费", "is_xiaoxiang":"是否有小项0|1", "is_xunjia":"是否询价0|1"，
            "pic_name":"标题", "server_price":"服务费", "is_jiage": "拆分费用：1：显示官方费、服务费，0：只显示费用",
           "xiaoxiang_num": "小项数量", "yh_price": "优惠价格", "is_yh": "是否优惠" }],
     * "extract": {"price": "应付总额", "yuan_price": "原价"}    
     * }
     */
    "cart.getCarts": `${urlDomain}/cart/tongbuCart`,
    /**
     * 删除购物车单品
     * @api     cart.delCart
     * @method  RESTful
     * @param   Int     id  购物车id
     * @returns Object  
     */
    "cart.delCart": `${urlDomain}/cart/delCart`,
    /**
     * 计算单价和总价
     * @api     cart.totalPrice
     * @method  POST
     * @param   Int         ck_cart_id      购物车id
     * @param   Int         ck_xx_num       小项数量
     * @param   Int         ck_sb_num       商品数量
     * @param   string      str_cart_ids     购物车组合字段，当多选时使用；（购物车id-小项数量-商品数量：50114-10-3,50113-10-1）
     * @returns Object      { "xj_price": "小计（处理后的价格）", "price": "总价格"}
     */
    "cart.totalPrice": `${urlDomain}/cartRecord/TotalPrice`,
    /**
     * 创建订单并发起支付
     * @api     useOrder.create
     * @method  POST|RESTful
     * @param   {String}  RESTful.pay_mode        支付方式: wxpay-微信支付,wxpayTest-微信支付测试
     * @param   {String}  RESTful.trade_type      交易类型，取值为：JSAPI，NATIVE，APP等
     * @param   {String}  POST.order_type         下单类型：1-直接付款，2-从购物车付款
     * @param   {String}  POST.category           支付标识：wxpay
     * @param   {String}  POST.kuaidi             快递费用：0.00
     * @param   {String}  POST.taitou             发票抬头
     * @param   {Int}     POST.invoice            是否开发票：0-否，1-是
     * @param   {String}  POST.Cart[h_cart_ids]   商品信息字符串，当 POST.order_type = 1 时，{shopid}-10-1, 否则 {cartid}-10-1
     * @param   {String}  POST.price              应付价格
     * @returns    
     */
    "userOrder.create": `${urlDomain}/userOrder/create`,
    /**
     * 订单列表
     * @api userOrder.list
     * @method  POST
     */
    "userOrder.list": `${urlDomain}/userOrder/list`,
    /**
     * 订单明细
     * @api userOrder.detail
     * @method  RESTful
     * @param  {int} order_id   订单编号
     */
    "userOrder.detail": `${urlDomain}/userOrderRecord/TongbuView`,
    /**
     * 状态列表
     * @api userOrder.statusList
     * @method  RESTful
     * @param   {int}   type    状态列表：0-所有状态，1-根据当前用户订单状态返回
     */
    "userOrder.statusList": `${urlDomain}/userOrder/statuslist`,
    /**
     * 根据商品信息获取应支付金额
     * @method  RESTful
     * @param   string  str_shop_ids    商品信息字符串 shopid-xiaoxiangNum-shopNum
     */
    "userOrder.getPayPrices": `${urlDomain}/userOrder/getPayPrices`,


    /**
     * 获取商品类型
     * @api     commodity.getType
     * @method  RESTful
     * @returns Object
     */
    "goods.getList": `${urlDomain}/waste/category`,

    "goods.getSearchlist": `${urlDomain}/waste/category`,

    /**
     * 语音识别
     * @method  RESTful
     * @returns Object
     */
    "voice.Identification": `${urlDomain}/WeapUser/voice`,

    /**
     * 图片识别
     * @method  RESTful
     * @returns Object
     */
    "photo.Identification": `${urlDomain}/WeapUser/wastephoto`,

    /**
     * 获取新闻列表
     * @method  RESTful
     * @returns Object
     */
    "news.list": `${urlDomain}/waste/newslist`,

    /**
     * 获取新闻内容
     * @method  RESTful
     * @returns Object
     */
    "news.detail": `${urlDomain}/waste/newdetails`,

    /**
     * 获取商品列表
     * @method  RESTful
     * @returns Object
     */
    "shop.list": `${urlDomain}/goods/getgoods`,

    /**
     * 获取商品内容
     * @method  RESTful
     * @returns Object
     */
    "shop.detail": `${urlDomain}/goods/goodscontent`,

    /**
     * 回收页面 请求地址页面数据
     * @method  RESTful
     * @returns Object
     */
    "reserve.getUserAddress": `${urlDomain}/WeapUser/getaddress`,

    /**
     * 回收页面 保存新增地址
     * @method  RESTful
     * @returns Object
     */
    "reserve.saveaddress": `${urlDomain}/WeapUser/saveaddress`,


    /**
     * 地址页面  改变默认选中的地址radio
     * @method  RESTful
     * @returns Object
     */
    "reserve.radioChange": `${urlDomain}/WeapUser/isaddress`,


    /**
     * 删除地址 （也有可能是 默认地址）
     * @method  RESTful
     * @returns Object
     */
    "reserve.deladdress": `${urlDomain}/WeapUser/deladdress`,

    /**
     * 上传图片的地址
     * @method  RESTful
     * @returns Object
     */
    "reserve.uploadimage": `${urlDomain}/Order/savephoto`,


    /**
     * 新增订单的地址
     * @method  RESTful
     * @returns Object
     */
    "reserve.saveorder": `${urlDomain}/Order/saveorder`,


    /**
     * 返回全部订单
     * @method  RESTful
     * @returns Object
     */
    "userljfl.order": `${urlDomain}/Order/getorder`,


    /**
     * 提交订单
     * @method  RESTful
     * @returns Object
     */
    "upload.order": `${urlDomain}/Order/sporder`,


    /**
     * 等待预约，预约失败提交失败内容
     * @method  RESTful
     * @returns Object
     */
    "userljfl.orderWaitFail": `${urlDomain}/Order/uporder`,

    /**
     * 根据订单的id返回单条订单信息
     * @method  RESTful
     * @returns Object
     */
    "user.getOneOrder": `${urlDomain}/Order/detailorder`,


    /**
     * 更新订单状态的方法
     * @method  RESTful
     * @returns Object
     */
    "userljfl.updateOrderStatus": `${urlDomain}/Order/cancelorder`,

    // /**
    //  * 再次预约的方法
    //  * @method  RESTful
    //  * @returns Object
    //  */
    // "userljfl.TwoupdateOrderStatus": `${urlDomain}/Order/againorder`,

    /**
     * 再次预约的方法
     * @method  RESTful
     * @returns Object
     */
    "userljfl.refreshOrderaddress": `${urlDomain}/Order/connord`,

    /**
     * 获取我的环保树
     * @method  RESTful
     * @returns Object
     */
    "userljfl.getMytreeData": `${urlDomain}/Order/greentree`,

    /**
     * 获取我的环保树
     * @method  RESTful
     * @returns Object
     */
    "user_ljfl.treeOrderUpload": `${urlDomain}/Order/conversion`,




}];

function getURL(key, index = 0) {
    return links[index][key] || null;
}

function setURL(key, newUrl, index = 0) {
    if (links[index][key]) {
        links[index][key] = `${urlDomain + newUrl}`;
    }
    return links[index][key] || null;
}

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

module.exports = {
    links: links,
    get: getURL,
    set: setURL,
    debug: _config.default.debug
};