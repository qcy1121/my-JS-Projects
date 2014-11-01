define(['exports', 'jquery','dataApi'], function (exports, $,dataApi) {
    var pageNav = (function () {
        var pageNav = function () {
            location = window.location;
            this.url = location.href;
            this.loadTreeMap();
        };
        var treeMap = null;
        var location = null;

        pageNav.prototype = {
            initUrl:function(){

            },
            loadTreeMap :function(){
                var _this = this;
                dataApi.loadTreeMap(this.url).then(function (treeMap) {
                    _this.setTreeMap(treeMap);
                });
            },
            setTreeMap: function (map) {
                treeMap = map;
                this.initNav();
            },
            initNav: function () {

            }

        }

    });

});