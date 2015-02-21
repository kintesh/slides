/**
 * Created by kintesh on 28/01/15.
 */
;(function(){
    var constants = require("./constants"),
        translator = require("./translator"),
        async = require("async");

    function slides(source, callback) {
        async.waterfall([
            function(callback) {
                translator(source, callback)
            }
        ], function(err, res) {
            if(err == null) {
                res.html = constants.temp_html(makeHTMLHead(res.properties),res.html);
            }
            callback(err, res);
        });
    }

    function makeHTMLHead(properties) {
        return (properties["title"] != undefined ? "<title>" + properties["title"] + "</title>\n" : "<title>Slides</title>\n") +
            ("<meta charset=\"UTF-8\">\n") +
            (properties["sub_title"] != undefined ? "<meta name=\"description\" content=\""+properties["sub_title"]+"\">\n" : "") +
            (properties["author"] != undefined ? "<meta name=\"author\" content=\""+properties["author"]+"\">\n" : "") +
            "<link rel=\"stylesheet\" href=\"./slides_assets/css/slides.css\">\n" +
            "<link rel=\"stylesheet\" href=\"./slides_assets/css/slides-print.css\" media=\"print\" />" +
            "<link rel=\"stylesheet\" href=\"./slides_assets/css/katex.css\">\n" +
            "<link rel=\"stylesheet\" href=\"./slides_assets/css/font-awesome.css\">\n" +
            "<script src=\"./slides_assets/js/jquery.js\"></script>\n" +
            "<script src=\"./slides_assets/js/slides.js\"></script>";
    }

    module.exports = slides;

})();