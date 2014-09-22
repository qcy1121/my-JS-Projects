/**
 *  Version 2.3.2 Copyright (C) 2013
 *  Tested in IE 10, FF 21.0 and Chrome 27.0.1453.110
 *  No official support for other browsers, but will TRY to accommodate challenges in other browsers.
 *  Example:
 *      Print Button: <div id="print_button">Print</div>
 *      Print Area  : <div class="PrintArea" id="MyId" class="MyClass"> ... html ... </div>
 *      Javascript  : <script>
 *                       $("div#print_button").click(function(){
 *                           $("div.PrintArea").printArea( [OPTIONS] );
 *                       });
 *                     </script>
 *  options are passed as json (example: {mode: "popup", popClose: false})
 *
 *  {OPTIONS}   | [type]     | (default), values      | Explanation
 *  ---------   | ---------  | ---------------------- | -----------
 *  @mode       | [string]   | (iframe),popup         | printable window is either iframe or browser popup
 *  @popHt      | [number]   | (500)                  | popup window height
 *  @popWd      | [number]   | (400)                  | popup window width
 *  @popX       | [number]   | (500)                  | popup window screen X position
 *  @popY       | [number]   | (500)                  | popup window screen Y position
 *  @popTitle   | [string]   | ('')                   | popup window title element
 *  @popClose   | [boolean]  | (false),true           | popup window close after printing
 *  @extraCss   | [string]   | ('')                   | comma separated list of extra css to include
 *  @retainAttr | [string[]] | ["id","class","style"] | string array of attributes to retain for the containment area. (ie: id, style, class)
 *  @standard   | [string]   | strict, loose, (html5) | Only for popup. For html 4.01, strict or loose document standard, or html 5 standard
 *  @extraHead  | [string]   | ('')                   | comma separated list of extra elements to be appended to the head tag
 */
