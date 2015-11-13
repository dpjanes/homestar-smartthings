"use strict";

var iotdb = require("iotdb");

exports.binding = {
    model: require('./SmartThingsContact.json'),
    bridge: require('../SmartThingsBridge').Bridge,
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
