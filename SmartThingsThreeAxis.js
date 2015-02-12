/*
 *  SmartThingsThreeAxis.js
 *
 *  David Janes
 *  IOTDB
 *  2014-08-17
 *  "Indonesian Independence Day"
 *
 *  SmartThings ThreeAxis
 */

"use strict";

var homestar = require("homestar")

exports.Model = homestar.make_model('SmartThingsThreeAxis')
    .facet(":sensor.spatial")
    .i("x", homestar.vector.number.xyz.x)
    .i("y", homestar.vector.number.xyz.y)
    .i("z", homestar.vector.number.xyz.z)
    .make();

exports.binding = {
    model: exports.Model,
    bridge: require('./SmartThingsBridge').Bridge,
    initd: {
        device: 'threeAxis',
    },
    matchd: {
        'iot:vendor/type': 'threeAxis',
    },
};
