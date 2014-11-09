/**
 * Created by IntelliJ IDEA.
 * User: quch
 * Date: 12/10/12
 * Time: 3:25 PM
 * To change this template use File | Settings | File Templates.
 */


//THREE.CSS3DCube = function ( width, height, depth, widthSegments, heightSegments, depthSegments ) {
var CSS3DCube = function(scene) {

    if (scene && scene instanceof THREE.Scene) {
        this.scene = scene;
    } else {
        alert("Wrong scene!");
    }
    var colors = new Array(6);
    colors[0] = colors[1] = new THREE.Color(0xff0000).getContextStyle();
    colors[2] = colors[3] = new THREE.Color(0x00ff00).getContextStyle();
    colors[4] = colors[5] = new THREE.Color(0x0000ff).getContextStyle();
    this.defaultColors = colors;
};

CSS3DCube.prototype = {
    scene: null,x:null,y:null,z:null,defaultColors: [],
    PLANE : {XOY:"XOY",YOZ:"YOZ",XOZ:"XOZ"},


    setScene: function (scene) {
        if (scene && scene instanceof THREE.Scene)
            this.scene = scene;
    },
    /*
     build Plane with start position is (x,y,z),
     */
    createPlane : function (x, y, z, width, height, planeStr, color) {

        var start_position ,rotation;
        switch (planeStr) {
            case "XOY":
                rotation = new THREE.Vector3(0, 0, 0);
                start_position = new THREE.Vector3(x + width / 2, y + height / 2, z);
                break;
            case "YOZ":
                rotation = new THREE.Vector3(0, 1.57, 0);
                start_position = new THREE.Vector3(x, y + height / 2, z + width / 2);
                break;
            case "XOZ":
                rotation = new THREE.Vector3(1.57, 0, 0);
                start_position = new THREE.Vector3(x + width / 2, y, z + height / 2);
                break;
            default:
                alert("error planeStr");
        }
        return this.buildPane(start_position, rotation, width, height, color);

    },
    createCube : function (x, y, z, width, height, depth, colors) {


        if (!( colors && ( colors instanceof Array ) && colors.length == 6)) {
            colors = this.defaultColors;
        }

        this.x = x;
        this.y = y;
        this.z = z;

        this.buildCubePlane(width / 2, height / 2, 0, width, height, colors[0], this.PLANE.XOY);
        this.buildCubePlane(width / 2, height / 2, depth, width, height, colors[1], this.PLANE.XOY);
        this.buildCubePlane(0, height / 2, depth / 2, depth, height, colors[2], this.PLANE.YOZ);
        this.buildCubePlane(width, height / 2, depth / 2, depth, height, colors[3], this.PLANE.YOZ);
        this.buildCubePlane(width / 2, 0, depth / 2, width, depth, colors[4], this.PLANE.XOZ);
        this.buildCubePlane(width / 2, height, depth / 2, width, depth, colors[5], this.PLANE.XOZ);
    },

    buildCubePlane : function(x, y, z, width, height, color, planeStr) {


        var rotation, start_position = new THREE.Vector3(x + this.x, y + this.y, z + this.z);
        switch (planeStr) {
            case "XOY":
                rotation = new THREE.Vector3(0, 0, 0);
                break;
            case "YOZ":
                rotation = new THREE.Vector3(0, 1.57, 0);
                break;
            case "XOZ":
                rotation = new THREE.Vector3(1.57, 0, 0);
                break;
            default:
                alert("error planeStr");
        }
        this.buildPane(start_position, rotation, width, height, color);

    },

    buildPane :function (position, rotation, width, height, color) {
        var plane = document.createElement('div');
        plane.style.width = width + "px";
        plane.style.height = height + "px";
        plane.style.background = color;
        plane.style.opacity = 1;
        var object = new THREE.CSS3DObject(plane);
        object.position = position;
        object.rotation = rotation;
        this.scene.add(object);
        return object;
    }
}
    ;
