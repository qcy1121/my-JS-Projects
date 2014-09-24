var jqmNews={
		author:'chyee',
		version:'1.0',
		website:'localhost:jqmNews/'//''http:www.qcy1121.tk'
};
jqmNews.utils={
		setParam:function(name,value){
			localStorage.setItem(name,value);
		},
		getParam:function(name){
			return localStorage.getItem(name);
		}
};