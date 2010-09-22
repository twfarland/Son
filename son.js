/**
* SON, 'Style Object Notation' http://timfarland.com/son
* Released under the MIT license
*
* Copyright (C) 2010 Tim Farland
*
* Converts JSON to CSS
*
* Inspired by Sass http://sass-lang.com
* But intended as a more javascript-native solution for manageable css
*
* Some internal utility funcs informed by RightJS include, startsWith, 
* and isHash functions. The original lib was written with RightJS 
* but I ported those funcs to reduce dependencies
* http://rightjs.org <<< try RightJS, if you haven't. It is good
*/



(function(){

//First we need a list of all those crazy css3 properties and selectors. 

//possible css property chunks
var cssProperties = [
//shared
	"bottom",
	"top",
	"left",
	"right",
	"color",
	"width",
	"height",
	"style",
	"max",
	"min",
	"size",
	"image",
	"position",
	"type",
	"x",
	"y",
	"spacing",
	"align",
	"break",
	"collapse",
	"radius",
	"shadow",
	"opacity",
	"side",
	"after",
	"before",
	"duration",
	"direction",
	"timing",
	"function",
	"outline",
	"transform",
	"offset",
	"name",
	"ruby",
//background
	"background",
	"attachment",		
	"repeat",
	"origin",
//border
	"border",
//font
	"font",
	"family",
	"variant",
	"weight",
	"adjust",
	"stretch",
//generated content
	"label",
	"content",
	"counter",
	"increment",
	"reset",
	"quotes",
	"bookmark",
	"target",
	"level",
	"length",
	"crop",
	"hyphenate",
	"character",
	"lines",
	"resource",
	"hyphens",
	"image",
	"resolution",
	"marks",
	"move",
	"to",
	"page",
	"policy",
	"quotes",
	"string",
	"set",
	"replace",
//line box
	"alignment",
	"adjust",
	"baseline",
	"shift",
	"dominant",
	"drop",
	"initial",
	"inline",
	"line",
	"stacking",
	"strategy",
//hyperlink
	"target",
	"new",
//list and markers
	"list",
	"marker",
//box model
	"box",
	"margin",
	"padding",
	"clear",
	"clip",
	"cursor",
	"display",
	"float",
	"overflow",
	"visibility",
	"z",
	"index",
	"marquee",
	"loop",
	"play",
	"count",
	"rotation",
	"point",
//print
	"page",
	"break",
	"inside",
	"orphans",
	"widows",
//text
	"letter",
	"decoration",
	"indent",
	"unicode",
	"bidi",
	"vertical",
	"white",
	"space",
	"word",
	"hanging",
	"punctuation",
	"trim",
	"last",
	"emphasis",
	"justify",
	"outline",
	"wrap",
//column
	"span",
	"column",
	"fill",
	"gap",
	"rule",
//flexible box
	"flex",
	"group",
	"lines",
	"ordinal",
	"orient",
	"pack",
	"sizing",
	"tab",
//table
	"table",
	"caption",
	"empty",
	"cells",
	"layout", 
//speech
	"cue",
	"mark",
	"pause",
	"phonemes",
	"rest",
	"speak",
	"voice",
	"balance",
	"rate",
	"pitch",
	"range",
	"stress",
	"volume",
//animation
	"animation",
	"iteration",
	"play",
	"state",
//transitions
	"transition",
	"property",
//grid
	"columns",
	"rows",
//3d/2d transform
	"backface",
	"perspective",
	"origin",
//ruby
	"overhang",
//paged media
	"fit",
	"orientation",
	"windows",
//ui
	"appearance",
	"cursor",
	"icon",
	"nav",
	"up",
	"down",
	"resize",
//proposals
	"webkit",
	"moz"
	];


	//possible string beginnings for selectors (that aren't just html tags)
	var selectorCues = [".","*","#","[",">","+","~",":","@"]; 

	//html tags
	var htmlTags = [
	"a",
	"abbr",
	"acronym",
	"address",
	"applet",
	"area",
	"article",
	"aside",
	"audio",
	"b",
	"base",
	"basefont",
	"bb",
	"bdo",
	"big",
	"blockquote",
	"body",
	"br",
	"button",
	"canvas",
	"caption",
	"center",
	"cite",
	"code",
	"col",
	"colgroup",
	"command",
	"datagrid",
	"dd",
	"del",
	"details",
	"dialog",
	"dir",
	"div",
	"dfn",
	"dl",
	"dt",
	"em",
	"embed",
	"fieldset",
	"figure",
	"font",
	"footer",
	"form",
	"frame",
	"frameset",
	"h1", "h2", "h3", "h4", "h5", "h6",
	"head",

	"header",
	"hgroup",
	"hr",
	"html",
	"i",
	"iframe",
	"img",
	"input",
	"ins",
	"isindex",
	"kbd",
	"label",
	"legend",
	"li",
	"link",
	"mark",
	"map",
	"menu",
	"meta",
	"meter",
	"nav",
	"noframes",
	"noscript",
	"object",
	"ol",
	"optgroup",
	"option",
	"output",
	"p",
	"param",
	"pre",
	"progress",
	"q",
	"ruby",
	"rp",
	"rt",
	"s",
	"samp",
	"script",
	"section",
	"select",
	"small",
	"source",
	"span",
	"strike",
	"strong",
	"style",
	"sub",
	"table",
	"tbody",
	"td",
	"textarea",
	"tfoot",
	"th",
	"thead",
	"time",
	"title",
	"tr",
	"tt",
	"u",
	"ul",
	"var",
	"video",
	"xmp"
	];

	//combined beginnings and tags
	var allCues = selectorCues.concat(htmlTags);


	//util funcs ported from rightJS
	//similar to rightJS include
	var isInArray = function(needle, haystack) {
	    for (i in haystack){
	      if (needle === haystack[i]) return true;
	    }
	    return false;
	};


	//test if a string starts with another string
	var strStart = function(needle, isInString) {
	    var start_str = isInString.substr(0, needle.length);
	    return start_str === needle;
	};


	//test if any strStart on an array
	var anyStartWith = function(isInString, haystack){
		for (i in haystack){
			if (strStart(haystack[i], isInString)) return true;
		}
		return false;
	};


	//checks if something is 'hash'
	var isHashObj =  function(value){		
	  return value.toString() === '[object Object]';
	};


	//detects if key represents a css property name
	//checks fragments of property names, not dashed property names
	var isProperty = function(key){
		//split if it is a dashed property
		var splitKey = key.split("-");
		for (i in splitKey){
			return isInArray(splitKey[i], cssProperties);
		}
		return false;	
	};


	//detects if key represents a css selector
	var isSelector = function(key){

		//it is selector if it starts with something in allCues
		//the matching could be made more robust than 'strStart' using regex later if there are problems
		return anyStartWith(key, allCues);	
	
	};


	//detects if key is declared explicitly as a selector (if it starts with $)
	var selectorOverride = function(key){

		if (strStart("$", key)) return true;	
	
	};


	//gets key type, either css selector or css property
	var getKeyType = function(key){

		if (selectorOverride(key)) {
			return "selector";
		} 
		else if (isProperty(cleanKey(key))) {
			return "property";
		}
		else if (isSelector(cleanKey(key))) {
			return "selector";
		}
		else {
			return null;	
		}
	};


	//cleans $ from key
	var cleanKey = function(key){
		
		//strip out $
		if (strStart("$",key)) key = key.substr(1);
		return key;
	};





//the main convertor func. If clientside is true, it does a document.write with <style> tags
var jsonToCss = function(styleObj, clientside){

	var output = "";

	var wrt = function(x){ 		
		output += "\r\n " + x; 
	};

	//run through the object

	//a flag to remember if there is a selctor open or not
	var openSelector = false;

	//deal with lineage as an array. don't destructively change lineage arrays, 
	//just change long enough to pass to next iteration
	//(use .concat([i]) instead of .push(i)

	var iterate = function(level, selectorLineage, propertyLineage){

		var selectorLineage = selectorLineage || [];
		var propertyLineage = propertyLineage || [];
		
		for (key in level){

		
		//strip out everything after the pipe, which is only there to provide uniqueness
		skey = key.split("|")[0];
		//e.g: ".myClass|uniq" becomes "myClass"

		//clean $ from key
		ckey = cleanKey(skey);
		//e.g: "$.myClass" becomes ".myClass

		//we still need to retain the original key for referencing
		
				//is the key a property name? 
				if (getKeyType(skey) === "property"){	
			
					//is the value an levelect? then add key to property lineage and go deeper
					if (isHashObj(level[key])){ 
								
						iterate( level[key], selectorLineage, propertyLineage.concat([ckey]) );
				
					}
					//the value is a string? print the property assignment
					else {
						wrt("\t" + propertyLineage.concat([ckey]).join("-") + ": " + level[key] + ";");
					}				
				
				}
				//is the key a selector? then write it and go deeper
				else if (getKeyType(skey) === "selector"){
			
					//is the value an levelect? it should be, for a selector
					//print the selector and its lineage, and go down to the next level
					if (isHashObj(level[key])){ 
			
						if (openSelector) wrt("}");
										
						wrt( selectorLineage.concat([ckey]).join(" ") + " { ");
					
						openSelector = true;
					
						iterate( level[key], selectorLineage.concat([ckey]), propertyLineage );
					} 
					else {				
						wrt( "Error: invalid value for selector " + key );
					}
			
				} 
				//We couldn't find out what the key was. Probably the json was wrong or the matching is broken
				else {			
					wrt( "Error: can't determine type of key: " + key );
				}
			
		
		}
	
		return null;
	
	};

	iterate(styleObj);	

	if (openSelector) wrt("}");

	//does document write if clientside = true, otherwise returns raw css
	return (clientside) ? document.write('<style type="text/css">'+output+'</style>') : output;

}; //end son converter func



//just somewhere to hold style references
var styles = {};


// Current version.
var VERSION = '1.0.0';



// CommonJS export jsonToCss method and version #
if (typeof exports !== 'undefined') { 
	exports.jsonToCss = jsonToCss;
	exports.VERSION = VERSION;
}


// send whole son obj to window(browser) or global(server) scope
this.son = {};
this.son.jsonToCss = jsonToCss;
this.son.styles = styles;
this.son.VERSION = VERSION;


})(); 
