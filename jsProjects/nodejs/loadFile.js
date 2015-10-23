//need q ,requirejs

var fs = require("fs"),
    Q = require('q'),
    readdir = Q.denodeify(fs.readdir),
    //readFile = Q.denodeify(fs.readFile),
    writeFile = fs.writeFile,// Q.denodeify(fs.writeFile),
    lstatSync = fs.lstatSync,//Q.denodeify(fs.lstatSync);
    requirejs = require('requirejs'),
    basePath = "..";

requirejs.config({
    nodeRequire: require,//把node自身的require方法传递给requirejs
    baseUrl: "../lib",
    paths: {
        "jquery": "jquery",
        'webApi': "../webApi",
        'util':'../util',
    }
});
requirejs(["webApi/pageModel"], function (pageModel) {
    var Page = pageModel.Page, Node = pageModel.Node;
    var root = new Node("导航");
    var paths = ['canvas', 'css3', 'cssStudy', 'dojo', 'pageStackView', 'threeJS'];
    var promises = [];
    var readNode = function (path, parent) {
        //console.log("read: " + path);
        var pms = [], deferred = Q.defer();
        readdir(path).then(function (names) {

            names.forEach(function (name) {
                var filePath = path + '/' + name,
                    file = fs.lstatSync(filePath);
                //console.log(filePath);
                var node;
                if (file.isDirectory()) {
                    var node = new Node(name);
                    parent.add(node);
                    pms.push(readNode(filePath, node));
                } else {
                    var reg = /.*((.html)|(.htm))$/i;
                    if (reg.test(name)) {
                        var page = new Page(filePath, name);
                        parent.add(page);
                    }
                }
            });
            if (pms.length) {
                Q.all(pms).then(function () {
                    deferred.resolve(true);
                },function (e) { console.error(e) });
            } else {
                deferred.resolve(true);
            }

        },function (e) { console.error(e); deferred.reject(e); });
        //console.log("deferred.promise : " + deferred.promise);
        return deferred.promise;
    }
    paths.forEach(function (path) {
        path = basePath + '/' + path;
        var node = new Node(path);
        root.add(node);
        promises.push(readNode(path, node));
    });
    Q.all(promises).done(function (all) {
        var json = "[" + JSON.stringify(root.clean().toJson()) + "]";
        console.log('aaa');
        writeFile(basePath + "/webApi/data.js", json);
    });
    //check();
});

