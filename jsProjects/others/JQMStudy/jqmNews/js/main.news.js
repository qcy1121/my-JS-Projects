// cover page creating event
function changePage(){
	window.location.href="index.html";
}
$("#load_index").on("pagecreate",function(){
	setInterval("changePage()",3000);
});
// Home page creating event
$("#index_index").on("pagecreate",function(){
	var $li="",
	$strSubStr = "",
	initSubNum =0,
	$webSite = jqmNews.website,
	$path= '';// TODO set a request path, to request a data.such as '**/ssd?action=index';
	$webUrl = $webSite + $path,
	$listview = $(this).find('ul[data-role="listview"]');
	var $tpl_Index_List = function($p_array, $p_items){
		if(jqmNews.utils.getParam('user_sub_str')!=null){
			$strSubStr = jqmNews.utils.getParam('user_sub_str');
			var $arrSubStr= new Array();
			$arrSubStr= $strSubStr,split(",");
			intSubNum = $arrSubStr.length -1;
			for(var i=0;i<$arrSubStr.length-1;i++){
				$.each($p_items.Table,function(index,item){
					if(item.news_cateid == $arrSubStr[i]){
							$li = '<li class="lst" data-icon = "false" > '+
								' <a href="newscate.html" data-ajax="false" '+
								' data-catename="'+item.news_catename+'" data-id="'+item.news_catedid+'" '+
								' style="margin:0px;padding:0px 0px 0px 55px"> '+
								' <img src="'+item.news_iconurl+'" alt="" /> '+ 
								' <h3>'+item.new_catename+'</h3></li>';
							$p_array.push($li);
							   
					}
				});
			}
		}else{
			$li='<li style="text-align:center"> You have subscripted nothing news!</li>';
			$p_array.push($li);
		}
	};
	var $lst_Index_List = function(){
		$.getJSON($webUrl,{},function(response){
			$tpl_Index_List(li_array, response);
			var strTitle = '<li data-role="list-divider"> '+
						 ' My Subsscription <span class="ui-li-count">'+initSubNum+'</spen></li>';
			$listview.html(strTitle+li_array.join(''));
			$listview.delegate('li a', 'click', function(e){
				jqmNews.utils.setParam('cate_link_id', $(this).data('id'));
				jqmNews.utils.setParam('cate_link_name', $(this).data('catename'));
			});
		});
	};
	$lst_Index_List();
});
//类别新闻页面创建事件
$('#newscate_index').on("pagecreate", function() {
var $li = "";
var $strId = "";
var $strName = "";
var $webUrl1 = "";
var $webUrl2 = "";
var $webSite = jqmNews.website;
var $catename = $(this).find('[data-role="header"] h4');
var $listview = $(this).find('ul[data-role="listview"]');
var $adlist = $("#news_list");
var $adinfo = $("#news_info");
var $tpl_Cate_Ad = function($p_array, $p_items) {
$.each($p_items.Table, function(index, item) {
$li = '<a href="newsdetail.html" data-ajax="false" '+
'data-catename="' + item.news_catename + '" '+
' data-id="' + item.news_id + '"> '+
' <img src="' + item.imgnews_imgurl + '" alt=""/></a>';
$adinfo.html(item.news_title);
$p_array.push($li);
});
};
var $tpl_Cate_List = function($p_array, $p_items) {
$.each($p_items.Table, function(index, item) {
$li = '<li class="lst" data-icon="false"> '+
' <a href="newsdetail.html" data-ajax="false" '+
' data-catename="' + item.news_catename + '" '+
' data-id="' + item.news_id + '" '+
' style="margin:0px;padding:0px"> '+
' <h3>' + item.news_title + '</h3></a></li>';
$p_array.push($li);
});
};
var $lst_Cate_Ad = function() {
$strId = jqmNews.utils.getParam('cate_link_id');
$strName = jqmNews.utils
.getParam('cate_link_name');
$webUrl1 = $webSite + '/ch15/News/NewsApi.ashx?act=cate_img&cateid=' + $strId;
$.getJSON($webUrl1, {},
function(response) {
$catename.html($strName);
var li_array = new Array();
$tpl_Cate_Ad(li_array, response);
$adlist.html(li_array.join(''));
$adlist.delegate('a', 'click', function(e) {
jqmNews.utils.setParam('p_link_id',
$(this).data('id'));
jqmNews.utils.setParam('cate_link_name',
$(this).data('catename'));
});
});
};
var $lst_Cate_List = function() {
$strId = jqmNews.utils.getParam('cate_link_id');
$strName = jqmNews.utils
.getParam('cate_link_name');
$webUrl2 = $webSite + '/ch15/News/NewsApi.ashx?act=cate_lst&cateid=' + $strId;
$.getJSON($webUrl2, {},
function(response) {
var li_array = new Array();
$tpl_Cate_List(li_array, response);
$listview.html(li_array.join(''));
$listview.listview('refresh');
$listview.delegate('li a', 'click', function(e) {
jqmNews.utils.setParam('p_link_id',
$(this).data('id'));
jqmNews.utils.setParam('cate_link_name',
$(this).data('catename'));
});
});
};
$lst_Cate_Ad();
$lst_Cate_List();
});
// 新闻详细页面创建事件
$('#detail_index').on("pagecreate", function() {
var $strId = "";
var $strName = "";
var $webSite = jqmNews.website;
var $webUrl = "";
var $catename = $(this).find('[data-role="header"] h4');
var $title = $("#news_detail_title");
var $info = $("#news_detail_info");
var $content = $("#news_detail_content");
var $lst_Detail_List = function() {
$strId = jqmNews.utils.getParam('p_link_id');
$strName = jqmNews.utils.getParam('cate_link_name');
$webUrl = $webSite + '/ch15/News/NewsApi.ashx?act=detail&newsid=' + $strId;
$.getJSON($webUrl, {},
function(response) {
$catename.html($strName);
$.each(response.Table, function(index, item) {
$title.html(item.news_title);
var strHTML = item.news_adddate + "&nbsp;&nbsp; 来源：" + item.news_source;
$info.html(strHTML);
$content.html("&nbsp;&nbsp;&nbsp;&nbsp;" +
item.news_content);
});
});
};
$lst_Detail_List();
});