define(['exports', 'util/util'], function (exports, u) {
    var _extends = u._extends, Map = u.Utils.Map;
    var PageType = {
        PAGE: "PAGE",
        NODE: "NODE"
    }
    var Page = (function () {
        function Page(page, title) {
            //console.log(page, title);
            this.page = page;
            this.type = PageType.PAGE;
            this.title = title;

            Object.defineProperty(this, 'key', {
                get: function () { return this.title+this.type; },
                enumerable: true,
                configurable: false,
                writeable:false,
            });
        }
        Page.prototype = {
            toJson: function () {
                var json = {};
                for (var idx in this) {
                    //console.log(idx);
                    json[idx] = this[idx];
                }
                return json;
            },
            fromJson: function (json) {
                for (var idx in json) {
                    this[idx] = json[idx];
                }
            },
            toHtml: function () {
                var html = '<a class="menu_page" data-link="' + this.page + '" >' + this.title + '</a>';
                return html;
            },
            onClick: function () {
                location.href = location.href + "#";
            }
        }

        return Page;
    })();
    var Node = (function (_super) {
        _extends(Node, _super);
       // var map;
        function Node(title) {
            _super.call(this, "", title);
            //console.log("NODE title: ",title);
            this.map = new Map();
            this.type = PageType.NODE;
        }
        Object.defineProperty(Node.prototype,'length', {
            get: function () { var len = this.map.length(); return len; },
            set: function (value) { return },
            enumerable: false,
            configurable: false
        });
        Node.prototype.add = function (page) {
            //console.log(this.title, page.key);
            this.map.set(page.key, page);
        };
        Node.prototype.remove = function (page) {
            this.map.remove(page.key);
        };
        Node.prototype.toJson = function () {
           // console.log('toJSON');
            var map = this.map,
                json = {};
            for (var idx in this) {
                if (idx == 'map') {
                    var mapJson = {};
                    map.forEach(function (key, value) {
                        mapJson[key] = value.toJson();
                    });
                    json[idx] = mapJson;
                } else {
                    json[idx] = this[idx];
                }
            }
            return json;
        };
        Node.prototype. fromJson= function (json) {

            for (var idx in json) {
                if (idx == 'map') {
                    var map = json[idx];
                    for (var key in map) {
                        var nodeJson = map[key], type = nodeJson.type, node;
                        if (type == PageType.NODE) {
                            node = new Node();
                        } else if (type == PageType.PAGE) {
                            node = new Page();
                        }
                        if (!node) throw 'Wrong page type!';
                        node.fromJson(nodeJson);
                        this.add(node);
                    }
                } else {
                    this[idx] = json[idx];
                }
            }
        };
        Node.prototype.clean = function () {
            var removeKeys = [],map = this.map;
            map.forEach(function (key, value) {
                if (value.type == PageType.NODE) {
                    value.clean();
                    if (value.length < 1) {
                        removeKeys.push(key);
                    }
                }
            });
            removeKeys.forEach(function (key) {
                map.remove(key);
            });
            return this;
        }
        Node.prototype.toHtml= function () {
            var map = this.map,
                html = '<div class="menu_node"><label>' + this.title + '</label><div class="node_body" >';
            map.forEach(function (key, value) {
                html += value.toHtml();
            });
            html += '</div></div>';
            return html;
        };
        return Node;
    })(Page);
    exports.PageType = PageType;
    exports.Node = Node;
    exports.Page = Page;
});