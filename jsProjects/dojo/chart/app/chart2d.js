//ref->http://www.ibm.com/developerworks/library/wa-moredojocharts/
//ref->http://www.ibm.com/developerworks/cn/web/wa-dojocharts/
//ref->http://www.ibm.com/developerworks/cn/web/1403_tangzh_dojochart/



define(["dojo/_base/declare", "dojox/charting/Chart", "dojox/charting/SimpleTheme", "dojox/charting/themes/Tom",
         "dojox/charting/plot2d/Grid","dojox/charting/action2d/MouseZoomAndPan","dojox/charting/action2d/MouseIndicator",
		"dojox/charting/axis2d/Default", "dojox/charting/plot2d/Lines","dojox/charting/plot2d/Bars","dojox/charting/plot2d/Areas","dojox/charting/plot2d/Columns",
		"dojox/charting/plot2d/StackedAreas", "dojox/charting/plot2d/Bubble", "dojox/charting/plot2d/StackedColumns", "dojox/charting/plot2d/ClusteredBars", "dojox/charting/plot2d/StackedBars", "dojox/charting/plot2d/ClusteredColumns",
		"dojox/charting/widget/Legend","dojox/charting/action2d/Tooltip","dojox/charting/action2d/Magnify",
		"dojo/ready" ], function(declare, Chart,SimpleTheme,Tom, 
				Grid,MouseZoomAndPan,MouseIndicator,
				Default, Lines,Bars,Areas,Columns,StackedAreas,Bubble,StackedColumns,ClusteredBars,StackedBars,ClusteredColumns,
				Legend, Tooltip,Magnify,ready) {

	var chart2d =declare("chart2d",Object,{
	    chart: null,
	    legend:null,
		constructor:function(){
			
			
		},
		draw: function (div, chartType) {
		    this.clean();
		    var myTheme = new SimpleTheme({
		        markers: {
		            CIRCLE:        "m-3,0 c0,-4 6,-4 6,0 m-6,0 c0,4 6,4 6,0",
		            SQUARE:        "m-3,-3 l0,6 6,0 0,-6 z",
		            DIAMOND:    "m0,-3 l3,3 -3,3 -3,-3 z",
		            CROSS:        "m0,-3 l0,6 m-3,-3 l6,0",
		            X:        "m-3,-3 l6,6 m0,-6 l-6,6",
		            TRIANGLE:    "m-3,3 l3,-6 3,6 z",
		            TRIANGLE_INVERTED:"m-3,-3 l3,6 3,-6 z"
		        }
		    });			var chart = new Chart(div,{title: "Production(Quantity)"});
		    chart.setTheme(myTheme);
		    chart.addPlot("grid", { type: Grid,
		        hMajorLines: true,
		        hMinorLines: false,
		        vMajorLines: true,
		        vMinorLines: false,
		        majorHLine: { color: "green", width: 1 },
		        majorVLine: { color: "red", width:1 },
		        hStripes: true,
		        vStripes: false,
		        hFill: "red",
		        vFill: "blue" ,
		        hAxis: "x",
		        vAxis: "y" 
		    });

		    var plotOpts ;//= { markers: true };
		    switch (chartType) {
		        case 'ClusteredBars':
		            plotOpts = { type: ClusteredBars }; break;
		        case 'ClusteredColumns':
		            plotOpts = { type: ClusteredColumns }; break;
		        case 'StackedBars':
		            plotOpts = { type: StackedBars }; break;
		        case 'StackedColumns':
		            plotOpts = { type: StackedColumns }; break;
		        case 'StackedAreas':
		            plotOpts = { type: StackedAreas }; break;
		        case "Lines":
		            plotOpts = { type: Lines }; break;
		        case "Bars":
		            plotOpts = { type: Bars, pag: 5, minBarSize: 3, maxBarSize: 50 }; break;
		        case "Bubble":
		            plotOpts = { type: Bubble, fill: "red" }; break;
                    
		        case "Columns":
		        default:
		            plotOpts = { type: Columns, gap: 5 }; 
		    }
		    plotOpts.markers = true;// plotOpts.fill = 'green';
		    chart.addPlot("default", plotOpts);
		    /*
			chart.addPlot("default", {
				//type:Columns,
				type:Lines,
				//type:Columns,gap: 5,
				//type: Bars, gap: 5,// minBarSize: 3, maxBarSize: 50 ,
				//tension: "S",
				markers: true,
				//interpolate:true,
			});
		    //			//chart.addPlot("default", { type: Bubble, fill: "red" });
            */
		    chart.addAxis("x",{
		        title:"x axis",
		        titleOrientation:"away"
		    });
		    chart.addAxis("y", {
		        vertical: true,
		        includeZero:true,
		        title:"y",
		        fixLower: "major", fixUpper: "major"
		    });
		    //			chart.addAxis("y1", {
		    //				vertical : true,
		    //				title:"y2",
		    //				leftBottom:false
		    //			});
		    var isLine = /Lines/.test(chartType), isStacked = /(^Stack)|(^Clustere).*/.test(chartType);
		    if (isLine) {
		        chart.addSeries("Series 1", [1, 3, 2, 4, 9, 6, 7]);
		        chart.addSeries("Series A", [{ x: 1, y: 5 }, { x: 1.5, y: 1.7 }, { x: 2, y: 9 }, { x: 5, y: 3 }]);
		        chart.addSeries("Series B", [{ x: 3, y: 8.5 }, { x: 4.2, y: 6 }, { x: 5.4, y: 2 }]);

		        new MouseIndicator(chart, "default", {
		            series: "Series 1",
		            font: "normal normal bold 12pt Tahoma",
		            fillFunc: function (v) {
		                return v.y > 3 ? "green" : "red";
		            },
		            labelFunc: function (v) {
		                return "x: " + v.x + ", y:" + v.y;
		            }
		        });
		        
		    } else if (isStacked){
		        chart.addSeries("A", [1, 3, 5, 7, 2, 4, 6], { fill: "red" }).
                      addSeries("B", [2, 4, 6, 8, 3, 5, 7], { fill: "green" }).
                      addSeries("C", [6, 4, 2, 7, 5, 3, 1], { fill: "blue" });
		        //chart.addSeries("A", [{ x: 1, y: 3 }, { x: 5, y: 7 }, { x: 2, y: 4 }, { x: 1, y: 6 }], { stroke: { color: "red" }, fill: "red" }).
                //      addSeries("B", [{ x: 2, y: 4 }, { x: 6, y: 8 }, { x: 3, y: 5 }, { x: 1, y: 7 }], { stroke: { color: "green" }, fill: "green" }).
                //      addSeries("C", [{ x: 6, y: 4 }, { x: 2, y: 7 }, { x: 5, y: 3 }, { x: 1, y: 1 }], { stroke: { color: "blue" }, fill: "blue" })

		    }   else {
		        var data = [{ x: 1, y: 1, size: 1 }
			    			, { x: 5, y: 4, size: 1 }
			    			, { x: 2, y: 3, size: 1 }
			    			, { x: 3, y: 2, size: 1 }
			    			, { x: 4, y: 1, size: 1 }];
		        chart.addSeries("Series", data);
			}
			//chart.render();
			 var tip = new Tooltip(chart,"default");
			 
			    // Create the magnifier
			    var mag = new Magnify(chart,"default");

		    new MouseZoomAndPan(chart, "default", { axis: "x" });
		    new MouseZoomAndPan(chart, "default", { axis: "y" });
		    
			    // Render the chart!
			    chart.render();

			    // Create the legend
			    !this.legend&&(this.legend = new Legend({ chart: chart }, "legend1"));
			this.chart = chart;
		},
		clean: function () {
		    this.chart && this.chart.destroy();
		}
	});
	return chart2d;
});

//exports.chart2d = chart2d;
