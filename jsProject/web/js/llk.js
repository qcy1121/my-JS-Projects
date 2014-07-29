
var __extends = this.__extends || function(d, b) {
	function __() {
		this.constructor = d;
	}
	__.prototype = b.prototype;
	d.prototype = new __();
};
define(["exports","jquery","app/dataApi","app/utils"],function(exports,$,webApi){
var GridCell = (function() {

	function GridCell(cell/*Cell*/){
		this.cell = cell;
	};
	return GridCell;
})();

var Cell = (function(){
	function Cell(x, y,img ,audio){
		this.x = x;
		this.y = y;
		this.img = img;
		this.audio = audio;
		this.isHidden = false;
	};
	Cell.prototype = {
			name:null,
			onclick:null,
			jObj:null,
			view:null,//for click 
			click:function(event,view){
				view.onClick(this);
			},
			addEvent:function(){
				var cell  = this.jObj,_this = this;
				cell.click(function(event){
					_this.audio.flip.play();
					_this.click(event,_this.view);
				}); 

				cell.on("mouseover",function(){_this.audio.beep.play();});
			},
			setJobj:function(){
				this.jObj=$("<img src="+this.img+" class='imgCell' />");
				
			},
			draw:function(){
				if(!this.jObj){
					this.setJobj();
				}
				this.addEvent();
				this.jObj.css("visibility",this.isHidden?"hidden":"visible");
			
				return this.jObj;
			}/*,
			toHtml:function(){
				return "<img src="+this.img+"  class='imgCell' style='display:block' />";
			}*/
	};
	return Cell;
	
})();
var WordCell = (function(_super){
	__extends(WordCell,_super);
	function WordCell(i,j,img,audio){
		_super.call(this,i,j,img,audio);
	};

	WordCell.prototype.setJobj=function(){
		this.jObj = $("<div class='imgCell'>"+this.img+"</div>");
	};

	return WordCell;
})(Cell);

var resource = (function(){
	var _resource = function(audio,images){
		this._audio = audio?audio: {flip: '../audio/audio-flip.ogg',
		        link:'../audio/audio-link.ogg',
		        beep: '../audio/audio-beep.ogg'};
		this._images =images?images:{
			
		};
		this.audio ={},this.images = {};
		
	};
	_resource.prototype.load = function(){
		for(var idx in this._audio){
			var audio = new Audio(this._audio[idx]);
			this.audio[idx]=audio ;
		}
		for(var idx in this._images){
			var image = new Image(this._images[idx]);
			this.images[idx]= image;
		}
		this.audio.beep.volume=0.5;
		return this;
	};

	return _resource;
})();
exports.resource = resource;

// the grid
var GridView = (function() {
	function GridView(parent,opts) {
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
		//this.cell_size = opts.cell_size?opts.cell_size:40; // size of square cell.
		this.parentElement = parent;
		parent.empty();
		this.timerId= null;
		this.timeObj = opts.timeObj;
		this.outwidth = opts.width;
		this.levelUpCallback = opts.levelUpCallback;
		// this.timeStart = Date.getTime() ; this.timeNow = ... // Using precise time
		this.timeStep = 500;
		this.underlay = null;
		this.xNum =  10; // rows of view table
		this.yNum =  5; // columns of view table
		this.level = opts.level?opts.level:1;
		this.bigLevel = 0;
		this.baseNum =10;
		this.imgNum=this.level*2+this.baseNum;
		this.stop=false;
		this.zoom=1;
		this.over = false;
		this.resource = opts.resource?opts.resource:(new resource()).load();
		this.levels = [
						{y:6,x:6},
						{y:6,x:7},
						{y:6,x:8},
						{y:6,x:9},
						{y:6,x:10},
						{y:6,x:11},
						{y:6,x:12},
						{y:6,x:13},
						{y:6,x:14},
						{y:7,x:13},
						{y:7,x:14},
	        			{y:7,x:15}
	        	            ];
	};
	
	
	
	GridView.prototype = {
		calculateLevel:function(){
            this.level>this.levels.length&&(alert("你通关了，再通一次吧！"),this.level=1);
			var levelVal =  this.levels[this.level-1];
			this.xNum = levelVal.x; // rows of view table
			this.yNum =  levelVal.y; // columns of view table
			/*if(this.xNum * this.yNum %2){
				alert(" Wrong xNumber or yNumber");
				this.xNum = 10;
			}*/
			this.imgNum=this.level*2+this.baseNum;
		},
		/*setImgNum:function(num){
			this.imgNum = num;
		},*/
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
			return new Cell(i,j,img,this.resource.audio);
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
			if(imgNum == this.imgNum && this.imgs.length>imgNum){
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
		
		refresh:function(){
			if(this.isOver())return ;
			this.refreshGrid();
			this.drawGrid();
		},
		drawGrid:function(){
			//this.underlay.destory();
			//this.parentElement.empty();
			var table = this.table,col,cell,underlay = this.underlay;
			if(!table){
				table = $("<table id='gridTable' class='gridTable'></table>");
				underlay =$("<div>").addClass("underlay");
				table.appendTo(this.parentElement);
				underlay.appendTo(this.parentElement);
			}
			table.empty();
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

			underlay.css({width:table.width(),height:table.height(),position:"absolute",top:"0px",left:"0px"}).fadeOut("100");

			this.underlay = underlay;
			this.table = table;
			//this.changeZoom();
		},
		changeZoom :function(){
			var width = this.table.width(),
			zoom = this.outwidth/width;
			this.setZoom(zoom);
		},
		setZoom:function(zoom){
			var css ;
			if(typeof zoom == "object"){
				var x = zoom.x,y=zoom.y;
				css = {"-webkit-transform": "scale("+x+","+y+")", "-ms-transform": "scale("+x+","+y+")","transform": "scale("+x+","+y+")"};
				
			}else{
				css = {"zoom":zoom};
			}
			this.table.css(css);
			this.underlay.css(css);
		},
		onClick:function(cell/*cell*/){
			//TODO
			if(cell.isHidden) return;
			
			if(this.selectedCell && (this.selectedCell.img == cell.img) && (this.selectedCell != cell)){
				var path = this.findPath(this.selectedCell,cell);
				if(path){
					this.doLink(path,cell);
				}else // can't select
					this.selectCell(cell);
			}else{// not same or first select
				this.selectCell(cell);
			}
			
			
			
		},
		doLink:function(path,cell){
			this.drawPath(path);
			this.hidSelected(this.selectedCell,cell);

			this.timeObj.time2 =this.timeObj.shorttime;
			this.removeHighlightCells();
			if(this.bigLevel)this.refresh();
			this.checkDeadLock();
		},
		drawPath:function(path){
			this.resource.audio.link.play();
			
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
		render : function(level) {
			this.level = level?level:this.level;
			this.calculateLevel();
			this.selfInit();
			this.initGridArray();
			this.refreshGrid();
			this.drawGrid();
			this.initTimer();
		},
		renderHighLevel:function(){
			if(this.level>this.levels.length){
				this.level = 1;
				this.bigLevel = 2;
			}else{ 
				this.level++;
			}
			//TODO the level and bigLevel need use one argument
			
			
			if(this.levelUpCallback)this.levelUpCallback(this.level);
			this.render(this.level);
		},

		selfInit:function(){
			var path = this.basePath+"../images";
			this.initImgs(path,31);
		},
		initTimer:function(){
			this.cleanTimer();
			this.timeObj.time1= this.timeObj.maxtime;
			this.timeObj.time2 = 0;
			this.startTimer();
		},
		checkDeadLock:function(){
			this.tips = this.checkCells();
			if(!this.tips){
				this.refreshGrid();
				this.drawGrid();
			}
		},
		hint:function(){
			if(this.isOver())return ;
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
				this.renderHighLevel();
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
				this.renderHighLevel();
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
		gameover:function(){
			
			this.underlay.fadeIn("100").html("<div style='font-size:20px' >GAME OVER</div>");
			this.destroy();
		},
		destroy:function(){
			this.over = true;
			this.cleanTimer();
			//this.cleanOptions();
			delete this;
		},
		pause:function(){

			this.underlay.fadeIn("100");
			this.pauseTimer();
			 
		},
		goon:function(){
			//this.startTimer();
			if(this.isOver())return;
			this.stop=false;
			this.underlay.fadeOut("100");
		},
		startTimer:function(){
			//this.cleanTimer();
			this.stop  = false;
			var timeStep = this.timeStep, step = timeStep/1000,_this = this;
			var timerCtr = function(){
				if(_this.stop)return;
				if(_this.timeObj.time1<=0){_this.gameover();return;}
				if(_this.timeObj.time2){
					_this.timeObj.time2-=step;
				}else{

					_this.timeObj.time1-=step;
				}
				_this.timeObj.timerCallback();
			};
			// no need to use requestAnimationFrame()
			this.timerId = setInterval(timerCtr,timeStep);
		},
		pauseTimer:function(){
			this.stop=true;
			//clearInterval(this.timerId);
			
		},
		cleanTimer:function(){
			clearInterval(this.timerId);
		},
		isOver:function(){
			if(this.over){
				alert("GAME OVER!");
				return true;
			}
			return false;
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
	function WordGridView(parent,opts){
		_super.call(this,parent,opts);
		var wordsArray = opts.wordArray;
		if(!wordsArray|| !wordsArray.length){
			//alert("There is no words input!");
			//return;
			wordsArray = webApi.webApi.load.wordsArray();
		}
		this.wordsArray  = wordsArray;
	}
	WordGridView.prototype.createNewCell=function(i,j,img){
		return new WordCell(i,j,img,this.resource.audio);
	},
	WordGridView.prototype.selfInit=function(){
		this.initWords(this.wordsArray);
	
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

//todo,add tongyinzi matching

exports.GridView = GridView;
exports.WordGridView = WordGridView;
});