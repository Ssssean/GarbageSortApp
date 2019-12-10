/**
 * 接口响应参数
 * */
let data = {
    demo: {
        errcode: 0,
        errmsg: "",
        "data|10": [{
            "id|+1": 1,
            img: "@image('200x100', '#4A7BF7','#fff','pic')",
            title: "@ctitle(3,8)",
            city: "@county(true)",
            stock_num: "@integer(0,100)", //库存数量
            marketing_start: "@datetime()",
            marketing_stop: "@now()",
            price: "@integer(100,2000)", //现价，单位：分
            original_price: "@integer(100,3000)"
        }]
    },
    // 用户获取openid
    "user.getOpenid": {
        errcode: 0,
        errmsg: "",
        type: "",
        data: {
            openid: "",
            utoken: ""
        },
        extract: {}
    },
    // 用户登录
    "user.weappLogin": {
        errcode: 0,
        errmsg: "",
        type: "",
        data: {
            openid: "oivEv5aKH-_od6C2jeSf3mzW1xW8",
            weapp_user_id: "1",
            utoken: "F8QvVcBZ/lU0E9k83qcY5Q=="
        },
        extract: {}
    },
    // 获取服务器上session信息
    "user.getSessionInfo": {
        errcode: 0,
        errmsg: "",
        type: "",
        data: {
            weapp_user_id: "1",
            openid: "oivEv5aKH-_od6C2jeSf3mzW1xW8",
            utoken: "F8QvVcBZ/lU0E9k83qcY5Q=="
        },
        extract: {}
    },
    // 获取首页组件
    "home.getComponents": {
        errcode: 0,
        errmsg: "",
        type: "",
        data: {
            version: "1.0",
            components: {
                topSearchBar: {
                    ver: "1.0",
                    type: "search-bar",
                    placeholder: "搜索商标/专利/版权/认证..",
                    isHotSearch: true
                },
                swiperGroup: {
                    ver: "1.0",
                    type: "swiper",
                    swiperCurrent: 0,
                    items: [{
                        pic_url: "/images/home/home-swiper.jpg",
                        link: ""
                    }]
                },
                homeIcons: {
                    ver: "1.0",
                    type: "icons-group",
                    items: [{
                            title: "商标",
                            pic_url: "/images/home/trademark.png",
                            api: {
                                url: "shop.search",
                                params: "/type/commodity/keyword/58,59"
                            }
                        },
                        {
                            title: "专利",
                            pic_url: "/images/home/patent.png",
                            api: {
                                url: "shop.search",
                                params: "/type/commodity/keyword/60,62"
                            }
                        },
                        {
                            title: "版权",
                            pic_url: "/images/home/copyright.png",
                            api: {
                                url: "shop.search",
                                params: "/type/commodity/keyword/63"
                            }
                        },
                        {
                            title: "设计",
                            pic_url: "/images/home/design.png",
                            api: {
                                url: "shop.search",
                                params: "/type/commodity/keyword/64"
                            }
                        }
                    ]
                },
                hotRec: {
                    ver: "1.0",
                    type: "image-block",
                    title: "热门推荐",
                    subtitle: "您身边的知识产权专家",
                    isMore: true,
                    moreLink: "common/search/searchInfo?params=/type/hot",
                    lineNum: 12 / 2,
                    items: [{
                            pic_url: "/images/home/rd_guoji.jpg",
                            title: "国际商标",
                            api: {
                                url: "shop.search",
                                params: "/type/commodity/keyword/59"
                            }
                        }, {
                            pic_url: "/images/home/rd_cpc.jpg",
                            title: 'CPC提交实用',
                            api: {
                                url: "shop.search",
                                params: '/type/text/keyword/CPC提交实用'
                            }
                        },
                        {
                            pic_url: "/images/home/rd_daixie.jpg",
                            title: "代写实用新型",
                            //link: "goods/goods?shop_id=271"
                            api: {
                                url: "shop.search",
                                params: '/type/id/keyword/275,310'
                            }
                        },
                        {
                            pic_url: "/images/home/rd_jiaji.jpg",
                            title: '加急商标注册',
                            api: {
                                url: "shop.search",
                                params: '/type/text/keyword/加急商标注册'
                            }
                        }
                    ]
                },
                discount: {
                    ver: "1.0",
                    type: "shop-grid",
                    title: "限时特惠",
                    subtitle: "",
                    lineNum: 12 / 3,
                    isMore: true,
                    moreLink: "common/search/searchInfo?params=/type/discount",
                    className: "",
                    items: [{
                            titie: "套餐-实用-编写单个人减缓",
                            link: "",
                            price: "360"
                        },
                        {
                            titie: "加急专利注册",
                            link: "",
                            price: "360"
                        },
                        {
                            titie: "加急商标注册",
                            link: "",
                            price: "200"
                        },
                        {
                            titie: "套餐-实用-编写单个人减缓",
                            link: "",
                            price: "350"
                        },
                        {
                            titie: "国际商标注册",
                            link: "",
                            price: "450"
                        }
                    ]
                }
            }
        },
        extract: {}
    },
    "shop.hotSearch": {
        errcode: 0,
        errmsg: "",
        type: "",
        "data|10": [{
            "id|+1": 1,
            title: "@ctitle(3,8)"
        }],
        extract: {
            link: "" // 跳转到指定页面
        }
    },
    "commodity.getType": {
        "errcode": 0,
        "errmsg": "",
        "type": "",
        "data": [{
                "id": 58,
                "name": "\u56fd\u5185\u5546\u6807",
                "type": 1,
                "items": [{
                        "name": "\u52a0\u6025\u5546\u6807\u6ce8\u518c",
                        "id": "1"
                    },
                    {
                        "name": "\u62c5\u4fdd\u5546\u6807\u6ce8\u518c",
                        "id": "29"
                    },
                    {
                        "name": "\u5546\u6807\u8bbe\u8ba1",
                        "id": "30"
                    },
                    {
                        "name": "\u9a73\u56de\u590d\u5ba1",
                        "id": "28"
                    },
                    {
                        "name": "\u5546\u6807\u8f6c\u8ba9",
                        "id": "2"
                    },
                    {
                        "name": "\u5546\u6807\u53d8\u66f4",
                        "id": "3"
                    },
                    {
                        "name": "\u5546\u6807\u7eed\u5c55",
                        "id": "7"
                    },
                    {
                        "name": "\u5546\u6807\u8bb8\u53ef",
                        "id": "5"
                    },
                    {
                        "name": "\u5546\u6807\u64a4\u9500",
                        "id": "6"
                    },
                    {
                        "name": "\u5546\u6807\u5f02\u8bae",
                        "id": "4"
                    },
                    {
                        "name": "\u4e2a\u4f53\u6267\u7167\u529e\u7406",
                        "id": "68"
                    }
                ]
            },
            {
                "id": 59,
                "name": "\u56fd\u9645\u5546\u6807",
                "items": [{
                        "name": "\u9a6c\u5fb7\u91cc",
                        "id": "34"
                    },
                    {
                        "name": "\u6b27\u76df",
                        "id": "35"
                    },
                    {
                        "name": "\u4e9a\u6d32",
                        "id": "36"
                    },
                    {
                        "name": "\u6b27\u6d32",
                        "id": "37"
                    },
                    {
                        "name": "\u5317\u7f8e\u6d32",
                        "id": "38"
                    },
                    {
                        "name": "\u5357\u7f8e\u6d32",
                        "id": "39"
                    },
                    {
                        "name": "\u5927\u6d0b\u6d32",
                        "id": "40"
                    },
                    {
                        "name": "\u975e\u6d32",
                        "id": "41"
                    },
                    {
                        "name": "\u975e\u6d32\u77e5\u8bc6\u4ea7\u6743\u7ec4\u7ec7",
                        "id": "42"
                    },
                    {
                        "name": "\u975e\u6d32\u5730\u533a\u5de5\u4e1a\u4ea7\u6743\u7ec4\u7ec7",
                        "id": "43"
                    }
                ]
            },
            {
                "id": 60,
                "name": "\u56fd\u5185\u4e13\u5229",
                "items": [{
                        "name": "CPC\u63d0\u4ea4\u53d1\u660e",
                        "id": "32"
                    },
                    {
                        "name": "CPC\u63d0\u4ea4\u5b9e\u7528",
                        "id": "59"
                    },
                    {
                        "name": "CPC\u63d0\u4ea4\u5916\u89c2",
                        "id": "60"
                    },
                    {
                        "name": "\u4ee3\u5199\u4e13\u5229",
                        "id": "9"
                    },
                    {
                        "name": "\u53d1\u660e\u4e13\u5229\u5957\u9910",
                        "id": "55"
                    },
                    {
                        "name": "\u5b9e\u7528\u65b0\u578b\u5957\u9910",
                        "id": "56"
                    },
                    {
                        "name": "\u5916\u89c2\u4e13\u5229\u5957\u9910",
                        "id": "57"
                    },
                    {
                        "name": "\u4e13\u5229\u7533\u8bf7\u8d39",
                        "id": "13"
                    },
                    {
                        "name": "\u529e\u767b\u8d39",
                        "id": "61"
                    },
                    {
                        "name": "\u53d1\u660e\u4e13\u5229\u5e74\u8d39",
                        "id": "62"
                    },
                    {
                        "name": "\u5b9e\u7528\/\u5916\u89c2\u5e74\u8d39",
                        "id": "63"
                    },
                    {
                        "name": "\u4e13\u5229\u8457\u5f55\u9879\u76ee\u53d8\u66f4",
                        "id": "66"
                    },
                    {
                        "name": "\u4e13\u5229\u6743\u8bc4\u4ef7\u62a5\u544a",
                        "id": "67"
                    },
                    {
                        "name": "\u4e13\u5229\u4ea4\u6613",
                        "id": "71"
                    }
                ]
            },
            {
                "id": 62,
                "name": "\u56fd\u9645\u4e13\u5229",
                "items": [{
                        "name": "\u9999\u6e2f\u4e13\u5229",
                        "id": "15"
                    },
                    {
                        "name": "PCT\u56fd\u9645\u9636\u6bb5",
                        "id": "27"
                    },
                    {
                        "name": "\u7f8e\u56fd\u4e13\u5229",
                        "id": "14"
                    },
                    {
                        "name": "\u6b27\u76df\u4e13\u5229",
                        "id": "19"
                    },
                    {
                        "name": "\u6fb3\u5927\u5229\u4e9a\u4e13\u5229",
                        "id": "17"
                    },
                    {
                        "name": "\u65b0\u897f\u5170\u4e13\u5229",
                        "id": "48"
                    },
                    {
                        "name": "\u6cd5\u56fd\u4e13\u5229",
                        "id": "49"
                    },
                    {
                        "name": "\u745e\u58eb\u4e13\u5229",
                        "id": "50"
                    },
                    {
                        "name": "\u4fc4\u7f57\u65af\u4e13\u5229",
                        "id": "51"
                    },
                    {
                        "name": "\u5fb7\u56fd\u4e13\u5229",
                        "id": "16"
                    },
                    {
                        "name": "\u65e5\u672c\u4e13\u5229",
                        "id": "20"
                    },
                    {
                        "name": "\u97e9\u56fd\u4e13\u5229",
                        "id": "18"
                    },
                    {
                        "name": "\u52a0\u62ff\u5927\u4e13\u5229",
                        "id": "70"
                    },
                    {
                        "name": "\u6cf0\u56fd\u4e13\u5229",
                        "id": "52"
                    },
                    {
                        "name": "\u5370\u5ea6\u4e13\u5229",
                        "id": "21"
                    },
                    {
                        "name": "\u82f1\u56fd\u4e13\u5229",
                        "id": "22"
                    },
                    {
                        "name": "\u65b0\u52a0\u5761\u4e13\u5229",
                        "id": "53"
                    },
                    {
                        "name": "\u53f0\u6e7e\u4e13\u5229",
                        "id": "54"
                    }
                ]
            },
            {
                "id": 63,
                "name": "\u7248\u6743\u670d\u52a1",
                "items": [{
                        "name": "\u7f8e\u672f\u4f5c\u54c1",
                        "id": "23"
                    },
                    {
                        "name": "\u6587\u5b57\u4f5c\u54c1",
                        "id": "24"
                    },
                    {
                        "name": "\u8ba1\u7b97\u673a\u8f6f\u4ef6",
                        "id": "25"
                    },
                    {
                        "name": "\u6761\u5f62\u7801",
                        "id": "58"
                    },
                    {
                        "name": "\u8865\u6b3e\u4e13\u7528",
                        "id": "69"
                    },
                    {
                        "name": "\u7279\u6b8a\u4e1a\u52a1",
                        "id": "65"
                    },
                    {
                        "name": "\u77e5\u4ea7\u7cfb\u7edf\u5b9a\u5236\u5f00\u53d1",
                        "id": "72"
                    },
                    {
                        "name": "\u5176\u4ed6\u4f5c\u54c1",
                        "id": "26"
                    }
                ]
            }
        ],
        "extract": {
            "class_id": 58,
            "children_id": 1,
            "children_text": "加急商标注册"
        }
    },
    "commodity.getShop": {
        "errcode": 0,
        "errmsg": "",
        "type": "",
        "data": [{
                "id": "16",
                "name": "\u52a0\u6025\u5546\u6807\u6ce8\u518c",
                "oprice": 360,
                "price": 339
            },
            {
                "id": "24",
                "name": "\u8865\u53d1\u5546\u6807\u6ce8\u518c\u8bc1\u7533\u8bf7",
                "oprice": 700,
                "price": 700
            },
            {
                "id": "271",
                "name": "\u62c5\u4fdd\u5546\u6807\u6ce8\u518c",
                "oprice": 1099,
                "price": 1099
            },
            {
                "id": "272",
                "name": "\u4e2a\u4eba\u6ce8\u518c\uff08\u65e0\u6267\u7167\uff09",
                "oprice": 639,
                "price": 639
            },
            {
                "id": "383",
                "name": "\u52a0\u6025\u5546\u6807\u6ce8\u518c\uff08\u719f\u7ec3\uff09",
                "oprice": 330,
                "price": 318
            },
            {
                "id": "388",
                "name": "\u4e2a\u4eba\u6ce8\u518c\u719f\u7ec3\uff08\u65e0\u6267\u7167\uff09",
                "oprice": 618,
                "price": 618
            }
        ],
        "extract": {}
    }
};

module.exports = data;