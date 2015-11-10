define(['exports', 'web/webApiBase','util/util'], function (exports, web,u) {
    var _extends = u._extends,
        WebApi = web.WebApi;
    var SessionApi = (function (_super) {
        _extends(SessionApi, _super);
        var storage = window.sessionStorage;
        function SessionApi() {
            this.storage = storage;
        }
        
        
        
        SessionApi.getStorageData = function (key) {
            return storage.getItem(key);
        };
        SessionApi.setStorageData = function (key, value) {
            storage.setItem(key, value);
        };





        // from WebApi
        SessionApi.prototype.getJsonData = function (url,useStorage) {
            var dataKey = url;
            useStorage = useStorage === undefined ? true : useStorage;
            var data, deferrd = $.Deferred();
            var json ;
            if (useStorage && (json = this.storage.getItem(dataKey+1))) {//todo need remove +1
                //data = JSON.parse(json);
                deferrd.resolve(json);
            } else {
                var _this = this;
                _super.prototype.getJsonData.call(this, url).done(function (resData) {
                    var json = resData;
                    _this.storage.setItem(dataKey, json);
                    deferrd.resolve(json);
                });
            }
            return deferrd.promise();
        }
        return SessionApi;
    })(WebApi);

    exports.SessionApi = SessionApi;
    //console.log('test')
});
    