#!/usr/bin/env node

var path = require('path');
var pkg = require(path.join(__dirname, 'package.json'));
var Bleacon = require('bleacon');
var request = require('request');

const pickObject = (obj, keys) => Object.keys(obj)
    .filter(key => keys.indexOf(key) >= 0)
    .reduce((newObj, key) => Object.assign(newObj, { [key]: obj[key] }), {});

// Parse command line options
var program = require('commander');
program
    .version(pkg.version)
    .parse(process.argv);


function buildPayload(bleacon){

    var deviceLabel = tilt[bleacon.uuid] + '-' + bleacon.uuid; // Assigns the device label based on the TILT identified
    bleacon.timeStamp = Date.now(); // Set the actual timestamp

    // Build the payload by default
    var payload = {
        "uuid": deviceLabel,
        "temperature":{ "value": bleacon.major, "timestamp": bleacon.timeStamp },
        "gravity": { "value": bleacon.minor/1000, "timestamp": bleacon.timeStamp },
        "rssi": { "value": bleacon.rssi, "timestamp": bleacon.timeStamp }
    };
    return payload;
}

Bleacon.on('discover', function (bleacon) {

    // Identifies the TILT Hydrometer available
    tilt = {
        "a495bb10c5b14b44b5121370f02d74de": "Red",
        "a495bb20c5b14b44b5121370f02d74de": "Green",
        "a495bb30c5b14b44b5121370f02d74de": "Black",
        "a495bb40c5b14b44b5121370f02d74de": "Purple",
        "a495bb50c5b14b44b5121370f02d74de": "Orange",
        "a495bb60c5b14b44b5121370f02d74de": "Blue",
        "a495bb70c5b14b44b5121370f02d74de": "Pink"
    };

    if (tilt[bleacon.uuid] != null) {
        console.log(buildPayload(bleacon));
    }
});

Bleacon.startScanning();
