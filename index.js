var vm = new Vue({
    el: '#app',
    data: {
        // apiBase: 'https://cdn.statically.io/gh/fysh711426/VtuberData/master/api/',
        apiBase: 'https://raw.githubusercontent.com/fysh711426/VtuberData/master/api/',
        menu: '',
        submenu: '',
        day: '',
        showDay: false,
        showRankVar: false,
        errorImage: null,
        isLoaded: false,
        datas: [],
        showCount: 20,
        showSpinner: false,
        isLoadMore: false
    },
    methods: {
        init: async function () {
            this.menu = getParameter('m') || 'popular';
            this.submenu = getParameter('s') || 'tw';
            if (this.menu === 'popular' || this.menu === 'singing') {
                this.day = getParameter('d') || '7';
                this.showDay = true;
            }
            this.showRankVar = true;
            // if (this.menu === 'popular' || this.menu === 'subscribe') {
            //     this.showRankVar = true;
            // }
            progress.config({
                color: '#ffb600'
            });
            progress.start();
            selectMenu(this.menu);
            selectSubMenu(this.submenu);
            gotop('.gotop');
            onScrollEnd(this.onScrollEnd, 50);
            this.errorImage = await this.loadedErrorImage(
                'https://cdn.statically.io/gh/fysh711426/fysh711426.github.io/master/mini-form-ui/images/default-head-176x176.png');
            this.datas = await this.getData();
            this.checkSpinner();
            var _this = this;
            setTimeout(function () {
                _this.isLoaded = true;
                progress.done();
                setTimeout(function () {
                    tooltip('.tooltip');
                    spinner('.spinner');
                }, 1);
            }, 1);
        },
        getApi: function () {
            return this.apiBase +
                this.menu + '_' +
                this.submenu + (this.showDay ? '_day' + this.day : '') + '.json';
        },
        getData: async function () {
            var api = this.getApi();
            if (api) {
                var response = await axios.get(api);
                return response.data;
            }
        },
        onScrollEnd: function() {
            if (!this.isLoadMore) {
                this.isLoadMore = true;
                setTimeout(() => {
                    if (this.showCount < this.datas.length) {
                        this.showCount += 20;
                    }
                    this.checkSpinner();
                    this.isLoadMore = false;
                }, 500);
            }
        },
        checkSpinner: function() {
            this.showSpinner = false;
            if (this.showCount < this.datas.length) {
                this.showSpinner = true;
            }
        },
        imgError: function (e) {
            if (this.errorImage) {
                e.target.src = this.errorImage;
            }
        },
        loadedErrorImage: function (url) {
            return new Promise(function (resolve) {
                var img = new Image();
                img.onload = function () {
                    if (this.complete === true) {
                        resolve(url);
                        img = null;
                    }
                }
                img.onerror = function () {
                    resolve(null);
                    img = null;
                }
                img.src = url;
            });
        }
    },
    mounted() {
        this.init();
    }
});
