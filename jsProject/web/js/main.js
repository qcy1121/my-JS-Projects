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
		gridView.init();
		$("#refresh").attr("disabled",false);
		$("#refresh").removeAttr("disabled");
		$("#hint").removeAttr("disabled");
	};
	var drawWords=function(){
		var div =$("#tableDiv");
		gridView = new llk.WordGridView(div);
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
	$("#tableDiv").before($('<div><input type="button" value = "draw " id="draw" />'+
'<input type="button" value = "drawWords " id="drawWords" />'+
'<input type="button" id="refresh" value = "refresh "  disabled="disabled" id="refresh" />'+
'<input type="button" id="hint" value="hint" disabled="disabled" id = "hint" ></div>'));
		$(document).on("click",":button",function(){
	//$(":button").on("click",function(){
		console.log("click");
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

