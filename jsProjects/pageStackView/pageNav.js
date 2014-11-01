define(['exports', 'jquery','web/dataApi'], function (exports, $,dataApi) {
    var pageNav = (function () {
        var pageNav = function () {
            location = window.location;
            this.url = location.href;
            this.dataApi = dataApi.dataApi.getInstance();
            this.baseUrl = null;
        };
        var treeMap = null;
        var location = null;

        pageNav.prototype = {
            init:function(){
                this.loadTreeMap();
            },
            initUrl:function(){
                // this.baseUrl = this.url
                this.baseUrl = "file:///E:/workspace/zepto-master/";
            },
            loadTreeMap :function(){
                var _this = this;
                this.dataApi.loadTreeMap(this.url).done(function (treeMap) {
                    _this.setTreeMap(treeMap);
                });
            },
            setTreeMap: function (map) {
                this.treeMap = map;
                this.initNav();
            },
            initNav: function () {
                var navDiv = $("<div class='nav' ><div class='navInner' /></div>"),
                    navInner = navDiv.find('.navInner'),
                    treeMap = this.treeMap, _this = this,
                    clickHandle = function () {
                        var link = $(this).data("link");
                        console.log(link);
                        _this.onMenuClick(link);
                    }
                for (var i in treeMap) {
                    var menu = $("<a href='javascript:void(0)' class='menu' />");
                    // menu.text(i).on('click', function (i) { return function () { console.log(i); _this.onMenuClick(i); } }(i));
                    menu.text(i).data("link", treeMap[i]).on('click', clickHandle);

                    menu.appendTo(navInner);
                }
                navDiv.appendTo($("body"));
            },
            onMenuClick: function (key) {
                location.href = location.href + "#";
            }

        }
        return pageNav;
    })();
    exports.pageNav = pageNav;

});