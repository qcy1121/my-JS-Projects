(function($){
	$.fn.imageLazyLoading= function(options){
		var self = $(this);
		var opts = $.extend({
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
				if(obj[0].nodeName.toLowerCase()=="img"){
				data.push({
					url:obj.attr(opts.dataUrl),
					obj :obj//,
					//updated:false;
				});
			}
			});
			opts.data=data;
		}else{
			$.each(opts.data,function(i,e){
				var obj = $("<img>");
				obj.attr("src",opts.noLoadedImg);
				//obj.addClass(opts.noLoadedImg);
				e.obj = obj;
				self.append(obj);
			});
		}
		var cter = opts.container;
		var lazyLoading = function(){
			$.each(opts.data,function(i,e){
				var obj = e.obj,
				url = e.url;
				if(!e.updated){
					var height = cter.height(),
					scrollTop = cter.scrollTop(),
					selfTop = obj.offset().top;
                    //todo need check the scroll
                    console.log(selfTop+"  "+scrollTop+"  "+selfTop+"   "+scrollTop+"   "+height);
					if((selfTop-scrollTop)>0&&(selfTop-scrollTop)<height){
						obj.fadeIn(10);
						obj.attr("src",url);
						e.updated = true;
					}
				}
			});
			
		}
		cter.on("scroll",lazyLoading);
		lazyLoading();
	};
})(jQuery)