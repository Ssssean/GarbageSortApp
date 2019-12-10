const formatTime = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
};

//获取当前日期的方法
const formatDate = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    console.log(day);

    return [year, month, day].map(formatNumber).join('-')
};

const formatNumber = n => {
    n = n.toString();
    return n[1] ? n : '0' + n;
};

const dateFormat = obj => {
    let date = new Date(obj);
    let y = 1900 + date.getYear();
    let m = '0' + (date.getMonth() + 1);
    let d = '0' + date.getDate();
    return y + '/' + m.substring(m.length - 2, m.length) + '/' + d.substring(d.length - 2, d.length);
}

const _interopRequireDefault = obj => {
    return obj && obj.__esModule ? obj : { default: obj };
};

const data = (e, key) => {
    if (e.currentTarget && e.currentTarget.dataset) {
        if (key) {
            return e.currentTarget.dataset[key];
        } else {
            return e.currentTarget.dataset;
        }
    }
    return {};
}

/** 精准算法 */
const calc = {
    /**
     * 加法运算
     * @param   {float} arg1 第一个加数
     * @param   {float} arg2 第二个加数
     * @param   {int}   [2]  要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
     * @returns {float}     两数相加的结果
     */
    add: function(arg1, arg2) {
        arg1 = this.format(arg1.toString()), arg2 = this.format(arg2.toString());
        let arg1Arr = arg1.split("."),
            arg2Arr = arg2.split("."),
            d1 = arg1Arr.length == 2 ? arg1Arr[1] : "",
            d2 = arg2Arr.length == 2 ? arg2Arr[1] : "";
        let maxLen = Math.max(d1.length, d2.length);
        let m = Math.pow(10, maxLen);
        let result = Number(((arg1 * m + arg2 * m) / m).toFixed(maxLen));
        let d = arguments[2];
        let s = arguments[3]; // 必须返回字符串

        return typeof d === "number" ? (s == true ? (result).toFixed(d) : Number((result).toFixed(d))) : result;
    },
    /**
     * 减法运算
     * @param {float} arg1 第一个数 
     * @param {float} arg2 减数 
     * @param {int} [2]  要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
     */
    sub: function(arg1, arg2) {
        return this.add(this.format(arg1), -Number(this.format(arg2)), arguments[2]);
    },
    /**
     * 乘法函数
     * @param {float} arg1 第一个数
     * @param {float} arg2 乘数
     * @param {int} [2]  要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
     */
    mul: function(arg1, arg2) {
        let r1 = this.format(arg1.toString()),
            r2 = this.format(arg2.toString()),
            m, resultVal, d = arguments[2];
        m = (r1.split(".")[1] ? r1.split(".")[1].length : 0) + (r2.split(".")[1] ? r2.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) * Number(r2.replace(".", "")) / Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    },
    /**
     * 除法
     * @param {float} arg1 被除数
     * @param {float} arg2 除数
     * @param {int} [2]  要保留的小数位数（可以不传此参数，如果不传则不处理小数位数）
     */
    div: function(arg1, arg2) {
        let r1 = this.format(arg1.toString()),
            r2 = this.format(arg2.toString()),
            m, resultVal, d = arguments[2];
        m = (r2.split(".")[1] ? r2.split(".")[1].length : 0) - (r1.split(".")[1] ? r1.split(".")[1].length : 0);
        resultVal = Number(r1.replace(".", "")) / Number(r2.replace(".", "")) * Math.pow(10, m);
        return typeof d !== "number" ? Number(resultVal) : Number(resultVal.toFixed(parseInt(d)));
    },
    format: function(arg1) {
        if (isNaN(arg1)) {
            arg1 = arg1.replace(",", "");
        }
        return arg1;
    },
    /**
     * 将1,000.00转换成1000
     * @param {String} money 
     */
    undoNubmer: function(money) {
        if (money && money != null) {
            money = String(money);
            var group = money.split('.');
            var left = group[0].split(',').join('');
            return Number(left + "." + group[1]);
        } else {
            return "";
        }
    },
    /**
     * 将1000转换成1,000.00
     * @param {Number} money 
     */
    dealNumber: function(money) {
        if (money && money != null) {
            money = String(money);
            var left = money.split('.')[0],
                right = money.split('.')[1];
            right = right ? (right.length >= 2 ? '.' + right.substr(0, 2) : '.' + right + '0') : '.00';
            var temp = left.split('').reverse().join('').match(/(\d{1,3})/g);
            return (Number(money) < 0 ? "-" : "") + temp.join(',').split('').reverse().join('') + right;
        } else if (money === 0) {
            return '0.00';
        } else {
            return "";
        }
    }
};

