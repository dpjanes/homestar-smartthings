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

exports.binding = {
    model: require('./SmartThingsThreeAxis.json'),
    bridge: require('../SmartThingsBridge').Bridge,
    initd: {
        device: 'threeAxis',
    },
    matchd: {
        'iot:vendor.type': 'threeAxis',
    },
};
