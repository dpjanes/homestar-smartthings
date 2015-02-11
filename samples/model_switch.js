/*
 *  Use a Model to manipulate semantically
 */

var iotdb = require("iotdb");

var ModelBinding = require('../SmartThingsSwitch');

wrapper = iotdb.bridge_wrapper(ModelBinding.binding);
wrapper.on('model', function(model) {
    model.on_change(function(model) {
        console.log("+ state\n ", model.thing_id(), model.state());
    });
    model.on_meta(function(model) {
        console.log("+ meta\n ", model.thing_id(), model.meta().state());
    });
    
    console.log("+ discovered\n ", model.meta().state(), "\n ", model.thing_id());

        
    var on = false;
    var timer = setInterval(function() {
        if (!model.reachable()) {
            console.log("+ forgetting unreachable model");
            clearInterval(timer);
            return;
        }

        model.set("on", on);
        on = !on;
    }, 2500);
})
wrapper.on('ignored', function(bridge) {
    console.log("+ ignored\n ", bridge.meta());
});
