define(['exports'], function (exports) {
    var Utils = (function () {
        var Utils = function () { };
        var Map = function () {
            this.map = Object.create(null);
        }
        Map.prototype = {
            get: function (key) {
                return this.map[this.convertKeyToProperty(key)];
            }, set: function (key, value) {
                this.map[this.convertKeyToProperty(key)] = value;
            }, has: function (key) {
                return this.convertKeyToProperty(key) in this.map;
            }, remove: function (key) {
                return delete this.map[this.convertKeyToProperty(key)];
            }, removeWhere: function (filter) {
                var toRemove = [];
                for (var prop in this.map) {
                    var key = this.convertPropertyToKey(prop);
                    if (key && filter(key, this.map[prop])) {
                        toRemove.push(key);
                    }
                }
                for (var i = 0; i < toRemove.length; i++) {
                    this.remove(toRemove[i]);
                }
            }, forEach: function (functor) {
                for (var prop in this.map) {
                    var key = this.convertPropertyToKey(prop);
                    if (key) {
                        functor(key, this.map[prop]);
                    }
                }
            }, convertPropertyToKey: function (prop) {
                if (this.map.hasOwnProperty && !this.map.hasOwnProperty(prop)) {
                    return null;
                }
                if (prop[prop.length - 1] != '$') {
                    return null;
                }
                return prop.substring(0, prop.length - 1);
            }, convertKeyToProperty: function (key) {
                if ('string' !== typeof (key)) {
                    //throw new TypeError('key not a string');
                    return null;
                }
                return key + '$';
            }, isEmpty: function () {
                for (var prop in this.map) {
                    return false;
                }
                return true;
            }, length: function () {
                var size = 0;
                for (var i in this.map) {
                    size++;
                }
                return size;
            }
        };
        Utils.Map = Map;


        return Utils;
    })();



    exports.Utils = Utils;
});