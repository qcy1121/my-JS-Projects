/*
 * there are two ways to get/set data:
 * 1. use storage of html5
 * 2. use ajax request form the server.
 * 
 */



define(["exports","jquery"],function(exports,$){
	
	var StorageApi = (function(){
		function StorageApi(storage){
			this.storage = storage?storage:localStorage;
			
			if(!this.storage){ alert("not suport"); return null;}
			//this.storage = isSession?sessionStorage:localStorage;
		}
		StorageApi.prototype = {
	            getItem : function( key ) {
	                return this.storage.getItem(key);
	            },
	            
	            setItem : function( key, value ) {
	            	console.log(key+" "+value);
	                return this.storage.setItem(key, value);
	            },
	            get:function(key){
	            	var obj = JSON.parse(this.getItem(key));
	            	return obj;
	            },
	            set:function(key,obj){
	            	var value =JSON.stringify(obj);
	            	return this.setItem(key,value);
	            },

	            removeItem : function( key ) {
	                 return this.storage.removeItem(key);
	            },

	            clear : function() {
	            	return this.storage.clear();
	            },
	            remove:function(key){
	            	this.removeItem(key);
	            }
		};
		return StorageApi;
	})();
	exports.StorageApi  = StorageApi;
	
	var WebApi = (function(){
		function WebApi(){
			
		}
		
		WebApi.prototype = {
				
		};
		return WebApi;
	})();
	exports.WebApi = WebApi;
});