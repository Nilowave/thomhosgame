var fs = require("fs");

var exec = require("child_process").exec;

function start (response) { 
	// console.log ( "Request handler 'start' was called." ); 
	
	fs.readFile(__dirname + '/../public/pc/views/index.html', function (err, html) {
	    if (err) {
	        throw err; 
	    }       
	    
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
	});

} 

function mobile(response) { 
	// console.log ( "Request handler 'mobile' was called." ); 
	fs.readFile(__dirname + '/../public/mobile/views/index.html', function (err, html) {
	    if (err) {
	        throw err; 
	    }       
	    
        response.writeHeader(200, {"Content-Type": "text/html"});  
        response.write(html);  
        response.end();  
	});
} 

function js(pathname, response) { 
	// console.log(pathname)

	fs.readFile(__dirname + '/../public'+pathname, function (err, html) {
	    if (err) {
	        throw err; 
	    }       
	    
        response.writeHeader(200, {"Content-Type": "text/javascript"});  
        response.write(html);  
        response.end();  
	});
}
function css(pathname, response) { 
	// console.log(pathname)

	fs.readFile(__dirname + '/../public'+pathname, function (err, html) {
	    if (err) {
	        throw err; 
	    }       
	    
        response.writeHeader(200, {"Content-Type": "text/css"});  
        response.write(html);  
        response.end();  
	});
}
function file(pathname, response) { 
	// console.log(pathname)

	fs.readFile(__dirname + '/../public'+pathname, function (err, swf) {
	    if (err) {
	        throw err; 
	    }       
	    
        response.writeHeader(200);
        response.write(swf);
        response.end();
	});
}

exports.start = start;
exports.mobile = mobile;
exports.js = js;
exports.css = css;
exports.flash = file;