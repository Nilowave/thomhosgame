var http = require("http");
var url = require("url");
var io  = require("socket.io");

var websocket;
var socketSessions = {};
var isMobile = false;

console.log('Version: ' + process.version);

function start(route, handle) {
	function onRequest(request, response) {

		var ua = request.headers['user-agent'];
		// console.log(ua)
		var mobile = false;

		if ( /mobile/i.test(ua) || /Android/.test(ua) || /WPDesktop/.test(ua) ) {
			mobile = true;
		}
		
		var pathname = url.parse(request.url).pathname;

		route ( handle , pathname , response, mobile );	
		

	}

	var httpserver = http.createServer(onRequest).listen(80);

  	websocket = io.listen(httpserver);

  	// websocket.set('log level', 2);

	websocket.configure(function() {
	  websocket.set('transports', ['websocket','flashsocket']);
	  websocket.set('flash policy port', 843);
	});
	
	websocket.on('connection', function (socket) {
console.log('connect '+socket.id)
// console.log(websocket.sockets)
		socket.on('disconnect', function (s) { 
			cleanup(socket.id);
	    	console.log("disconnected " + socket.id)
		});

		socket.on('client connect', function (data) { 
			console.log(socketSessions)
	    	if(socketSessions[data.id]) {
		    	socketSessions[data.id].client = socket.id;
		    	socket.join(data.id);
		    	// console.log(socketSessions[data.id])
		    	websocket.sockets.in(data.id).emit('paired', socketSessions[data.id]);
		    } else {
		    	console.log('NO HOST FOUND FOR GAME: '+data.id)
		    	socket.emit('host not found');	
		    }
		});

		socket.on('start session', function(){
			console.log('start session')
			var session = randomString(4);
		    while( socketSessions[session] ) {
		    	session = randomString(4);
		    }
		    socketSessions[session] = {'host':socket.id, id:session, client:'none'};
		    socket.emit('new session', { id: session });
		    socket.join(session);
		});

	    socket.on("TO_CLIENT", function(data){
	    	if ( websocket.sockets.clients(data.session.id).length ) {
		    	websocket.sockets.in(data.session.id).emit('TO_CLIENT', {session:data.session, scene:data.scene, msg:data.msg});
		    } else {
		    	socket.emit('ERROR', { msg: "none / wrong game ID: '" +data.session.id+"'" });
		    }
	    });

	    socket.on("INTRO:start", function(data) {
	    	if ( websocket.sockets.clients(data.id).length ) {
		    	websocket.sockets.in(data.id).emit('INTRO:start', {session:data.id});
		    } else {
		    	socket.emit('ERROR', { msg: "none / wrong game ID: '" +data.id+"'" });
		    }
	    });

	    socket.on("INTRO:startgame", function(data) {
	    	websocket.sockets.in(data.id).emit('INTRO:startgame', {session:data.id});
	    });

	    socket.on("GAME", function(data) {
	    	if ( websocket.sockets.clients(data.id).length ) {
		    	websocket.sockets.in(data.id).emit('GAME', {session:data.id, event: data.event, data:data.data});
		    } else {
		    	socket.emit('ERROR', { msg: "none / wrong game ID: '" +data.id+"'" });
		    }
	    });

	    socket.on("orientation", function(data){
	    	console.log(data)
	    })

	});

  
  	console.log("Sockets listening has stared");
    
}

function cleanup(socket) {
    console.log("\n");
    console.log(socketSessions);
    for(var s in socketSessions) {
    	if(socket == socketSessions[s].host) {
    		console.log("HOST DISCONNECT: CLEANUP => " + socket);
    		delete socketSessions[s];
    	}
    }
    console.log(socketSessions);

}


function randomString(length) {
	var chars = 'ABCDEFGHIJKLMNPQRSTUWYZ';//'123456789ABCDEFGHIJKLMNPQRSTUWYZ';
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}


exports.start = start;