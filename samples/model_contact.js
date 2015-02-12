/*
 *  Use a Model to manipulate semantically
 */

var iotdb = require("iotdb");
var _compact = iotdb.helpers.ld.compact

var ModelBinding = require('../SmartThingsContact');

wrapper = iotdb.bridge_wrapper(ModelBinding.binding);
wrapper.on('model', function(model) {
    model.on_change(function(model) {
        console.log("+ state\n ", model.thing_id(), model.state());
    });
    model.on_meta(function(model) {
        console.log("+ meta\n ", model.thing_id(), _compact(model.meta().state()));
    });
    
    console.log("+ discovered\n ", _compact(model.meta().state()), "\n ", model.thing_id());
})
wrapper.on('ignored', function(bridge) {
    console.log("+ ignored\n ", bridge.meta());
});
