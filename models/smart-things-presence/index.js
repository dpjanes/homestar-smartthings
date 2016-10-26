/*
 *  SmartThingsPresence.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-06
 *
 *  SmartThings Presence Detector
 */

"use strict";

exports.binding = {
    model: require('./model.json'),
    bridge: require('../../SmartThingsBridge').Bridge,
    initd: {
        device: 'presence',
    },
    matchd: {
        'iot:vendor.type': 'presence',
    },
};
