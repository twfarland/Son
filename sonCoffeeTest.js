(function() {
  var Script, app, fs, http, son, sys;
  http = require('http');
  fs = require('fs');
  sys = require('sys');
  son = require('./son');
  app = require('express').createServer();
  Script = process.binding('evals').Script;
  app.get('/*:file?.son.css', function(req, res) {
    return fs.readFile('./' + req.params.file + ".son.js", function(err, sonToParse) {
      return res.send(son.jsonToCss(Script.runInThisContext(sonToParse.toString("utf8"))), {
        'Content-Type': 'text/css'
      }, 201);
    });
  });
  app.listen(3000);
  console.log('Server running at http://localhost:3000/');
}).call(this);
