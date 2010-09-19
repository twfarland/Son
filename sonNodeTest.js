var 	http = require('http')
	,fs = require('fs')
	,sys = require('sys')
	,son = require('./son')
	,app = require('express').createServer();


var Script = process.binding('evals').Script;


//Routes *.son.css to the corresponding *.son.js
app.get('/*:file?.son.css', function(req, res){	
	
	fs.readFile('./' + req.params.file + ".son.js", function (err, sonToParse) {

	  	if (err) throw err; 

		res.send(
			son.jsonToCss( 
				Script.runInThisContext(sonToParse.toString("utf8"))
			), 
			{ 'Content-Type': 'text/css' }, 201
		); 

	});	
	
});


app.listen(3000);

