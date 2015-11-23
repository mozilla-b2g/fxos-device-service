# fxos-device-service

[![Build
Status](https://travis-ci.org/mozilla-b2g/fxos-device-service.png?branch=master)](https://travis-ci.org/mozilla-b2g/fxos-device-service)
[![npm
version](https://badge.fury.io/js/fxos-device-service.svg)](https://badge.fury.io/js/fxos-device-service)

A RESTful web service that exposes interactions with a connected Firefox OS device

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

#### POST /events

Trigger a series of sequential low-level touch interactions. The client is
expected to write a JSON array of event objects for which to sequentially
execute. See the syntax for `POST /events/:event` for event object schema.

#### POST /events/:event

Trigger a low-level touch-related interaction. The client is expected to write a
JSON object with event-related properties which control the trigger details.

Valid event types and their JSON properties:

+ `doubletap`
  + _x_, X-axis coordinate
  + _y_, Y-axis coordinate
+ `drag`
  + _x_, X-axis coordinate to start drag
  + _y_, Y-axis coordinate to start drag
  + _endX_, X-axis coordinate to end drag
  + _endY_, Y-axis coordinate to end drag
  + _duration_, time in milliseconds for drag to elapse
+ `keydown`
  + _code_, keycode for the key press
+ `keyup`
  + _code_, keycode for the key release
+ `reset`, __needs no parameters__
+ `sleep`
  + _duration_, time in milliseconds to wait before next event invocation.
    Useful when triggering many events in a single request.
+ `tap`
  + _x_, X-axis coordinate
  + _y_, Y-axis coordinate

Example:

```sh
curl \
  -H 'Content-Type: application/json' \
  -X POST \
  'http://localhost:8080/events/tap' \
  --data-binary '{"x":100,"y":200}'
```

#### GET /files?filepath=&lt;filepath&gt;

Download a file from device. Use the `filepath` query parameter to specify the
location of the file to download.

#### PUT /files?filepath=&lt;filepath&gt;

Upload a file to device. Use the `filepath` query parameter to specify the path
destination of the uploaded file. The uploaded file should sent via
`multipart/form-data`. A file permissions `mode` may also be set during upload.

Examples:

```sh
# Will upload myfile.txt to /data/local/myfile.txt
curl \
  -X PUT
  -F 'upload=@myfile.txt'
  'http://localhost:8080/files?filepath=/data/local/myfile.txt'
```

```sh
# Will upload image.jpg to /data/local/image.jpg with 777 permissions
curl \
  -X PUT
  -F 'upload=@image.jpg'
  -F 'mode=777'
  'http://localhost:8080/files?filepath=/data/local/image.jpg'
```

```sh
# Will upload script.sh to /data/local/script.sh with executable permissions
curl \
  -X PUT
  -F 'upload=@script.sh'
  -F 'mode=+x'
  'http://localhost:8080/files?filepath=/data/local/script.sh'
```

#### GET /logs

Pipe logs from logcat to the connected client.

#### POST /logs

Write a log to the adb-connected device. The client is expected to write
a JSON object in the request body with the following fields:

+ _message_, required
+ _priority_, optional, defaults to `i`
+ _tag_, optional, defaults to `DeviceService`

#### DELETE /logs

Clear all logcat logs on adb-connected device.

#### DELETE /processes/:pid

Delete the process given by *pid* parameter.

#### GET /properties

Retrieve a JSON object of all the device properties and their associates values.

#### GET /properties/:id

Retrieve the value of a device property specified by the `:id` url parameter.

#### POST /properties

Set the values of a collection device properties. The client is expected to
write a JSON object which contains a dictionary of property names to values.

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
