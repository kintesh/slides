/**
 * Created by kintesh on 28/01/15.
 */
;(function(){

    var regex = require("./regexp");

    /**
     * Removes comments from the input.
     *
     * @param {string} source text
     * @returns {string} source text without comments
     */
    exports.removeComments = function(source) {
        return source.replace(regex.comments, "");
    };

})();