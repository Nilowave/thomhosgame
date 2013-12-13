var APP = APP || {};

/* APP CONSTANTS */
APP.DATA = {};
APP.socket;
APP.combo;
APP.cTime = 500;
APP.unlocked = 0;
APP.cooldownMultiplier = 50;

APP.emit = function(name, options) {
	// APP.emit('GAME:input_move', { id: APP.session, type: type, 'direction': direction });
	if(APP.socket) {
		if(name.split(':')[0] == "GAME") {
			var id = options.id;
			delete options.id;
			APP.socket.emit("GAME", {id: id, event:name.split(':')[1], data:options} );
		} else {
			APP.socket.emit(name, options);
		}
	}
}


APP.main = function() {
	// deleteCookie('test')


	console.log( getCookie('test') )
	// APP.introActions('init');

	// return;

	if( !getCookie('skipintro') ) {
		createCookie('skipintro', 'false', 1);
	} else {
		if(getCookie('skipintro') == 'false');
		createCookie('skipintro', 'true', 1);
		APP.skipintrp = true;
	}

	// APP.introActions("init");
	// return;
	
	APP.socket = io.connect('http://192.168.2.1:8888');

	APP.socket.on('paired', function (data) {
		console.log('pairing success')
		$$('a.btnSet')[0].dispose();
		APP.DATA = data;
		APP.session = data.id
		$('sessionID').set('value', "PAIRED");

		$('game').addClass('paired');
		$('orient').addClass('paired');

	});
	
	APP.socket.on('connection', function (data) {
		console.log('connection')
		console.log(data)
	});
	APP.socket.on('ERROR', function (data) {
		console.log('error')
		console.log(data)
	});

	APP.socket.on('host not found', function () {
		if ( !$('sessionID').hasClass('wrong'))
			$('sessionID').addClass('wrong')

		$$('a.btnSet')[0].removeClass('hide');
		// alert("Oops... I think you made a mistake there friend.\nThere is no game that goes by that code.\nPLEASE try that again okay.");
	});

	APP.socket.on('TO_CLIENT', function (data) {
		switch(data.scene) {
			case "INTRO":
				APP.introActions(data.msg);
				break;

			case "GAME":
				APP.gameActions(data.msg);
				break;
		}
	});

	$$('a.btnSet')[0].addEvents({
		'touchstart': function(e) {
	        // $('sessionID').blur();
			
			APP.session = String( $('sessionID').get('value') ).toUpperCase();
			console.log(APP.session)
	        if(APP.session.length) {
	        	$$('a.btnSet')[0].addClass('hide');
	        	console.log(APP.socket)
				// APP.socket.emit('client connect', { id: APP.session });
				APP.emit('client connect', { id: APP.session });
			} else {
				// console.log('enter code first!!')
			}
		},
		'click': function(e) {
	        // $('sessionID').blur();
			
			APP.session = String( $('sessionID').get('value') ).toUpperCase();
			console.log(APP.session)
	        if(APP.session.length) {
				// APP.socket.emit('client connect', { id: APP.session });
				APP.emit('client connect', { id: APP.session });
			} else {
				// console.log('enter code first!!')
			}
		}
	})

	// window.addEventListener("deviceorientation", APP.handleOrientation, true);

}

APP.introActions = function(msg) {
	// if($('sessionID')) $('sessionID').set('value', msg)

	switch(msg) {
		case "init":

			$('game').set('load', {
				url:"mobile/views/game.html",
				onComplete: APP.intro
			}).load();
			break;

		case "cue_pm":
		console.log("cue_pm")
			$$('#intro .init').addClass('hide');
			$$('#intro .cue').removeClass('hide');
			$$('#intro .cue').addClass('hide');
			$$('#intro .cue_pm').removeClass('hide');
			break;

		case "cue_londoner":
			$$('#intro .cue').removeClass('hide');
			$$('#intro .cue').addClass('hide');
			$$('#intro .cue_londoner').removeClass('hide');
			break;

		case "cue_ladiesman":
			$$('#intro .cue').removeClass('hide');
			$$('#intro .cue').addClass('hide');
			$$('#intro .cue_ladiesman').removeClass('hide');
			break;

		case "cue_instructions":
			$$('#intro .cue').removeClass('hide');
			$$('#intro .cue').addClass('hide');
			
			$$('.cue_instructions').removeClass('hide');
			
			$$('.cue_instructions a')[0].addEvents({
				'touchstart': function(e) {					
					$$('.cue_instructions a.btn_start')[0].addClass('hide');
					APP.emit('INTRO:startgame', { id: APP.session });
				}
			})

			break;
	}
}

APP.gameActions = function(msg) {

	switch(msg) {
		case "init":
			$$('#intro').addClass('hide');
			$$('#game_screen').removeClass('hide');
			APP.game();
			break;

		case "start":
			// console.log('game logics')
			break;
	}
}

