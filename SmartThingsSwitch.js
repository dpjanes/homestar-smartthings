/*
 *  SmartThingsSwitch.js
 *
 *  David Janes
 *  IOTDB
 *  2014-03-06
 *
 *  SmartThings Z-Wave Switch
 */

"use strict";

var iotdb = require("iotdb");

exports.Model = iotdb.make_model('SmartThingsSwitch')
    .facet(":switch")
    .o("on", iotdb.boolean.on)
    .make();

exports.binding = {
    model: exports.Model,
    bridge: require('./SmartThingsBridge').Bridge,
    initd: {
        device: 'switch',
    },
    matchd: {
        'iot:vendor/type': 'switch',
    },
    connectd: {
        data_in: function (paramd) {
            if (paramd.rawd['switch'] !== undefined) {
                paramd.cookd['on'] = paramd.rawd['switch'];
            }
        },
        data_out: function (paramd) {
            if (paramd.cookd.on !== undefined) {
                paramd.rawd['switch'] = paramd.cookd.on ? 1 : 0;
            }
        },
    },
};
