var print = function () {
    // var p = <any>$("#appContainer");
    //p.printArea({});
    //var id = this.activeScreen.
    //   var Iframe = function Iframe() {
    //        var frameId = "settings.id";
    //        var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;left:0px;top:0px;';
    //        var iframe;
    //
    //        try {
    //            iframe = document.createElement('iframe');
    //            document.body.appendChild(iframe);
    //            $(iframe).attr({ style: iframeStyle, id: frameId, src: "" });
    //            iframe.doc = null;
    //            iframe.doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
    //        }
    //        catch (e) { throw e + ". iframes may not be supported in this browser."; }
    //
    //        if (iframe.doc == null) throw "Cannot find document.";
    //
    //        return iframe;
    //    }
    //
    //    html2canvas(document.body, {
    //        //timeout:10,
    //        logging:true,
    //        allowTaint: true, // whether to allow images to taint the canvas, won't need proxy if set to true
    //
    //        // parse options
    //        svgRendering: true,
    //        onrendered: function (canvas) {
    //            /* canvas is the actual canvas element,
    //               to append it to the page call for example
    //               document.body.appendChild( canvas );
    //            */
    //            var f = new Iframe();
    //            var writeDoc = f.doc;
    //            var printWindow = f.contentWindow || f;
    //            var img = canvas.toDataURL("image/png");
    //            writeDoc.write("<img src='" + img + "' />");
    //            printWindow.print();
    //        }
    //    });
    var createWin = function (usepopup, url) {
        if(!usepopup) {
            var Iframe = function Iframe() {
                var frameId = "settings.id";
                var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;left:0px;top:0px;';
                var iframe;
                try  {
                    iframe = document.createElement('iframe');
                    document.body.appendChild(iframe);
                    $(iframe).attr({
                        style: iframeStyle,
                        id: frameId,
                        src: ""
                    });
                    iframe.doc = null;
                    iframe.doc = iframe.contentDocument ? iframe.contentDocument : (iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
                } catch (e) {
                    throw e + ". iframes may not be supported in this browser.";
                }
                if(iframe.doc == null) {
                    throw "Cannot find document.";
                }
                iframe.document = iframe.doc;
                return iframe;
            };
            return new Iframe();
        } else {
            var windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
            windowAttr += ",width='90%',height='90%'";
            windowAttr += ",resizable=yes,personalbar=no,scrollbars=yes";
            url = url ? url : "";
            var newWin = window.open(url, "_blank", windowAttr);
            //newWin.document.write("<img src='" + url + "' />");
            //document.domain = document.domain;
            //newWin["doc"] = newWin.document;
            return newWin;
        }
    };
    var $p = $(this.activeScreen.parentElement);
    // var page = $p.children()[0];
    // p = <any>$("body");
    // p.printArea({timeout:100});
    //if (dojo.has("ie") ){
    if(false) {
        window.print();
    } else {
        var svgArr = [], canvasArr = [], deferArr = [];
        var openImg = function (url) {
            //var f = createWin(false, url);
            // f.document.write("<img src='" + url + "' />");
            var newwin = createWin(true);
            newwin.document.write("<img src='" + url + "'/>");
            newwin.document.close();
            pageBack();
        };
        var printCanvas = function (page) {
            var url = page.tagName == "CANVAS" ? page.toDataURL("image/svg+xml") : page;
            openImg(url);
            // newwin.document.body.appendChild(canvas);
            //var writeDoc = f.doc;
            //var printWindow = f.contentWindow || f;
            ////var canvas = writeDoc.createElement("canvas");
            //printWindow.onload = function () {
            //    writeDoc.appendChild(canvas);
            //    // canvg(canvas, ele);
            //    // writeDoc.body.appendChild(canvas);
            //    printWindow.print();
            //}
        };
        // printCanvas(document.getElementById("appContainer"));
        var page2canvas = function (page, callback) {
            if(page.tagName == "CANVAS") {
                callback(page);
            }
            html2canvas(page, {
                allowTaint: // timeout: 1,
                // logging:true,
                true,
                svgRendering: // whether to allow images to taint the canvas, won't need proxy if set to true
                // parse options
                true,
                onrendered: function (canvas) {
                    callback(canvas);
                }
            });
        };
        var page2svg = function () {
        };
        var pageBack = function () {
            for(var idx in deferArr) {
                var obj = deferArr[idx];
                if(obj.display !== "none") {
                    obj.dom.next().remove();
                    obj.dom.css("display", obj.display);
                }
            }
        };
        var serializer = new XMLSerializer(), setXmlns = function (svg) {
            var xmlns = "http://www.w3.org/2000/svg", xlink = "http://www.w3.org/1999/xlink";
            if(svg.namespaceURI != xmlns) {
                svg.removeAttribute("xmlns");
                svg.setAttribute("xmlns", xmlns);
            }
            if(svg.getAttributeNS(xmlns, "xlink") != xlink) {
                if(!dojo.has("ie")) {
                    svg.setAttribute("xmlns", xmlns);
                    svg.setAttribute("xmlns:xlink", xlink);
                } else {
                    svg.removeAttributeNS(xmlns, "xlink");
                    svg.setAttributeNS(xmlns, "xlink", xlink);
                }
            }
            return svg;
        }, parseSVG = function ($svgdom) {
            var $newsvg = $svgdom.clone(), svg;
            svg = $newsvg[0];
            svg = setXmlns(svg);
            $newsvg.find("svg").each(function () {
                setXmlns($(this)[0]);
                //svg.setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
                //svg.setAttributeNS(xmlns, "http://www.w3.org/2000/svg");
                //svg.setAttributeNS(xmlns, "xmlns", xmlns);
                //svg.setAttributeNS(xmlns, "xmlns:xlink", "http://www.w3.org/1999/xlink");
                //svg.setAttribute(xmlns,"xml:space", "preserve");
            });
            // svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
            // svg.setAttributeNS(xmlns, "xmlns", xmlns);
            // svg.setAttributeNS(xmlns, "xmlns:xlink", "http://www.w3.org/1999/xlink");
            //svg.setAttribute("xml:space", "preserve");
            // svg = $newsvg[0];
            var str = serializer.serializeToString(svg);
            console.log(str);
            $newsvg.remove();
            return str;
        };
        var parseSVG2Canvas = function ($p) {
            var $svg = $p.find("svg").filter(function (idx) {
                return $(this).css("display") !== "none" && $(this).parents("svg").length == 0;
            });
            if($svg.length) {
                $svg.each(function (index) {
                    var _$this = $(this), obj;
                    if(_$this.css("display") == "none") {
                        obj = {
                            dom: _$this,
                            display: _$this.css("display")
                        };
                        console.log(_$this);
                    } else {
                        var canvas = document.createElement("canvas");
                        /*
                        // var svg = document.getElementById('svg_root'); // or whatever you call it
                        //var serializer = new XMLSerializer();
                        ////var svg = $(this).clone();
                        ////svg.attr("xmlns", "http://www.w3.org/2000/svg").attr("xmlns: xlink", "http://www.w3.org/1999/xlink");
                        //var str = serializer.serializeToString($(this)[0]);
                        "<svg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' ");
                        */
                        var str = parseSVG(_$this);
                        //console.log(str);
                        _$this.after(canvas);
                        canvg(canvas, str, {
                            renderCallback: function (canvas) {
                                svgArr[index] = canvas;
                                obj = {
                                    dom: _$this,
                                    display: _$this.css("display"),
                                    canvas: canvas
                                };
                                _$this.css("display", "none");
                            }
                        });
                        deferArr.push(obj);
                    }
                    return $(this);
                });
            }
        };
        var page, screen = this.activeScreen;
        try  {
            if(screen instanceof FlowsheetScreen) {
                if(false) {
                    //dojo.has("ie") ){
                    page = $p.children().children()[0];
                    printCanvas(page);
                } else {
                    screen = screen;
                    page = screen.getImage();// get the canvas element paresed in this screen
                    openImg(page);
                }
            } else {
                parseSVG2Canvas($p);
                if(screen instanceof EquipmentScreen) {
                    page = $p.children()[1];// canvas element parsed
                } else if(screen instanceof DashboardScreen) {
                    page = $p.children()[0];// canvas element parsed
                }
                page2canvas(page, printCanvas);
            }
        } catch (e) {
            console.log(e);
        }
    }
};
var print2 = function () {
    var oldzoom = $("body").css("zoom"), newzoom = 0.5;
    $("body").css("zoom", newzoom);
    window.print();
    $("body").css("zoom", oldzoom ? oldzoom : 1);
};
var print3 = function () {
    var p = $("#appContainer");
    var jsPDF = {
    };
    var pdf = new jsPDF.jsPDF('p', 'in', 'letter'), source = // source can be HTML-formatted string, or a reference
    // to an actual DOM element from which the text will be scraped.
    '<div>' + p.html() + '<div>', specialElementHandlers = // we support special element handlers. Register them with jQuery-style
    // ID selector for either ID or node name. ("#iAmID", "div", "span" etc.)
    // There is no support for any other type of selectors
    // (class, of compound) at this time.
    {
        '#bypassme': // element with id of "bypass" - jQuery style selector
        function (element, renderer) {
            // true = "handled elsewhere, bypass text extraction"
            return true;
        }
    };
    // all coords and widths are in jsPDF instance's declared units
    // 'inches' in this case
    pdf.fromHTML(source, // HTML string or DOM elem ref.
    0.5, // x coord
    0.5, // y coord
    {
        'width': 7.5,
        'elementHandlers': // max width of content on PDF
        specialElementHandlers
    });
    pdf.save('Test.pdf');
};