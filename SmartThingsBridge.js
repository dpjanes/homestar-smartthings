/*
 *  SmartThingsBridge.js
 *
 *  David Janes
 *  IOTDB.org
 *  2015-02-08
 *
 *  Copyright [2013-2015] [David P. Janes]
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

"use strict";

var iotdb = require('iotdb');
var _ = iotdb._;

var path = require('path');
var url = require('url');
var smartthings = require('iotdb-smartthings');

var body_parser = require('body-parser');

var logger = iotdb.logger({
    name: 'homestar-smartthings',
    module: 'SmartThingsBridge',
});

var ACCOUNT_KEY = "/bridges/SmartThingsBridge/initd";


/**
 *  See {iotdb.bridge.Bridge#Bridge} for documentation.
 *  <p>
 *  @param {object|undefined} native
 *  only used for instances, should be a device object from iotdb-smartthings
 */
var SmartThingsBridge = function (initd, native) {
    var self = this;

    self.initd = _.defaults(initd,
        iotdb.keystore().get(ACCOUNT_KEY), {
            mqtt: true,
            poll: 5 * 60,
            name: null,
            device: null,
        }
    );
    self.native = native;
};

SmartThingsBridge.prototype = new iotdb.Bridge();

/* --- lifecycle --- */

/**
 *  See {iotdb.bridge.Bridge#discover} for documentation.
 */
SmartThingsBridge.prototype.discover = function () {
    var self = this;

    var st = self._st();
    if (!st) {
        logger.info({
            method: "discover"
        }, "SmartThings not configured");
        return;
    }

    st.on("endpoint", function () {
        var device_types = smartthings.device_types;
        if (self.initd.device) {
            device_types = [self.initd.device];
        }

        for (var dti in device_types) {
            st.request_devices(device_types[dti]);
        }
    });
    st.on("devices", function (device_type, devices) {
        for (var di in devices) {
            self.discovered(new SmartThingsBridge(self.initd, devices[di]));
        }
    });

    st.request_endpoint();
};

/**
 *  See {iotdb.bridge.Bridge#connect} for documentation.
 */
SmartThingsBridge.prototype.connect = function (connectd) {
    var self = this;
    if (!self.native) {
        return;
    }

    self._validate_connect(connectd);

    self.connectd = _.defaults(connectd, {}, self.connectd);

    if (self.native.value) {
        self._pulled(self.native.value);
    }

    if (self.initd.mqtt && self.native.mqtt) {
        self._setup_mqtt();
    }
    if (self.initd.poll > 0) {
        self._setup_polling();
    }
};

SmartThingsBridge.prototype._setup_polling = function () {
    var self = this;

    var timer = setInterval(function () {
        if (!self.native) {
            clearInterval(timer);
            return;
        }

        self.pull();
    }, self.initd.poll * 1000);
};

