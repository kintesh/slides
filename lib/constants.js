/**
 * Created by kintesh on 28/01/15.
 */
;(function(){


    exports.frame_separator = "====";


    /**
     * Regular expressions.
     */
    exports.regexp_comments = /(\/\*([^*]|[\r\n]|(\*+([^\*/]|[\r\n])))*\*+\/)|((\/\/[^\n]*))/g;




    /**
     * Make all properties constant
     */
    ;(function() {
        var props = Object.getOwnPropertyNames(exports);
        for(var i = 0; i < props.length; i++) {
            var descriptor = Object.getOwnPropertyDescriptor(exports, props[i]);
            descriptor.writable = false;
            descriptor.configurable = false;
            Object.defineProperty(exports, props[i], descriptor);
        }
    })();

})();