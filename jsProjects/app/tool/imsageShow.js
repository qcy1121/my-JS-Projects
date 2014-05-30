(function($){
	$.fn.imageLazyLoading= function(options){
		var opts = $.extendd({
			container:$(window),
			data:null,
			dataUrl:'data-url',
			fadeIn:0
		},options||{});
		if(!opts.data){
			//if(opts.data-url)
			var data = [];
			$(this).each(function(){
			var obj = $(this);
				if(obj.nodeName.toLowerCase()=="img"){
				data.push({
					url:$(this).attr(opts.dataUrl),
					obj :obj
				});
			}
			});
			opts.data=[];
		}
		var cter = opts.container;
		var lazyLoading = function(){
			$.each(data,function(i,e){
				var obj = e.obj,
				url = e.url;
				if(obj){
					var height = cter.height(),
					scrollTop = cter.scrollTop(),
					selfTop = obj.offset().top;
					if((selfTop-scrollTop)>0&&(selfTop-scrolltop)<height){
						obj.fadeIn(0);
						obj.attr("src",url);
						
					e.obj = null;
					}
				}
			});
			
		}
		cter.bind("scroll",lazyLoading);
		
	};
})(jQuery)