SmartThingsBridge.prototype._setup_mqtt = function () {
    var self = this;

    var mqtt;
    try {
        mqtt = require("iotdb-mqtt");
    } catch (x) {
        logger.error({
            method: "_setup_mqtt",
            cause: "likely not installed - try 'homestar install iotdb-mqtt'",
        }, "MQTT not available");
        return;
    }

    self._mqtt_client = mqtt.connect(self.native.mqtt);
    self._mqtt_client.subscribe(url.parse(self.native.mqtt).pathname.replace(/\/*/, ''));
    self._mqtt_client.on('message', function (topic, message) {
        message = message.toString();
        self._pulled(JSON.parse(message));
    });
};

SmartThingsBridge.prototype._forget = function () {
    var self = this;
    if (!self.native) {
        return;
    }

    logger.info({
        method: "_forget"
    }, "called");

    if (self._mqtt_client) {
        self._mqtt_client.end();
        self._mqtt_client = null;
    }

    self.native = null;
    self.pulled();
};

/**
 *  See {iotdb.bridge.Bridge#disconnect} for documentation.
 */
SmartThingsBridge.prototype.disconnect = function () {
    var self = this;
    if (!self.native || !self.native) {
        return;
    }

    self._forget();
};

/* --- data --- */

/**
 *  See {iotdb.bridge.Bridge#push} for documentation.
 */
SmartThingsBridge.prototype.push = function (pushd, done) {
    var self = this;
    if (!self.native) {
        done(new Error("not connected"));
        return;
    }

    self._validate_push(pushd, done);

    logger.info({
        method: "push",
        unique_id: self.unique_id,
        pushd: pushd,
    }, "pushed");

    if (self.connectd.data_out) {
        var paramd = {
            rawd: {},
            cookd: pushd,
        };
        self.connectd.data_out(paramd);
        self._st().device_request(self.native, paramd.rawd);
    } else {
        self._st().device_request(self.native, pushd);
    }

    // optimistic state change
    self.pulled(pushd);
    
    done();
};

/**
 *  See {iotdb.bridge.Bridge#pull} for documentation.
 */
SmartThingsBridge.prototype.pull = function () {
    var self = this;
    if (!self.native) {
        return;
    }

    self._st().device_poll(self.native, function (error, _deviced, _stated) {
        logger.info({
            method: "_pull",
            error: error,
            device: self.native,
            stated: _stated,
        }, "pulled");

        if (_stated && _stated.value) {
            self._pulled(_stated.value);
        }
    });
};

SmartThingsBridge.prototype._pulled = function (rawd) {
    var self = this;

    if (self.connectd.data_in) {
        var paramd = {
            rawd: rawd,
            cookd: {},
        };
        self.connectd.data_in(paramd);
        self.pulled(paramd.cookd);
    } else {
        self.pulled(rawd);
    }
};

/* --- state --- */

/**
 *  See {iotdb.bridge.Bridge#meta} for documentation.
 */
SmartThingsBridge.prototype.meta = function () {
    var self = this;
    if (!self.native) {
        return;
    }

    return {
        "iot:thing-id": _.id.thing_urn.unique("SmartThings", self.native.id, self.native.type),
        "iot:device-id": _.id.thing_urn.unique("SmartThings", self.native.id),
        "schema:name": self.native.label || self.initd.name || "SmartThings",
        "iot:vendor.type": self.native.type,
    };
};

/**
 *  See {iotdb.bridge.Bridge#reachable} for documentation.
 */
SmartThingsBridge.prototype.reachable = function () {
    return this.native !== null;
};

/**
 *  See {iotdb.bridge.Bridge#configure} for documentation.
 */
SmartThingsBridge.prototype.configure = function (app) {
    var self = this;

    self.html_root = app.html_root || "/";

    app.use('/$', body_parser.urlencoded({
        extended: true
    }));
    app.all('/$', function (request, response) {
        self._configure_index(request, response);
    });

    return "SmartThings";
};

SmartThingsBridge.prototype._configure_index = function (request, response) {
    var self = this;

    var account_value = iotdb.keystore().get(ACCOUNT_KEY);

    var template = path.join(__dirname, "templates", "index.html");
    var templated = {
        html_root: self.html_root,
        account: account_value
    };

    if (request.method === "POST") {
        if (request.body && request.body.json) {
            try {
                account_value = JSON.parse(request.body.json);
                iotdb.keystore().save(ACCOUNT_KEY, account_value);
                templated.success = "SmartThings configuration saved - enjoy!";
            } catch (x) {
                templated.error = "" + x;
            }
        } else {
            templated.error = "No request?";
        }
    }

    response
        .set('Content-Type', 'text/html')
        .render(template, templated);
};


/* --- internals --- */
var __st;

SmartThingsBridge.prototype._st = function () {
    var self = this;

    if (__st === undefined) {
        var cfgd = iotdb.keystore().get(ACCOUNT_KEY);
        if (!cfgd) {
            logger.error({
                method: "_st",
            }, "SmartThings is not configured");
            __st = null;
        } else {
            __st = new smartthings.SmartThings();
            __st.configure(cfgd);
        }
    }

    return __st;
};

/*
 *  API
 */
exports.Bridge = SmartThingsBridge;
