/**
 * Created by kintesh on 28/01/15.
 */
;(function(){
    var translator = require("./translator");

    function slides(source) {
        return translator(source);
    }

    module.exports = slides;

})();