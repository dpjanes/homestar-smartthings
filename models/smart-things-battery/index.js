/*
 *  SmartThingsBattery.js
 *
 *  David Janes
 *  IOTDB
 *  2014-08-17
 *  "Indonesian Independence Day"
 *
 *  SmartThings Battery Level
 */

"use strict";

exports.binding = {
    model: require('./model.json'),
    bridge: require('../../SmartThingsBridge').Bridge,
    initd: {
        device: 'battery',
    },
    matchd: {
        'iot:vendor.type': 'battery',
    },
    connectd: {
        data_in: function (paramd) {
            if (paramd.rawd.battery) {
                paramd.cookd.battery = paramd.rawd.battery * 100;
            }
        },
    },
};