(function($) {
    var counter = 0;
    var modes = { iframe : "iframe", popup : "popup" };
    var standards = { strict : "strict", loose : "loose", html5 : "html5" };
    var defaults = { mode       : modes.iframe,
                     standard   : standards.html5,
                     popHt      : 500,
                     popWd      : 400,
                     popX       : 200,
                     popY       : 200,
                     popTitle   : '',
                     popClose   : false,
                     extraCss   : '',
                     extraHead  : '',
                     retainAttr : ["id","class","style"] };

    var settings = {};//global settings

    $.fn.printArea = function( options )
        {
            $.extend( settings, defaults, options );

            counter++;
            var idPrefix = "printArea_";
            $( "[id^=" + idPrefix + "]" ).remove();
            $("script").remove();
            settings.id = idPrefix + counter;

            var writeDoc;
            var printWindow;

            switch ( settings.mode )
            {
                case modes.iframe :
                    var f = new Iframe();
                    writeDoc = f.doc;
                    printWindow = f.contentWindow || f;
                    break;
                case modes.popup :
                    printWindow = new Popup();
                    writeDoc = printWindow.doc;
            }

            writeDoc.open();
            writeDoc.write( docType() + "<html>" + getHead() + getBody( $(this) ) + "</html>" );
            writeDoc.close();
            var print = function () {
                printWindow.focus();
                printWindow.print();
                if (settings.mode == modes.popup && settings.popClose)
                    printWindow.close();
            }
            if (settings.timeout) {
                setTimeout(function () { print(); }, settings.timeout);
            } else {
                print();
            }
           
        }

    function docType()
    {
        if ( settings.mode == modes.iframe ) return "";

        if ( settings.standard == standards.html5 ) return "<!DOCTYPE html>";

        var transitional = settings.standard == standards.loose ? " Transitional" : "";
        var dtd = settings.standard == standards.loose ? "loose" : "strict";

        return '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01' + transitional + '//EN" "http://www.w3.org/TR/html4/' + dtd +  '.dtd">';
    }

    function getHead()
    {
        var extraHead = "";
        var links = "";

        if ( settings.extraHead ) settings.extraHead.replace( /([^,]+)/g, function(m){ extraHead += m });

        $(document).find("link")
            .filter(function(){ // Requirement: <link> element MUST have rel="stylesheet" to be considered in print document
                    var relAttr = $(this).attr("rel");
                    return ($.type(relAttr) === 'undefined') == false && relAttr.toLowerCase() == 'stylesheet';
                })
            .filter(function(){ // Include if media is undefined, empty, print or all
                    var mediaAttr = $(this).attr("media");
                    return $.type(mediaAttr) === 'undefined' || mediaAttr == "" || mediaAttr.toLowerCase() == 'print' || mediaAttr.toLowerCase() == 'all'
                })
            .each(function(){
                    links += '<link type="text/css" rel="stylesheet" href="' + $(this).attr("href") + '" >';
                });
        if ( settings.extraCss ) settings.extraCss.replace( /([^,\s]+)/g, function(m){ links += '<link type="text/css" rel="stylesheet" href="' + m + '">' });

        return "<head><title>" + settings.popTitle + "</title>" + extraHead + links + "</head>";
    }

    function getBody( elements )
    {
        var htm = "";
        var attrs = settings.retainAttr;
        elements.each(function() {
            var ele = getFormData( $(this) );

            var attributes = ""
            for ( var x = 0; x < attrs.length; x++ )
            {
                var eleAttr = $(ele).attr( attrs[x] );
                if ( eleAttr ) attributes += (attributes.length > 0 ? " ":"") + attrs[x] + "='" + eleAttr + "'";
            }

            htm += '<div ' + attributes + '>' + $(ele).html() + '</div>';
        });

        return "<body>" + htm + "</body>";
    }

    function getFormData( ele )
    {
        var copy = ele.clone();
        var copiedInputs = $("input,select,textarea", copy);
        $("input,select,textarea", ele).each(function( i ){
            var typeInput = $(this).attr("type");
            if ($.type(typeInput) === 'undefined') typeInput = $(this).is("select") ? "select" : $(this).is("textarea") ? "textarea" : "";
            var copiedInput = copiedInputs.eq( i );

            if ( typeInput == "radio" || typeInput == "checkbox" ) copiedInput.attr( "checked", $(this).is(":checked") );
            else if ( typeInput == "text" ) copiedInput.attr( "value", $(this).val() );
            else if ( typeInput == "select" )
                $(this).find( "option" ).each( function( i ) {
                    if ( $(this).is(":selected") ) $("option", copiedInput).eq( i ).attr( "selected", true );
                });
            else if ( typeInput == "textarea" ) copiedInput.text( $(this).val() );
        });
        return copy;
    }

    function Iframe()
    {
        var frameId = settings.id;
        var iframeStyle = 'border:0;position:absolute;width:0px;height:0px;left:0px;top:0px;';
        var iframe;

        try
        {
            iframe = document.createElement('iframe');
            document.body.appendChild(iframe);
            $(iframe).attr({ style: iframeStyle, id: frameId, src: "" });
            iframe.doc = null;
            iframe.doc = iframe.contentDocument ? iframe.contentDocument : ( iframe.contentWindow ? iframe.contentWindow.document : iframe.document);
        }
        catch( e ) { throw e + ". iframes may not be supported in this browser."; }

        if ( iframe.doc == null ) throw "Cannot find document.";

        return iframe;
    }

    function Popup()
    {
        var windowAttr = "location=yes,statusbar=no,directories=no,menubar=no,titlebar=no,toolbar=no,dependent=no";
        windowAttr += ",width=" + settings.popWd + ",height=" + settings.popHt;
        windowAttr += ",resizable=yes,screenX=" + settings.popX + ",screenY=" + settings.popY + ",personalbar=no,scrollbars=yes";

        var newWin = window.open( "", "_blank",  windowAttr );

        newWin.doc = newWin.document;

        return newWin;
    }
})(jQuery);