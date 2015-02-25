/*
 *  Use a Model to manipulate semantically
 */

var iotdb = require("iotdb");
var _ = iotdb._;

var ModelBinding = require('../SmartThingsMotion');

wrapper = _.bridge_wrapper(ModelBinding.binding);
wrapper.on('thing', function(model) {
    model.on("state", function(model) {
        console.log("+ state\n ", model.thing_id(), model.state());
    });
    model.on("meta", function(model) {
        console.log("+ meta\n ", model.thing_id(), _.ld.compact(model.meta().state()));
    });
    
    console.log("+ discovered\n ", _.ld.compact(model.meta().state()), "\n ", model.thing_id());
})
wrapper.on('ignored', function(bridge) {
    console.log("+ ignored\n ", _.ld.compact(bridge.meta()));
});
