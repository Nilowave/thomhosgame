var server = require(__dirname + "/modules/server");
var router = require(__dirname + "/modules/router");
var requestHandlers = require(__dirname + "/modules/requestHandlers");

var handle = {};

handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/mobile"] = requestHandlers.mobile;
handle["/js"] = requestHandlers.js;
handle["/css"] = requestHandlers.css;
handle["/file"] = requestHandlers.flash;

server.start(router.route, handle);
