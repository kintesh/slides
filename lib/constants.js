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
    exports.regex_comments = /(\/\*([^*]|[\r\n]|(\*+([^\*/]|[\r\n])))*\*+\/)/g;
    exports.regex_lines = /\r\n|\r|\n/m;
    exports.regex_properties = /([\w]+):\s*(.*)\s*/m;
    exports.regex_frame = /={4}[^=]((?:[^=\\]|\\.|={0,3}[^=])*)={4}/g;
    exports.regex_maths = /(\$(?!\$)((?:[^$\\]|\\.)*)\$(?!\$))|(\$\$((?:[^\$\\]|\\.)*)\$\$)/g;
    exports.regex_frameProperties = /^\[\[([\w\d #;:,-]+)]]/m;
    exports.regex_controlElemBlock = /\[\[([\w\d #;:,-]+)]]/g;
    exports.regex_controlElemProp = /\s*([\w-]+)\s*:\s*([\w\d#]+)\s*/g;
    exports.regex_controlElemClass = /class=&quot;controlElem&quot;/g;
    exports.regex_alignCenter = /(?:-&gt;)([\S\s]*)(?:&lt;-)/m;


    /**
     * HTML Templates.
     */
    exports.temp_html = function(head, body) {
        return "<!DOCTYPE html>\n<html>\n<head>\n"+head+"</head>\n\n<body>\n"+body+"</body>\n</html>";
    };
    exports.temp_offline = function(properties) {
        return this.temp_meta(properties) +
            "<link rel=\"stylesheet\" href=\"./slides_assets/css/fonts.css\">\n" +
            "<link rel=\"stylesheet\" href=\"./slides_assets/css/slides.css\">\n" +
            "<link rel=\"stylesheet\" href=\"./slides_assets/css/slides-print.css\" media=\"print\"/>\n" +
            "<link rel=\"stylesheet\" href=\"./slides_assets/css/style.css\"/>\n" +
            "<link rel=\"stylesheet\" href=\"./slides_assets/css/animations.css\"/>\n" +
            "<link rel=\"stylesheet\" href=\"./slides_assets/css/font-awesome.css\">\n" +
            "<script src=\"./slides_assets/js/jquery.js\"></script>\n" +
            "<script src=\"./slides_assets/js/slides.js\"></script>\n" +
            "<script src=\"./slides_assets/js/MathJax/MathJax.js?config=TeX-AMS-MML_HTMLorMML\"></script>\n";
    };
    exports.temp_online = function(properties) {
        return this.temp_meta(properties) +
            "<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Open+Sans:400,400italic,700|Source+Code+Pro\">\n" +
            "<link rel=\"stylesheet\" href=\"https://slides.kinte.sh/slides_assets/css/slides.css\">\n" +
            "<link rel=\"stylesheet\" href=\"https://slides.kinte.sh/slides_assets/css/slides-print.css\" media=\"print\"/>\n" +
            "<link rel=\"stylesheet\" href=\"https://slides.kinte.sh/slides_assets/css/style.css\"/>\n" +
            "<link rel=\"stylesheet\" href=\"https://slides.kinte.sh/slides_assets/css/animations.css\"/>\n" +
            "<link rel=\"stylesheet\" href=\"https://maxcdn.bootstrapcdn.com/font-awesome/4.3.0/css/font-awesome.min.css\">\n" +
            "<script src=\"https://code.jquery.com/jquery-2.1.3.min.js\"></script>\n" +
            "<script src=\"https://slides.kinte.sh/slides_assets/js/slides.js\"></script>\n" +
            "<script src=\"https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML\"></script>\n";
    };
    exports.temp_meta = function(properties) {
        return (properties["title"] != undefined ? "<title>" + properties["title"] + "</title>\n" : "<title>Slides</title>\n") +
            ("<meta charset=\"UTF-8\">\n") +
            (properties["sub_title"] != undefined ? "<meta name=\"description\" content=\""+properties["sub_title"]+"\">\n" : "") +
            (properties["author"] != undefined ? "<meta name=\"author\" content=\""+properties["author"]+"\">\n" : "");
    };
    exports.temp_controlElem = function(props) {
        return "<div class=\"controlElem\" style=\"display: none;\">"+props+"</div>";
    };
    exports.temp_slide = function(content, frameProps) {
        if(frameProps != undefined) {
            return "<div class=\"slide\" style=\""+frameProps+"\">\n"+content+"\n</div>\n";
        } else {
            return "<div class=\"slide\">\n" + content + "\n</div>\n";
        }
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
    exports.temp_inlineMath = function(math) {
        return "<span class=\"inlineMath\">\\("+math+"\\)</span>";
    };
    exports.temp_blockMath = function(math) {
        return "<p class=\"blockMath\">\\("+math+"\\)</p>";
    };
    exports.tmp_alignMiddle = function(content) {
        return "<div class=\"align_middle\"><divc class=\"middle_container\">\n" + content + "\n</div></div>\n";
    };



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