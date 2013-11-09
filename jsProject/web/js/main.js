require.config({
	baseUrl : "../",

	paths : {
		jquery : "lib/jquery",
		jqm : "lib/jquery.mobile-1.3.2",
		llk : "js/llk",
		utils:"js/utils"
	}
});

require(['jquery',"llk"], function( $,llk ) {
	var gridView;
	var draw=function(){
		var div =$("#tableDiv");
		gridView = new llk.GridView(div);
		gridView.setImgNum(10);
		gridView.init();
		$("#refresh").attr("disabled",false);
		$("#refresh").removeAttr("disabled");
		$("#hint").removeAttr("disabled");
	};
	var drawWords=function(){
		var div =$("#tableDiv");
		gridView = new llk.WordGridView(div);
		gridView.setImgNum(10);
		gridView.init();
		$("#refresh").attr("disabled",false);
		$("#refresh").removeAttr("disabled");
		$("#hint").removeAttr("disabled");
	};
	var refresh= function(){
		gridView.refreshGrid();
		gridView.drawGrid();
	};
	var hint = function(){
		gridView.hint();
	};
	$("#tableDiv").before($('<div class="myButtonDiv" ><div class="myButton" id="draw" >draw</div>'+
'<div class="myButton" id="drawWords" >drawWords</div>'+
'<div class="myButton" id="refresh" disabled="disabled" id="refresh" >refresh</div>'+
'<div class="myButton" id="hint" disabled="disabled" >hints</div></div>'));
		$(document).on("click","div.myButton",function(){
	//$(":button").on("click",function(){
			var id= $(this).attr("id");
			switch (id){
				case "draw": draw();
					 break;
				case "drawWords":drawWords();
					 break;
				
				case "refresh": refresh();
					break;
				case "hint": hint();
					break;
				default: return;
			}
	});
	
});

