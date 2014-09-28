
(function addCssHooks() {
    var div = document.createElement('div'),
        divStyle = div.style,
        support = $.support;
    support.transform = divStyle.transform ==='' ? 'transform':divStyle.MozTransform === '' ? 'MozTransform' : (divStyle.WebkitTransform === '' ? 'WebkitTransform' : (divStyle.OTransform === '' ? 'OTransform' : (divStyle.MsTransform === '' ? 'MsTransform' : "")));
    $.cssHooks.transform = {
        set: function (elem, value) {
            var supportTransform = support.transform;
            if(!supportTransform)throw "not support transform";
            elem.style[supportTransform] = value;
            //存储该值,使得可以get 
            $.data(elem, 'transform', {
                value: value
            });
        },
        get: function (elem) {
            return $.data(elem, 'transform').value;
        }
    }
    support.transformOrigin = divStyle.TransformOrigin === '' ? 'transformOrigin' : divStyle.MozTransformOrigin === '' ? 'MozTransformOrigin' : (divStyle.WebkitTransformOrigin === '' ? 'WebkitTransformOrigin' : (divStyle.OTransformOrigin === '' ? 'OTransformOrigin' : (divStyle.MsTransformOrigin === '' ? 'MsTransformOrigin' : "")));
    $.cssHooks.transformOrigin = {
        set: function (elem, value) {
            var supportTransformOrigin = support.transformOrigin;
            if (!supportTransformOrigin) throw "not support transform orgin";
            elem.style[supportTransformOrigin] = value;
            //存储该值,使得可以get 
            $.data(elem, 'transformOrigin', {
                value: value
            });
        },
        get: function (elem) {
            return $.data(elem, 'transformOrigin').value;
        }
    }

})();
function afterRun() {
    function addRules(sheet, selector, styles) {
        if (!sheet) return;
        try {
            if (sheet.insertRule) return sheet.insertRule(selector + " {" + styles + "}", sheet.cssRules.length);
            if (sheet.addRule) return sheet.addRule(selector, styles);
        } catch (e) {
            console.log(e);
        }
    }
    var sheet = document.styleSheets[0];
    addRules(sheet, '.unit', "display:inline-block;padding:4px;margin-right:5px;border:solid 1px;");
};
function run() {
    var $btns = $("#btns"), $showDiv = $("#showDiv"), $value = $("#value");
    var transform = [
        { name: 'translate', units: 'px', x: 100, y: 100 },
        { name: 'rotate', units: 'deg', x: 180},
        { name: 'scale', units: '', x: 2, y: 2,min:1 },
        { name: 'skew', units: 'deg', x: 180, y: 180 }
        //matrix(n,n,n,n,n,n)
    ],
    transform3d = [
        { name: 'translate3d', units: 'px', x: 100, y: 100, z: 100 },
        { name: 'rotate3d', x: 100, y: 100, z: 100,angle:180 },//rotate3d(x,y,z,angle)
        { name: 'scale3d', units: '', x: 1, y: 1,z:1 ,min: -1 }
        //matrix3d(n,n,n,n,n,n,n,n,n,n,n,n,n,n,n,n
        //perspective(n)	Defines a perspective view for a 3D transformed element
    ]
    units = [],units3d=[];
    var createUnit = function (item) {
        var $unit = $("<div class='unit'>"),
            unitsStr = item.units ? item.units : "",
            min = item.min||0,
            $inputX = item.x && $("<input type='range' max='" + item.x + "' min='"+min+"' value='"+min+"' />"),
            $inputY = item.y && $("<input type='range' max='" + item.y + "' min='" + min + "' value='" + min + "' />"),
            $inputZ = item.z && $("<input type='range' max='" + item.z + "' min='" + min + "' value='" + min + "' />"),
            $divX = $inputX && $("<div>" + item.name + " " + ($inputY ? "X" : "") + " : <label>" + $inputX.val() + "</label>" + unitsStr + "</div>").append($inputX),
            $divY = $inputY && $("<div>" + item.name + " Y : <label>" + $inputY.val() + "</label>" + unitsStr + "</div>").append($inputY),
            $divZ = $inputZ && $("<div>" + item.name + " Z : <label>" + $inputZ.val() + "</label>" + unitsStr + "</div>").append($inputZ);
        $divX && $unit.append($divX);
        $divY && $unit.append($divY);
        $divZ && $unit.append($divZ);

        var getStyleValue;
        if (item.angle) {
            var $inputD = $("<input type='range' max='" + item.angle + "' min='0' value='0' />"),
                $divD = $("<div> angle : <label>"+item.angle+"</label>deg</div>").append($inputD);
            $unit.append($divD);
            getStyleValue = function () {
                var vx = $inputX.val(), vy = $inputY.val(), vz = $inputZ.val(),vd = $inputD.val();
                return item.name + "(" + vx + "," + vy + "," + vz + "," +vd +"deg)";
            }
        } else {
            getStyleValue = function () {
                var vx = $inputX.val(), vy = $inputY && $inputY.val(), vz = $inputZ && $inputZ.val();
                return item.name + "(" + vx + "" + unitsStr + ($inputY ? ("," + vy + "" + unitsStr) : "") + ($inputZ ? ("," + vz + "" + unitsStr) : "") + ")";
            }
        }
        $unit.getStyleValue = getStyleValue;
        return $unit;
    }
    var $transformDiv = $("<div>").appendTo($btns), $transform3dDiv = $("<div>").appendTo($btns);
    transform.forEach(function (item) {
        var unit = createUnit(item);
        $transformDiv.append(unit);
        units.push(unit);
    });
    var showInputValue = function (item) {
        var $item = $(item);
        $item.parent().find('label').text($item.val());
    }
    $transformDiv.find('input').on('change', function () {
        showInputValue(this);
        var values = [];
        units.forEach(function ($unit) {
            values.push($unit.getStyleValue());
        });
        update(values.join(" "));

    });
    transform3d.forEach(function (item) {
        var unit = createUnit(item);
        $transform3dDiv.append(unit);
        units3d.push(unit);
    });
    $transform3dDiv.find('input').on('change', function () {
        showInputValue(this);
        var values = [];
        units3d.forEach(function ($unit) {
            values.push($unit.getStyleValue());
        });
       
        update(values.join(" "));
    });

    var update = function (value) {
        $showDiv.css('transform', value);
        $value.text(value);
    }

}
$(function () {

    run();
    afterRun();
});