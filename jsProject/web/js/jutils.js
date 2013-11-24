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
/*// confirm not implemented, use defer ?
var $confirm,$confirmcontent, confirmFunc = function(str){
	if(!$confirm){
		$confirmcontent = $("<div>");
		$confirm = $("<div id='confirm'></div>").append($confirmcontent);
		$confirm.dialog({
			modal:true,
			show:false,
			buttons:{
				"Ok": function() { $(this).dialog("close");return true;},
				"Canel":function(){$(this).dialog("close"); return false;}
			}
		});
		
	}
	$confirmcontent.text(str);
	$confirm.dialog("open");
	
};
window.confirm = confirmFunc;
*/
})();