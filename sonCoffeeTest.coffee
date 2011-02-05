http    = require 'http'
fs      = require 'fs'
sys     = require 'sys'
son     = require './son'
app     = require('express').createServer()

Script = process.binding('evals').Script

app.get( '/*:file?.son.css', (req, res) ->

    fs.readFile( './' + req.params.file + ".son.js", (err, sonToParse) ->	

        res.send( 
            son.jsonToCss( 
                Script.runInThisContext( 
                    sonToParse.toString("utf8")
                )
            ), 
            { 'Content-Type': 'text/css' }, 
            201
        )
    )
)

app.listen 3000
console.log 'Server running at http://localhost:3000/'
