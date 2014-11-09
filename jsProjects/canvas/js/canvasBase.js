
define(['jquery'], function ( $) {
    var CanvasTool = (function () {
        var CanvasTool = function () { };
        var $showDiv = $("#showDiv");
        CanvasTool.createCanvas = function () {
            var canvas = document.createElement("canvas");
            canvas.width = '300';
            canvas.height = '300';
            var div = document.createElement("div");
            div.appendChild(canvas);
            $showDiv.get(0).appendChild(div);
            return canvas;
        }

        return CanvasTool;
    })();

    //exports.CanvasTool = CanvasTool;

    var CanvasStudy = Object.create(null);
    CanvasStudy.L1 = function () {
        var canvas = CanvasTool.createCanvas();
        var ctx = canvas.getContext('2d');
        // ctx.filRect(x,y,width,height);
        // ctx.strokeRect(x,y,width,height);
        // ctx.art(x, y, radius, startAngle, endAngle, anticlockwise );
        ctx.fillRect(40, 40, 100, 100);

        ctx.beginPath();
        ctx.moveTo(145, 140);
        ctx.lineTo(245, 150);
        ctx.lineTo(200, 50);
        ctx.closePath();
        ctx.stroke();

        ctx.lineWidth = 5;
        ctx.lineTo(285, 285);
        ctx.stroke();

        ctx.lineWidth = 1;
        ctx.lineTo(285, 185);
        ctx.stroke();


        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.arc(150, 250, 50, Math.PI/2, 3*Math.PI/2 , false);
        ctx.closePath();
        ctx.fill();

        var text = "Hello World";
        ctx.font = 'italic 30px serif';
        ctx.fillText(text, 20, 200);

        return ctx;
    }
    CanvasStudy.L2 = function (ctx) {
        if (!ctx) {
            var canvas = CanvasTool.createCanvas();
            var ctx = canvas.getContext('2d');
        }
        ctx.fillStyle = 'red';
        ctx.save();
        ctx.fillRect(50, 50, 100, 100);

        ctx.fillStyle = 'blue';
        ctx.fillRect(200, 50, 100, 100);

        setTimeout(function () {
            ctx.restore();
            ctx.fillRect(50, 200, 100, 100);
        }, 500);


        return ctx;
    }
    CanvasStudy.L3 = function (context) {
        var ctx = CanvasStudy.L2(context);
        ctx.save(); ctx.save();// ctx.save();
        ctx.translate(50, 50);
        var drawRect = function () {
            ctx.fillRect(50, 50, 100, 100);
        }

        drawRect();
        setTimeout(function () {
            ctx.scale(0.5, 0.8);// all the context base changed
            drawRect();
        }, 500);
        setTimeout(function () {
            ctx.restore();
            ctx.rotate(0.7854);//45 deg
            drawRect();
            //ctx.restore();
        }, 1000);
        
        /*
        a c e       xScale   xSkew    xTrans
        b d f  =    yScale   ySkew    yTrans
        0 0 1       0        0          1

        // base matrix
        1 0 0
        0 1 0
        0 0 1
        ctx.transform(xScale, ySkew, xSkew, yScale, xTrans, yTrans);
        */
        setTimeout(function () {
            
            ctx.setTransform(1, 0, 0, 1, 0, 0)
            ctx.clearRect(0, 0, 300, 300);

            ctx.fillStyle = 'rgba(63,169,245,0.5)';
            ctx.fillRect(50, 50, 50, 50);
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = 'rgba(63,169,245,1)';
            ctx.fillRect(100, 100, 50, 50);
            ctx.globalAlpha = 1; // back to default;
            //ctx.fillStyle = 'rgb(63,169,245)';
            ctx.fillRect(150, 150, 50, 50);
            



        }, 1500);

    }
    //exports.CanvasStudy = CanvasStudy;
    return {
        run: function () {
            for (var i in CanvasStudy) {
                var fn = CanvasStudy[i];
                fn();
            }
        }
    }
});

