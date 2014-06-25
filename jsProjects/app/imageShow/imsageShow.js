(function ($) {
    $.fn.getRect = function () {
        var left = 0, top = 0, right = 0, bottom = 0;
        var node = this[0];
        if (node == window) {
            return {left: 0, top: 0, right: this.width(), bottom: this.height()};
        }
        if (!node.getBoundingClientRect) {
            console.error("not support Rect");
        } else {
            var rect = node.getBoundingClientRect();
            left = right = this.scrollTop();
            top = bottom = this.scrollTop();
            left += rect.left;
            right += rect.right;
            top += rect.top;
            bottom += rect.bottom;
        }
        ;
        return { "left": left, "top": top, "right": right, "bottom": bottom };
    };
    var imageData = {srcData: null, showData: null};
    var imageLazyLoad = function (self, options) {
        this.lock = false;
        this.cter = null;
        this.cterRect = null;
        this.self = self;
        this.delay=100;
        options || this.setOpts(options);
    };
    imageLazyLoad.prototype = {
        options: {
            container: $(window),
            data: null,
            // dataUrl:'data-url',
            fadeTime: 10,
            noLoadedImg: 'noLoadedImg.jpg',
            imageListClass: null,
            updateImg: null,
            eventsTrigger: ['scroll', 'resize'],
            isNeedUpdate: function (rect, outerRect) {
                return (rect.top > 0 && rect.top <= outerRect.bottom);
            }
        },
        setOpts: function (options) {
            var opts = $.extend(this.options, options);
            this.opts = opts;
            this.cter = opts.container || self;//,cterRect=cter.getRect();
            this.delay=opts.delay||100;
        },
        isNeedUpdate: function (obj, cterRect) {
            return this.opts.isNeedUpdate(obj.getRect(), cterRect);
        },
        showImg: function (e) {
            e.obj.attr("src", e.src);
            e.updated = true;
        },
        updateImg: function (e, index) {
            var obj = e.obj, opts = this.opts;
            this.showImg(e);
            obj.fadeIn(opts.fadeTime);
            opts.updateImg && opts.updateImg(e, index);
        },
        lazyLoading: function () {
            //$.each(opts.data,function(i,e){
            var data = this.opts.data;//,updateFlag=true;
            for (var i = 0, e; e = data[i]; i++) {
                var obj = e.obj;
                //console.log( e.src);
                if(this.stop){this.stop=false; break;}
                !e.updated && this.isNeedUpdate(obj, this.cterRect) && this.updateImg(e, i);
                // delete e;
            }
        },
        stop:false,
        //timeOuts:[],
        checkLoading: function () {
            var _this = this;
            //if (!this.lock) {
                //this.lock = true;
                this.stop=true;
                //this.lazyLoading();
               setTimeout(function () {
                    _this.stop = false;
                   _this.lazyLoading();
               }, this.delay);
           // }
        },
        resize: function () {
            this.cterRect = this.cter.getRect();
        },
        run: function () {
            this.cterRect = this.cter.getRect();
            var opts = this.opts,_this=this,
                handler = function(){
                    _this.checkLoading();
                }
            for (var i in opts.eventsTrigger) {
                this.cter.on(opts.eventsTrigger[i],handler);
            }
            this.lazyLoading();
        }
    };
    var prepareOptions = function (self, opts) {

        var imageListClass = opts.imageListClass;
        var newData = [];
        for (var i in opts.data) {
            var e = opts.data[i];
            // / $.each(opts.data,function(i,e){
            if (!e)return;
            var obj = $("<img>");
            e.obj = obj;
            e.updated = false;
            opts.addFun ? opts.addFun(self, e) : self.append(obj);
            obj.attr("src", opts.noLoadedImg);
            imageListClass && obj.addClass(imageListClass);
            newData.push(e);
        }
        opts.data = newData;
        return opts;
    }

    var runFLag = true;
    $.fn.usePhotoBox = function (options) {
        var self = $(this);
        self.children().length>0&&self.cleanImageShow()
        var im = new imageLazyLoad(self);
        var opts = $.extend(im.options, options || {});
        opts = prepareOptions(self, $.extend({
            addFun: function (parent, e) {
                var path = this.getCompressedPath();
                var a = $("<a></a>");
                a.attr("href", e.url);
                e.src = path + "/" + e.name;
                parent.append(a.append(e.obj));
            },
            updateImg: function (e, index) {// update photobox image
                var data = self.data('_photobox');
                var image = null
                if (data && data.images && (image = data.images[index])) {
                    image[2] = e.src;
                    var thumbs = imageData.showData;//||  getThumbs();
                    var showE = thumbs[index];
                    showE && this.showImg(showE);
                    //console.log(e.url+"  "+index);
                }
            }
        }, opts));
        imageData.srcData = opts.data;
        im.setOpts(opts);
        im.run();
        addPhotoBox(self, opts);
    }
    var addPhotoBox = function (self, opts) {
       // if (!runFLag) {
            $('#pbCaption').length==0&& self.photobox("prepareDOM");//.on();
        //}
        runFLag = true;
        self.photobox('a', { time: 0 }, function () {
            if (runFLag) {
                runFLag = false;
                addLazyLoadingForPhotoBox(opts);
            }
        });
    };

    var thumbs = null,
        getThumbs = function () {
            return thumbs || (thumbs = initThumbs());
        },
        initThumbs = function () {
            return $('#pbCaption').find("img");
        };
        function addLazyLoadingForPhotoBox (oldOpts) {
            var cter = $('#pbCaption');
            var im = new imageLazyLoad(cter);
            var data = imageData.srcData,
                thumbs = getThumbs(),
                newData = [];
            for (var i = 0, v; v = data[i]; i++) {
                var e = $.extend({}, v);
                e.obj = $(thumbs[i]);
                newData.push(e);
            }
            var eventsTrigger = ['mousemove'];
            var options = $.extend(oldOpts, {
                updateImg: function (e, index) {// update source image
                    var sourceE = data[index];
                    sourceE && im.showImg(sourceE);
                },
                isNeedUpdate: function (rect, outerRect) {
                    return rect.right >= outerRect.left && rect.left <= outerRect.right;
                },
                eventsTrigger: eventsTrigger,
                data: newData,
                container: cter,
                delay:80
            });
            imageData.showData = options.data;//,
            im.setOpts(options);// options);
            im.run();
        };

    $.fn.removePhotoBox = function () {
        var self = $(this);
        self.photobox('destroy');
        //$("#pbOverlay").remove();
        return self;
    }
    $.fn.cleanImageShow = function () {
        $(this).removePhotoBox().children().remove();
    }
})(jQuery)