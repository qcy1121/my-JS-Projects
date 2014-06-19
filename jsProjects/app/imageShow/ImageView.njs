var fs = require("fs"),
    path = "./images";//233_0515";// the folder path to get images

function readDir(path, obj, callback) {

    fs.readdir(path, function (err, files) {
        if (err)console.log(err);
        //obj.array.push({name: path, path: path, type: 'path'});
        var paths = [];
        for (var i in files) {
            var f = files[i], p = path + "/" + f, file = fs.lstatSync(p);
            if (file.isDirectory()) {
                paths.push(p);
            } else if (file.isFile()) {
                readFile(f, path, obj);
            }
        }


        if (paths.length == 0) {
            if (callback) {
                callback();
            }
        } else {
            var hooks = [];
            for (var i in paths) {
                //console.log(paths[i]);
                readDir(paths[i], obj, function () {
                    hooks.push(1);
                    if (hooks.length == paths.length &&callback) {
                        callback();
                    }
                });
            }

        }
    });
};


function readFile(file, path, obj) {
    var reg = /.JPG/i;
    if (reg.test(file)) {
        var a = {name: file, url: (path + '/' + file), type: 'image'};
        //console.log(file);
        var arr = obj[path];
        if(!arr)arr=obj[path]=[];
        arr.push(a);

    }
};
function saveFile(obj) {

    fs.writeFile('data.js', 'var data='+ JSON.stringify(obj), function (e) {
        if (e)console.error(e);
    });
    //fs.read
}
function read(path) {
    var obj = {};
    var cb = function () {
        //console.log(content.length);
        saveFile(obj);
    };
    readDir(path, obj, cb);
}
read(path);