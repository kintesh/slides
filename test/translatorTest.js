/**
 * Created by kintesh on 28/01/15.
 */
var assert = require("assert"),
    translator = require("../lib/translator"),
    fs = require("fs"),
    async = require("async"),
    testSource
    ;

describe("Translator", function() {

    it("Rigorous tests", function() {
        assert.equal(true, true);
        assert.notEqual(true, false);
        assert.notDeepEqual(translator, {});
        assert.notDeepEqual(fs, {});
        assert.notDeepEqual(async, {});
    });

    it("Test removeComments(source)", function(done) {
        var input = "Tyche is the /*nick*/name given to a /**hypothetical**/ gas giant located in the " +
                "Solar System's Oort cloud//.",
            expOut = "Tyche is the name given to a  gas giant located in the Solar System's Oort cloud";
        async.waterfall([
            function(callback) {
                translator.removeComments({source:input}, callback)
            }
        ], function(err, res) {
            if(err == null) {
                assert.deepEqual(res.source, expOut);
                done();
            }
        });
    });

    it("read test for source file", function(done) {
        async.waterfall([
            function(callback) {
                fs.readFile(__dirname+"/testSource", "utf8", callback);
            }
        ], function(err, data) {
            if(err == null) {
                testSource = data;
                done();
            }
        });
    });

    it("test for readProperties", function(done) {
        var input = testSource,
            expOut = {
                title: "Sample Slides",
                sub_title: "Sample slides showing different features.",
                author: "Kintesh Patel",
                date: "28/01/2015"
            };
        async.waterfall([
            function(callback) {
                translator.readProperties({source:input}, callback);
            }
        ], function(err, res) {
            if(err == null) {
                assert.deepEqual(res.properties, expOut);
                done();
            }
        });
    });

    it("test for extractFrames", function(done) {
        var input = testSource,
            frameLength = 7,
            frame0 = "[[background-color:aquamarine; color:black]]\n# Headers\n---------\n[[visibility:reveal]]" +
                "\n# H1 header\n[[visibility:reveal; color:red]]\n## H2 header\n[[visibility:reveal; color:#22FF22]]" +
                "\n### H3 header\n[[visibility:reveal]]\n#### H4 header\n[[visibility:reveal]]\n##### H5 header" +
                "\n[[visibility:reveal]]\n###### H6 header\n\n";
        async.waterfall([
            function(callback) {
                translator.extractFrames({source:input}, callback);
            }
        ], function(err, res) {
            if(err == null) {
                assert.equal(frameLength, res.frames.length);
                assert.deepEqual(frame0, res.frames[0].content);
                done();
            }
        });
    });

    it("test for extractMaths", function(done) {
        var inputFrame = "Inline math equations go in like so: $ \\omega = d\\phi / dt $. Display math should " +
                "get its own line and be put in in double-dollarsigns:\n\n$$ I = \\int \\rho R^{2} dV $$\n\nAnd " +
                "note that you can backslash-escape any punctuation characters.",
            expOutFrame = "Inline math equations go in like so: %{MATH0}. Display math should get its own " +
                "line and be put in in double-dollarsigns:\n\n%{MATH1}\n\nAnd note that you can backslash-escape " +
                "any punctuation characters.",
            mathsOutput = [
                { type: 0, value: " \\omega = d\\phi / dt " },
                { type: 1, value: " I = \\int \\rho R^{2} dV " }
            ];
        async.waterfall([
            function(callback) {
                translator.extractMaths({frames:[{content:inputFrame}]}, callback);
            }
        ], function(err, res) {
            if(err == null) {
                assert.deepEqual(expOutFrame, res.frames[0].content);
                assert.deepEqual(mathsOutput, res.frames[0].maths);
                done();
            }
        });
    });

    it("test for restoreMaths", function(done) {
        var inputFrame = "Inline math equations go in like so: %{MATH0}. Display math should get its own " +
                "line and be put in in double-dollarsigns:\n\n%{MATH1}\n\nAnd note that you can backslash-escape " +
                "any punctuation characters.",
            expOutFrame = "Inline math equations go in like so: <span class=\"inlineMath\"> \\omega = d\\phi / dt " +
                "</span>. Display math should get its own line and be put in in double-dollarsigns:\n\n" +
                "<p class=\"blockMath\"> I = \\int \\rho R^{2} dV </p>\n\nAnd note that you can " +
                "backslash-escape any punctuation characters.",
            maths = [
                { type: 0, value: " \\omega = d\\phi / dt " },
                { type: 1, value: " I = \\int \\rho R^{2} dV " }
            ];
        async.waterfall([
            function(callback) {
                translator.restoreMaths({frames:[{content:inputFrame, maths:maths}]}, callback)
            }
        ], function(err, res) {
            if(err == null) {
                assert.deepEqual(res.frames[0].content, expOutFrame);
                done();
            }
        });
    });

    it("test for replaceControlTags", function(done) {
        var inputFrame = "Itemized lists look like:\n[[visibility:reveal; color:red]]\n  * this one\n  " +
            "* that one\n  * the other one\n",
            expOutFrame = "Itemized lists look like:\n<div class=\"controlElem\" style=\"display: none;\">" +
                "{\"visibility\":\"reveal\",\"color\":\"red\"}</div>\n  * this one\n  * that one\n  * the other one\n";
        async.waterfall([
            function(callback) {
                translator.replaceControlTags({frames:[{content:inputFrame}]}, callback)
            }
        ], function(err, res) {
            if(err == null) {
                assert.deepEqual(res.frames[0].content, expOutFrame);
                done();
            }
        });
    });

    it("test for makeTitleSlide", function(done){
        var input = {
                title: "Sample Slides",
                sub_title: "Sample slides showing different features.",
                author: "Kintesh Patel",
                date: "28/01/2015"
            },
            expOut = "<div class=\"slide\">\n<div class=\"title_title\"><h1>Sample Slides</h1></div>" +
                "<div class=\"title_subTitle\"><h3>Sample slides showing different features.</h3></div>" +
                "<div class=\"title_author\">Kintesh Patel</div><div class=\"title_date\">28/01/2015</div>\n</div>\n";
        async.waterfall([
            function(callback) {
                translator.makeTitleSlide({properties:input}, callback);
            }
        ], function(err, res) {
            if(err == null) {
                assert.deepEqual(res.titleSlide, expOut);
                done();
            }
        });
    });

    it("test for readFrameProperties", function(done) {
        var
            frame0 = "# Headers\n---------\n[[visibility:reveal]]\n# H1 header\n[[visibility:reveal; color:red]]" +
                "\n## H2 header\n[[visibility:reveal; color:#22FF22]]\n### H3 header\n[[visibility:reveal]]" +
                "\n#### H4 header\n[[visibility:reveal]]\n##### H5 header\n[[visibility:reveal]]" +
                "\n###### H6 header\n\n";
        async.waterfall([
            function(callback) {
                translator.extractFrames({source:testSource}, callback)
            },
            function(slides, callback) {
                translator.readFrameProperties(slides, callback)
            }
        ], function(err, res) {
            if (err == null) {
                assert.deepEqual(res.frames[0].content, frame0);
                assert.deepEqual(res.frames[0].properties, "background-color:aquamarine; color:black");
                done();
            }
        });
    });

    it("test for renderMarkdown", function(done) {
        var inputFrame = "I am using **markdown**.",
            expOut = "<p>I am using <strong>markdown</strong>.</p>\n";
        async.waterfall([
            function(callback) {
                translator.renderMarkdown({frames:[{content:inputFrame}]}, callback);
            }
        ], function(err, res) {
            if(err == null) {
                assert.deepEqual(res.frames[0].content, expOut);
                done();
            }
        });
    });

    it("test for renderKatex", function(done) {
        var input = "$ \\pi $",
            expOut = "<span class=\"katex\"><span class=\"katex-inner\"><span class=\"strut\" " +
                "style=\"height:0.43056em;\"></span><span class=\"strut bottom\" style=\"height:0.43056em;" +
                "vertical-align:0em;\"></span><span class=\"base textstyle uncramped\"><span class=\"mord " +
                "mathit\" style=\"margin-right:0.03588em;\">π</span></span></span></span>";
        async.waterfall([
            function(callback) {
                translator.extractMaths({frames:[{content:input}]}, callback);
            },
            function(slides, callback) {
                translator.renderKatex(slides, callback);
            }
        ], function(err, res) {
            if(err == null) {
                assert.deepEqual(res.frames[0].content, expOut);
                done();
            }
        });
    });

    it("test for translate", function(done) {
        async.waterfall([
            function(callback) {
                translator(testSource, callback);
            }
        ], function(err, res) {
            assert.notDeepEqual(res.html,undefined);
            done();
        })
    });

    it("test for renderMathJax", function(done) {
        var input = "$ \\pi $",
            expOut = "<span class=\"inlineMath\"><math xmlns=\"http://www.w3.org/1998/Math/MathML\">\n"+
            "  <mi>&#x03C0;<!-- π --></mi>\n</math></span>";
        async.waterfall([
            function(callback) {
                translator.extractMaths({frames:[{content:input}]}, callback);
            },
            function(slides, callback) {
                translator.renderMathJax(slides, callback);
            }
        ], function(err, res) {
            if(err === null) {
                assert.deepEqual(res.frames[0].content, expOut);
                done();
            }
        });
    });

});