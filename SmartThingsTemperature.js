/*
 *  SmartThingsTemperature.js
 *
 *  David Janes
 *  IOTDB
 *  2014-08-17
 *  "Indonesian Independence Day"
 *
 *  SmartThings Temperature Level
 */

"use strict";

var iotdb = require("iotdb")

exports.Model = iotdb.make_model('SmartThingsTemperature')
    .facet(":sensor.climate")
    .i("temperature", iotdb.sensor.number.temperature.fahrenheit)
    .make();

exports.binding = {
    model: exports.Model,
    bridge: require('./SmartThingsBridge').Bridge,
    initd: {
        device: 'temperature',
    },
    matchd: {
        'iot:vendor/type': 'temperature',
    },
};
