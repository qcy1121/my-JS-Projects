
var StringMap = (function() {
	function StringMap() {
		this.size = 0;
		this.map = Object.create(null);
	}
	;
	StringMap.prototype = {
		get : function(key) {
			return this.map[this.convertKeyToProperty(key)];
		},
		set : function(key, value) {
			if (!this.has(key)) {
				this.size++;
			}
			this.map[this.convertKeyToProperty(key)] = value;
		},
		has : function(key) {
			return this.convertKeyToProperty(key) in this.map;
		},
		remove : function(key) {
			var has = this.has(key);
			var result = delete this.map[this.convertKeyToProperty(key)];
			if (has && result) {
				this.size--;
			}
			return result;
		},
		removeWhere : function(filter) {
			var toRemove = [];
			for ( var prop in this.map) {
				var key = this.convertPropertyToKey(prop);
				if (key && filter(key, this.map[prop])) {
					toRemove.push(key);
				}
			}
			for (var i = 0; i < toRemove.length; i++) {
				this.remove(toRemove[i]);
			}
		},
		forEach : function(functor) {
			for ( var prop in this.map) {
				var key = this.convertPropertyToKey(prop);
				if (key) {
					functor(key, this.map[prop]);
				}
			}
		},
		convertPropertyToKey : function(prop) {
			if (this.map.hasOwnProperty && !this.map.hasOwnProperty(prop)) {
				return null;
			}
			if (prop[prop.length - 1] != '$') {
				return null;
			}
			return prop.substring(0, prop.length - 1);
		},
		convertKeyToProperty : function(key) {
			if ('string' !== typeof (key)) {
				//throw new TypeError('key not a string');
				return null;
			}
			return key + '$';
		},
		isEmpty : function() {
			for ( var prop in this.map) {
				return false;
			}
			return true;
		},
		length : function() {
			return this.size;
		}
	};
	return StringMap;
})();

