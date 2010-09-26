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
* but I extracted those funcs to reduce dependencies
* http://rightjs.org 
* 'Each' function from underscore.js
* http://documentcloud.github.com/underscore/
*/



(function(){


//util funcs from underscore JS

	var isNumber = function(value) {
	  return typeof(value) === 'number';
	};

	var nativeForEach = Array.prototype.forEach;

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	var each = function(obj, iterator, context) {
	    try {
	      if (nativeForEach && obj.forEach === nativeForEach) {
		obj.forEach(iterator, context);
	      } else if (isNumber(obj.length)) {
		for (var i = 0, l = obj.length; i < l; i++) iterator.call(context, obj[i], i, obj);
	      } else {
		for (var key in obj) {
		  if (hasOwnProperty.call(obj, key)) iterator.call(context, obj[key], key, obj);
		}
	      }
	    } catch(e) {
	      if (e != 'undefined') throw e;
	    }
	    return obj;
	};

//util funcs from rightJS

	//test if a string starts with another string
	var strStart = function(needle, isInString) {
	    var start_str = isInString.substr(0, needle.length);
	    return start_str === needle;
	};


	//checks if something is 'hash'
	var isHashObj =  function(value){		
	  return value.toString() === '[object Object]';
	};

//my util funcs

	
	//detects if linage has multiple selector
	var hasMultiSelector = function(lineage){
		return ( lineage[0] && lineage[0].split(",")[1] );
	}

	//detects if key is declared explicitly as a selector (if it starts with $)
	var selectorOverride = function(key){

		if (strStart("$", key)) return true;	
	
	};


	//gets key type, either css selector or css property
	var getKeyType = function(key){

		if (selectorOverride(key)) {
			return "selector";
		} 
		else {
			return "property";
		}
	};


	//cleans $ from key
	var cleanDollar = function(key){
		
		//strip out $
		if (strStart("$",key)) key = key.substr(1);
		return key;
	};





//the main convertor func. If clientside is true, it does a document.write with <style> tags
var jsonToCss = function(styleObj, clientside){

	var startTime = (new Date).getTime();

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
		
	
		each(level,function(element,key){
		
		//strip out everything after the pipe, which is only there to provide uniqueness
		skey = key.split("{")[0] + ( key.split("}")[1] || "" );
		//e.g: ".myClass|uniq" becomes "myClass"

		//clean $ from key
		ckey = cleanDollar(skey);
		//e.g: "$.myClass" becomes ".myClass

		//we still need to retain the original key for referencing
		
				//is the key a property name? 
				if (getKeyType(skey) === "property"){	
			
					//is the value an object? then add key to property lineage and go deeper
					if (isHashObj(element)){ 
								
						iterate( element, selectorLineage, propertyLineage.concat([ckey]) );
				
					}
					//the value is a string? print the property assignment
					else {
						wrt("\t" + propertyLineage.concat([ckey]).join("-") + ": " + element + ";");
					}				
				
				}
				//is the key a selector? then write it and go deeper
				else if (getKeyType(skey) === "selector"){
			
					//is the value a hash obj? it should be, for a selector
					//print the selector and its lineage, and go down to the next level
					if (isHashObj(level[key])){ 
			
						if (openSelector) wrt("}");

						//print selector, handle whether multiple or single

						if ( hasMultiSelector(selectorLineage) ){

							//split first part	
							var rootSel = selectorLineage[0].split(",");

							var temp = [];

							each(rootSel,function(rootPart, part){ 
								//join each part of that with the other lineage parts
								temp.push( 
									[rootPart].concat(selectorLineage.slice(1))
									.concat([ckey])
									.join(" ") 
								);
							});

							//join those parts with ","
							temp = temp.join(",")
	
							//write, don't update
							wrt( temp + " { ");

						} 
						//print as a single selector
						else {
							wrt( selectorLineage.concat([ckey]).join(" ") + " { ");
						}

						openSelector = true;
					
						//go deeper, passing in lineage
						iterate( element, selectorLineage.concat([ckey]), propertyLineage );
					} 
					else {				
						wrt( "Error: invalid value for selector " + key );
					}
			
				} 
				//We couldn't find out what the key was. Probably the json was wrong or the matching is broken
				else {			
					wrt( "Error: can't determine type of key: " + key );
				}
			
		
		});
	
		return null;
	
	};

	iterate(styleObj);	

	if (openSelector) wrt("}");

	var exTime = (new Date).getTime() - startTime;

	wrt("/* Parse time: " + exTime + "ms */");

	//does document write if clientside = true, otherwise returns raw css
	return (clientside) ? document.write('<style type="text/css">'+output+'</style>') : output;

}; //end son converter func



//just somewhere to hold style references
var styles = {};


// Current version.
var VERSION = '1.0.2';


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
