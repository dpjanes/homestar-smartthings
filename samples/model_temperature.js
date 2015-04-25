/*
 *  Use a Model to manipulate semantically
 */

"use strict";

var iotdb = require("iotdb");
var _ = iotdb._;

var ModelBinding = require('../models/SmartThingsTemperature');

var wrapper = _.bridge_wrapper(ModelBinding.binding);
wrapper.on('thing', function (model) {
    model.on("state", function (model) {
        console.log("+ state\n ", model.thing_id(), model.state("istate"));
    });
    model.on("meta", function (model) {
        console.log("+ meta\n ", model.thing_id(), model.state("meta"));
    });

    console.log("+ discovered\n ", model.thing_id(), model.state("meta"));
});
wrapper.on('ignored', function (bridge) {
    console.log("+ ignored\n ", _.ld.compact(bridge.meta()));
});
