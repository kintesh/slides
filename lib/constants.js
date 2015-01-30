/**
 * Created by kintesh on 28/01/15.
 */
;(function(){


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