var fs = require("fs"),
    path = "./2013.04.07 Oriental Park";// the folder path to get images

function readDir(path, obj, callback) {

    fs.readdir(path, function (err, files) {
        if (err)console.log(err);
        obj.array.push({name: path, path: path, type: 'path'});
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
                    if (hooks.length == paths.length) {
                        if (callback)callback();
                    }
                });
            }

        }
    });
};


function readFile(file, path, obj) {
    var reg = /.JPG/i;
    if (reg.test(file)) {
        var a = {name: file, path: (path + '/' + file), type: 'image'};
        //console.log(file);
        obj.array.push(a);
    }
};
function savefile(arr) {

    fs.writeFile('data.js',  JSON.stringify(arr), function (e) {
        if (e)console.error(e);
    });
}
function read(path) {
    var obj = {};
    obj.array = [];
    var cb = function () {
        //console.log(content.length);
        savefile(obj.array);
    };
    readDir(path, obj, cb);
}
read(path);