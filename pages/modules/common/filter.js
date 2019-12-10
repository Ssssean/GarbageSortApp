module.exports = {
    data: {
        filters: [
            ["bq", "orderLabel"],
            ["limit", "offset"],
            "start_time",
            "end_time",
            "leixing",
            "contract_id",
            "shenqinghao",
            "content",
            "status",
            "shop_type"
        ]
    },
    methods: {
        /**
         * 获取筛选条件
         */
        getFilterCondition() {
            let data = this.data;
            let _fields = data.filters;
            let _restful = "";

            _fields.forEach((v, k) => {
                if (typeof v == 'string' && data[v] != "") {
                    _restful += `/${v}/${ typeof data[v] == 'string' ? data[v]: data[v].join(",") }`;
                } else if (typeof v == 'object' && data[v[1]] != "") {
                    _restful += `/${v[0]}/${data[v[1]]}`;
                }
            });
            return _restful;
        },
    }
};