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
