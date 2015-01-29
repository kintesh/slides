/**
 * Created by kintesh on 28/01/15.
 */
var assert = require("assert"),
    translator = require("../lib/translator"),
    fs = require("fs"),
    testSource
    ;

describe("Translator", function () {

    it("Rigorous tests", function () {
        assert.equal(true, true);
        assert.notEqual(true, false);
        assert.notDeepEqual(translator, {});
        assert.notDeepEqual(fs, {});
    });

    it("Test removeComments(source)", function () {
        var input = "Tyche is the /*nick*/name given to a /**hypothetical**/ gas giant located in the " +
                "Solar System's Oort cloud//.",
            output = "Tyche is the name given to a  gas giant located in the Solar System's Oort cloud";
        assert.equal(translator.removeComments(input), output);
    });

    it("read test source file", function() {
        testSource = fs.readFileSync(__dirname+"/testSource", "utf8");
        assert.notDeepEqual(testSource, undefined);
    });

    it("test for readProperties", function () {
        var input = testSource,
            output = {
                title: 'Sample Slides',
                sub_title: 'The following are sample slides showing different features.',
                author: 'Kintesh Patel',
                date: '28/01/2015'
            };
        assert.deepEqual(translator.readProperties(input), output);
    });

});