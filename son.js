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
 */

(function () {


   //iterate over arrays, using the native foreach if available
   var nativeForEach = Array.prototype.forEach,
       hasOwnProperty = Object.prototype.hasOwnProperty;
   
   var each = (function (testarr) {
      if (nativeForEach && testarr.forEach === nativeForEach) {
         return function (obj, iterator, context) {
            obj.forEach(iterator, context);
         };
      } else if (isNumber(testarr.length)) {
         return function (obj, iterator, context) {
            for (var i = 0, l = obj.length; i < l; i++) iterator.call(context, obj[i], i, obj);
         };
      }
      return obj;
   })([1]);


   //iterate over objs
   var objEach = function (obj, iterator, context) {

      for (var key in obj) {
         if (hasOwnProperty.call(obj, key)) iterator.call(context, obj[key], key, obj);
      }

      return obj;
   };


   //tests if number
   var isNumber = function (value) {
      return typeof(value) === 'number';
   };
   

   //checks if something is 'hash'
   var isHashObj = function (value) {
      return value.toString() === '[object Object]';
   };
   

   //test if a string starts with another string
   var strStart = function (needle, isInString) {
      var start_str = isInString.substr(0, needle.length);
      return start_str === needle;
   };
   

   //detects if linage has multiple selector
   var hasMultiSelector = function (lineage) {
      return (lineage[0] && lineage[0].split(",")[1]);
   }


   //detects if key is declared explicitly as a selector (if it starts with $)
   var isCssSelector = function (key) {

      if (strStart("$", key)) return true;

   };
   

   //cleans $ from key
   var cleanDollar = function (key) {

      //strip out $
      if (strStart("$", key)) key = key.substr(1);
      return key;
   };
   

   //creates error objs for convertor
   var invalidVal = function (message) {
      var err = new Error(message);
      err.type = "invalidVal";
      return err;
   }
   
   //replace all of instances of pattern in string
   String.prototype.replaceAll = function(needle,replacement){
	   return this.replace(new RegExp(needle,"g"),replacement) ;
   };   

   //processes a branch of the style obj, treating it as a css property
   var processCssProperty = function (element, selectorLineage, propertyLineage, level, ckey, key) {
	
	var elems = [ckey];
	
	if (key.split(",")[1] != undefined){
		elems = ckey.split(", ");
	}

	each(elems,function(elemkey){
				  
		//is the value an object? then add key to property lineage and go deeper
		if (isHashObj(element)) {
		   iterate(element, selectorLineage, propertyLineage.concat([elemkey]));	   
		}
		//the value is a string? print the property assignment
		else if (typeof(element) == "string" || typeof(element) == "number") {
		   wrt("  " + propertyLineage.concat([elemkey]).join("-") + ": " + element + ";");
		}
		else {
		   throw invalidVal("Invalid value for property: " + elemkey);
		}
	});
	
   };


   //processes a branch of the style obj, treating it as a css selector
   var processCssSelector = function (element, selectorLineage, propertyLineage, level, ckey, key) {
      //is the value a hash obj? it should be, for a selector
      //print the selector and its lineage, and go down to the next level
      if (isHashObj(level[key])) {

         if (openSelector) wrt("}");

         //print selector, handle whether multiple or single	
         if (hasMultiSelector(selectorLineage)) {

            //split first part	
            var rootSel = selectorLineage[0].split(",");

            var temp = [];

            each(rootSel, function (rootPart, part) {
               //join each part of that with the other lineage parts
               temp.push(
		      [rootPart].concat(selectorLineage.slice(1))
			.concat([ckey])
			.join(" ")
			.replaceAll(" :",":")
		   );
            });

            //join those parts with ","
            temp = temp.join(",")

            //write, don't update
            wrt(temp + " { ");

         }
         //print as a single selector
         else {
            wrt(selectorLineage.concat([ckey])
			.join(" ")
			.replaceAll(" :",":") + " { "
		);
         }

         openSelector = true;

         //go deeper, passing in lineage
         iterate(element, selectorLineage.concat([ckey]), propertyLineage);
      }
      else {
         throw invalidVal("Invalid value for selector " + key);
      }

   };
   

   //a flag to remember if there is a selctor open or not
   var openSelector = false;
   

   //writes and remembers output string
   var output = "";
   

   var wrt = function (x) {
      output += "\r\n " + x;
   };
   

   //run through the object	
   //deal with lineage as an array. don't destructively change lineage arrays, 
   //just change long enough to pass to next iteration
   //(use .concat([i]) instead of .push(i)
   var iterate = function (level, selectorLineage, propertyLineage) {

      var selectorLineage = selectorLineage || [],
          propertyLineage = propertyLineage || [];

      objEach(level, function (element, key) {

         //strip out curly brackets, which are only there to provide uniqueness
         skey = key.split("{")[0] + (key.split("}")[1] || "");
         //e.g: ".myClass|uniq" becomes "myClass"
         //clean $ from key
         ckey = cleanDollar(skey);
         //e.g: "$.myClass" becomes ".myClass
         //we still need to retain the original key for referencing
         //is the key a property name? 
         if (!isCssSelector(skey)) {
            processCssProperty(element, selectorLineage, propertyLineage, level, ckey, key);
         }
         //treat key as a selector
         else {
            processCssSelector(element, selectorLineage, propertyLineage, level, ckey, key);
         }
      });

      return null;

   };


   //the main convertor func.
   var jsonToCss = function (styleObj) {

      var startTime = (new Date).getTime();

      output = "";

      try {
         iterate(styleObj);
      }
      catch (error) {
         if (error.type == "invalidVal") {
            wrt("Exception: " + error.message)
         }
         else {
            throw error;
         }
      }

      if (openSelector) wrt("}");

      openSelector = false;

      var exTime = (new Date).getTime() - startTime;

      wrt("/* Parse time: " + exTime + "ms */");

      //returns raw css string
      return output;

   }; //end son converter func
   

   //just somewhere to hold style references
   var styles = {};
   

   // Current version.
   var VERSION = '1.0.3';
   

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