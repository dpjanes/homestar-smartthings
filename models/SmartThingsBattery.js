/*
 *  SmartThingsBattery.js
 *
 *  David Janes
 *  IOTDB
 *  2014-08-17
 *  "Indonesian Independence Day"
 *
 *  SmartThings Battery Level
 */

"use strict";

var iotdb = require("iotdb");

exports.Model = iotdb.make_model('SmartThingsBattery')
    .facet(":sensor.battery")
    .i("battery", iotdb.sensor.percent.battery)
    .make();

exports.binding = {
    model: exports.Model,
    bridge: require('../SmartThingsBridge').Bridge,
    initd: {
        device: 'battery',
    },
    matchd: {
        'iot:vendor.device': 'battery',
    },
    connectd: {
        data_in: function (paramd) {
            if (paramd.rawd.battery) {
                paramd.cookd.battery = paramd.rawd.battery * 100;
            }
        },
    },
};
