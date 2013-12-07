var server = require("./modules/server");
var router = require("./modules/router");
var requestHandlers = require("./modules/requestHandlers");

var handle = {};

handle["/"] = requestHandlers.start;
handle["/start"] = requestHandlers.start;
handle["/mobile"] = requestHandlers.mobile;
handle["/js"] = requestHandlers.js;
handle["/css"] = requestHandlers.css;
handle["/file"] = requestHandlers.flash;

server.start(router.route, handle);
