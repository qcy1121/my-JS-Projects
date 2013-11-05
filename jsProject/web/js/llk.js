var __extends = this.__extends || function(d, b) {
	function __() {
		this.constructor = d;
	}
	__.prototype = b.prototype;
	d.prototype = new __();
};

var GridCell = (function() {

	var GridCell = function(cell/*Cell*/){
		this.cell = cell;
	};
	return GridCell;
})();

var Cell = (function(){
	var Cell = function(x, y,img ){
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
			draw:function(){
				var cell = $("<img src="+this.img+" class='imgCell' />");
				var _this = this;
				//this.click = 
				cell.click(function(event){
					_this.click(event,_this.view);
				}); 
				cell.css("display",this.isHidden?"none":"block");
				this.jObj = cell;
				return cell;
			},
			toHtml:function(){
				return "<img src="+this.img+"  class='imgCell' style='display:block' />";
			}
	};
	return Cell;
	
})();

// the grid
var GridView = (function() {
	var GridView = function(parent,xNum, yNum,cell_size) {
		
		this.xNum = xNum ? xNum : 15; // rows of view table
		this.yNum = yNum ? yNum : 10; // columns of view table
		if(this.xNum * this.yNum %2){
			alert(" Wrong xNumber or yNumber");
			this.xNum = 10;
		}
		this.cell_size = cell_size?cell_size:40; // size of square cell.
		this.parentElement = parent;
	};
	GridView.prototype = {
		grid : null,
		cells:null,
		imgs:null,
		imgMap:null,
		basePath:"./",
		selectedCell:null,
		hidCount:0,
		allCount:0,
		table:null,
		tips:null,
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
		initGridArray : function() {
			this.gridCells = [];
			this.cells = [];
			this.imgMap = {};
			this.allCount = this.xNum * this.yNum;
			this.hidCount = 0;
			var img = null;
			for(var i=0;i<this.xNum;i++){
				this.gridCells[i] = [];
				for(var j=0;j<this.yNum;j++){
					if((this.cells.length % 2)==0)img = this.getRandomImg();
					//console.log(img);
					cell = new Cell(i,j,img);
					cell.view = this;
					//cell.onclick = this.onClick;
					gridCell = new GridCell(cell);
					this.cells.push(cell );
					this.gridCells[i].push(gridCell);
					this.pushToImgMap(img, cell);
				}
			}
		},
		pushToImgMap:function(img,cell){
			var imgCells = this.imgMap[img];
			if(!imgCells){
				imgCells = [];
				this.imgMap[img] = imgCells;
			}
			imgCells.push(cell);
			
		},
		getRandomImg:function(isSort){
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
			if(this.allCount - this.hidCount <=2){
				alert("Can't resfresh, please click draw button");
				return;
			}
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
			// case 1: the two cell in one line
			/*if(cell1.x == cell2.x){ // x axis is same, check each point in y axis
				if(cell1.y>cell2.y){
					tp1= {x:cell2.x,y:cell2.y};
					tp2 = {x:cell1.x,y:cell1.y};
				}
				if(this.canLinkWithLine(tp1,tp2,true))return [tp1,tp2];
			}else if(cell1.y == cell2.y){ // y axis is same, check each point x axis
				if(cell1.x>cell2.x){
					tp1= {x:cell2.x,y:cell2.y};
					tp2 = {x:cell1.x,y:cell1.y};
				}
				if(this.canLinkWithLine(tp1,tp2,false))return [tp1,tp2];
				
			}*/
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
			cell1.jObj.css("display","none");
			cell2.jObj.css("display","none");
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
			this.selectedCell.jObj.addClass("selected");
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
			for ( var idx in this.cells) {
				cell = this.cells[idx];
				if (cell.isHidden)
					continue;
				img = cell.img;
				imgCells = this.imgMap[img];
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

// GridViewCtrl the outer grid and control
var GridViewCtrl = (function(){
	var GridViewCtrl = function(gridView/*GridView*/){

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