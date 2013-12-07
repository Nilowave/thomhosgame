var APP = APP || {};

APP.DATA = {};

APP.main = function() {
	
	APP.game = new Swiff("flash/game.swf", {
		id: 'theGame',
	    width: "1280",
	    height: "720",
	    params: {
	        wMode: 'transparent',
	        bgcolor: '#1e1e1e'
	    },
	    vars: {
	    },
	    callBacks: {
	    }
	});

	APP.game.inject( $("gameContainer") )

	/*
	var socket = io.connect('http://192.168.2.1:8888');
	socket.emit('start session');
	socket.on('new session', function (data) {
		console.log(data.id);
		$$('.code')[0].set('text', data.id)		
	});

	socket.on('paired', function (data) {
		APP.DATA = data;
		alert("Pairing complete. Lets start the game")
	});
	*/

}