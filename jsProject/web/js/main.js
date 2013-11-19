require.config({
	baseUrl : "../",

	paths : {
		jquery : "lib/jquery",
		jui:"lib/jquery-ui",
		jqm : "lib/jquery.mobile-1.3.2",
		app:"js"
	}
});

require(['jquery',"app/llk",'jui'], function( $,llk ) {
	
	var gridView,  div =$("#tableDiv"), $out = $("#outDiv");
	$out.css("display","block");
	var width=$out.width(),height=$out.height();
console.log(width+"  "+height);

	
	var draw=function(){
		
		gridView = new llk.GridView(div);
		//gridView.setImgNum(10);
		gridView.init();
		enableBtn();
	};
	var drawWords=function(){
		gridView = new llk.WordGridView(div);
		//gridView.setImgNum(10);
		gridView.init();
		enableBtn();
		//$("#refresh").attr("disabled",false).removeAttr("disabled");
		//$("#hint").removeAttr("disabled");
	};
	var refresh= function(){
		gridView.refreshGrid();
		gridView.drawGrid();
	};
	var hint = function(){
		gridView.hint();
		//alert("aa");
	};
	var maxtime =100,time,shorttime=3;
	var show = function(){
		 $("#draw").button({icons:{ primary:"ui-icon-run-01"},text:false}).click(draw);
		 $("#drawWords").button({icons:{ primary:"ui-icon-word-01"},text:false}).click(drawWords);
		 $("#refresh").button({icons:{ primary:"ui-icon-refresh-01"},disabled:true,text:false}).click(refresh);
		 $("#hint").button({icons:{ primary:"ui-icon-hint-01"},disabled:true,text:false}).click(hint);
		 $("#draw,#drawWords,#refresh,#hint").addClass("ui-button-block");
		 $("#timeBar").progressbar({max:maxtime,value:maxtime}).addClass("timeBar");
		 $("#awardBar").progressbar({max:shorttime,value:0}).addClass("awardBar");
	};
	function enableBtn(){
		$("#hint,#refresh").button("option",{disabled:false});
	};
	
	function alert(arg){
		if($dialog){
			$dialog =$("<div id='dialog'></div>");
		}
		
		$dialog.text(arg).dialog();
	};
	
	show();
});

