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
    exports.readProperties = function(source) {
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
    };

    /**
     * Extracts frames from the source.
     *
     * @param {string} source text
     * @returns {Array} list of frames
     */
    exports.extractFrames = function(source) {
        var frames = [],
            match = constants.regex_frame.exec(source);
        while(match != null) {
            frames.push(match[1]);
            match = constants.regex_frame.exec(source);
        }
        return frames;
    };

    /**
     * Extracts and marks math equations.
     *
     * @param {string} frame source text
     * @returns {{frame: frame, maths: Array}} frame with marked math equations, list of extracted math equations
     */
    exports.extractMaths = function(frame) {
        var maths = [],
            mathsCount = 0,
            match = constants.regex_maths.exec(frame);
        while(match != null) {
            if(match[1] != undefined) {
                maths.push({
                    type: constants.math_type_inline,
                    value: match[2]
                });
                frame = frame.replace(match[1], constants.math_marker(mathsCount));
            } else if(match[3] != undefined) {
                maths.push({
                    type: constants.math_type_block,
                    value: match[4]
                });
                frame = frame.replace(match[3], constants.math_marker(mathsCount));
            }
            match = constants.regex_maths.exec(frame);
            mathsCount++;
        }
        return {
            frame: frame,
            maths:maths
        }
    };

    /**
     * Restores extracted math equations to marked frame.
     *
     * @param {string} frame source text with extracted and marked math equations
     * @param {Array} maths extracted math equations
     * @param {string} replaceInline string to surround inline math with
     * @param {string} replaceBlock string to surround block math with
     * @returns {string} frame with restored math equations surrounded by either inline or block string (tags)
     */
    exports.restoreMaths = function(frame, maths, replaceInline, replaceBlock) {
        for(var i=0; i<maths.length; i++) {
            if(maths[i].type == constants.math_type_inline) {
                frame = frame.replace(constants.math_marker(i),
                    replaceInline.replace(constants.math_replace, maths[i].value))
            } else if(maths[i].type == constants.math_type_block) {
                frame = frame.replace(constants.math_marker(i),
                    replaceBlock.replace(constants.math_replace, maths[i].value))
            }
        }
        return frame;
    };

    /**
     * Replaces element control tags with div tags.
     *
     * @param frame source text
     * @returns {string} frame with control tags replaced with div
     */
    exports.replaceControlTags = function(frame) {
        var match = constants.regex_controlElemBlock.exec(frame);
        while(match != null) {
            var p = constants.regex_controlElemProp.exec(match[1]),
                c = "{";
            while(p != null) {
                c += p[1] + ":\"" + p[2] + "\"";
                p = constants.regex_controlElemProp.exec(match[1]);
                if(p != null) c+= ",";
            }
            c += "}";
            frame = frame.replace(match[0], constants.temp_controlElem(c));
            match = constants.regex_controlElemBlock.exec(frame);
        }
        return frame;
    };

    /**
     * Makes title slide.
     *
     * @param properties
     * @returns {string} title slide
     */
    exports.makeTitleSlide = function(properties) {
        var slide = "";
        if(properties["title"] != undefined)
            slide += constants.temp_title(properties["title"]);
        if(properties["sub_title"] != undefined)
            slide += constants.temp_subTitle(properties["sub_title"]);
        if(properties["author"] != undefined)
            slide += constants.temp_author(properties["author"]);
        if(properties["date"] != undefined)
            slide += constants.temp_date(properties["date"]);
        return constants.temp_slide(slide);
    };


})();