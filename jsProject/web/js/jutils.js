define(['exports',"jquery","jui"],function(exports, $,$u){
var jui = (function(){
var $alert,$content,$okBtn,alertFunc=function(arg){
	var $defer = $.Deferred();
	if(!$alert){
		//$okBtn=$("<div>").button({text:"OK"}).click(function(){$alert.dialog("close");});
		$content = $("<div>");
		$alert =$("<div id='dialog'></div>").append($content);
		$alert.dialog({
			modal:true,
			show:false,
			buttons:{
				"Ok": function() { $(this).dialog("close");$defer.resolve(true);}
			}
			});
	}
	$content.text(arg);
	$alert.dialog("open");
    return $defer.promise;
};
window.alert = alertFunc;
// confirm not implemented, use defer ?
var confirmFunc = function(str){
	var $confirm,$confirmcontent;
	var jconfirm = function(str){
		var $defer = $.Deferred();

		var okFunc = function(){
			$confirm.dialog("close");$defer.resolve(true);
		},cancelFunc = function(){
			$confirm.dialog("close"); $defer.resolve(false);
		};
		if(!$confirm){
			$confirmcontent = $("<div>");
			$confirm = $("<div >").append($confirmcontent);
			$confirm.dialog({
				modal:true,
				show:false,
				buttons:{
					"Ok": okFunc,
					"Cancel":cancelFunc
				}
			});
		}
		$confirmcontent.text(str);
        $defer.always(function(){
           $confirm.remove();
        });
		$confirm.dialog("open");
        return $defer.promise();
	};
	
 return new jconfirm(str);
};

    var buildUI = (function () {
        var progressbarOptions = {
            opts: {
                max: 100,
                value: 0
            }
        };
        $.fn.extend({
            isDisabled: function () {
                var css = this.classList;
                var disableReg = /\bdisabled\b/;
                return disableReg.test(css);
            }, setDisabled: function (disabled) {
                var _this = $(this);
                disabled && _this.addClass('disabled') || _this.removeClass("disabled");
                return this;
            }, progressbar: function () {
                var self = $(this);
                if (self.get(0).tagName.toLowerCase() !== 'progress') {
                    throw "This tag is not a progress";
                    return;
                }
                var args = arguments,
                    setOptions = function (key, value) {
                        self.attr(key, value);
                    };
                if (typeof args[0] == 'string') {
                    setOptions(args[0], args[1]);
                } else {
                    var options = progressbarOptions.opts;
                    options = $.extend(options, args[0]);
                    for (var i in options) {
                        self.attr(i, options[i]);
                    }
                }
                return this;
            }
        });
    })();
//cssHooks
    $.cssHooks.transform = {
        set:function(value){
            var scales = value;
//            {
//            '-moz-transform': scales,
//            '-ms-transform': scales,
//            '-webkit-transform': scales
//            }
        }
    }
    return {
        jconfirm : confirmFunc
    }
})()
    exports.jutils =jui;
})