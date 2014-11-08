define(['exports', 'jquery','web/webApiBase','util/util'], function (exports,$, webApiBase,util) {
    var CacheManager = (function () {
        function CacheManager() {
            this.map = util.Utils.Map();
        }
        CacheManager.prototype = {
            get: function (cachePath, createCallback) {
                var cacheItem = this.map.get(cachePath);
                if (!cacheItem) {
                    cacheItem = new CacheItem(cachePath);
                    this.map.set(cachePath, cacheItem);
                }
                return cacheItem.get(createCallback);
            }, removeWhere: function (filter) {
                this.map.removeWhere(function (key, item) {
                    return filter(key, item.getCachedValue());
                });
            }, getPromise: function (cachePath, createAsyncCallback) {
                var cacheItem = this.map.get(cachePath);
                if (!cacheItem) {
                    cacheItem = new CacheItem(cachePath);
                    this.map.set(cachePath, cacheItem);
                }
                return cacheItem.getPromise(createAsyncCallback);
            }
        }
        return CacheManager;
    })();
    exports.CacheManager = CacheManager;
    var CacheItem = (function () {
        function CacheItem(cachePath) {
            this.cachePath = cachePath;
            this.deferred = null;
            this.cachedResult = null;
            this.cachePath = cachePath;
        }
        CacheItem.prototype = {
            get: function (createCallback) {
                if (!this.cachedResult) {
                    if (createCallback) {
                        this.setCachedResult(createCallback(this.cachePath));
                    }
                }
                return this.getCachedValue();
            }, getPromise: function (createAsyncCallback) {
                var _this = this;
                if (!this.deferred) {
                    this.deferred = $.deferred();
                    if (this.cachedResult == null) {
                        createAsyncCallback(this.cachePath).then(function (result) {
                            return _this.setCachedResult(result);
                        }, function (err) {
                            return _this.deferred.reject(err);
                        });
                    } else {
                        this.deferred.resolve(this.cachedResult.value);
                    }
                }
                return this.deferred.promise;
            }, getCachedValue: function () {
                return this.cachedResult ? this.cachedResult.value : null;
            }, setCachedResult: function (result) {
                if (result && result.isCacheResult) {
                    this.cachedResult = result;
                } else {
                    this.cachedResult = new CacheResult(result);
                }
                if (this.deferred) {
                    this.deferred.resolve(this.getCachedValue());
                    this.deferred = null;
                }
            }
        }
        return CacheItem;
    })();

    var CacheResult = (function () {
        function CacheResult(value) {
            // TODO - need parameters to control cache lifetime and expiry rules
            //importance: string;
            //expiry: any;
            //lifetime: any;
            this.isCacheResult = true;
            this.value = value;
        }
        return CacheResult;
    })();
    exports.CacheResult = CacheResult;
});