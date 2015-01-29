/**
 * Created by kintesh on 28/01/15.
 */
;(function(){


    exports.frame_separator = "====";


    /**
     * Regular expressions.
     */
    exports.regex_comments = /(\/\*([^*]|[\r\n]|(\*+([^\*/]|[\r\n])))*\*+\/)|((\/\/[^\n]*))/g;
    exports.regex_lines = /\r\n|\r|\n/m;
    exports.regex_properties = /([\w]+):\s*(.*)\s*/m;
    exports.regex_frame = /={4}[^=]((?:[^=\\]|\\.|={0,3}[^=])*)={4}/g;




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