var notepad={
		author:'chyee',
		version:'1.0',
		website:'localhost:notepad/'//''http:www.qcy1121.tk'
};
notepad.utils={
		setParam:function(name,value){
			localStorage.setItem(name,value);
		},
		getParam:function(name){
			return localStorage.getItem(name);
		}
};