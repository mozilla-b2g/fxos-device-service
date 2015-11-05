# fxos-device-service

[![Build Status](https://travis-ci.org/mozilla-b2g/fxos-device-service.png?branch=master)](https://travis-ci.org/mozilla-b2g/fxos-device-service)

A web service that exposes interactions with a connected Firefox OS device

### API Methods

#### GET /

Status message that shows whether the service is running.

#### POST /connections/:port

Open a tcp connection to the parameter *port*. Returns a port on the
host machine that is proxied to that device port.

#### DELETE /connections/:port

Close the device tcp connection previously opened on the parameter
*port*.

#### GET /crashes

List ids of crash reports on device.

#### GET /crashes/:id

Download the crash dump with the parameter crash *id*.

#### GET /devices

List ids of adb-attached devices.

#### GET /devices/:id

Fetch details about the device whose adb id is the parameter *id*.

#### GET /device

Fetch details about a device. The service will look at the request
headers (particularly `X-Session-Id` or `X-Android-Serial`) to
figure out which device to report about.

#### GET /logs

Pipe logs from logcat to the connected client.

#### POST /logs

Write a log to the adb-connected device. The client is expected to write
a JSON object in the request body with the following fields:

+ _message_, required
+ _priority_, optional, defaults to `i`
+ _tag_, optional, defaults to `DeviceService`

#### DELETE /processes/:pid

Delete the process given by *pid* parameter.

#### POST /restart?hard=(true|false|0|1)

Restarts b2g process running on device. If the url parameter *hard* is
`true` or `1`, then the device will be restarted instead.

### Request headers

#### X-Session-Id

We store a map from session ids to sessions on the server. The `X-Session-Id`
request header allows you to make a request using details from an
existing session which are stored on the server. Every request response
comes with an `X-Session-Id` header.

#### X-Android-Serial

The `X-Android-Serial` header allows you to specify that a certain adb
device id should be used when multiple devices are connected to the host
machine.

#### X-Remote-Host

The `X-Remote-Host` header specifies a remote host for any commands
issued via adb to use during this request.

#### X-Remote-Port

The `X-Remote-Port` header specifies a device port for any commands
issued via adb to use during this request.
