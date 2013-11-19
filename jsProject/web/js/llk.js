
var __extends = this.__extends || function(d, b) {
	function __() {
		this.constructor = d;
	}
	__.prototype = b.prototype;
	d.prototype = new __();
};
define(["exports","jquery","app/utils"],function(exports,$){
var GridCell = (function() {

	function GridCell(cell/*Cell*/){
		this.cell = cell;
	};
	return GridCell;
})();

var Cell = (function(){
	function Cell(x, y,img ){
		this.x = x;
		this.y = y;
		this.img = img;
		this.isHidden = false;
	};
	Cell.prototype = {
			name:null,
			onclick:null,
			jObj:null,
			view:null,//for click 
			click:function(event){
				this.view.onClick(this);
			},
			setJobj:function(){
				this.jObj=$("<img src="+this.img+" class='imgCell' />");
			},
			draw:function(){
				this.setJobj();
				var cell = this.jObj;
				var _this = this;
				//this.click = 
				cell.click(function(event){
					_this.click(event,_this.view);
				}); 
				cell.css("visibility",this.isHidden?"hidden":"visible");
				this.jObj = cell;
				return cell;
			}/*,
			toHtml:function(){
				return "<img src="+this.img+"  class='imgCell' style='display:block' />";
			}*/
	};
	return Cell;
	
})();
var WordCell = (function(_super){
	__extends(WordCell,_super);
	function WordCell(i,j,img){
		_super.call(this,i,j,img);
	};

	WordCell.prototype.setJobj=function(){
		this.jObj = $("<div class='imgCell'>"+this.img+"</div>");
	};

	return WordCell;
})(Cell);

// the grid
var GridView = (function() {
	function GridView(parent,xNum, yNum,cell_size) {
		
		this.xNum = xNum ? xNum : 10; // rows of view table
		this.yNum = yNum ? yNum : 5; // columns of view table
		if(this.xNum * this.yNum %2){
			alert(" Wrong xNumber or yNumber");
			this.xNum = 10;
		}

		this.grid = null;
		this.cells=null;
		this.imgs=null;
		this.imgMap=null;
		this.basePath="./";
		this.selectedCell=null;
		this.hidCount=0;
		this.allCount=0;
		this.table=null;
		this.tips=null;
		this.imgNum=20;
		this.cell_size = cell_size?cell_size:40; // size of square cell.
		this.parentElement = parent;
	};
	GridView.prototype = {
		zoomX:{
		        set: function(zoom){
		        	return this.setZoomX();
		        },
		        enumerable: true,
		        configurable: true
		},
		zoomY:{
			 
		        set: function(zoom){
		        	return this.setZoomY(zoom);
		        },
		        enumerable: true,
		        configurable: true
		},
		setZoomX:function(x){
			
		},
		
		setZoomY:function(y){
			
		},
		setImgNum:function(num){
			this.imgNum = num;
		},
		initGridArray : function() {
			this.gridCells = [];
			this.cells = [];
			this.imgMap = new StringMap();
			this.allCount = this.xNum * this.yNum;
			this.hidCount = 0;
			var img = null;
			for(var i=0;i<this.xNum;i++){
				this.gridCells[i] = [];
				for(var j=0;j<this.yNum;j++){
					if((this.cells.length % 2)==0)img = this.getRandomImg();
					//console.log(img);
					cell = this.createNewCell(i,j,img);
					cell.view = this;
					//cell.onclick = this.onClick;
					gridCell = new GridCell(cell);
					this.cells.push(cell );
					this.gridCells[i].push(gridCell);
					this.pushToImgMap(img, cell);
				}
			}
		},
		createNewCell:function(i,j,img){
			return new Cell(i,j,img);
		},
		pushToImgMap:function(img,cell){
			var imgCells = this.imgMap.get(img);
			if(!imgCells){
				imgCells = [];
				this.imgMap.set(img,imgCells);
			}
			imgCells.push(cell);
			
		},
		getRandomImg:function(isSort){
			var imgNum = this.imgMap.size;
			if(imgNum== this.imgNum && this.imgs.length>imgNum){
				this.imgs = this.imgs.slice(0,imgNum);
			}
			if(!isSort){
				var randomIdx =Math.floor(Math.random()*(this.imgs.length));
				return this.imgs[randomIdx];
			}else{
				//TODO  change the logic to get img
			}
		},
		initImgs:function(path,num){
			
			if(num>32){
				num=32;
				console.warn("nums is bigger than existing imgs");
			}
			this.imgs = [];
			for(var i=0;i<num;i++){
				var img = path+"/llk_"+i+".gif";
				this.imgs.push(img);
			}
		},
		refreshGrid : function() {
			this.cleanOptions();
			
			var gridCell,cell,randomCell;
			for(var i=0;i<this.xNum;i++){
				for(var j=0;j<this.yNum;j++){

					gridCell = this.gridCells[i][j];
					cell = gridCell.cell;
					if(cell.isHidden)continue;// the gridCell be hidden, jump
					//console.log(cell.isHidden + "  "+cell.x+ ","+cell.y);
					do{
						randomCell = this.getRandomCell();
					}while(randomCell.isHidden)// || cell == randomCell)
					
					this.changeGridCell(gridCell,randomCell);
				}
			}

			this.checkDeadLock();
		},
		getRandomCell:function(){
			var randomNum = Math.floor(Math.random()*(this.cells.length));
			return this.cells[randomNum];
		},
		changeGridCell : function(gridCell, newCell) {
			var x = newCell.x, 
				y = newCell.y, 
				cell = gridCell.cell;
			newCell.x = cell.x;
			newCell.y = cell.y;
			cell.x = x;
			cell.y = y;
			this.gridCells[x][y].cell = cell;
			gridCell.cell = newCell;
		},
		
		checkValue : function(){
			
			
		},
		drawGrid:function(){
			this.parentElement.html("");
			var table = $("<table id='gridTable' class='gridTable'></table>"),col,cell;
			for(var i=0;i<this.yNum;i++){
				col = $("<tr></tr>");
				col.appendTo(table);
				for(var j=0;j<this.xNum;j++){
					cell = this.gridCells[j][i].cell;
					//$("<td>"+cell.toHtml()+"</td>").appendTo(col);
					var td = $("<td></td>");
					td.append(cell.draw());
					td.appendTo(col);
				}
			}
			//this.parentElement.append(table);

			table.appendTo(this.parentElement);
			this.table = table;
		},
		onClick:function(cell/*cell*/){
			//TODO
			if(cell.isHidden) return;
			
			if(this.selectedCell && (this.selectedCell.img == cell.img) && (this.selectedCell != cell)){
				var path = this.findPath(this.selectedCell,cell);
				if(path){
					this.drawPath(path);
					this.hidSelected(this.selectedCell,cell);
					this.removeHighlightCells();
					this.checkDeadLock();
				}else // can't select
					this.selectCell(cell);
			}else{// not same or first select
				this.selectCell(cell);
			}
			
			
			
		},
		drawPath:function(path){
			
			
		},
		findPath:function(cell1,cell2){
			var tp1,tp2;// turning points	

			tp1= {x:cell1.x,y:cell1.y};
			tp2 = {x:cell2.x,y:cell2.y};
			// get the farthest 4 points for the two point to link.
			var bounds1 = this.getBounds(cell1),
				bounds2 = this.getBounds(cell2);
			//console.log(bounds1);
			//console.log(bounds2);
			var yMin = bounds1.yMin.y>bounds2.yMin.y?bounds1.yMin:bounds2.yMin,
				yMax = bounds1.yMax.y<bounds2.yMax.y?bounds1.yMax:bounds2.yMax,
				xMin = bounds1.xMin.x>bounds2.xMin.x?bounds1.xMin:bounds2.xMin,
				xMax = bounds1.xMax.x<bounds2.xMax.x?bounds1.xMax:bounds2.xMax;
		   if(yMin.y > yMax.y && xMin.x > xMax.x)return null;
			
		    // check link vertical, check each horizon line in vertical.
		    for(var i=yMin.y;i<=yMax.y;i++){
		    	tp1 = {x:cell1.x,y:i};
		    	tp2 = {x:cell2.x,y:i};
		    	if(this.canLinkWithLine(tp1,tp2,false))return [tp1,tp2];
		    }
		    // check horizon
		    for(var i=xMin.x;i<=xMax.x;i++){
		    	tp1 = {x:i,y:cell1.y};
		    	tp2 = {x:i,y:cell2.y};
		    	if(this.canLinkWithLine(tp1, tp2,true)) return [tp1,tp2];
		    }
			return null;
		},
		canLinkWithLine: function(tp1,tp2,isX){// check turning point;
			var tempCell,diff,step;
			if(isX){//isX ,  x axis values are same, check points in y axis.
				diff = tp2.y -tp1.y;
				step = Math.abs(diff)/diff;
				if(tp1.x>=this.xNum||tp1.x<0 || diff==0)return true;//  must be diff !=0 ,or this loop will not stop; 
				for(var i=tp1.y+step;i!=tp2.y;i+=step){
					tempCell = this.gridCells[tp1.x][i];
					if(!tempCell.cell.isHidden)return false;
				}
			}else{// isY, y axis values are same, check points in x axis.
				diff = tp2.x -tp1.x;
				step = Math.abs(diff)/diff;
				if(tp1.y>=this.yNum||tp1.y<0 || diff==0)return true;
				for(var i =tp1.x+step;i!=tp2.x;i+=step){
					tempCell = this.gridCells[i][tp1.y];
					if(!tempCell.cell.isHidden)return false;
				}
			}
			return true;
		},
		
		// get the farthest 4 points can be link path;
		getBounds : function(cell) {
			return {
				xMin : this.checkBound(cell, true, false),
				xMax : this.checkBound(cell, true, true),
				yMin : this.checkBound(cell, false, false),
				yMax : this.checkBound(cell, false, true)
			};
		},
		checkBound:function(cell,isX,isPlus){
			var x = cell.x,y = cell.y,tempxy,isEnd,end,stepFunc,bound;
			if(isPlus){
				end= isX?this.xNum:this.yNum;// end, include the point off the grid
				stepFunc = function(val){return val+1;};
			}else{
				end = 0;
				stepFunc = function(val){return val-1;};
			}
			tempxy = isX?x:y;
			do{

				bound = isX?{x:tempxy,y:y}:{x:x,y:tempxy};
				tempxy = stepFunc(tempxy);
				isEnd = isPlus ? tempxy >= end : tempxy < end;
				if (isEnd) {
					tempCell = null;
					bound = isX?{x:tempxy,y:y}:{x:x,y:tempxy};
				} else {
					tempGridCell = isX?this.gridCells[tempxy][y]:this.gridCells[x][tempxy];
					tempCell = tempGridCell.cell;
				}
			}while(tempCell && (tempCell.isHidden))// || tempCell ==cell))
			return bound;
		},
		
		hidSelected:function(cell1,cell2){
			cell1.jObj.css("visibility","hidden");
			cell2.jObj.css("visibility","hidden");
			cell1.isHidden = true;
			cell2.isHidden = true;
			this.selectedCell = null;
			this.hidCount +=2;
			
			//TODO , need add animation
		},
		selectCell:function(cell){
			if(this.selectedCell)
				this.selectedCell.jObj.removeClass("selected");
			this.selectedCell = cell;
			if(cell)this.selectedCell.jObj.addClass("selected");
		},
		init : function() {
			var path = this.basePath+"../images";
			this.initImgs(path,31);
			this.initGridArray();

			this.refreshGrid();
			this.drawGrid();
		},
		checkDeadLock:function(){
			this.tips = this.checkCells();
			if(!this.tips){
				this.refreshGrid();
				this.drawGrid();
			}
		},
		hint:function(){
			if(this.tips){
				this.highlightCell(this.tips);
				return;
			}
			var cells= this.checkCells();
			if(cells){
				this.tips = cells;
				this.highlightCell(cells);
			}else{
				if(this.hidCount ==this.allCount){
				this.init();
				}else{
					this.refreshGrid();
					this.drawGrid();
				}
			}
		},
		checkCells:function(){
			var cell, imgCells, img;
			if(this.hidCount == this.allCount){
				alert("Good Job!");
				this.init();
				return;
			}
			for ( var idx in this.cells) {
				cell = this.cells[idx];
				if (cell.isHidden)
					continue;
				img = cell.img;
				imgCells = this.imgMap.get(img);
				var cell1, cell2, len = imgCells.length;
				for (var i = 0; i < len; i++) {
					cell1 = imgCells[i];
					if (cell1.isHidden)
						continue;
					for (var j = i + 1; j < len; j++) {
						cell2 = imgCells[j];
						if (cell2.isHidden)
							continue;
						if (this.findPath(cell1, cell2)) {
							return [cell1,cell2];
						}
					}
				}
			}
			return null;
		},
		highlightCell:function(cells){
			for(var i in cells){
				cells[i].jObj.addClass("highlight");
			}
		},
		removeHighlightCells:function(){
			if(this.tips){
				for(var i in this.tips){
					this.tips[i].jObj.removeClass("highlight");
				}
				this.tips= null;
			}
		},
		cleanOptions:function(){
			this.tips=null;
			this.selectCell(null);
		},
		move:function(){
			
		},
		toJson:function(){
			
		},
		formJson:function(json){
			
		},
		pause:function(){
			
		}

	};
	/*Object.defineProperty(GridView.prototype, "zoomX", {
        get: function () {
            return this.getZoomX();
        },
        set: function(zoom){
        	return this.setZoomX();
        },
        enumerable: true,
        configurable: true
    });*/
	return GridView;
})();
var WordGridView = (function(_super){
	__extends(WordGridView,_super);
	function WordGridView(parent,wordsArray){
		_super.call(this,parent);
		if(!wordsArray|| !wordsArray.length){
			//alert("There is no words input!");
			//return;
			wordsArray = ['土','王','免','兔','代','伐','休','体','盲','育','育','育','鸟','乌','鸣','呜','师','帅','家','侯','候',
			              '壶','壶','斤','斥','飞','戈','享','亨','又','叉','巾','币','勺','匀','爪','瓜','几','凡','厂','广',
			              '今','令','勿','匆','予','矛','九','丸','良','良','折','拆','析','拆','析','诉','住','往','茶','荼','快','快',
			              '吴','吴','狠','狼','扰','拢','洗','洗','冶','治','理','埋','云','去','库','库','西','百','洒','酒','早','旱',
			              '侍','待','仿','彷','倘','尚','欠','久','牛','生','干','午','味','昧','昕','昕','唔','晤','喧','瞌','哺','晴',
			              '响','晌','呢','昵','暖','暖','历','厉','氏','民','也','也','血','皿','思','恩','旦','亘','夫','失','晴','睛',
			              '徒','徙','暑','署','毫','毫','账','帐','气','乞','史','吏','戎','戒','了','子','沪','泸','幼','幻','伯','伯',
			              '刀','刃','王','主','玉','大','太','犬','木','本','术','戊','戍','戌','兵','乒','乓','哀','衷','衰','尤','尤','龙',
			              '往','住','佳','凭','筑','就','杏','杳','查'];
		}
		this.wordsArray  = wordsArray;
	}
	WordGridView.prototype.createNewCell=function(i,j,img){
		return new WordCell(i,j,img);
	},
	WordGridView.prototype.init=function(){
		this.initWords(this.wordsArray);
		this.initGridArray();

		this.refreshGrid();
		this.drawGrid();
	};
	WordGridView.prototype.initWords=function(array){
		var num = array.length;
		
		this.imgs = [];
		for(var i=0;i<num;i++){
			this.imgs.push(array[i]);
		}
	};
	return WordGridView;
})(GridView);



// GridViewCtrl the outer grid and control
var GridViewCtrl = (function(){
	function GridViewCtrl(gridView/*GridView*/){

		this.vWidth = 600;// width of view
		this.vHeight = 400; // height of view
	};
	GridViewCtrl.prototype = {
			gridView:null,
			setGridView :function(gridView){
				this.gridView = gridView;
			}
	};
	return GridViewCtrl;
})();
exports.GridView = GridView;
exports.WordGridView = WordGridView;
});