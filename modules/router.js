function route(handle, pathname, response, mobile) {
	// console.log("About to route a request for " + pathname);

	if(mobile && pathname=="/")
		pathname = "/mobile";

	if (typeof handle[pathname] === 'function' ) { 
		handle[pathname](response);
	} else if( /\/js/i.test(pathname) ) {
		handle['/js'](pathname, response);
	} else if( /\/css/i.test(pathname) ) {
		handle['/css'](pathname, response);
	} else if( /\/flash/i.test(pathname) ) {
		handle['/file'](pathname, response);
	} else if( /\/img/i.test(pathname) ) {
		handle['/file'](pathname, response);
	} else if( /\/mobile/i.test(pathname) ) {
		handle['/file'](pathname, response);
	} else { 
		console.log( "No request handler found for " + pathname ); 
		
	    response.writeHead(200, {"Content-Type": "text/plain"});
	    response.write("404 Not found");
	    response.end();
	}
}

exports.route = route;