/**
 * Created by kintesh on 28/01/15.
 */
;(function(){


    /**
     * Basic constants
     * @type {string}
     */
    exports.frame_separator = "====";
    exports.math_type_inline = 0;
    exports.math_type_block = 1;
    exports.math_marker = function(number) {
        return "%{MATH"+number+"}";
    };
    exports.math_replace = "%{MATH}";


    /**
     * Regular expressions.
     */
    exports.regex_comments = /(\/\*([^*]|[\r\n]|(\*+([^\*/]|[\r\n])))*\*+\/)|((\/\/[^\n]*))/g;
    exports.regex_lines = /\r\n|\r|\n/m;
    exports.regex_properties = /([\w]+):\s*(.*)\s*/m;
    exports.regex_frame = /={4}[^=]((?:[^=\\]|\\.|={0,3}[^=])*)={4}/g;
    exports.regex_maths = /(\$(?!\$)((?:[^$\\]|\\.)*)\$(?!\$))|(\$\$((?:[^\$\\]|\\.)*)\$\$)/g;
    exports.regex_frameProperties = /^\[\[([\w ;:,-]+)]]/m;
    exports.regex_controlElemBlock = /\[\[([\w ;:,-]+)]]/g;
    exports.regex_controlElemProp = /\s*([\w]+)\s*:\s*([\w]+)\s*/g;
    exports.regex_controlElemClass = /class=&quot;controlElem&quot;/g;
    exports.regex_alignCenter = /(?:-&gt;)([\S ]*)(?:&lt;-)/m;


    /**
     * HTML Templates.
     */
    exports.temp_html = function(head, body) {
        return "<!DOCTYPE html>\n<html>\n<head>\n"+head+"</head>\n\n<body>\n"+body+"</body>\n</html>";
    };
    exports.temp_controlElem = function(props) {
        return "<div class=\"controlElem\" style=\"display: none;\">"+props+"</div>";
    };
    exports.temp_slide = function(content, frameProps) {
        if(frameProps != undefined) {
            return "<div class=\"slide\" style=\""+frameProps+"\">\n"+content+"\n</div>\n";
        } else
            return "<div class=\"slide\">\n"+content+"\n</div>\n";
    };
    exports.temp_title = function(title) {
        return "<div class=\"title_title\"><h1>"+title+"</h1></div>";
    };
    exports.temp_subTitle = function(subTitle) {
        return "<div class=\"title_subTitle\"><h3>"+subTitle+"</h3></div>";
    };
    exports.temp_author = function(author) {
        return "<div class=\"title_author\">"+author+"</div>";
    };
    exports.temp_date = function(date) {
        return "<div class=\"title_date\">"+date+"</div>";
    };
    exports.temp_inlineMath = "<span class=\"inlineMath\">%{MATH}</span>";
    exports.temp_blockMath = "<div class=\"blockMath\">%{MATH}</div><br/>";



    /**
     * Make all properties constant
     */
    (function() {
        Object.getOwnPropertyNames(exports).map(function(name) {
            var descriptor = Object.getOwnPropertyDescriptor(exports, name);
            descriptor.writable = false;
            descriptor.configurable = false;
            Object.defineProperty(exports, name, descriptor);
        });
    }).call();

})();