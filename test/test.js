/**
 * Created by kintesh on 28/01/15.
 */
var assert = require("assert"),
    slides = require("../lib/slides");

describe("Slides", function() {

    it("Rigorous tests", function() {
        assert.equal(true, true);
        assert.notEqual(true, false);
    });

    it("test for translate", function(done) {
        var input = "====\n# -> Welcome to slides <-\n**Slides** is a tool to *make* and *present* HTML5 slides.====",
            output = "<!DOCTYPE html>\n<html>\n<head>\n<title>Slides</title>\n<meta charset=\"UTF-8\">\n" +
                "<link rel=\"stylesheet\" href=\"./slides_assets/css/slides.css\">\n" +
                "<link rel=\"stylesheet\" href=\"./slides_assets/css/slides-print.css\" media=\"print\" />\n" +
                "<link rel=\"stylesheet\" href=\"./slides_assets/css/font-awesome.css\">\n" +
                "<script src=\"./slides_assets/js/jquery.js\"></script>\n" +
                "<script src=\"./slides_assets/js/slides.js\"></script>\n" +
                "<script src=\"./slides_assets/js/MathJax/MathJax.js?config=TeX-AMS-MML_HTMLorMML\"></script>\n" +
                "</head>\n\n<body>\n" +
                "<div class=\"slide\">\n<h1 id=\"welcome-to-slides\" style=\"text-align: center;\">Welcome to slides" +
                "</h1>\n<p><strong>Slides</strong> is a tool to <em>make</em> and <em>present</em> HTML5 slides.</p>" +
                "\n\n</div>\n</body>\n</html>";
        slides(input, function(err, res) {
            assert.deepEqual(res.html, output);
            done();
        });
    });

});