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

var iotdb = require("iotdb");

exports.binding = {
    model: require('./SmartThingsTemperature.json'),
    bridge: require('../SmartThingsBridge').Bridge,
    initd: {
        device: 'temperature',
    },
    matchd: {
        'iot:vendor.type': 'temperature',
    },
};
