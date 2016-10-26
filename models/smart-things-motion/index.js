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

exports.binding = {
    model: require('./model.json'),
    bridge: require('../../SmartThingsBridge').Bridge,
    initd: {
        device: 'motion',
    },
    matchd: {
        'iot:vendor.type': 'motion',
    },
};
