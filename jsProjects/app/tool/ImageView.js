var fs = require("fs"),
path="./2013.04.07 Oriental Park";// the folder path to get images

var content = [];
function readDir(path){
	fs.readdir(path,function(err,files){
	if(err)console.log(err);
	
	for(var i in files){
		var f = files[i],file = fs.lstatSync(path+"/"+f);
		if(file.isFile()){
			readFile(f,path,content);
		}else if(file.isDirectory()){
			readDir(path+"/"+f);
		}
	}
	
	savefile(content);
});
};

		
function readFile(file,path,content){
		var reg = /.jpg/i;
		if(reg.test(file)){
			var a= {name:file,path:(path+'/'+file)};
			//console.log(file);
			content.push(a);
		}
};
function savefile(arr){
	var strs=[];
		strs.push('<html><body><table><tr>');
	for(var i=0 ;i<arr.length;){
	var file = arr[i];
		strs.push('<td>'+i+'<img src="'+file.path+'" > '+file.name+'</td>'+'\n');
		if((++i)%5==0) strs.push("</tr><tr>");
	}
	strs.push('</tr></table></body></html>');
	fs.writeFile('images.txt',strs.join(""),function(e){	
	  if(e)console.log(e);
	});
}
readDir(path);