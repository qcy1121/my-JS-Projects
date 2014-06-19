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
           // dataUrl:'data-url',
            fadeTime:10,
            noLoadedImg:'noLoadedImg.jpg',
            imageListClass:null,
            updateImg:null,
            eventsTrigger:['scroll','resize'],
            isNeedUpdate: function (rect,outerRect) {
                return (rect.top > 0 && rect.top <= outerRect.bottom);
            }
        },options||{});
        var imageListClass = opts.imageListClass;
        for (var i in opts.data) {
            var e = opts.data[i];
            // / $.each(opts.data,function(i,e){
            if (!e)return;
            var obj = $("<img>");

            //obj.addClass(opts.noLoadedImg);
            e.obj = obj;
            opts.addFun? opts.addFun(self, e): self.append(obj);
            obj.attr("src",opts.noLoadedImg);
            //obj.attr("src", e.url);
            imageListClass&&obj.addClass(imageListClass);
        }
        ;

        return opts;
    }
	$.fn.imageLazyLoading= function(options){
		var self = $(this);
       // var opts=prepareOptions(self,options);
        var opts = $.extend({},options);
		var cter = opts.container||self;//,cterRect=cter.getRect();
        var isNeedUpdate=function(obj,cterRect){
            return opts.isNeedUpdate(obj.getRect(),cterRect);
        }
        var updateImg= function(e,index){
            var obj = e.obj;
            obj.fadeIn(opts.fadeTime);
            obj.attr("src", e.url);
            e.updated = true;
            opts.updateImg&&opts.updateImg(e,index);
            //record=i;
            //if(updateFlag){
            //  updateFlag=false;
            //max +=i;
            // max=(len>max)?max:len;
            //}
        }
		//var record =0;
		var lazyLoading = function(){
            cterRect = cter.getRect();
			//$.each(opts.data,function(i,e){
			var data = opts.data;//,updateFlag=true;
			for(var i=0,e;e=data[i];i++){
				var obj = e.obj,
				url = e.url;
				!e.updated&&isNeedUpdate(obj,cterRect)&&updateImg(e,i);
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
        for(var i in opts.eventsTrigger){
            cter.on(opts.eventsTrigger[i],checkLoading);
        }
        //console.log(cter);
        //cter.on("mousemove",function(e){
           //console.log("...");
        //});
		lazyLoading();
	};

    $.fn.usePhotoBox=function(options){
        var self = $(this);
        var opts = prepareOptions(self, $.extend( {
            addFun: function (parent, e) {
                var path = this.getCompressedPath();
                var a = $("<a></a>");
                a.attr("href", e.url);
                e.url = path + "/" + e.name;
                parent.append(a.append(e.obj));
            },
            updateImg: function (e, index) {// update photobox image
                var data = self.data('_photobox');
                var image = null
                if (data && data.images && (image = data.images[index])) {
                    image[2] = e.url;
                    var thumbs = getThumbs();
                    thumbs[index].src = e.url;
                    //console.log(e.url+"  "+index);
                }
            }
        },options));
        self.imageLazyLoading(opts);
        var runflag= true;
        self.photobox('a',{ time:0 },function(){
            if(runflag){
                runflag=false;
                addLazyLoadingForPhotobox();
            }
        });
        var thumbs=null;
        function getThumbs(){
          return thumbs||(thumbs = initThumbs());
        };
        function initThumbs(){
            return $('#pbCaption').find("img");
        };
        function addLazyLoadingForPhotobox() {
            var data = opts.data,
                thumbs = getThumbs(),
                newData=[];
            for (var i = 0, v; v = data[i]; i++) {
                var e = $.extend({},v);
                e.obj = $(thumbs[i]);
                newData.push(e);
            }
            var eventsTrigger=['mousemove'];
            var cter = $('#pbCaption');
            var options = $.extend(opts,{
                updateImg: function (e, index) {// update source image
                    var sourceE = data[index];
                    sourceE && ( sourceE.obj.attr("src", e.url));
                },
                isNeedUpdate:function(rect,outerRect){
                    return rect.right>=outerRect.left&&rect.left<=outerRect.right;
                },
                eventsTrigger:eventsTrigger,
                data:newData,
                container:cter
            });
            cter.imageLazyLoading(options);
        }

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
    $.fn.removePhotoBox=function(){
       var self = $(this);
        self.photobox('destroy');
        return self;
    }
    $.fn.cleanImageShow=function(){
        $(this).children().remove();
    }
})(jQuery)