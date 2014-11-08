
define(['exports','jquery','web/webApiBase'], function (exports,$,webApiBase) {
    var webApi = webApiBase.webApiBase;
    var dataApi = (function () {
        var dataApi = function () {


        }
        var dataApiInstance = null;
        dataApi.getInstance = function () {
            if (!dataApiInstance) {
                dataApiInstance = new dataApi();
            }
            return dataApiInstance;

        }

        dataApi.prototype = {
            loadTreeMap: function (url) {
                //todo: mock data
                var data = {
                    'menu1testsdfd': './test',
                    'menu2': './test'
                }, deferrd = $.Deferred();
                deferrd.resolve(data);
                return deferrd.promise();
            }
        }
        return dataApi;
    })();

    exports.dataApi = dataApi;
}); 