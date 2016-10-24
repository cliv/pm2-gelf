pm2-gelf
=================

An quick and dirty library to redirect your [PM2](http://pm2.io) logs to a [GELF](http://docs.graylog.org/en/latest/pages/gelf.html) input stream

* Heavily based on [https://github.com/dfrankland/pm2-loggly](https://github.com/dfrankland/pm2-loggly)
* Uses [https://github.com/robertkowalski/gelf-node](https://github.com/robertkowalski/gelf-node) to output to GELF

## Installation

Tested on node-4.5.x, requires pm2.

```sh
  pm2 install pm2-gelf
```

## Configuration

This module has multiple configuration variables, all fed into gelf-node

- "graylogPort": The UDP port to send gelf messages to (Default: 12201)
- "graylogHostname": The hostname of the GELF input (Default: '127.0.0.1')
- "connection": Lan or Wan - The connection type (Default: 'wan')
- "maxChunkSizeWan": The largest chunk to send via WAN (Default: 1420)
- "maxChunkSizeLan": The largest chunk to sent via LAN (Default: 8154)


After having installed the module:

```sh
  pm2 set pm2-gelf:<param> <value>
```

Examples:

```sh
  pm2 set pm2-gelf:graylogHostname my.cool.host
  pm2 set pm2-gelf:graylogPort 12345
```
