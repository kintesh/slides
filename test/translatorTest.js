/**
 * Created by kintesh on 28/01/15.
 */
var assert = require("assert"),
    translator = require("../lib/translator"),
    fs = require("fs"),
    testSource
    ;

describe("Translator", function() {

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
                title: 'Sample Slides',
                sub_title: 'The following are sample slides showing different features.',
                author: 'Kintesh Patel',
                date: '28/01/2015'
            };
        assert.deepEqual(translator.readProperties(input), output);
    });

    it("test for extractFrames", function() {
        var input = testSource,
            frameLength = 7,
            frame0 = "# Headers\n---------\n\n# H1 header\n## H2 header\n### H3 header\n#### H4 header\n" +
                "##### H5 header\n###### H6 header\n\n";
        var frames = translator.extractFrames(input);

        assert.equal(frameLength, frames.length);
        assert.deepEqual(frame0, frames[0]);
    });

});