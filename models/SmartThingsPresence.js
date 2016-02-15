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

var iotdb = require("iotdb");

exports.binding = {
    model: require('./smart-things-presence.json'),
    bridge: require('../SmartThingsBridge').Bridge,
    initd: {
        device: 'presence',
    },
    matchd: {
        'iot:vendor.type': 'presence',
    },
};
