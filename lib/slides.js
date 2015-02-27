/**
 * Created by kintesh on 28/01/15.
 */
;(function(){
    var constants = require("./constants"),
        translator = require("./translator"),
        async = require("async");

    function slides(source, callback) {
        async.waterfall([
            function(callback) {
                translator(source, callback)
            }
        ], function(err, res) {
            if(err == null) {
                res.offline = constants.temp_html(constants.temp_offline(res.properties),res.html);
                res.online = constants.temp_html(constants.temp_online(res.properties),res.html);
            }
            callback(err, res);
        });
    }

    module.exports = slides;

})();