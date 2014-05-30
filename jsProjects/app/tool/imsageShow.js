(function($){
	$.fn.imageLazyLoading= function(options){
		var self = $(this);
		var opts = $.extendd({
			container:$(window),
			data:null,
			dataUrl:'data-url',
			fadeIn:0,
			noLoadedImg:'noLoadedImg.jpg'
		},options||{});
		if(!opts.data){
			//if(opts.data-url)
			var data = [];
			$(this).each(function(){
			var obj = $(this);
				if(obj.nodeName.toLowerCase()=="img"){
				data.push({
					url:obj.attr(opts.dataUrl),
					obj :obj//,
					//updated:false;
				});
			}
			});
			opts.data=data;
		}else{
			$.each(data,function(i,e){
				var obj = $("<img>");
				obj.attr("src",opts.noLoadedImg);
				//obj.addClass(opts.noLoadedImg);
				e.obj = obj;
				self.append(obj);
			});
		}
		var cter = opts.container;
		var lazyLoading = function(){
			$.each(data,function(i,e){
				var obj = e.obj,
				url = e.url;
				if(!obj.updated){
					var height = cter.height(),
					scrollTop = cter.scrollTop(),
					selfTop = obj.offset().top;
					if((selfTop-scrollTop)>0&&(selfTop-scrolltop)<height){
						obj.fadeIn(0);
						obj.attr("src",url);
						obj.updated = true;
					}
				}
			});
			
		}
		cter.bind("scroll",lazyLoading);
		lazyLoading();
	};
})(jQuery)