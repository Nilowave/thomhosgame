var app = require("http");
var url = require("url");
var io  = require("socket.io");
var fs  = require('fs');

function start(route) {
  function onRequest(request, response) {
    var pathname = url.parse(request.url).pathname;
    // console.log("Request for " + pathname + " received.");

    route(pathname);

    response.writeHead(200, {"Content-Type": "text/plain"});
    response.write("Hello World");
    response.end();
  }

  app.createServer(onRequest).listen(8888);
  console.log("Server has started.");

  io.listen(app)

  io.sockets.on('connection', function (socket) {
    socket.emit('news', { hello: 'world' });
    socket.on('my other event', function (data) {
      console.log(data);
    });
  });
}

exports.start = start;

