# fxos-device-service

[![Build Status](https://travis-ci.org/mozilla-b2g/fxos-device-service.png?branch=master)](https://travis-ci.org/mozilla-b2g/fxos-device-service)

A web service that exposes interactions with a connected Firefox OS device

### API

#### GET /

Status message that shows whether the service is running.

#### GET /info

Information about connected device including adb device id and gaia
commit.

#### GET /log

Pipe logs from logcat to the connected client.

#### GET /crashes

List ids of crash reports on device.

#### GET /crashes/:id

Download the crash dump with the parameter crash *id*.

#### POST /restart?hard=(true|false|0|1)

Restarts b2g process running on device. If the url parameter *hard* is
`true` or `1`, then the device will be restarted instead.

#### POST /connection/:port

Open a tcp connection to the parameter *port*. Returns a port on the
host machine that is proxied to that device port.

#### DELETE /connection/:port

Close the device tcp connection previously opened on the parameter
*port*.
