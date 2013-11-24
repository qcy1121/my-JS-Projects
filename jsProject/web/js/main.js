require.config({
	baseUrl : "../",

	paths : {
		jquery : "lib/jquery",
		jui:"lib/jquery-ui",
		jqm : "lib/jquery.mobile-1.3.2",
		app:"js"
	}
});

require(['jquery',"app/llk",'jui','app/jutils'], function( $,llk ) {
	
	var gridView,  $out = $("#outDiv");

	var outWidth=$out.width(),outHeight=$out.height(),leftWidth =70,rightWidth = outWidth-leftWidth;
	var div =$("#tableDiv").addClass("tableDiv").width(rightWidth);
	
//console.log(width+"  "+height);

var maxtime =100,time,shorttime=3,islocked = false;
var timeObj = {
		maxtime:maxtime,
		shorttime:shorttime,
		time1:maxtime,
		time2:0,
		timerCallback : function(){
			$("#timeBar").progressbar("value",this.time1);
			$("#awardBar").progressbar("value",this.time2);
			$("#links").text(this.time2);
			$("#timeleft").text(this.time1);
			if(this.time1<=10){
				//$("timeBar").toggleClass("red");
			}
		}
	};
	var createOpts = function(){
		var time = $.extend({},timeObj);
		return {
			timeObj:time,
			width:rightWidth,
			level:1
		};
	} ;
	var draw=function(){
		if(gridView)gridView.destroy();
		gridView = new llk.GridView(div,createOpts());
		//gridView.setImgNum(10);
		gridView.render();
		enableBtn();
	};
	var drawWords=function(){
		if(gridView)gridView.destroy();
		gridView = new llk.WordGridView(div,createOpts());
		gridView.render();
		enableBtn();
		//$("#refresh").attr("disabled",false).removeAttr("disabled");
		//$("#hint").removeAttr("disabled");
	};
	var refresh= function(){
		gridView.refresh();
	};
	var hint = function(){
		gridView.hint();
		
	};
	
	var lock = function(){
		if(islocked){
			enableBtn();
			gridView.goon();
			islocked= false;
			 $("#lock").button("option","icons",{primary:"my-ui-icon-unlock-01 my-ui-icon"});
		}else{
			disableBtn();
			gridView.pause();
			islocked= true;
			 $("#lock").button("option","icons",{primary:"my-ui-icon-lock-01 my-ui-icon"});
		}
	};
	var show = function(){
		 $("#draw").button({icons:{ primary:"my-ui-icon-run-01 my-ui-icon"},text:false}).click(draw);
		 $("#drawWords").button({icons:{ primary:"my-ui-icon-word-01 my-ui-icon"},text:false}).click(drawWords);
		 $("#refresh").button({icons:{ primary:"my-ui-icon-refresh-01 my-ui-icon"},disabled:true,text:false}).click(refresh);
		 $("#hint").button({icons:{ primary:"my-ui-icon-hint-01 my-ui-icon"},disabled:true,text:false}).click(hint);
		 $("#lock").button({icons:{primary:"my-ui-icon-lock-01 my-ui-icon"},disabled:true,text:false}).click(lock);
		 $("#draw,#drawWords,#refresh,#hint,#lock").addClass("ui-button-block");
		 $("#timeBar").progressbar({max:maxtime,value:maxtime}).addClass("timeBar");
		 $("#awardBar").progressbar({max:shorttime,value:0}).addClass("awardBar");
	};
	function enableBtn(){
		$("#hint,#refresh,#lock").button("enable");
		islocked = false;
	};
	function disableBtn(){
		$("#hint,#refresh").button("disable");
	}
	
	
	show();
});

