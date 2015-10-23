define(['exports', 'jquery', 'util/util', 'web/pageModel', 'web/dataApi', 'web/storageWebApi'], function (exports, $, u, p, dataApi,s) {//,
    var Node = p.Node, page = p.Page;
    var sessionApi = s.SessionApi;
    var PageNav = (function () {
        var PageNav = function () {
            //var location = window.location;
            this.url = location.href;
            this.baseUrl = "../";//location.protocol+"//"+location.host;
            this.dataApi = dataApi.DataApi.getInstance(this.baseUrl);
            this.innerHtml = '';
        };
        //var treeMap = null;
        //var location = null;
        var treeMapkey = 'treeMapHtml';
        PageNav.prototype = {
            init:function(){
                this.loadTreeMap();
            },
            initUrl:function(){
            },
            loadTreeMap :function(){
                var _this = this, html;
                if (html = sessionApi.getStorageData(treeMapkey+1)) {//todo ,need remove +1
                    this.setUpHtml(html);
                } else {
                    this.dataApi.loadTreeMap(this.baseUrl).done(function (jsonStr) {
                        var treeMap = JSON.parse(jsonStr);
                        _this.setTreeMap(treeMap[0]);
                    });
                }
            },
            setTreeMap: function (map) {
                
                var node = new Node();
                node.fromJson(map);
                var html = node.toHtml();
                this.innerHtml = html;
                sessionApi.setStorageData(treeMapkey, this.innerHtml);
                this.initNav();
            },
            setUpHtml: function (html) {
                this.innerHtml = html;
            },
            initNav: function () {
                var navDiv = $("<div class='nav' ><div class='navInner' /></div>"),
                    navInner = navDiv.find('.navInner'),
                    _this = this,
                    clickHandle = function () {
                        var link = _this.baseUrl+"/"+$(this).data("link");
                        console.log(link);
                        _this.onMenuClick(link);
                    };
                var html = this.innerHtml;
                console.log(html);
                navInner.html(html);
                //for (var i in treeMap) {
                //    var menu = $("<a href='javascript:void(0)' class='menu' />");
                //    // menu.text(i).on('click', function (i) { return function () { console.log(i); _this.onMenuClick(i); } }(i));
                //    menu.text(i).data("link", treeMap[i]).on('click', clickHandle);

                //    menu.appendTo(navInner);
                //}
                navDiv.appendTo($("body"));

                navInner.find('a').on('click', clickHandle);
            },
            onMenuClick: function (link) {
                location = link;
            }
        }
        return PageNav;
    })();
    exports.PageNav = PageNav;
    
});

