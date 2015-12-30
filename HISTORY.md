### 4.2.0

+ Add GET `/devices/:id/profile`
+ Add POST `/devices/:id/profile`

### 4.1.1

+ Replace linux adb binary with one that works on ubuntu 15.10

### 4.1.0

+ Added CORS headers to all responses to improve in-browser API access.

### 4.0.0

+ Device-contextual routes are now organized under the `/devices/:id` API.
+ `/device` route removed in favor of `/devices/:id`.
+ Removed necessity of all request headers.
+ Search for devices on remote hosts with `/devices?host=<host>&port=<port>`
+ ID in `/devices/:id` is now a device session ID, not device serial number.

### 3.0.0

+ BREAKING CHANGE: Invalid post data now responds with HTTP 422 instead of 500.
+ Add `POST /events` to trigger low-level touch-related interactions.
+ Add `GET /files` to download and stream a file from a device destination.
+ Add `PUT /files` to upload a file to a destination on device.
+ Add `GET /processes` to fetch information about one or many B2G processes.
+ Add `GET /properties` to retrieve one or many properties from `getprop`.
+ Add `POST /properties` to set the value of a device property.
+ Added Gecko revision to data returned from `/device`.
+ Added display interface information to data returned from `/device`.
+ Added ability to set file permissions on uploaded files.
+ Fixed session creation which would not correctly hydrate a previous session.

### 2.1.0

+ Add `DELETE /logs` to clear device logs.
+ `GET /logs` will now only write future logs if the android sdk is 22
  or later.

### 2.0.0

Thanks to more great patches from @eliperelman, we've now cleaned up a
lot of the server's internals and organized all of our test cases! In
addition, we've added `DELETE /processes/:pid` and `POST /logs`. We also
changed the previous `/connection` endpoint to `/connections` and the
previous `/log` endpoint to `/logs` in the spirit of keeping the urls RESTful.

### 1.0.0

Thanks to a superhero effort from @eliperelman, we now have

+ `/devices`, `/devices/:id`, and `/device` instead of `/info`
+ Session support
+ Multiple connected device support
+ Remote adb host support

### 0.1.0

+ Add `GET /crashes` and `GET /crashes/:id` to service api.

### 0.0.1

+ Initial implementation for v0.0 API.
+ Only works with a single device at a time.
+ Does not work across platforms. For instance, you need unix `unzip`.
