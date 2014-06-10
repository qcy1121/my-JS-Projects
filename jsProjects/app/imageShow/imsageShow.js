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
    var prepareOptions=function(self,options){
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
           for(var i in opts.data){
               var e = opts.data[i];
           // / $.each(opts.data,function(i,e){
                if(!e)return;
                var obj = $("<img>");

                //obj.addClass(opts.noLoadedImg);
                e.obj = obj;
                if(opts.addFun){
                    opts.addFun(self,e);
                }else{
                    self.append(obj);
                }
               //obj.attr("src",opts.noLoadedImg);
               obj.attr("src", e.url);
            };
        }
        return opts;
    }
	$.fn.imageLazyLoading= function(options){
		var self = $(this);
        var opts=prepareOptions(self,options);
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
    $.fn.usePhotoBox=function(options){
        var self = $(this);
        options.addFun = function(parent,e){
            var path = options.getCompressdPath();
            var a= $("<a></a>");
            a.attr("href",e.url);
            e.url = path+"/"+ e.name;
            parent.append(a.append(e.obj));
        }
        var opts = prepareOptions(self,options)
        //self.imageLazyLoading(opts);
        self.photobox('a',{ time:0 });

        // using a callback and a fancier selector
        //----------------------------------------------
        //self.photobox('li > a.family', { time: 0 }), function() {
        //    console.log('image has been loaded');
        //}
        //)

        // destroy the plugin on a certain gallery:
        //-----------------------------------------------
        //self.photobox('destroy');

        // re-initialize the photbox DOM (does what Document ready does)
        //-----------------------------------------------
       // self.photobox('prepareDOM');
    }
})(jQuery)