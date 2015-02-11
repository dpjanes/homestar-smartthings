/*
 *  SmartThingsMotion.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-06
 *
 *  SmartThings Motion Detector
 */

"use strict";

var iotdb = require("iotdb")

exports.Model = iotdb.make_model('SmartThingsMotion')
    .facet(":sensor.motion")
    .i("open", iotdb.sensor.boolean.motion)
    .make();

exports.binding = {
    model: exports.Model,
    bridge: require('./SmartThingsBridge').Bridge,
    initd: {
        device: 'motion',
    },
    matchd: {
        'iot:vendor/device': 'motion',
    },
};
