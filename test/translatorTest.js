/**
 * Created by kintesh on 28/01/15.
 */
var assert = require("assert"),
    translator = require("../lib/translator"),
    fs = require("fs"),
    testSource
    ;

describe("Translator test", function() {

    it("Rigorous tests", function() {
        assert.equal(true, true);
        assert.notEqual(true, false);
        assert.notDeepEqual(translator, {});
        assert.notDeepEqual(fs, {});
    });

    it("Test removeComments(source)", function() {
        var input = "Tyche is the /*nick*/name given to a /**hypothetical**/ gas giant located in the " +
                "Solar System's Oort cloud//.",
            output = "Tyche is the name given to a  gas giant located in the Solar System's Oort cloud";
        assert.equal(translator.removeComments(input), output);
    });

    it("read test for source file", function() {
        testSource = fs.readFileSync(__dirname+"/testSource", "utf8");
        assert.notDeepEqual(testSource, undefined);
    });

    it("test for readProperties", function() {
        var input = testSource,
            output = {
                title: "Sample Slides",
                sub_title: "Sample slides showing different features.",
                author: "Kintesh Patel",
                date: "28/01/2015"
            };
        assert.deepEqual(translator.readProperties(input), output);
    });

    it("test for extractFrames", function() {
        var input = testSource,
            frameLength = 7,
            frame0 = "[[background-color:aquamarine; color:black]]\n# Headers\n---------\n[[visibility:reveal]]" +
                "\n# H1 header\n[[visibility:reveal; color:red]]\n## H2 header\n[[visibility:reveal; color:#22FF22]]" +
                "\n### H3 header\n[[visibility:reveal]]\n#### H4 header\n[[visibility:reveal]]\n##### H5 header" +
                "\n[[visibility:reveal]]\n###### H6 header\n\n";
        var frames = translator.extractFrames(input);
        assert.equal(frameLength, frames.length);
        assert.deepEqual(frame0, frames[0]);
    });

    it("test for extractMaths", function() {
        var inputFrame = "Inline math equations go in like so: $ \\omega = d\\phi / dt $. Display math should " +
                "get its own line and be put in in double-dollarsigns:\n\n$$ I = \\int \\rho R^{2} dV $$\n\nAnd " +
                "note that you can backslash-escape any punctuation characters.",
            outputFrame = "Inline math equations go in like so: %{MATH0}. Display math should get its own " +
                "line and be put in in double-dollarsigns:\n\n%{MATH1}\n\nAnd note that you can backslash-escape " +
                "any punctuation characters.",
            mathsOutput = [
                { type: 0, value: " \\omega = d\\phi / dt " },
                { type: 1, value: " I = \\int \\rho R^{2} dV " }
            ];
        var output = translator.extractMaths(inputFrame);
        assert.deepEqual(outputFrame, output.frame);
        assert.deepEqual(mathsOutput, output.maths);
    });

    it("test for restoreMaths", function() {
        var inputFrame = "Inline math equations go in like so: %{MATH0}. Display math should get its own " +
                "line and be put in in double-dollarsigns:\n\n%{MATH1}\n\nAnd note that you can backslash-escape " +
                "any punctuation characters.",
            outputFrame = "Inline math equations go in like so: <div class=\"inlineMath\"> \\omega = d\\phi / dt " +
                "</div>. Display math should get its own line and be put in in double-dollarsigns:\n\n" +
                "<div class=\"blockMath\"> I = \\int \\rho R^{2} dV </div>\n\nAnd note that you can " +
                "backslash-escape any punctuation characters.",
            maths = [
                { type: 0, value: " \\omega = d\\phi / dt " },
                { type: 1, value: " I = \\int \\rho R^{2} dV " }
            ],
            replaceInline = "<div class=\"inlineMath\">%{MATH}</div>",
            replaceBlock = "<div class=\"blockMath\">%{MATH}</div>";
        assert.deepEqual(translator.restoreMaths(inputFrame, maths, replaceInline, replaceBlock), outputFrame);
    });

    it("test for replaceControlTags", function() {
        var inputFrame = "Itemized lists look like:\n[[visibility:reveal; color:red]]\n  * this one\n  " +
            "* that one\n  * the other one\n",
            outputFrame = "Itemized lists look like:\n<div class=\"controlElem\" style=\"display: none;\">" +
                "{\"visibility\":\"reveal\",\"color\":\"red\"}</div>\n  * this one\n  * that one\n  * the other one\n";
        assert.deepEqual(translator.replaceControlTags(inputFrame), outputFrame);
    });

    it("test for makeTitleSlide", function(){
        var input = {
                title: "Sample Slides",
                sub_title: "Sample slides showing different features.",
                author: "Kintesh Patel",
                date: "28/01/2015"
            },
            output = "<div class=\"slide\">\n<div class=\"title_title\"><h1>Sample Slides</h1></div>" +
                "<div class=\"title_subTitle\"><h3>Sample slides showing different features.</h3></div>" +
                "<div class=\"title_author\">Kintesh Patel</div><div class=\"title_date\">28/01/2015</div>\n</div>\n";
        assert.deepEqual(translator.makeTitleSlide(input), output)
    });

    it("test for readFrameProperties", function() {
        var frames = translator.extractFrames(testSource),
            frame0 = "# Headers\n---------\n[[visibility:reveal]]\n# H1 header\n[[visibility:reveal; color:red]]" +
                "\n## H2 header\n[[visibility:reveal; color:#22FF22]]\n### H3 header\n[[visibility:reveal]]" +
                "\n#### H4 header\n[[visibility:reveal]]\n##### H5 header\n[[visibility:reveal]]" +
                "\n###### H6 header\n\n",
            output = translator.readFrameProperties(frames[0]);
        assert.deepEqual(output.frame, frame0);
        assert.deepEqual(output.properties, "background-color:aquamarine; color:black");
    });

    it("test for renderMarkdown", function() {
        var input = "I am using **markdown**.",
            output = "<p>I am using <strong>markdown</strong>.</p>\n";
        assert.deepEqual(translator.renderMarkdown(input), output);
    });

    it.skip("test for translate", function() {
        console.log(translator.translate(testSource));
    });

});