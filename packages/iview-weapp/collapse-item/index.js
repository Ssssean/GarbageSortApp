Component({
    externalClasses: ['i-class-content', 'i-class-title', 'i-class', 'i-title-wrap-class', 'i-collapse-item-arrow'],

    relations: {
        '../collapse/index': {
            type: 'parent',
            linked: function(target) {
                const options = {
                    accordion: target.data.accordion
                }
                if (target.data.name === this.data.name) {
                    options.showContent = 'i-collapse-item-show-content';
                }
                this.setData(options);
            }
        },
        '../cell-group/index': {
            type: 'child'
        }
    },

    properties: {
        title: String,
        name: String
    },

    data: {
        showContent: '',
        accordion: false
    },

    options: {
        multipleSlots: true
    },

    methods: {
        trigger(e) {
            const data = this.data;
            if (data.accordion) {
                this.triggerEvent('collapse', { name: data.name }, { composed: true, bubbles: true });
            } else {
                this.setData({
                    showContent: data.showContent ? '' : 'i-collapse-item-show-content'
                });
                if (this.data.showContent != '') {
                    const allList = this.getRelationNodes('../cell-group/index');
                    let _element = allList[0];
                    if (_element) {
                        _element = _element.getRelationNodes('../cell/index');
                        _element = _element[0] || null;
                    }
                    this.triggerEvent('dexpand', { name: data.name, first: _element }, { composed: true, bubbles: true });
                }
            }
        }
    }
});