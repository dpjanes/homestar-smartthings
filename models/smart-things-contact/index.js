/*
 *  SmartThingsContact.js
 *
 *  David Janes
 *  IOTDB
 *  2014-08-17
 *  "Indonesian Independence Day"
 *
 *  SmartThings Contact Switch
 */

"use strict";

exports.binding = {
    model: require('./model.json'),
    bridge: require('../../SmartThingsBridge').Bridge,
    initd: {
        device: 'contact',
    },
    matchd: {
        'iot:vendor.type': 'contact',
    },
    connectd: {
        data_in: function (paramd) {
            if (paramd.rawd.contact !== undefined) {
                paramd.cookd.open = paramd.rawd.contact ? false : true;
            }
        },
    },
};
