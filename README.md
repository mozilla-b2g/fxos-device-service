# fxos-device-service

[![Build
Status](https://travis-ci.org/mozilla-b2g/fxos-device-service.png?branch=master)](https://travis-ci.org/mozilla-b2g/fxos-device-service)
[![npm
version](https://badge.fury.io/js/fxos-device-service.svg)](https://badge.fury.io/js/fxos-device-service)

A RESTful web service that exposes interactions with a connected Firefox OS device

### API Methods

#### `GET /`

Status message that shows whether the service is running.

#### `GET /devices[?host=<host>&port=<port>]`

List IDs and serial numbers of adb-attached devices. Can optionally specify a
remote `host` and `port` for which the device is connected.

#### `GET /devices/:id`

Fetch details about the device whose session ID is the parameter `id`.

#### `POST /devices/:id/connections/:port`

Open a tcp connection to the parameter `port`. Returns a port on the
host machine that is proxied to the device's port.

#### `DELETE /devices/:id/connections/:port`

Close the device tcp connection previously opened on the parameter
`port`.

#### `GET /devices/:id/crashes`

List IDs of crash reports on device.

#### `GET /devices/:id/crashes/:crashId`

Download the crash dump with the parameter crash `crashId`.

#### `POST /devices/:id/events`

Trigger a series of sequential low-level touch interactions. The client is
expected to write a JSON array of event objects for which to sequentially
execute. See the syntax for `POST /events/:event` for event object schema.

#### `POST /devices/:id/events/:event`

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
  'http://localhost:8080/devices/abcdef0123456789/events/tap' \
  --data-binary '{"x":100,"y":200}'
```

#### `GET /devices/:id/files?filepath=<filepath>`

Download a file from device. Use the `filepath` query parameter to specify the
location of the file to download.

#### `PUT /devices/:id/files?filepath=<filepath>`

Upload a file to device. Use the `filepath` query parameter to specify the path
destination of the uploaded file. The uploaded file should sent via
`multipart/form-data`. A file permissions `mode` may also be set during upload.

Examples:

```sh
# Will upload myfile.txt to /data/local/myfile.txt
curl \
  -X PUT
  -F 'upload=@myfile.txt'
  'http://localhost:8080/devices/abcdef0123456789/files?filepath=/data/local/myfile.txt'
```

```sh
# Will upload image.jpg to /data/local/image.jpg with 777 permissions
curl \
  -X PUT
  -F 'upload=@image.jpg'
  -F 'mode=777'
  'http://localhost:8080/devices/abcdef0123456789/files?filepath=/data/local/image.jpg'
```

```sh
# Will upload script.sh to /data/local/script.sh with executable permissions
curl \
  -X PUT
  -F 'upload=@script.sh'
  -F 'mode=+x'
  'http://localhost:8080/devices/abcdef0123456789/files?filepath=/data/local/script.sh'
```

#### `GET /devices/:id/logs`

Pipe logs from logcat to the connected client.

#### `POST /devices/:id/logs`

Write a log entry to the device. The client is expected to write a JSON object
in the request body with the following fields:

+ _message_, required
+ _priority_, optional, defaults to `i`
+ _tag_, optional, defaults to `DeviceService`

#### `DELETE /devices/:id/logs`

Clear all logcat logs on the device.

#### `DELETE /devices/:id/processes/:pid`

Stop the process given by `pid` parameter.

#### `GET /devices/:id/properties`

Retrieve a JSON object of all the device properties and their associates values.

#### `GET /devices/:id/properties/:property`

Retrieve the value of a device property specified by the `property` url parameter.

#### `POST /devices/:id/properties`

Set the values of a collection device properties. The client is expected to
write a JSON object which contains a dictionary of property names to values.

#### `POST /devices/:id/restart?hard=(true|false|0|1)`

Restarts b2g process running on device. If the url parameter `hard` is
`true` or `1`, then the device will be restarted instead.
