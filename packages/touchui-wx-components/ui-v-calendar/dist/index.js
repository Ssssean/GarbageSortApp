'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _props = require('../src/props.js');

var _props2 = _interopRequireDefault(_props);

var _date = require('../../libs/date.js');

var _date2 = _interopRequireDefault(_date);

var _objectToStyle = require('../../libs/objectToStyle.js');

var _objectToStyle2 = _interopRequireDefault(_objectToStyle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moment = require('../../../moment/moment.js');
moment.suppressDeprecationWarnings = true;

// 
exports.default = Component({
    behaviors: [_props2.default],
    data: {
        monthsArray: [],
        oldItem: undefined,
        scrollTop: 0,
        oldRangeLeftItem: undefined,
        oldRangeRightItem: undefined,
        heightCount: 50,
        myItem: undefined,
        rangeRightItem: undefined,
        rangeLeftItem: undefined,
        inRangeArray: []
    },
    ready: function ready() {
        this.data.monthsArray.splice(0, this.data.monthsArray.length);
        var startMonthAnchor = void 0;
        var endMonthAnchor = void 0;
        if (isNaN(Number(this.data.dateRange[0]))) {
            // 字符串
            startMonthAnchor = this.data.dateRange[0] + '/01';
            endMonthAnchor = this.data.dateRange[1] + '/01';
        } else {
            startMonthAnchor = moment().subtract(this.data.dateRange[0], 'months').format('YYYY/MM/DD');

            endMonthAnchor = moment().add(this.data.dateRange[1], 'months').format('YYYY/MM/DD');
        }

        for (var i = 0;; i++) {
            var year = moment(startMonthAnchor).year();
            var month = moment(startMonthAnchor).month() + 1;
            var day = moment(startMonthAnchor).date();
            var startMonthDater = new _date2.default(year, month, day).monthDays; // Dater使用的是正常月份
            var monthArray = this.getMonthArray(startMonthDater, i);
            monthArray.monthIndex = i;
            this.data.monthsArray.push(monthArray);
            if (moment(startMonthAnchor).isSame(endMonthAnchor, 'month')) {
                // 相同
                break;
            }
            startMonthAnchor = moment(startMonthAnchor).add(1, 'month');
        }

        if (this.data.value) {
            if (typeof this.data.value === 'string') {
                var dIndex = this.momentTransToItem(moment(this.data.value)).dayIndex;
                var mIndex = this.momentTransToItem(moment(this.data.value)).monthIndex;
                this.selectSingle(mIndex, dIndex, false);
            } else {
                // 
                var _dIndex = this.momentTransToItem(moment(this.data.value[0])).dayIndex;
                var _mIndex = this.momentTransToItem(moment(this.data.value[0])).monthIndex;
                this.selectRange(_mIndex, _dIndex, false);
                _mIndex = this.momentTransToItem(moment(this.data.value[1])).monthIndex;
                _dIndex = this.momentTransToItem(moment(this.data.value[1])).dayIndex;
                this.selectRange(_mIndex, _dIndex, false);
            }
        }

        // }, 3000);

        this.setData({
            monthsArray: this.data.monthsArray,
            monthTitleStyle: (0, _objectToStyle2.default)(this.data.monthTitleStyle),
            calendarWrapStyle: (0, _objectToStyle2.default)(this.calendarWrapStyleObj())
        });
        var startMoment = void 0;
        if (this.data.startShow === 'today') {
            startMoment = moment();
        } else {
            startMoment = moment(this.data.startShow);
        }

        for (var _i = 0; _i < this.data.monthsArray.length; _i++) {
            if (this.itemTransToMoment(this.data.monthsArray[_i]).isSame(startMoment, 'month')) {
                this.setData({
                    scrollTop: this.data.monthsArray[_i].positionY
                });
            }
        }
    },

    methods: {
        calendarWrapStyleObj: function calendarWrapStyleObj() {
            var style = {};
            style.height = this.data.height + 'px';
            return style;
        },
        itemTransToMoment: function itemTransToMoment(item) {
            if (item.day) {
                return moment(item.year + '/' + item.month + '/' + item.day);
            } else {
                return moment(item.year + '/' + item.month);
            }
        },
        momentTransToItem: function momentTransToItem(moment) {
            for (var i = 0; i < this.data.monthsArray.length; i++) {
                for (var j = 0; j < this.data.monthsArray[i].data.length; j++) {
                    if (moment.isSame(this.itemTransToMoment(this.data.monthsArray[i].data[j]), 'day')) {
                        return this.data.monthsArray[i].data[j];
                    }
                }
            }
        },
        inRangeSelect: function inRangeSelect(rightItem, startI, endI, select) {
            if (!select) {
                this.data.inRangeArray.length = 0;
                return;
            }
            for (var i = startI; i <= endI; i++) {
                for (var j = 0; j < this.data.monthsArray[startI].data.length; j++) {
                    // 
                    if (this.data.monthsArray[i].data[j].isThisMonth && this.itemTransToMoment(this.data.monthsArray[i].data[j]).isAfter(this.itemTransToMoment(this.data.oldRangeLeftItem), 'day') && this.itemTransToMoment(this.data.monthsArray[i].data[j]).isBefore(this.itemTransToMoment(rightItem), 'day')) {
                        this.data.inRangeArray.push(this.data.monthsArray[i].data[j]);
                    }
                    if (this.itemTransToMoment(this.data.monthsArray[i].data[j]).isSame(this.itemTransToMoment(rightItem), 'day')) {
                        break;
                    }
                }
            }
            this.setData({
                inRangeArray: this.data.inRangeArray
            });
        },
        selectRange: function selectRange(mIndex, dIndex, manual) {
            this.data.inRangeArray.length = 0;
            this.setData({
                inRangeArray: this.data.inRangeArray
            });
            var selectItem = this.data.monthsArray[mIndex].data[dIndex];
            var selectMoment = this.itemTransToMoment(selectItem);
            if (selectItem.isPastDay && this.data.disablePastDays) {
                this.triggerEvent('failed');
                return;
            }
            if (selectItem.isForeDay && this.data.disableForeDays) {
                this.triggerEvent('failed');
                return;
            }
            if (selectItem.isToday && !this.data.canSelectToday) {
                this.triggerEvent('failed');
                return;
            }
            if (!this.data.oldRangeLeftItem && !this.data.oldRangeRightItem) {
                // 两边都没有
                selectItem.isRangeLeft = true; // 变颜色
                this.data.oldRangeLeftItem = selectItem; // 第一支选
                if (manual) {
                    this.triggerEvent('selectedstart', selectItem.value);
                }
                this.setData({
                    rangeLeftItem: selectItem
                });
            } else if (this.data.oldRangeLeftItem, !this.data.oldRangeRightItem) {
                //左有右没有
                // maxRange选取
                if (this.data.maxRange) {
                    if (this.itemTransToMoment(this.data.oldRangeLeftItem).add(this.data.maxRange, 'day').isBefore(selectMoment, 'day')) {
                        this.triggerEvent('failed');
                        return;
                    }
                }
                if (this.itemTransToMoment(this.data.oldRangeLeftItem).isAfter(selectMoment, 'day')) {
                    // 如果选择在之前
                    // this.data.oldRangeLeftItem = this.
                    this.data.oldRangeLeftItem.isRangeLeft = false;
                    selectItem.isRangeLeft = true; // 变颜色
                    this.data.oldRangeLeftItem = selectItem;
                    if (manual) {
                        this.triggerEvent('selectedstart', selectItem.value);
                    }
                    this.setData({
                        rangeLeftItem: selectItem
                    });
                } else if (this.itemTransToMoment(this.data.oldRangeLeftItem).isBefore(selectMoment, 'day')) {
                    // 如果选择在之后
                    selectItem.isRangeRight = true; // 变颜色
                    this.data.oldRangeRightItem = selectItem; // 老东西
                    var startI = this.data.oldRangeLeftItem.monthIndex;
                    var endI = selectItem.monthIndex;
                    this.inRangeSelect(selectItem, startI, endI, true);
                    if (manual) {
                        this.triggerEvent('selectedend', [this.data.oldRangeLeftItem.value, selectItem.value]);
                    }
                    this.setData({
                        rangeRightItem: selectItem
                    });
                } else {
                    selectItem.isRangeLeft = false; // 变颜色
                    this.data.oldRangeLeftItem = undefined;
                }
            } else {
                //如果都有
                var _startI = this.data.oldRangeLeftItem.monthIndex;
                var _endI = this.data.oldRangeRightItem.monthIndex;
                this.inRangeSelect(this.data.oldRangeRightItem, _startI, _endI, false);
                this.data.oldRangeLeftItem.isRangeLeft = false;
                this.data.oldRangeRightItem.isRangeRight = false;
                this.data.oldRangeRightItem = undefined;
                selectItem.isRangeLeft = true; // 变颜色
                this.data.oldRangeLeftItem = selectItem; // 老东西
                if (manual) {
                    this.triggerEvent('selectedstart', selectItem.value);
                }
                this.setData({
                    rangeLeftItem: selectItem,
                    rangeRightItem: { value: '' }
                });
            }
        },
        selectSingle: function selectSingle(mIndex, dIndex, manual) {

            var selectItem = this.data.monthsArray[mIndex].data[dIndex];

            if (selectItem.isPastDay && this.data.disablePastDays) {
                this.triggerEvent('failed');
                return;
            }
            if (selectItem.isForeDay && this.data.disableForeDays) {
                this.triggerEvent('failed');
                return;
            }
            if (selectItem.isToday && !this.data.canSelectToday) {
                this.triggerEvent('failed');
                return;
            }
            if (this.data.oldItem) {

                this.data.oldItem.isClicked = false;
            }
            this.data.monthsArray[mIndex].data[dIndex].isClicked = true;
            this.data.oldItem = this.data.monthsArray[mIndex].data[dIndex];
            if (manual) {
                this.triggerEvent('change', selectItem.value);
            }
            this.setData({
                myItem: this.data.monthsArray[mIndex].data[dIndex]
            });

            // this.$emit('change', this.AnchorToDayString(this.timeAnchor))
        },
        touchStartHandler: function touchStartHandler(e) {
            var mIndex = e.currentTarget.dataset.monthIndex;
            var dIndex = e.currentTarget.dataset.dayIndex;
            var selectItem = this.data.monthsArray[mIndex].data[dIndex];

            if (this.data.selectRangeMode) {
                this.selectRange(mIndex, dIndex, true);
            } else {
                this.selectSingle(mIndex, dIndex, true);
            }

            // this.setData({
            //   monthsArray: this.data.monthsArray
            // })
            // this.data.monthsArray['monthIndex'].
            // e.currentTarget.dataset.item.isThisMonth = false
            // 
        },
        getMonthArray: function getMonthArray(date, monthIndex) {
            var monthArray = {};
            var lineCount = 0;
            var count = 0;
            monthArray.data = [];

            monthArray.year = date.year;
            monthArray.month = date.month;
            if (date.preMonthDays.length >= 7) {
                date.preMonthDays.splice(date.preMonthDays.length - 7, 7);
                lineCount++;
            }
            for (var i = 0; i < date.preMonthDays.length; i++) {
                var obj = {};
                obj.day = date.preMonthDays[i];
                obj.month = date.month;
                obj.year = date.year;
                obj.value = obj.year + '/' + (obj.month < 10 ? '0' : '') + obj.month + '/' + (obj.day < 10 ? '0' : '') + obj.day;
                obj.isThisMonth = false;
                obj.isClicked = false;
                obj.isRangeLeft = false;
                obj.isRangeRight = false;
                obj.isInRange = false;
                obj.monthIndex = monthIndex;
                obj.dayIndex = count;
                if ([0, 6].indexOf(moment(obj.value).weekday()) !== -1) {
                    obj.isHoliday = true;
                }
                monthArray.data.push(obj);
                count++;
            }
            for (var _i2 = 0; _i2 < date.thisMonthDays.length; _i2++) {
                var _obj = {};
                _obj.day = date.thisMonthDays[_i2];
                _obj.month = date.month;
                _obj.year = date.year;
                _obj.isThisMonth = true;
                _obj.isClicked = false;
                _obj.isRangeLeft = false;
                _obj.isRangeRight = false;
                _obj.isInRange = false;
                _obj.monthIndex = monthIndex;
                _obj.dayIndex = count;
                _obj.value = _obj.year + '/' + (_obj.month < 10 ? '0' : '') + _obj.month + '/' + (_obj.day < 10 ? '0' : '') + _obj.day;

                if ([0, 6].indexOf(moment(_obj.value).weekday()) !== -1) {
                    _obj.isHoliday = true;
                }
                if (moment(_obj.year + '/' + _obj.month + '/' + _obj.day).isBefore(moment(), 'day')) {
                    _obj.isPastDay = true;
                    _obj.isForeDay = true;
                    _obj.isToday = false;
                } else if (moment(_obj.year + '/' + _obj.month + '/' + _obj.day).isAfter(moment(), 'day')) {
                    _obj.isPastDay = false;
                    _obj.isForeDay = true;
                    _obj.isToday = false;
                } else {
                    _obj.isPastDay = false;
                    _obj.isForeDay = false;
                    _obj.isToday = true;
                }
                monthArray.data.push(_obj);
                count++;
            }
            if (date.nextMonthDays.length >= 7) {
                date.nextMonthDays.splice(date.nextMonthDays.length - 7, 7);
                lineCount++;
            }

            for (var _i3 = 0; _i3 < date.nextMonthDays.length; _i3++) {
                var _obj2 = {};
                _obj2.day = date.nextMonthDays[_i3];
                _obj2.month = date.month;
                _obj2.year = date.year;
                _obj2.isThisMonth = false;
                _obj2.isClicked = false;
                _obj2.isRangeLeft = false;
                _obj2.isRangeRight = false;
                _obj2.isInRange = false;
                _obj2.monthIndex = monthIndex;
                _obj2.dayIndex = count;
                _obj2.value = _obj2.year + '/' + (_obj2.month < 10 ? '0' : '') + _obj2.month + '/' + (_obj2.day < 10 ? '0' : '') + _obj2.day;
                if ([0, 6].indexOf(moment(_obj2.value).weekday()) !== -1) {
                    _obj2.isHoliday = true;
                }
                monthArray.data.push(_obj2);
                count++;
            }
            monthArray.positionY = this.data.heightCount - 50;

            if (lineCount === 0) {
                monthArray.monthHeight = 350;
            } else if (lineCount === 1) {
                monthArray.monthHeight = 300;
            } else {
                monthArray.monthHeight = 250;
            }
            this.data.heightCount += monthArray.monthHeight;

            return monthArray;
        }
    }
});