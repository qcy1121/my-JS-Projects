require(["jquery","jui"],function($){

var $alert,$content,$okBtn,alertFunc=function(arg){
	
	if(!$alert){
		//$okBtn=$("<div>").button({text:"OK"}).click(function(){$alert.dialog("close");});
		$content = $("<div>");
		$alert =$("<div id='dialog'></div>").append($content);
		$alert.dialog({
			modal:true,
			show:false,
			buttons:{
				"Ok": function() { $(this).dialog("close");}
			}
			});
	}
	$content.text(arg);
	
	$alert.dialog("open");
};
window.alert = alertFunc;
// confirm not implemented, use defer ?
var confirmFunc = function(str,func){
	var $confirm,$confirmcontent,$defer;
	var jconfirm = function(str,func,$confirm,$confirmcontent){
		$defer = $.Deferred();
		$defer.done(function(res){
			func(res);
		});
		var okFunc = function(){
			$confirm.dialog("close");$defer.resolve(true);
		},cancelFunc = function(){
			$confirm.dialog("close"); $defer.resolve(false);
		};
		if(!$confirm){
			$confirmcontent = $("<div>");
			$confirm = $("<div id='confirm'></div>").append($confirmcontent);
			$confirm.dialog({
				modal:true,
				show:false,
				buttons:{
					"Ok": function() {okFunc.call();},
					"Cancel":function(){cancelFunc.call();}
				}
			});
			
		}
		$confirmcontent.text(str);
		$confirm.dialog("open");
	};
	
 return new jconfirm(str,func,$confirm,$confirmcontent);
};
window.jconfirm = confirmFunc;

})();