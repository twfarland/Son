#SON

'Style Object Notation'
Converts JSON to CSS.
Inspired by [Sass](http://sass-lang.com),
but intended as a more javascript-native solution for manageable css
The original lib was written with the nice [RightJS](http://rightjs.org) library
but I ported those funcs to reduce dependencies (include, startsWith, 
and isHash functions.)

Released under the MIT license
Creator: [Tim Farland](http://timfarland.com)


##What can Son do?

Son's approach is to use pure JSON to describe css stylesheets. Because of this, styles can be altered using normal js, and no
special constructs like 'mixins' are required. This opens up many possibilities for defining, transporting, and manipulating styles.

Selectors and property fragments may be nested, as in Sass.

You can store the style json wherever you want, but I found it convenient to make separate .js files for my stylesheets, and use routes to 
return the corresponding css.

At this stage, it doesn't validate your css, you have to know css.

For example:

    //mystyles.son.js

    (function(){

    var teststyles = {
      "#navbar" : {
        width : "80%",
        height : "23px",
        ul : {
          list : {
            style : {
              type : "none"
            }
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
   

##Usage

Son was designed with with [Node.js](http://nodejs.org) / [Express](http://express.js.com), but it theory, it can be used with any serverside js implementation that supports CommonJS.

You dont need to do any 'watch' commands. 

Just put the son.js file in your node lib folder and require it:

   var son = require('./son');

Then, use son.jsonToCss() to convert your json style object to a css string:

    var css = son.jsonToCss({ STYLE OBJECT });

sonNodeTest.js shows an example that uses an Express route to get the json from an external .js file and return a css file:

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

Sass constructs like mixins, variables, and inheritance can be done by manipulating the style object.

These examples are very low-level and you could manipulate the styles in more exciting ways, 
but I'm sure you guys would have have no problem coming up with your own ideas for that,
 because manipulation can be done with plain javascript. I might make some simple manipulation functions
for my own use anyway, so I'll add them later. But for now, a nice FP library like 
[underscore.js](http://documentcloud.github.com/underscore/) may be able to do what you need.

###Variables

    var myColour = '#333';

    var myStyles = {
	div : {
            border : '1px solid ' + myColour,
            color : myColour
	}
    };

###Mixins       

    var myShadow = function(colour){
        var shad = {
	    "-moz-box-shadow" : "2px 2px 2px " + colour,
            "-webkit-box-shadow" : "2px 2px 2px " + colour,
            "box-shadow" : "2px 2px 2px " + colour
	};
    };

    var myStyles = {
	div : {
            border : '1px solid #ccc'
	}
    };

    //i.e. using underscore.js .extend() func:
    _.extend(myStyles.div, myShadow("#333"));

(But personally, I would use multiple css classes instead of mixins where possible)

###Selector inheritance

Doing this the way Sass does it (by using commas in the selector instead of repeating the properties) is very nice.
I'm going to make a method for this, something that traverses the tree. 

###Other ideas for manipulation

- a grid system
- colour maths
- style generator functions
- using proper classes to generate style objects
- merging style objects as needed to benefit from modular css without extra http requests used in stylesheet 'import'
- whole layout/css framework generators!


##Gotchas

We're trying to make json act like css here, so there are some extra things we need to do to avoid conflicts. I will code around some of these later, but you can use Son now if you take some simple safety measures:


1 ] Because json keys must be unique at each level, you can't overwrite with the same key like in raw css. To get around this, suffix the selector with a `|` to give uniqueness. Anything after the `|` will be ignored. 

e.g: `".myClass|"` overwrites `".myClass"`

e.g: `".myClass|uniqueid"` overwrites `".myClass"` 


2 ] To avoid certain characters being treated as js directives, you need to wrap some things in quotes:

- Selectors that start with: `.`, `#`, `*`, `[`, `~`, `+`, `:`, `>`, `@`

e.g: `".myClass"`, `":hover"`

- Propeties that contain dashes

e.g: `"font-size"`, `"list-style-type"`

- Values that are mixtures of integers / strings / special characters:

e.g: `"100%"`, `"40px"`


3 ] Son looks at every key in the object to try to determine if it is a selector or a css property name. It looks at the key name and sees if it matches any css property name or part. So if you try to write a selector for 'table', it will want to think you mean the css property 'table-layout'.

So for some tags you need to really make sure it gets treated as a selector. To do that, just prefix it with a `"$"` (it will get ignored):

    "$table"
    "$span"
    "$label"

If you're not sure, or something breaks, just err on the safe side by prefixing any key you want to be treated as a selector with `$`	 


##If you're not sure:

- Wrap every key/value in quotes
- Prefix any key you want to be treated as a selector with `$`


##Dev to do

- Convert the other way, from css to son (so people can bring in existing stylesheets)
- Debug report mode
- Do some kind of caching, using real css files created w. node.js
- Code around conflict so the `$` selector override isn't needed (try something along the lines of checking for equality against all possible property chunk combinations as whole strings)
- Testing


##Other to do

- demos, docs, site


##Authors

Son.js was created by [Tim Farland](http://www.timfarland.com), a web product designer based in Berlin. 
I have a design/product background and am slowly getting deeper into dev. 
This is my first open source project and first time using Git.