APP.intro = function() {
	$$('#intro .init a').addEvents({
		'touchstart': function(e){
			e.stop();
			$$('#intro .init a').dispose();
			console.log(APP.session)
			APP.emit('INTRO:start', { id: APP.session });
		},
		'click': function(e){
			e.stop();
			console.log(APP.session)
			APP.emit('INTRO:start', { id: APP.session });
		}
	})
}

APP.game = function() {
	var busy = false;
	var currentPanel = $$('.panel')[0];
	
	APP.swipe;

	APP.Gestures = new Gestures();
	var r = Gestures.Readymade;
	
	APP.Gestures.register(r.right);
	APP.Gestures.register(r.left);
	APP.Gestures.register(r.up);
    APP.Gestures.register(r.down);

	APP.Gestures.addEvent('right', function(){
		APP.registerSwipe(currentPanel.get('rel'), "right");
	});
	APP.Gestures.addEvent('left', function(){
		APP.registerSwipe(currentPanel.get('rel'), "left");
	});
	APP.Gestures.addEvent('up', function(){
		APP.registerSwipe(currentPanel.get('rel'), "up");
	});
	APP.Gestures.addEvent('down', function(){
		APP.registerSwipe(currentPanel.get('rel'), "down");
	});

	APP.Gestures.start();

	window.addEventListener("deviceorientation", APP.handleOrientation, true);


	$$('.panel').addEvents({
		'touchstart': function() {
			if (busy || $('combo_timer').hasClass('KONAMI'))
				return;

			currentPanel = this;
			busy = true;
			var inner = this.getElement('.inner');
			inner.addClass('active');
			$$('.panel .inner').removeClass('tween');
			$$('.panel .inner').each(function(el){
				if(el != inner) {
					el.addClass('nonactive');
				}
			})
		},
		'touchend': function() {
			if(currentPanel != this)
				return;

			busy = false;
			var inner = this.getElement('.inner');
			inner.removeClass('active');
			$$('.panel .inner').addClass('tween');
			$$('.panel .inner').removeClass('nonactive');
		},
		'touchmove': function(e){
			e.preventDefault();
		}
	})
}

APP.handleOrientation = function(e) {
	var data = {}
	var move;
	data.beta = e.beta;

	if(e.beta > 15 && !APP.move) {
		move = "left";
		APP.move = move;
		APP.emit("GAME:move_thom", {id: APP.session, move:APP.move});
	}
	if(e.beta < -15 && !APP.move) {
		move = "right";
		APP.move = move;
		APP.emit("GAME:move_thom", {id: APP.session, move:APP.move});
		// APP.emit("orientation", "left");
	} 
	if(e.beta < 15 && e.beta > -15 && APP.move) {
		APP.move = null;
		APP.emit("GAME:move_thom", {id: APP.session, move:"stop"});
	}

}

APP.registerSwipe = function( type, direction) {
	APP.emit('GAME:input_move', { id: APP.session, type: type, 'direction': direction });
	APP.initCombo(type, direction);
	
}

APP.hideIcons = function() {
	$$('#combo_timer .icon img').removeClass('hide');
	$$('#combo_timer .icon img').addClass('hide');	
}
APP.setIcon = function(icon, animate) {
	if(animate == false) {
		return;
	}
	
	APP.hideIcons();

	switch(icon) {
		case "left":
			$$('#combo_timer .icon img.iLeft').removeClass('hide');
			break;
			
		case "up":
			$$('#combo_timer .icon img.iUp').removeClass('hide');
			break;
			
		case "down":
			$$('#combo_timer .icon img.iDown').removeClass('hide');
			break;

		case "right":
			$$('#combo_timer .icon img.iRight').removeClass('hide');
			break;

	}

	$$('#combo_timer .icon').setStyles({
		'width': 4,
		'height': 4,
		'margin-top': -2,
		'margin-left': -2
	});

	if( !$$('#combo_timer .icon').get('morph') ) {
	}
		$$('#combo_timer .icon').set('morph', {
			duration: 800,
			transition: Fx.Transitions.Elastic.easeOut
		})	
	
	$$('#combo_timer .icon').morph({
		'width': 50,
		'height': 50,
		'margin-top': -25,
		'margin-left': -25	
	})
	// $$('#combo_timer .icon').set('text', direction);
	
}
APP.initCombo = function(type, direction) {
	if(APP.comboCooldown) {
		console.log('cooling down the combo thumbs')
		return;
	}

	APP.setIcon(direction);
	$('combo_timer').removeClass('hide');
	
	$('combo_timer').addClass('bounce');

	if (!APP.combo)
		APP.combo = new Array();

	APP.combo.push({'type': type, 'direction':direction, uri: type + ":"+direction.toUpperCase()});

	if(APP.comboTween) {
		APP.cTime -= 25;
		$('combo_timer').addClass('combo');
		APP.comboTween.clear();
		APP.comboTween = new comboAnim();		
	} else {
		APP.comboTween = new comboAnim();		
	}

	APP.comboTween.onHide = function() {
		// console.log('hide')
		// $('combo_timer').addClass('hide');

	}
	APP.comboTween.trigger = function() {
		APP.comboCooldown = true;
		var cooldownTime = APP.cooldownMultiplier * APP.combo.length ;
		
		APP.registerCombo();
		APP.comboTween = null;
		$('combo_timer').removeClass('combo');
		APP.cTime = 500;
		setTimeout(function(){
			APP.comboCooldown = false;
		}, cooldownTime);
	}
	
	APP.comboTween.show(APP.cTime / 4); 


}

