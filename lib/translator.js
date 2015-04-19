/**
 * Created by kintesh on 28/01/15.
 */
;(function(){

    var constants = require("./constants"),
        marked = require("marked"),
        async = require("async");
    /**
     * Checks if callback is missing or invalid.
     */
    function checkCallback(callback) {
        if(!callback || typeof(callback) !== "function") {
            console.error("Missing/Invalid callback.");
            throw new Error("Missing/Invalid callback.");
        }
    }

    /**
     * Removes comments from the input.
     */
    function removeComments(slides, callback) {
        checkCallback(callback);
        try {
            slides.source = slides.source.replace(constants.regex_comments, "");
            callback(null, slides);
        } catch(err) {
            err = new Error("Missing property: slides.source");
            callback(err, null);
        }
    }

    /**
     * Reads slides properties and meta tags from source.
     */
    function readProperties(slides, callback) {
        checkCallback(callback);
        try {
            var properties = {},
                sLines = slides.source.split(constants.regex_lines);
            for (var i = 0; i < sLines.length; i++) {
                var cLine = sLines[i],
                    match = constants.regex_properties.exec(cLine);
                if (cLine == constants.frame_separator)
                    break;
                if (match != null)
                    properties[match[1]] = match[2];
            }
            slides.properties = properties;
            callback(null, slides);
        } catch(err) {
            err = new Error("Missing property: slides.source");
            callback(err, null);
        }
    }

    /**
     * Extracts frames from the source.
     */
    function extractFrames(slides, callback) {
        checkCallback(callback);
        try {
            constants.regex_frame.lastIndex = 0;
            var frames = [],
                match = constants.regex_frame.exec(slides.source);
            while (match != null) {
                frames.push({content:match[1]});
                match = constants.regex_frame.exec(slides.source);
            }
            slides.frames = frames;
            callback(null, slides);
        } catch(err) {
            err = new Error("Missing property: slides.frames");
            callback(err, null);
        }
    }

    /**
     * Extracts and marks math equations.
     */
    function extractMaths(slides, callback) {
        checkCallback(callback);
        try {
            async.each(slides.frames, function(frame, callback) {
                constants.regex_maths.lastIndex = 0;
                var maths = [],
                    mathsCount = 0,
                    match = constants.regex_maths.exec(frame.content);
                while(match != null) {
                    if(match[1] != undefined) {
                        maths.push({
                            type: constants.math_type_inline,
                            value: match[2]
                        });
                        frame.content = frame.content.replace(match[1], constants.math_marker(mathsCount));
                    } else if(match[3] != undefined) {
                        maths.push({
                            type: constants.math_type_block,
                            value: match[4]
                        });
                        frame.content = frame.content.replace(match[3], constants.math_marker(mathsCount));
                    }
                    constants.regex_maths.lastIndex = 0;
                    match = constants.regex_maths.exec(frame.content);
                    mathsCount++;
                }
                frame.maths = maths;
                callback();
            }, function() {
                callback(null, slides);
            });
        } catch(err) {
            err = new Error("Missing property: slides.frames || slides.frames.content || slides.frames.maths");
            callback(err, null);
        }

    }

    /**
     * Restores extracted math equations to marked frame.
     */
    function restoreMaths(slides, callback) {
        checkCallback(callback);
        try {
            async.each(slides.frames, function (frame, callback) {
                async.each(frame.maths, function (math, callback2) {
                    var marker = constants.math_marker(frame.maths.indexOf(math));
                    if (math.type == constants.math_type_inline) {
                        frame.content = frame.content.replace(marker, constants.temp_inlineMath(math.value));
                    } else if (math.type == constants.math_type_block) {
                        frame.content = frame.content.replace(marker, constants.temp_blockMath(math.value));
                    }
                    callback2();
                }, function() {
                    callback();
                });
            }, function() {
                callback(null, slides);
            });
        } catch(err) {
            err = new Error("!Missing property: slides.frames || slides.frames.content || slides.frames.maths");
            callback(err, null);
        }
    }

    /**
     * Replaces element control tags with div tags.
     */
    function replaceControlTags(slides, callback) {
        checkCallback(callback);
        try {
            async.each(slides.frames, function(frame, callback) {
                constants.regex_controlElemBlock.lastIndex = 0;
                var match = constants.regex_controlElemBlock.exec(frame.content);
                while(match != null) {
                    var p = constants.regex_controlElemProp.exec(match[1]),
                        c = "{";
                    while(p != null) {
                        c +="\"" + p[1] + "\":\"" + p[2] + "\"";
                        p = constants.regex_controlElemProp.exec(match[1]);
                        if(p != null) c+= ",";
                    }
                    c += "}";
                    frame.content = frame.content.replace(match[0], constants.temp_controlElem(c));
                    constants.regex_controlElemBlock.lastIndex = 0;
                    match = constants.regex_controlElemBlock.exec(frame.content);
                }
                callback();
            }, function() {
                callback(null, slides);
            });
        } catch(err) {
            err = new Error("Missing property: slides.frames || slides.frames.content");
            callback(err, null);
        }
    }

    /**
     * Makes title slide.
     */
    function makeTitleSlide(slides, callback) {
        checkCallback(callback);
        try {
            var titleSlide = "";
            if(slides.properties["title"] != undefined)
                titleSlide += constants.temp_title(slides.properties["title"]);
            if(slides.properties["sub_title"] != undefined)
                titleSlide += constants.temp_subTitle(slides.properties["sub_title"]);
            if(slides.properties["author"] != undefined)
                titleSlide += constants.temp_author(slides.properties["author"]);
            if(slides.properties["date"] != undefined)
                titleSlide += constants.temp_date(slides.properties["date"]);
            titleSlide = titleSlide != "" ? constants.temp_slide(constants.tmp_alignMiddle(titleSlide)) : undefined;
            slides.titleSlide = titleSlide;
            callback(null, slides);
        } catch(err) {
            err = new Error("Missing property: slides.properties");
            callback(err, null);
        }
    }

    /**
     * Removes properties from frame (if any) and return frame (with removed properties) and properties.
     */
    function readFrameProperties(slides, callback) {
        checkCallback(callback);
        try {
            async.each(slides.frames, function(frame, callback) {
                var match = constants.regex_frameProperties.exec(
                    frame.content.split(constants.regex_lines)[0]);
                if (match != null) {
                    frame.properties = match[1];
                    frame.content = frame.content.replace(match[0] + "\n", "");
                } else {
                    frame.properties = undefined;
                }
                callback();
            }, function() {
                callback(null, slides);
            });
        } catch(err) {
            err = new Error("Missing property: slides.frames || slides.frames.content || slides.frames.properties");
            callback(err, null);
        }
    }

    /**
     * Render markdown on input frame. Preserves slide control tags.
     */
    function renderMarkdown(slides, callback) {
        checkCallback(callback);
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
            if(text.match(constants.regex_controlElemClass) != null) {
                return text
                    .replace(/&amp;/g, "&")
                    .replace(/&lt;/g, "<")
                    .replace(/&gt;/g, ">")
                    .replace(/&quot;/g, "\"")
                    .replace(/&#39;/g, "'") + "\n";
            } else {
                var match = constants.regex_alignCenter.exec(text);
                if(match != null) {
                    return "<p style=\"text-align: center;\">" + match[1].trim() + "</p>\n";
                } else {
                    return "<p>" + text + "</p>\n";
                }
            }
        };

        renderer.heading = function(text, level) {
            var match = constants.regex_alignCenter.exec(text);
            if(match != null) {
                return "<h"+ level + " id=\"" + match[1].trim().toLowerCase().replace(/[^\w]+/g, "-") + "\" " +
                    "style=\"text-align: center;\">" + match[1].trim() + "</h" + level + ">\n";

            } else
                return "<h"+ level + " id=\"" + text.toLowerCase().replace(/[^\w]+/g, "-") + "\">" +
                    text + "</h" + level + ">\n";
        };

        renderer.link = function(href, title, text) {
            var out = "<a href=\"" + href + "\" target=\"_blank\"";
            if (title) {
                out += " title=\"" + title + "\"";
            }
            out += ">" + text + " <i class=\"fa fa-external-link\"></i></a>";
            return out;
        };

        try {
            async.each(slides.frames, function(frame, callback) {
                frame.content = marked(frame.content, {renderer:renderer});
                callback();
            }, function() {
                callback(null, slides);
            });
        } catch(err) {
            err = new Error("Missing property: slides.frames || slides.frames.content");
            callback(err, null);
        }
    }

    /**
     * Sanitize escape characters.
     */
    function sanitizeEscape(slides, callback) {
        checkCallback(callback);
        try {
            async.each(slides.frames, function(frame, callback) {
                frame.content = frame.content
                    .replace(/\\\$/g,   "%{DOLLAR}")
                    .replace(/\\\[/g,   "%{SQR_LEFT_BR}")
                    .replace(/\\]/g,    "%{SQR_RIGHT_BR}")
                    .replace(/\\>/g,    "%{ANG_LEFT_BR}")
                    .replace(/\\</g,    "%{ANG_RIGHT_BR}")
                    .replace(/\\-/g,    "%{HYPHEN_MINUS}")
                    .replace(/\\=/g,    "%{EQUAL}");
                callback();
            }, function() {
                callback(null, slides);
            });
        } catch(err) {
            err = new Error("Missing property: slides.frames || slides.frames.content");
            callback(err, null);
        }
    }

    /**
     * Unsanitize escape characters.
     */
    function unsanitizeEscape(slides, callback) {
        checkCallback(callback);
        try {
            async.each(slides.frames, function(frame, callback) {
                frame.content = frame.content
                    .replace(/%\{DOLLAR}/g,         "$")
                    .replace(/%\{SQR_LEFT_BR}/g,    "[")
                    .replace(/%\{SQR_RIGHT_BR}/g,   "]")
                    .replace(/%\{ANG_LEFT_BR}/g,    ">")
                    .replace(/%\{ANG_RIGHT_BR}/g,   "<")
                    .replace(/%\{HYPHEN_MINUS}/g,   "-")
                    .replace(/%\{EQUAL}/g,          "=");
                callback();
            }, function() {
                callback(null, slides);
            });
        } catch(err) {
            err = new Error("Missing property: slides.frames || slides.frames.content");
            callback(err, null);
        }
    }

    /**
     * Translates source in to HTML slides.
     */
    function translate(source, callback) {
        checkCallback(callback);

        var slides = {
            source: source,
            properties: undefined,
            titleSlide: undefined,
            frames: undefined,
            html: undefined
        };

        async.waterfall([
            function(callback) {
                removeComments(slides, callback);
            },
            function(slides, callback) {
                readProperties(slides, callback);
            },
            function(slides, callback) {
                makeTitleSlide(slides, callback);
            },
            function(slides, callback) {
                extractFrames(slides, callback);
            },
            function(slides, callback) {
                sanitizeEscape(slides, callback);
            },
            function(slides, callback) {
                readFrameProperties(slides, callback);
            },
            function(slides, callback) {
                replaceControlTags(slides, callback);
            },
            function(slides, callback) {
                extractMaths(slides, callback);
            },
            function(slides, callback) {
                renderMarkdown(slides, callback);
            },
            function(slides, callback) {
                restoreMaths(slides, callback);
            },
            function(slides, callback) {
                unsanitizeEscape(slides, callback);
            }
        ], function(err, res) {

            if(err == null) {
                if(res.html == undefined) {
                    res.html = "";
                }
                async.each(res.frames, function(frame, callback) {
                    frame.content = constants.temp_slide(frame.content, frame.properties);
                    res.html += frame.content;
                    callback();
                }, function() {
                    res.html = ((res.titleSlide == undefined) ? "" : res.titleSlide) + res.html;
                    callback(err, res);
                });
            } else {
                callback(err, res);
            }
        });
    }

    /**
     * Translator constructor
     *
     * @param {string} source text
     * @param callback
     * @constructor
     */
    function Translator(source, callback) {
        checkCallback(callback);
        translate(source, callback);
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
        Translator.sanitizeEscape = sanitizeEscape;
        Translator.unsanitizeEscape = unsanitizeEscape;
    }

    module.exports = Translator;
})();