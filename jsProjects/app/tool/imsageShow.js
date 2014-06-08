(function($){
	$.fn.getRect=function(){
		var left = 0, top = 0, right = 0, bottom = 0;
		var node = this[0];
        if(node==window){
            return {left:0,top:0,right:this.width(),bottom:this.height()};
        }
		if ( !node.getBoundingClientRect) {
		    console.error("not support Rect");
		} else {
			var rect = node.getBoundingClientRect();
			left = right = this.scrollTop(); top = bottom = this.scrollTop();
			left += rect.left; right += rect.right;
			top += rect.top; bottom += rect.bottom;
		};
		return { "left": left, "top": top, "right": right, "bottom": bottom };
	};
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
                if(!e)return;
				var obj = $("<img>");
				obj.attr("src",opts.noLoadedImg);
				//obj.addClass(opts.noLoadedImg);
				e.obj = obj;
				self.append(obj);
			});
		}
		var cter = opts.container,cterRect;
        var isNeedUpdate=function(obj){
            var rect = obj.getRect();
            return rect.top<=cterRect.bottom;
        };
		var record =0;
		var lazyLoading = function(){
            cterRect = cter.getRect();
			//$.each(opts.data,function(i,e){
			var data = opts.data,max =record+20,updateFlag=true;
			for(var i=0,len=data.length;i<max;i++){
				var e=data[i],obj = e.obj,
				url = e.url;
				if(!e.updated){
					if(isNeedUpdate(obj)){
						obj.fadeIn(10);
						obj.attr("src",url);
						e.updated = true;
                        record=i;
						if(updateFlag){
                            updateFlag=false;
                            //max +=i;
                            max=(len>max)?max:len;
                        }
					}
				}
			};

		};
		var _delay=100,lock=false;
		var checkLoading=function(){
			if(!lock){
				lock=true;
				lazyLoading();
				setTimeout(function(){
					lock=false;
				},_delay);
			}
		};
		cter.on("scroll",checkLoading);
		cter.on("resize",checkLoading);
		lazyLoading();
	};
})(jQuery)