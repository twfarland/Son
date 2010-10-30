#SON

'Style Object Notation'
Converts JSON to CSS.
Inspired by [Sass](http://sass-lang.com),
but intended as a more javascript-native solution for manageable css

Released under the MIT license.
Creator: [Tim Farland](http://timfarland.com)


##What can Son do?

###Son lets you use pure JSON to describe css stylesheets

Because of this, styles can be altered using normal js, and no
special constructs like 'mixins' are required. This opens up many possibilities for defining, transporting, and manipulating styles.

Son is designed for those comfortable with both css and basic js.

- Selectors and property fragments may be nested, as in Sass
- CommonJS-ready
- You can store the style json wherever you want, but I found it convenient to make separate .js files for my stylesheets, and use routes to 
return the corresponding css.
- Also works clientside (but I wouldn't really use it for that)

For example:

    //mystyles.son.js

    (function(){

    var myColour = '#ff0000';

    var teststyles = {
      "$#navbar" : {
        width : "80%",
        height : "23px",
       "$ul" : {
          list : {
            "style-type" :  "none"
           }
        },
        "$li" : {
            float : "left",
            border : "1px solid " + myColour,
            padding : "10px",
            "$a" : {
                "font-weight" : "bold",
                color : myColour
            }
        }
    };

    return teststyles;

    })(); 

Is returned as: 

    /*mystyles.son.css*/

    #navbar { 
 	width: 80%;
 	height: 23px;
    }
    #navbar ul { 
 	list-style-type: none;
    }
    #navbar li { 
 	float: left;
 	border: 1px solid #ff0000;
 	padding: 10px;
    }
    #navbar li a { 
 	font-weight: bold;
 	color: #ff0000;
    }

###Prefix any key you want treated as a css selector with `$`

e.g:

	"$div" : { --PROPERTIES-- }

Otherwise, it will be considered a css property name.

The first version of son had selector matching logic but I removed it because explicit declaration makes it much faster, and less affected by changing web standards.
   

##Usage

Son was designed with with [Node.js](http://nodejs.org) / [Express](http://express.js.com), but it theory, it can be used with any serverside js implementation.

You dont need to do any 'watch' commands, just put the son.js file in your node lib folder and require it:

   var son = require('./son');

Then, use son.jsonToCss() to convert your json style object to a css string:

    var css = son.jsonToCss({ STYLE OBJECT });

sonNodeTest.js shows an example that uses an Express route to get the json from an external .js file and return a css file:

    /* sonNodeTest.js */

    var http = require('http')
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
 

##Manipulation

Sass-style manipulation like mixins, variables, and inheritance can just be done by manipulating the styles object.

These examples are very low-level and you could manipulate the styles in more exciting ways, 
but I'm sure you guys would have have no problem coming up with your own ideas for that,
 because manipulation can be done with plain javascript. I might make some simple manipulation functions
for my own use anyway, so I'll add them later. But for now, a nice FP library like 
[underscore.js](http://documentcloud.github.com/underscore/) may be able to do what you need.

###Variables

    var myColour = '#333';

    var myStyles = {
        "$div" : {
            border : '1px solid ' + myColour,
            color : myColour
        }
    };

###Mixins       

    var myShadow = function(colour){
        return {
            "-moz-box-shadow" : "2px 2px 2px " + colour,
            "-webkit-box-shadow" : "2px 2px 2px " + colour,
            "box-shadow" : "2px 2px 2px " + colour
        };
    };

    var myStyles = {
        "$div" : {
            border : '1px solid #ccc'
        }
    };

    //i.e. using underscore.js .extend() func:
    _.extend(myStyles["$div"], myShadow("#333"));

###Assigning multiple properties to the same value

    var myStyles = {
        "$myDiv" : {
            "box, -moz-box, -webkit-box" : {
                shadow: "2px 2px 2px #666"
            }
        }
    };


###Other ideas for manipulation

- a grid system
- colour maths
- style generator functions
- using js object inheritance to generate style objects
- merging style objects in the manner of stylesheet 'import' to benefit from modular css without extra http requests
- layout/css framework generators


##Gotchas

We're trying to make json act like css here, so there are some extra things we need to do to avoid conflicts. I will code around some of these later, but you can use Son now if you take some simple safety measures:


1 ] Because json keys must be unique at each level, you can't redeclare a selector as you can in raw css. To get around this, place some characters within `{}` to give uniqueness. The curly brackets and their contents will be ignored by the parser.. 

e.g: `".myClass{}"` overrides `".myClass"`

e.g: `".myClass{uniqueid}"` overrides `".myClass"` 


2 ] To avoid certain characters being treated as js directives, you need to wrap some things in quotes:

- Selectors that start with: `.`, `#`, `*`, `[`, `~`, `+`, `:`, `>`, `@`

e.g: `".myClass"`, `":hover"`

- Propeties that contain dashes

e.g: `"font-size"`, `"list-style-type"`

- Values that are mixtures of integers / strings / special characters:

e.g: `"100%"`, `"40px"`



##If you're not sure:

- Wrap every key/value in quotes


##Dev to do

- Convert the other way, from css to son (so people can bring in existing stylesheets)
- Debug report mode
- Do some kind of caching, using real css files created w. node.js


##Other to do

- demos, docs, site


##Changelog

24.09.10 

- Uniqueness identifiers now use curly brackets instead of pipes. 
- Added support for multiple (comma-separated) selectors.

27.09.10

- Added conversion time notification.
- Changed for loops to js 1.6 forEach method where possible.
- Removed all css selector matching logic. Now you must prefix anything to be treated as a css selector with '$', otherwise it will be considered a css property. This makes conversion much faster.

31.10.10

- Cleaned and speeded up son.js code a bit
- Added support for multiple property declarations
- Added son versions of blueprint css 'reset' and 'typography' sheets.

##Authors

Son.js was created by [Tim Farland](http://www.timfarland.com), a web product designer based in Berlin.

##Disclaimer

This is experimental code! I can't guarantee that it won't change or break something in your app. Don't sue me.
