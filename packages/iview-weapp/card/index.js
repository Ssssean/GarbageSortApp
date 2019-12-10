Component({
    externalClasses: ['i-class', 'i-title-class'],

    options: {
        multipleSlots: true
    },

    data: {
        bodyClass: "i-card-body"
    },

    properties: {
        full: {
            type: Boolean,
            value: false
        },
        thumb: {
            type: String,
            value: ''
        },
        title: {
            type: String,
            value: ''
        },
        extra: {
            type: String,
            value: ''
        },
        noneHeader: {
            type: Boolean,
            value: false
        },
        noneFooter: {
            type: Boolean,
            value: false
        }
    },
    lifetimes: {
        ready() {
            if (this.properties.noneHeader) {
                this.setData({
                    bodyClass: "i-card-body-none-header"
                });
            }
        }
    }
});