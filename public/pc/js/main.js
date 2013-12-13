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


}

APP.gameloaded = function() {
	$('preloader').dispose();
}