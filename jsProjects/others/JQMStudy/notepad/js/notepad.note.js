// notenav page
$(document).on("pagecreate","#notenav_index",function(){
	if(notepad.utils.getParam("bln_look")!== null){
		$.mobile.changePage("index.html","slideup");
	}else{
		var $count = $("#notenav_list a").length;
		$("#notenav_list a:not(:first-child)").hide();
		$("#notenav_icon li:first-child").addClass("on").html("1");
		$("#notenav_list a img").each(function(index){
			$(this).swipeleft(function(){
				if(index<$count -1){
					var i=index+1,
					s=i+1;
					$("#natenav_list a").filter(":visible")
					.fadeOut(500).parent()
					.childen().eq(i).fadeIn(1000);
					$("#notenav_icon li").eq(i).html(s);
					$("#notenav_icon li").eq(i).toggleClass("on");
					$("#notenav_icon li").eq(i).siblings().removeAttr("class").html("");
					if(s == $count){
						notepad.utils.setParam("bln_look", 1);
						$.mobile.changePage("index.html","slideup");
					}
				}
			}).swiperight(function(){
				if(index >0){
					var i = index-1,s =i+1;
					$("#notenav_list a").filter(":visible")
					.fadeOut(500).parent()
					.children().eq(i).fadeIn(1000);
					$("#notenav_icon li").eq(i).html(s);
					$("#notenav_icon li").eq(i).toggleClass("on");
					$("#notenav_icon li").eq(i).siblings()
					.remveAttr("class").html("");
				}
			});
		});
	}
});
// addnote
$("#addnote_index").on("pagecreate",function(){
	var $header = $(this).find('div[data-role="header"]'),
		$rdotype = $("input[type='radio']"),
		$hidtype = $("#hidtype"),
		$txttitle = $("#txt-title"),
		$txtacontent = $("#txta-content");
	$rdotype.bind("change",function(){
		$hidtype.val(this.value);
	});
	$header.delegate("a","click",function(e){
		if ($txttitle.val().length > 0
				&& $txtacontent.val().length > 0) {
			var strnid = "note_" + RetRndNum(3), 
				notedata = {
					nid : strnid,
					type : $hidtype.val(),
					title : $txttitle.val(),
					content : $txtacontent.val()
				},
				jsonnotedata = JSON.stringify(notedata);
			notepad.utils.setParam(strnid, jsonnotedata);
			window.location.href = "list.html";
			
		}
	});
	function RetRndNum(n){
		var strRnd = "";
		for(var intI = 0;intI <n;intI++){
			strRnd +=Math.floor(Math.random()*10);
		}
		return strRnd;
	}
});

// index page
$("#index_index").on("pagecreate",function(){
	var $listview = $(this).find("ul[data-role='listview']"),
	$strKey = "",
	$m = 0, $n= 0,
	$strHTML = "";
	for( var i =0;i<localStorage.length;i++){
		$strKey = localStorage.key(i);
		if($strKey.substring(0,4) == "note"){
			var getData = JSON.parse(notepad.utils.getParam($strKey));
			if(getData.type=="a"){
				$m ++;
			}
			if(getData.type =="b"){
				$n ++;
			}
		}
	}
	var $sum = parseInt($m) + parseInt($n);
	$strHTML += '<li data-role="list-divider">All<span class = "ui-li-count">'+ $sum +'</span></li>';
	$strHTML += '<li><a href = "list.html" data-ajax="false" data-id="a" data-name="Type1">'+
			'Type1<span class="ui-li-count">'+$m+'</span></li>';
	$strHTML += '<li><a href="list.html",data-ajax = "false" data-id="b" data-name = "Type2">'+
			'Type2<span class="ui-li-count">'+$n+'</span></li>';
	$listview.html($strHTML);
	$listview.delegate('li a', 'click',function(e){
		notepad.utils.setParam('link_type',$(this).data('id'));
		notepad.utils.setParam('type_name',$(this).data('name'));
	});
});
//list page
$("#list_index").on("pagecreate",function(){
		var $listview = $(this).find('ul[data-role="listview"]'),
		$strKey="",$strHTML="",$intSum=0,
		$strType = notepad.utils.getParam("link_type"),
		$strName = notepad.utils.getParam("type_name");
		for( var i=0;i<localStorage.length;i++){
			var getData= JSON.parse(notepad.utils.getParam($strKey));
			if(!getData){
				return;
			}
			if(getData.type ==$strType){
				$strHTML += '<li data-icon="false" data-ajax="false"><a href="notedetail.html"'+
					'data-id="'+getData.nid +'">'+getData.title+'</a></li>';
				$intSum ++;
			}
		}
		var strTitle='<li data-role="list-divider">'+$strName+
					'<span class="ui-li-count">'+$intSum+'</span></li>';
		$listview.html(strTitle+$strHTML);
		$listview.delegate('li a','click',function(e){
			notepad.utils.setParam('list_link_id',$(this).data('id'));
		});	
});

//detail page
$("#notedetail_index").on("pagecreate",function(){
	var $type=$(this).find('div[data-role="header"] h4'),
		$strId = notepad.utils.getParam("list_link_id"),
		$title=$("#title"),
		$content = $("#content"),
		listData = JSON.parse(notepad.utils.getParam($strId)),
		strType = listData.type == "a"?"Type1":"Type2";
	$type.html(strType);
	$title.html(listData.title);
	$content.html(listData.content);
	$(this).delegate("#alink_delete","click",function(e){
		var yn = confire("Are you sure to delete it?");
		if(yn){
			localStorage.removeItem($strId);
			window.location.href = "list.html";
		}
	});
});

// edit page
$("#editnote_index").on("pageshow", function() {
	var $strId = notepad.utils.getParam('list_link_id'),
		$header = $(this).find('div[data-role="header"]'),
		$rdotype = $("input[type='radio']"),
		$hidtype = $("#hidtype"),
		$txttitle = $("#txt-title"),
		$txtacontent = $("#txta-content"),
		editData = JSON.parse(notepad.utils.getParam($strId));
	$hidtype.val(editData.type);
	$txttitle.val(editData.title);
	$txtacontent.val(editData.content);
	if (editData.type == "a") {
		$("#lbl-type-0").removeClass("ui-radio-off")
		.addClass("ui-radio-on ui-btn-active");
	} else {
		$("#lbl-type-1").removeClass("ui-radio-off")
		.addClass("ui-radio-on ui-btn-active");
	}
	$rdotype.bind("change", function() {
		$hidtype.val(this.value);
	});
	$header.delegate('a', 'click', function(e) {
		if ($txttitle.val().length > 0 && $txtacontent.val().length > 0) {
			var strnid = $strId,
				notedata = {
					nid : strnid,
				type : $hidtype.val(),
				title : $txttitle.val(),
				content : $txtacontent.val()
			};
			var jsonotedata = JSON.stringify(notedata);
			notepad.utils.setParam(strnid, jsonotedata);
			window.location.href = "list.html";
		}
	});
});