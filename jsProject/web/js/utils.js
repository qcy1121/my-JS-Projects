
define(['exports'],function(exports){
    var StringMap = (function() {
        function StringMap() {
            this.map = Object.create(null);
        }
        ;
        StringMap.prototype = {
            get : function(key) {
                return this.map[this.convertKeyToProperty(key)];
            },
            set : function(key, value) {
                this.map[this.convertKeyToProperty(key)] = value;
            },
            has : function(key) {
                return this.convertKeyToProperty(key) in this.map;
            },
            remove : function(key) {
                return delete this.map[this.convertKeyToProperty(key)];
            },
            removeWhere : function(filter) {
                var toRemove = [];
                for ( var prop in this.map) {
                    var key = this.convertPropertyToKey(prop);
                    if (key && filter(key, this.map[prop])) {
                        toRemove.push(key);
                    }
                }
                for (var i = 0; i < toRemove.length; i++) {
                    this.remove(toRemove[i]);
                }
            },
            forEach : function(functor) {
                for ( var prop in this.map) {
                    var key = this.convertPropertyToKey(prop);
                    if (key) {
                        functor(key, this.map[prop]);
                    }
                }
            },
            convertPropertyToKey : function(prop) {
                if (this.map.hasOwnProperty && !this.map.hasOwnProperty(prop)) {
                    return null;
                }
                if (prop[prop.length - 1] != '$') {
                    return null;
                }
                return prop.substring(0, prop.length - 1);
            },
            convertKeyToProperty : function(key) {
                if ('string' !== typeof (key)) {
                    //throw new TypeError('key not a string');
                    return null;
                }
                return key + '$';
            },
            isEmpty : function() {
                for ( var prop in this.map) {
                    return false;
                }
                return true;
            },
            size : function() {
               var size=0;
                for(var i in this.map)size++;
                return size;
            }
        };
        return StringMap;
    })();

    var ImageTool = (function(){
        var ImageTool = function(){

        }
        var canvas,image,
        getCanvas = function(){
            if(canvas) return canvas;
            canvas = document.createElement("canvas");
            return canvas;
        },
        getImage = function(){
            //if(image)return image;
            //var
            //    image = document.createElement("image");
            return new Image();
        };
        ImageTool.getBase64Image = function(img,type) {
            type =type||'png';
            // Create an empty canvas element
            var canvas = getCanvas();
            canvas.width = img.width;
            canvas.height = img.height;

            // Copy the image contents to the canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            // Get the data-URL formatted image
            // Firefox supports PNG and JPEG. You could check img.src to
            // guess the original format, but be aware the using "image/jpg"
            // will re-encode the image.
            var dataURL = canvas.toDataURL("image/"+type);

            return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
        }
        ImageTool.logBase64ByImagePath=function(path){
            var reg = /.*\.(img|png|jpg|gif)$/i,
                type;
            reg.test(path);
            type = RegExp.$1;
            var image = getImage();
            var _this = this;
            image.onload=function(){
                console.log("'"+ _this.getBase64Image(image,type)+"',");
                image = null;
            };
            image.src = path;
        }
        return ImageTool;
    })();




    exports.StringMap = StringMap;
    exports.ImageTool = ImageTool;

});


