/**
 * Created by kintesh on 28/01/15.
 */
;(function(){

    var constants = require("./constants");

    /**
     * Removes comments from the input.
     *
     * @param {string} source text
     * @returns {string} source text without comments
     */
    exports.removeComments = function(source) {
        return source.replace(constants.regex_comments, "");
    };

    /**
     * Reads slides properties and meta tags from source.
     *
     * @param {string} source text
     * @returns {{}} object with properties
     */
    exports.readProperties= function(source) {
        var properties = {},
            sLines = source.split(constants.regex_lines);

        for(var i=0; i<sLines.length; i++) {
            var cLine = sLines[i],
                match = constants.regex_properties.exec(cLine);
            if(cLine == constants.frame_separator)
                break;
            if(match != null)
                properties[match[1]] = match[2];
        }

        return properties;
    }

})();