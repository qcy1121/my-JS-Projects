require.config({
	baseUrl : "../",

	paths : {
		jquery : "lib/jquery",
		jui:"lib/jquery-ui",
		jqm : "lib/jquery.mobile-1.3.2",
		app:"js"
	}
});

	require(['jquery', "app/llk", "app/data", 'app/jutils'], function ($, llk,data,jui) {
        var jConfirm = jui.jutils.jconfirm;
	    var gridView, $out = $("#outDiv"),$myButtonDiv=$("#myButtonDiv");
	    var $tableDiv = $("#tableDiv");//.addClass("tableDiv");//.width(rightWidth);

	    //console.log(width+"  "+height);

	    var maxtime = 100,
	    	storage = new data.StorageApi()||{},
	        time, shortTime = 3,
	        isLocked = false,
            $timeBar=$("#timeBar"),$awardBar=$("#awardBar"),$links=$("#links"),$timeLeft=$("#timeleft"),$lock=$("#lock"),
	        timerCallback = function () {
	            $timeBar.progressbar("value", this.time1);
	            $awardBar.progressbar("value", this.time2);
	            $links.text(this.time2);
	            $timeLeft.text(this.time1);
	            if (this.time1 <= 10 &&this.time1>0) {
	                 $timeBar.toggleClass("red");
	            }
                if(this.time2>0){
                    $awardBar.toggleClass('red');
                }
	        },
	        levelUpCallback = function(level){
	        	storage.setItem("level",level);
	        };

	    var timeObj = {
	        maxTime: maxtime,
	        shortTime: shortTime,
	        time1: maxtime,
	        time2: 0,
	        timerCallback: timerCallback
	    };
	    var createOpts = function () {
	        var time = $.extend({}, timeObj);
	        return {
	            timeObj: time,
	           // width: rightWidth,
	            level: storage.getItem("level"),
	            levelUpCallback:levelUpCallback
	        };
	    };
	    var draw = function () {
	        if (gridView) gridView.destroy();
	        gridView = new llk.GridView($tableDiv, createOpts());
	        //gridView.setImgNum(10);
	        gridView.render();
            afterRun();
	    };
	    var drawWords = function () {
	        if (gridView) gridView.destroy();
	        gridView = new llk.WordGridView($tableDiv, createOpts());
	        gridView.render();
            afterRun();
	        //$("#refresh").attr("disabled",false).removeAttr("disabled");
	        //$("#hint").removeAttr("disabled");
	    };
        var afterRun=function(){
            enableBtn();
           // updateScale();
        }
        // todo to update scale to cover all the screen
        var updateScale=function(){
            var outWidth = $out.width(),
            outHeight = $out.height(),
            leftWidth = $myButtonDiv.width(),
            rightWidth = outWidth - leftWidth,
            rightHeight = outHeight-$timeBar.height();
            var tableDivWidth = $tableDiv.width(),tableDivHeight=$tableDiv.height();
            if(!tableDivWidth||!tableDivHeight)return;
            var xScale=rightWidth/tableDivWidth,yScale=rightHeight/tableDivHeight,
                scales = 'scale('+xScale+","+yScale+");";

            var css={
                'transform': scales
        }
            //$tableDiv.css(css);
        };
	    var refresh = function () {
	        gridView.refresh();
	    };
	    var hint = function () {
	    	var str= "hintCount",i = storage.getItem(str),i=i||0;
	    	jConfirm("一共使用了"+ i +"次提示，继续使用提示吗？").then(function(res){
                if(res){gridView.hint();storage.setItem(str,++i);}
            });
	       // gridView.hint();

	    };

	    var lock = function () {
	        if (isLocked) {
	            enableBtn();
	            gridView.goon();
	            isLocked = false;
	            $lock.removeClass("my-ui-icon-unlock-01").addClass("my-ui-icon-lock-01");
	        } else {
	            disableBtn();
	            gridView.pause();
	            isLocked = true;
	            $lock.removeClass("my-ui-icon-lock-01").addClass("my-ui-icon-unlock-01");
	        }
	    };
	    var show = function () {
	        $("#draw").addClass("my-ui-icon-run-01").on("click",draw);
	        $("#drawWords").addClass("my-ui-icon-word-01").on("click",drawWords);
	        $("#refresh").addClass("my-ui-icon-refresh-01").on("click",refresh).setDisabled(true);
	        $("#hint").addClass("my-ui-icon-hint-01").on("click",hint).setDisabled(true);
	        $lock.addClass("my-ui-icon-lock-01").on("click",lock).setDisabled(true);
	       // $("#draw,#drawWords,#refresh,#hint,#lock").addClass("ui-button-block");
            $timeBar.progressbar({
	            max: maxtime,
	            value: maxtime
	        });//.addClass("timeBar");
	        $awardBar.progressbar({
	            max: shortTime,
	            value: 0
	        });//.addClass("awardBar");

	    };

	    function enableBtn() {
	        $("#hint,#refresh,#lock").setDisabled(false);
	        isLocked = false;
	    };

	    function disableBtn() {
	        $("#hint,#refresh").setDisabled(true);//("disable");
	    }

	    $(document).ready(function () {
	        show();
	    });

	});