define(['exports', 'jquery'], function (exports, $) {
    
    var WebApi = (function () {
        function WebApi(url) {
            this.baseUrl = url;
        }
        
        WebApi.getInstance = function (url) {
            return WebApiFactory.getInstance(url,this);//todo .Need to mark sure why it can work and it's right or wrong.
        }
        WebApi.prototype = {
            getJsonData: function (url) {
                var data, deferrd = $.Deferred();
                $.get(url).done(function (resData) {

                    deferrd.resolve(resData);
                }).fail(function (e) {
                    deferrd.reject(e);
                });

                return deferrd.promise();
            }
        }
        return WebApi;
    })();

    var WebApiFactory = (function () {
        function factory () {

        }
        var apiCache = Object.create(null);
        factory.getInstance = function (baseUrl,constructorFun) {
            if (!apiCache[baseUrl]) {
                var webApi = new constructorFun(baseUrl);
                apiCache[baseUrl] = webApi;
            }
            return apiCache[baseUrl];
        }
        return factory;
    })();

    exports.WebApi = WebApi;
    exports.WebApiFactory = WebApiFactory;
});