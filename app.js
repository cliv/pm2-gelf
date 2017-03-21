/* eslint-disable no-alert, no-console */
'use strict';
const pm2 = require('pm2');
const pmx = require('pmx');
const os = require('os');
const hostname = os.hostname();

const conf = pmx.initModule();

var Gelf = require('gelf');
var gelf = new Gelf({
    graylogPort: conf.graylogPort,
    graylogHostname: conf.graylogHostname,
    connection: conf.connection,
    maxChunkSizeWan: conf.maxChunkSizeWan,
    maxChunkSizeLan: conf.maxChunkSizeLan
});

pm2.Client.launchBus(function(err, bus) {
    if (err) return console.error('PM2 Loggly:', err);

    console.log('PM2 GELF Connector: Bus connected, sending logs to ' + conf.graylogHostname + ':' + conf.graylogPort);

    bus.on('log:out', function(log) {
        if (log.process.name !== 'pm2-gelf') {
            // console.log(log.process.name, log.data);
            // Log to gelf
            var message = {
                'version': '1.1',
                'host': hostname,
                'timestamp': (log.at / 1000),
                'short_message': log.data,
                'level': 1,
                'facility': log.process.name
            };
            gelf.emit('gelf.log', message);
        }
    });

    bus.on('log:err', function(log) {
        if (log.process.name !== 'pm2-gelf') {
            // console.error(log.process.name, log.data);
            // Log to gelf
            var message = {
                'version': '1.1',
                'host': hostname,
                'timestamp': (log.at / 1000),
                'short_message': log.data,
                'level': 3,
                'facility': log.process.name
            };
            gelf.emit('gelf.log', message);
        }
    });

    bus.on('reconnect attempt', function() {
        console.log('PM2 GELF Connector: Bus reconnecting');
    });

    bus.on('close', function() {
        console.log('PM2 GELF Connector: Bus closed');
        pm2.disconnectBus();
    });
});