String.prototype.match_all = function(regexp) {
    let arr = [],
        result = null;
    while ((result = regexp.exec(this)) != null) {
        arr.push(result);
    }
    return arr;
}


Date.prototype.format = function(formatStr) {
    var date = this;
    /*  
    函数：填充0字符  
    参数：value-需要填充的字符串, length-总长度  
    返回：填充后的字符串  
    */
    var zeroize = function(value, length) {
        if (!length) {
            length = 2;
        }
        value = new String(value);
        for (var i = 0, zeros = ''; i < (length - value.length); i++) {
            zeros += '0';
        }
        return zeros + value;
    };
    return formatStr.replace(/"[^"]*"|'[^']*'|\b(?:d{1,4}|M{1,4}|yy(?:yy)?|([hHmstT])\1?|[lLZ])\b/g, function($0) {
        switch ($0) {
            case 'd':
                return date.getDate();
            case 'dd':
                return zeroize(date.getDate());
            case 'ddd':
                return ['Sun', 'Mon', 'Tue', 'Wed', 'Thr', 'Fri', 'Sat'][date.getDay()];
            case 'dddd':
                return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()];
            case 'M':
                return date.getMonth() + 1;
            case 'MM':
                return zeroize(date.getMonth() + 1);
            case 'MMM':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][date.getMonth()];
            case 'MMMM':
                return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()];
            case 'yy':
                return new String(date.getFullYear()).substr(2);
            case 'yyyy':
                return date.getFullYear();
            case 'h':
                return date.getHours() % 12 || 12;
            case 'hh':
                return zeroize(date.getHours() % 12 || 12);
            case 'H':
                return date.getHours();
            case 'HH':
                return zeroize(date.getHours());
            case 'm':
                return date.getMinutes();
            case 'mm':
                return zeroize(date.getMinutes());
            case 's':
                return date.getSeconds();
            case 'ss':
                return zeroize(date.getSeconds());
            case 'l':
                return date.getMilliseconds();
            case 'll':
                return zeroize(date.getMilliseconds());
            case 'tt':
                return date.getHours() < 12 ? 'am' : 'pm';
            case 'TT':
                return date.getHours() < 12 ? 'AM' : 'PM';
        }
    });
}

if (!Object.keys) {
    Object.keys = (function() {
        var hasOwnProperty = Object.prototype.hasOwnProperty,
            hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
            dontEnums = [
                'toString',
                'toLocaleString',
                'valueOf',
                'hasOwnProperty',
                'isPrototypeOf',
                'propertyIsEnumerable',
                'constructor'
            ],
            dontEnumsLength = dontEnums.length;

        return function(obj) {
            if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

            var result = [];

            for (var prop in obj) {
                if (hasOwnProperty.call(obj, prop)) result.push(prop);
            }

            if (hasDontEnumBug) {
                for (var i = 0; i < dontEnumsLength; i++) {
                    if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                }
            }
            return result;
        }
    })()
};


const route = (e) => {
    return "/" + e['route'];
}

const options = (e) => {
    return "/" + e['options'];
}


function getCtx(selector) {
    const pages = getCurrentPages();
    const ctx = pages[pages.length - 1];
    const componentCtx = ctx.selectComponent(selector);

    if (!componentCtx) {
        console.error('无法找到对应的组件，请按文档说明使用组件');
        return null;
    }
    return componentCtx;
}

function Toast(options) {
    const { selector = '#toast' } = options;
    const ctx = getCtx(selector);
    if (ctx)
        ctx.handleShow(options);
}

Toast.hide = function(selector = '#toast') {
    const ctx = getCtx(selector);
    if (ctx)
        ctx.handleHide();
};

function Message(options) {
    const { selector = '#message' } = options;
    const ctx = getCtx(selector);
    if (ctx)
        ctx.handleShow(options);
}

//判断是否为空数组或空对象
function isEmpty(obj) {
    //检验null和undefined
    if (!obj && obj !== 0 && obj !== '') {
        return false;
    }
    //检验数组
    if (Array.prototype.isPrototypeOf(obj) && obj.length === 0) {
        return false;
    }
    //检验对象
    if (Object.prototype.isPrototypeOf(obj) && Object.keys(obj).length === 0) {
        return false;
    }
    return true;
}


module.exports = {
    formatTime: formatTime,
    formatDate: formatDate,
    dateFormat: dateFormat,
    data: data,
    route: route,
    options: options,
    message: Message,
    toast: Toast,
    calc: calc,
    isEmpty: isEmpty,
    _interopRequireDefault: _interopRequireDefault
};