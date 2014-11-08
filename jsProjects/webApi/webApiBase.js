define(['exports', 'jquery'], function (exports, $) {
    var _extends = function (c, p) {
        for (var i in p) {
            if (p.hasOwnProperty(i)) {
                c[i] = p[i];
            }
        }
        var _t = function () { this.constructor = p };
        _t.prototype = p.prototype;
        c.prototype = new _t();
    }
    exports._extends = _extends;
    var webApiBase = (function () {
        function webApi(url) {
            this.baseUrl = url;
        }
        webApi.prototype = {

        }
        return webApi;
    })();

    var webApiFactory = (function () {
        function factory () {

        }
        var apiCache = Object.create(null);
        factory.createWebApi = function (baseUrl) {
            if (!apiCache[baseUrl]) {
                var webApi = new webApiBase(baseUrl);
                apiCache[baseUrl] = webApi;
            }
            return apiCache[baseUrl];
        }
    })();

    exports.webApiBase = webApiBase;
    exports.webApiFactory = webApiFactory;
});