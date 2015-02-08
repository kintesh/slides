/**
 * Created by kintesh on 28/01/15.
 */
;(function(){
    var translator = require("./translator");

    exports.translate = function(source) {
        return translator.translate(source);
    }

})();