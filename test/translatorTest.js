/**
 * Created by kintesh on 28/01/15.
 */
var assert = require("assert"),
    translator = require("../lib/translator");

describe("Translator", function () {

    it("Rigorous tests", function () {
        assert.equal(true, true);
        assert.notEqual(true, false);
        assert.notDeepEqual(translator, {});
    });

    it("Test removeComments(source)", function () {
        var input = "Tyche is the /*nick*/name given to a /**hypothetical**/ gas giant located in the " +
                "Solar System's Oort cloud//.",
            output = "Tyche is the name given to a  gas giant located in the Solar System's Oort cloud";
        assert.equal(translator.removeComments(input), output);
    });

});