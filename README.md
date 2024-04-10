# http-server-node-js
Pure Javascript HTTP Server based on Node.js from scratch.

Zero libraries, zero dependencies, zero ChatGPT, 100% man made and DIY.

---
This is my original Node.js JavaScript solutions to the
["Build Your Own HTTP server" Challenge](https://app.codecrafters.io/courses/http-server/overview).

[![progress-banner](https://backend.codecrafters.io/progress/http-server/bfca46c3-f83f-4fc0-97d6-dc95608ab3a3)](https://app.codecrafters.io/users/codecrafters-bot?r=2qF)


[HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) is the
protocol that powers the web. In this challenge, you'll build a HTTP/1.1 server
that is capable of serving multiple clients.

This server is made only on top of native Node.js 18 API, except for its builtin HTTP Server, meaning that it is a pure TCP server, and it can parse and serve concurrent
[HTTP/1.1](https://www.w3.org/Protocols/rfc2616/rfc2616-sec5.html) requests, and more.

As a zero dependency node.js app (ie a purely naked script), it does not need any `package.json` file.

Just launch it by
```sh
$ node app/main.js [--directory <staticFilesDirectory>]
```
---
Pretty frustrating to have to write that in JS for Node.js (CommonJS)...

I may be tempting to rewrite it in TS for Bun. To be continued...
