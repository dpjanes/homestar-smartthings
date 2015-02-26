# homestar-smart-things

IOTDB / HomeStar Controller for SmartThings

See <a href="samples/">the samples</a> for details how to add to your project.
particularly <code>model.js</code> for "standalone" and <code>iotdb.js</code>
for use in IOTDB / HomeStar projects.

# Quick Start

Turn a SmartThings switch off

	$ npm install -g homestar
	$ npm install iotdb
	$ homestar install homestar-wemo
	$ node
	>>> iotdb = require('iotdb')
	>>> iot = iotdb.iot()
	>>> things = iot.connect("SmartThingsSwitch")
	>>> things.set(":on", false)

# Models
## SmartThingsBattery
e.g. 

    {
        "battery": 90
    }

## SmartThingsContact
e.g. 

    {
        "open": true
    }

## SmartThingsMotion

<code>true</code> if there is motion.

e.g. 

    {
        "motion": true
    }

## SmartThingsSwitch

e.g. 

    {
        "on": true
    }

## SmartThingsTemperature

In Fahrenheit

e.g. 

    {
        "temperature": 72
    }

## SmartThingsThreeAxis

No particular units

e.g. 

    {
        "x": 10,
        "y": -180,
        "z": 78
    }
