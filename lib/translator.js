/**
 * Created by kintesh on 28/01/15.
 */
;(function(){

    var constants = require("./constants"),
        marked = require('marked');

    /**
     * Removes comments from the input.
     *
     * @param {string} source text
     * @returns {string} source text without comments
     */
    function removeComments(source) {
        return source.replace(constants.regex_comments, "");
    }

    /**
     * Reads slides properties and meta tags from source.
     *
     * @param {string} source text
     * @returns {{}} object with properties
     */
    function readProperties(source) {
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

    /**
     * Extracts frames from the source.
     *
     * @param {string} source text
     * @returns {Array} list of frames
     */
    function extractFrames(source) {
        var frames = [],
            match = constants.regex_frame.exec(source);
        while(match != null) {
            frames.push(match[1]);
            match = constants.regex_frame.exec(source);
        }
        return frames;
    }

    /**
     * Extracts and marks math equations.
     *
     * @param {string} frame source text
     * @returns {{frame: string, maths: Array}} frame with marked math equations, list of extracted math equations
     */
    function extractMaths(frame) {
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
            frame:frame,
            maths:maths
        }
    }

    /**
     * Restores extracted math equations to marked frame.
     *
     * @param {string} frame source text with extracted and marked math equations
     * @param {Array} maths extracted math equations
     * @param {string} replaceInline string to surround inline math with
     * @param {string} replaceBlock string to surround block math with
     * @returns {string} frame with restored math equations surrounded by either inline or block string (tags)
     */
    function restoreMaths(frame, maths, replaceInline, replaceBlock) {
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
    }

    /**
     * Replaces element control tags with div tags.
     *
     * @param frame source text
     * @returns {string} frame with control tags replaced with div
     */
    function replaceControlTags(frame) {
        var match = constants.regex_controlElemBlock.exec(frame);
        while(match != null) {
            var p = constants.regex_controlElemProp.exec(match[1]),
                c = "{";
            while(p != null) {
                c +="\"" + p[1] + "\":\"" + p[2] + "\"";
                p = constants.regex_controlElemProp.exec(match[1]);
                if(p != null) c+= ",";
            }
            c += "}";
            frame = frame.replace(match[0], constants.temp_controlElem(c));
            match = constants.regex_controlElemBlock.exec(frame);
        }
        return frame;
    }

    /**
     * Makes title slide.
     *
     * @param properties
     * @returns {string} title slide
     */
    function makeTitleSlide(properties) {
        var slide = "";
        if(properties["title"] != undefined)
            slide += constants.temp_title(properties["title"]);
        if(properties["sub_title"] != undefined)
            slide += constants.temp_subTitle(properties["sub_title"]);
        if(properties["author"] != undefined)
            slide += constants.temp_author(properties["author"]);
        if(properties["date"] != undefined)
            slide += constants.temp_date(properties["date"]);
        return slide != "" ? constants.temp_slide(slide) : undefined;
    }

    /**
     * Removes properties from frame (if any) and return frame (with removed properties) and properties.
     *
     * @param {string} frame source text
     * @returns {{frame: string, properties: Array|undefined}} frame without properties and properties
     */
    function readFrameProperties(frame) {
        var match = constants.regex_frameProperties.exec(frame.split(constants.regex_lines)[0]);
        if(match != null)
            return {
                frame: frame.replace(match[0]+"\n", ""),
                properties: match[1]
            };
        else
            return {
                frame: frame,
                properties: undefined
            };
    }

    /**
     * Render markdown on input frame. Preserves slide control tags.
     *
     * @param {string} frame source text
     * @returns {string} HTML of inout frame
     */
    function renderMarkdown(frame) {
        marked.setOptions({
            renderer: new marked.Renderer(),
            gfm: true,
            tables: true,
            breaks: false,
            pedantic: false,
            sanitize: true,
            smartLists: true,
            smartypants: false
        });

        var renderer = new marked.Renderer();
        renderer.paragraph = function(text) {
            //return '<p>' + text + '</p>\n';
            if(text.match(constants.regex_controlElemClass) != null) {
                return text
                    .replace(/&amp;/g, "&")
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">")
                    .replace(/&quot;/g, "\"")
                    .replace(/&#39;/g, "'") + "\n";
            } else
                return '<p>' + text + '</p>\n';
        };
        
        renderer.heading = function(text, level) {
            var match = constants.regex_alignCenter.exec(text);
            if(match != null) {
                return "<h"+ level + " id=\"" + match[1].trim().toLowerCase().replace(/[^\w]+/g, '-') + "\" " +
                    "style=\"text-align: center;\">" + match[1].trim() + "</h" + level + ">\n";

            } else
                return "<h"+ level + " id=\"" + text.toLowerCase().replace(/[^\w]+/g, '-') + "\">" +
                    text + "</h" + level + ">\n";
        };

        return marked(frame, {renderer:renderer});
    }

    /**
     * Translates source in to HTML slides.
     *
     * @param {string} source text
     * @returns {string} HTML output of source slides
     */
    function translate(source) {
        source = removeComments(source);
        var properties = readProperties(source),
            titleSlide = makeTitleSlide(properties);
        var frames = extractFrames(source);
        var output = titleSlide != undefined ? titleSlide : "";

        for(var i=0; i<frames.length; i++) {
            var frameProperties = readFrameProperties(frames[i]);
            var frameMath = extractMaths(replaceControlTags(frameProperties.frame));
            var newFrame = restoreMaths(renderMarkdown(frameMath.frame),
                frameMath.maths, constants.temp_inlineMath, constants.temp_blockMath);
            output += constants.temp_slide(newFrame, frameProperties.properties);
            frames[i] = newFrame;
        }

        return output;
    }

    /**
     * Translator constructor
     *
     * @param {string} source text
     * @returns {string} HTML
     * @constructor
     */
    function Translator(source) {
        return translate(source);
    }

    Translator.readProperties = readProperties;

    if(process.env.Test == 1) {
        Translator.removeComments = removeComments;
        Translator.extractFrames = extractFrames;
        Translator.extractMaths = extractMaths;
        Translator.restoreMaths = restoreMaths;
        Translator.replaceControlTags = replaceControlTags;
        Translator.makeTitleSlide = makeTitleSlide;
        Translator.readFrameProperties = readFrameProperties;
        Translator.renderMarkdown = renderMarkdown;
    }

    module.exports = Translator;
})();