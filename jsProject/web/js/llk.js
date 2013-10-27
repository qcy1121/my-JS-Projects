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
			click:function(event){
				this.onclick(this);
			},
			draw:function(){
				var cell = $("<img src="+this.img+" />");
				var _this = this;
				cell.onclick(function(event){
					_this.click(event);
				}); 
				return cell;
			},
			toHtml:function(){
				return "<img src="+this.img+" />";
			}
	};
	return Cell;
	
})();

// the grid
var GridView = (function() {
	var GridView = function(parent,xNum, yNum,cell_size) {

		this.xNum = xNum ? xNum : 10; // rows of view table
		this.yNum = yNum ? yNum : 5; // columns of view table
		this.cell_size = cell_size?cell_size:40; // size of square cell.
		this.parentElement = parent;
	};
	GridView.prototype = {
		grid : null,
		cells:null,
		imgs:null,
		basePath:"./",
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
			var img = null;
			for(var i=0;i<this.xNum;i++){
				this.gridCells[i] = [];
				for(var j=0;j<this.yNum;j++){
					if(!(j % 2))img = this.getImg();
					console.log(img);
					cell = new Cell(i,j,img);
					cell.onclick = this.onClick;
					gridCell = new GridCell(cell);
					this.cells.push(cell );
					this.gridCells[i].push(gridCell);
				}
			}
		},
		getImg:function(isSort){
			if(!isSort){
				var randomIdx =Math.floor(Math.random()*(this.imgs.length));
				return this.imgs[randomIdx];
			}else{
				//TODO  
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
			var gridCell,cell,randomCell;
			for(var i=0;i<this.gridCells.length;i++){
				for(var j=0;j<this.gridCells[i].length;j++){

					gridCell = this.gridCells[i][j];
					cell = gridCell.cell;
					if(gridCell.cell.isHidden)continue;// the gridCell must be not hidden
					
					do{
						randomCell = this.getRandomCell();
					}while(randomCell.isHidden || cell == randomCell)
					
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

			
			for(var i=0;i<this.gridCells.length;i++){
				col = $("<tr></tr>");
				col.appendTo(table);
				for(var j=0;j<this.gridCells[i].length;j++){
					cell = this.gridCells[i][j].cell;
					$("<td>"+cell.toHtml()+"</td>").appendTo(col);
				}
			}
			//this.parentElement.append(table);

			table.appendTo(this.parentElement);
		},
		onClick:function(/*cell*/){
			//TODO
			
			
			
			
			
		},
		init : function() {
			var path = this.basePath+"../images";
			this.initImgs(path,31);
			this.initGridArray();

			this.refreshGrid();
			this.drawGrid();
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