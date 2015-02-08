"use strict";

var iotdb = require("iotdb")

exports.Model = iotdb.make_model('SmartThingsContact')
    .facet(":sensor.contact")
    .i("open", iotdb.sensor.boolean.open)
    .make();

exports.binding = {
    model: exports.Model,
    matchd: {
        'iot:vendor/type': 'contact',
    },
    connectd: {
        data_in: function(paramd) {
            if (paramd.rawd.contact !== undefined) {
                paramd.cookd.open = paramd.rawd.contact ? false : true
            }
        },
    },
};
