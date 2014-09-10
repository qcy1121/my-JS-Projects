require(["jquery","jui"],function($){

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
window.jconfirm = confirmFunc;

})();