APP.registerCombo = function() {
	console.log('do combo')
	APP.emit('GAME:do_combo', { id: APP.session, combo: APP.combo });

	if (APP.isKONAMI() && APP.unlocked < 3) {
		APP.doKONAMI();
	}
	APP.combo = null;
}

APP.isKONAMI = function() {
	if( APP.combo.length != 8)
		return false;

	var KC = ["up","up","down","down","left","right","left","right"];

	for(var i = 0; i < 8; i ++) {
		if(APP.combo[i]['direction'] != KC[i])
			return false;
	}

	return true;
}

APP.doKONAMI = function() {
	
	$('combo_timer').addClass('KONAMI');
	$('combo_timer').addClass('B');
	APP.hideIcons();
	$$('#combo_timer .icon span')[0].set('text', "B");
	APP.Gestures.stop();

	$('combo_timer').addEvent('touchstart', function(e){
		if($('combo_timer').hasClass('B')) {
			$('combo_timer').removeClass('B');
			$('combo_timer').addClass('A');
			$$('#combo_timer .icon span')[0].set('text', "A");
		} else {
			$$('#combo_timer .icon span')[0].set('text', "");
			$('combo_timer').removeClass('A');
			$('combo_timer').removeClass('KONAMI');
			$('combo_timer').removeEvents();
			$('combo_timer').addClass('hide');
			APP.unlocked++;
			APP.Gestures.start();
			if(APP.unlocked == 3) {
				APP.emit('GAME:ultimate_KONAMI', { id: APP.session});
			} else {
				APP.emit('GAME:do_KONAMI', { id: APP.session});
			}
		}
	})
}

function comboAnim() {
	this.tween;
	this.tick;
	this.trigger;
	this.onHide;

	this.show = function(delay) {
		this.tick = -1;
		this.tween = setInterval(function(){
			if(!this.elements.length) {
				this.stop();
				return;
			}

			this.tick++;
			var stop;
			
			if(this.tick >= this.elements.length)
				var stop = this.stop();

			if(stop) {
				$('combo_timer').removeClass('bounce');
				if(this.trigger) {
					this.trigger();
					this.trigger = null;
				}
				this.hide(delay);
				return;
			}

			if(!this.elements[this.tick].hasClass('tick')) {
				this.elements[this.tick].addClass('tick');
			}

		}.bind(this), delay);
	}

	this.hide = function(delay) {
		$$('#combo_timer .icon img').removeClass('hide');
		$$('#combo_timer .icon img').addClass('hide');
		this.tick = -1;
		this.tween = setInterval(function(){
			if(!this.elements.length) {
				this.stop();
				return;
			}

			this.tick++;
			var stop;
			
			if(this.tick >= this.elements.length)
				var stop = this.stop();

			if(stop) {
				if(this.onHide) {
					this.onHide();
					this.onHide = null;
				}
				return;
			}

			if(this.elements[this.tick].hasClass('tick')) {
				this.elements[this.tick].removeClass('tick');
			}

		}.bind(this), delay);
	}

	this.stop = function() {
		clearInterval(this.tween);
		return true;
	}

	this.clear = function() {
		this.stop();
		this.trigger = null;
		this.onHide = null;
		this.elements = null;
		$$('#combo_timer .tier').removeClass('tick');
	}

	this.setElements = function() {
		return [
			$$('#combo_timer .tier4')[0],
			$$('#combo_timer .tier3')[0],
			$$('#combo_timer .tier2')[0],
			$$('#combo_timer .tier1')[0]
		];
	}

	this.elements = this.setElements();
}



function createCookie(name, value, expires, path, domain) {
  var cookie = name + "=" + escape(value) + ";";
 
  if (expires) {
    // If it's a date
    if(expires instanceof Date) {
      // If it isn't a valid date
      if (isNaN(expires.getTime()))
       expires = new Date();
    }
    else
      expires = new Date(new Date().getTime() + parseInt(expires) * 1000 * 60 * 60 * 24);
 
    cookie += "expires=" + expires.toGMTString() + ";";
  }
 
  if (path)
    cookie += "path=" + path + ";";
  if (domain)
    cookie += "domain=" + domain + ";";
 
  document.cookie = cookie;
}
function getCookie(name) {
  var regexp = new RegExp("(?:^" + name + "|;\s*"+ name + ")=(.*?)(?:;|$)", "g");
  var result = regexp.exec(document.cookie);
  return (result === null) ? null : result[1];
}
function deleteCookie(name, path, domain) {
  // If the cookie exists
  if (getCookie(name))
    createCookie(name, "", -1, path, domain);
}