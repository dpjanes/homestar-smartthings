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

exports.binding = {
    model: require('./model.json'),
    bridge: require('../../SmartThingsBridge').Bridge,
    initd: {
        device: 'temperature',
    },
    matchd: {
        'iot:vendor.type': 'temperature',
    },
};
