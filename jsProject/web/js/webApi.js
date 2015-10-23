define(["exports", "jquery", "app/utils"], function (exports, $) {
    var webApi = (function () {
        function webApi() {

        };
        webApi.prototyp = {//todo ,some basic methods were copied from some dojo request, not test.
            makeGetRequest: // make a generic request with GET method and no-cache
                function (url) {
                    var WebApi = this;
                    return $.ajax(url, {
                        method: "GET",
                        timeout: this.defaultTimeout,
                        handleAs: "json",
                        headers: WebApi.makeJsonHeaders(),
                        preventCache: true
                    });
                },
            makeGetRequestNoHandler: function (url) {
                var WebApi = this;
                return $.ajax(url, {
                    method: "GET",
                    timeout: this.defaultTimeout,
                    headers: WebApi.makeJsonHeaders()
                });
            },
            makePostRequest: // make a generic request with POST method and no-cache
                function (url, jsonData) {
                    var WebApi = this;
                    return $(url, {
                        method: "POST",
                        timeout: this.defaultTimeout,
                        data: jsonData,
                        handleAs: "json",
                        headers: WebApi.makeJsonHeaders()
                    });
                },
            makeJsonHeaders: function () {
                var WebApi = this;
                var headers = {
                    'Content-Type': "application/json"
                };
                if (WebApi.appSessionId) {
                    headers['X-Pt-App-Session'] = WebApi.appSessionId;
                }
                return headers;
            },
            load:{
                //todo webApi methods.

            }
        };
        webApi.urlEncodeProjectId = //To avoid GET http://localhost/api/admin/manage/save/5fa3d8e6-0cc3-459e-b483-6173336aefac.edit 404 (Not Found)
            //Replace "." with "_" in last parameter
            function urlEncodeProjectId(param) {
                if (param != null && param.indexOf(".") > 0) {
                    param = param.replace(".", "_");
                }
                return param;
            };
        webApi.defaultTimeout = 600000;
        webApi.headers = {
            'Content-Type': "application/json"
        };
        webApi.baseAppPath = '';
        return new webApi();

    })();
    exports.webApi = webApi;
});