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

var iotdb = require('iotdb')
var _ = iotdb.helpers;

var smartthings = require('iotdb-smartthings');

var bunyan = require('bunyan');
var logger = bunyan.createLogger({
    name: 'homestar-smart-things',
    module: 'SmartThingsBridge',
});

/**
 *  EXEMPLAR and INSTANCE
 *  <p>
 *  No subclassing needed! The following functions are 
 *  injected _after_ this is created, and before .discover and .connect
 *  <ul>
 *  <li><code>discovered</code> - tell IOTDB that we're talking to a new Thing
 *  <li><code>pulled</code> - got new data
 *  <li><code>connected</code> - this is connected to a Thing
 *  <li><code>disconnnected</code> - this has been disconnected from a Thing
 *  </ul>
 */
var SmartThingsBridge = function(initd, native) {
    var self = this;

    self.initd = _.defaults(initd, {
        name: null,
        device: null,
    });
    self.native = native;
    self.connectd = {};
};

/* --- lifecycle --- */

/**
 *  EXEMPLAR. 
 *  Discover WeMo Socket
 *  <ul>
 *  <li>look for Things (using <code>self.bridge</code> data to initialize)
 *  <li>find / create a <code>native</code> that does the talking
 *  <li>create an SmartThingsBridge(native)
 *  <li>call <code>self.discovered(bridge)</code> with it
 */
SmartThingsBridge.prototype.discover = function() {
    var self = this;

    var st = self._st();
    if (!st) {
        logger.info({
            method: "discover"
        }, "SmartThings not configured");
        return;
    }

    st.on("endpoint", function() {
        var device_types = smartthings.device_types;
        if (self.initd.device) {
            device_types = [ self.initd.device ];
        }

        for (var dti in device_types) {
            st.request_devices(device_types[dti]);
        }
    })
    st.on("devices", function(device_type, devices) {
        for (var di in devices) {
            self.discovered(new SmartThingsBridge(self.initd, devices[di]));
        }
    });

    st.request_endpoint();
};

/**
 *  INSTANCE
 *  This is called when the Bridge is no longer needed. When
 */
SmartThingsBridge.prototype.connect = function(connectd) {
    var self = this;
    if (!self.native) {
        return;
    }

    self.connectd = connectd;

    if (self.native.value) {
        self._pulled(self.native.value);
    }
};

SmartThingsBridge.prototype._forget = function() {
    var self = this;
    if (!self.native) {
        return;
    }

    logger.info({
        method: "_forget"
    }, "called");

    self.native = null;
    self.pulled();
}

/**
 *  INSTANCE and EXEMPLAR (during shutdown). 
 *  This is called when the Bridge is no longer needed. When
 */
SmartThingsBridge.prototype.disconnect = function() {
    var self = this;
    if (!self.native || !self.native) {
        return;
    }
};

/* --- data --- */

/**
 *  INSTANCE.
 *  Send data to whatever you're taking to.
 */
SmartThingsBridge.prototype.push = function(pushd) {
    var self = this;
    if (!self.native) {
        return;
    }

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
        console.log(paramd.rawd)
    } else {
        self._st().device_request(self.native, pushd);
    }
};

/**
 *  INSTANCE.
 *  Pull data from whatever we're talking to. You don't
 *  have to implement this if it doesn't make sense
 */
SmartThingsBridge.prototype.pull = function() {
    var self = this;
    if (!self.native) {
        return;
    }
};

SmartThingsBridge.prototype._pulled = function(rawd) {
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
}

/* --- state --- */

/**
 *  INSTANCE.
 *  Return the metadata - compact form can be used.
 *  Does not have to work when not reachable
 *  <p>
 *  Really really useful things are:
 *  <ul>
 *  <li><code>iot:thing</code> required - a unique ID
 *  <li><code>iot:device</code> suggested if linking multiple things together
 *  <li><code>iot:name</code>
 *  <li><code>iot:number</code>
 *  <li><code>schema:manufacturer</code>
 *  <li><code>schema:model</code>
 */
SmartThingsBridge.prototype.meta = function() {
    var self = this;
    if (!self.native) {
        return;
    }

    return {
        "iot:thing": _.id.thing_urn.unique("SmartThings", self.native.id),
        "iot:name": self.native.label || self.initd.name || "SmartThings",
        "iot:vendor/type": self.native.type,
    };
};

/**
 *  INSTANCE.
 *  Return True if this is reachable. You 
 *  do not need to worry about connect / disconnect /
 *  shutdown states, they will be always checked first.
 */
SmartThingsBridge.prototype.reachable = function() {
    return this.native !== null;
};

/**
 *  INSTANCE.
 *  Return True if this is configured. Things
 *  that are not configured are always not reachable.
 *  If not defined, "true" is returned
 */
SmartThingsBridge.prototype.configured = function() {
    return true;
};

/* --- injected: THIS CODE WILL BE REMOVED AT RUNTIME, DO NOT MODIFY  --- */
SmartThingsBridge.prototype.discovered = function(bridge) {
    throw new Error("SmartThingsBridge.discovered not implemented");
};

SmartThingsBridge.prototype.pulled = function(pulld) {
    throw new Error("SmartThingsBridge.pulled not implemented");
};

/* --- internals --- */
var __st;

SmartThingsBridge.prototype._st = function() {
    var self = this;

    if (__st === undefined) {
        var cfgd = iotdb.iot().cfg_get("bridges/SmartThingsBridge");
        if (!cfgd) {
            logger.error({
                method: "_st",
                device: native.deviceType
            }, "SmartThings is not configured");
            __st = null;
        } else {
            __st = new smartthings.SmartThings();
            __st.configure(cfgd);
        }
    }

    return __st;
}

/*
 *  API
 */
exports.Bridge = SmartThingsBridge;
