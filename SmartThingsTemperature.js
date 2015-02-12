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

var homestar = require("homestar")

exports.Model = homestar.make_model('SmartThingsTemperature')
    .facet(":sensor.climate")
    .i("temperature", homestar.sensor.number.temperature.fahrenheit)
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
