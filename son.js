(function() {
  /*
   Son - style object notation

   Data defs:

   A cssSelectorArray is an array adhering to the following form:

      [selector, (cssPropertyObj || cssSelectorArray)...]

      where:
          - selector is a valid css selector string, e.g "#main", "a:link, a:hover", "input[type='text']", "a span"

          - cssPropertyObj is a js object with only 1 key-value pair adhering to the following form:

              {cssPropertyName : (cssPropertyValue || [cssPropertyObj])}

              where:

                  - cssPropertyName is either:
                      - a valid css property name string, e.g: "font-weight"
                      - multiple css property names joined by commas, e.g: "margin,padding"
                      - a partial css property name, e.g: "font", "weight"
                  - cssPropertyValue is a valid css property value string


   A styleSheetArray is an array of cssSelectorArrays:

      [cssSelectorArray]



  #example data

  cssPropertyObj1 = "font-size" : 1.4 + "em"
  cssPropertyObj2 = "size" : 1.4 + "em"
  cssPropertyObj3 = "font" : [cssPropertyObj2]
  cssPropertyObj4 = "margin,padding" : 10 + "px"

  cssSelectorArray1 = ["#main", cssPropertyObj1]
  cssSelectorArray2 = [".main", cssPropertyObj3]
  cssSelectorArray3 = ["div", cssPropertyObj1, cssPropertyObj4]

  styleSheetArray1 = [cssSelectorArray1,cssSelectorArray3]
  */  var Son, isArray, root, toString;
  root = this;
  isArray = Array.isArray || (function(elem) {
    return toString.call(elem) === '[object Array]';
  });
  toString = Object.prototype.toString;
  Son = function() {
    /*
    Function defs
    */
    /*
    render : styleSheetArray -> cssString
    */    var buildProperties, buildPropertyNames, buildSelector, render, toCss;
    render = function(styleSheetArray) {
      var cssSelectorArray;
      return ((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = styleSheetArray.length; _i < _len; _i++) {
          cssSelectorArray = styleSheetArray[_i];
          _results.push(toCss(cssSelectorArray));
        }
        return _results;
      })()).join("\n");
    };
    /*
    toCss : cssSelectorArray, parent -> cssString
    where parent is a selector
    and cssString is a string containing an arbitrary number of css selector definitions
    */
    toCss = function(cssSelectorArray, parent) {
      var elem, selector;
      if (parent == null) {
        parent = null;
      }
      selector = buildSelector(parent, cssSelectorArray[0]);
      return [
        selector, " {\n", ((function() {
          var _i, _len, _ref, _results;
          _ref = cssSelectorArray.slice(1);
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            elem = _ref[_i];
            if (toString.call(elem) === '[object Object]') {
              _results.push(buildProperties(elem));
            }
          }
          return _results;
        })()).join(""), "}\n"
      ].concat((function() {
        var _i, _len, _ref, _results;
        _ref = cssSelectorArray.slice(1);
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          elem = _ref[_i];
          if (isArray(elem)) {
            _results.push(toCss(elem, selector));
          }
        }
        return _results;
      })()).join("");
    };
    /*
    buildSelector : (parent, selector) -> selector
    split selector if multiple, and append parent to each part (if any), and rejoin if split
    e.g: buildSelector("h2", "span, strong")
        -> "h2 span, h2 strong"
    e.g: buildSelector("#main div, #sub div", "span, strong")
        -> "#main div span, #main div strong, #sub div span, #sub div strong"
    e.g: -> null, "span, strong"
    */
    buildSelector = function(parent, selector) {
      var parent, parentParts, part, selectorParts;
      if (parent != null) {
        selectorParts = selector.split(",");
        parentParts = parent.split(",");
        return ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = parentParts.length; _i < _len; _i++) {
            parent = parentParts[_i];
            _results.push(((function() {
              var _i, _len, _results;
              _results = [];
              for (_i = 0, _len = selectorParts.length; _i < _len; _i++) {
                part = selectorParts[_i];
                _results.push(parent + " " + part);
              }
              return _results;
            })()).join(", "));
          }
          return _results;
        })()).join(", ");
      } else {
        return selector;
      }
    };
    /*
    #tests
    console.log buildSelector("h2", "span, strong") is "h2 span, h2 strong"
    console.log buildSelector("#main div, #sub div", "span, strong") is "#main div span, #main div strong, #sub div span, #sub div strong"
    console.log buildSelector(null, "span, strong") is "span, strong"
    */
    /*
    buildPropertyNames : (null || array), array -> array
    appends parent selectors to property name parts with "-"
    #e.g: buildPropertyNames(null,["margin","padding"])
        -> ["margin","padding"]
    #e.g: buildPropertyNames(["font"],["size","weight"])
        -> ["font-size","font-weight"]
    */
    buildPropertyNames = function(parentParts, cssPropertyNameParts) {
      var cssPropertyNamePart, parent, _i, _len, _results;
      if (parentParts == null) {
        parentParts = null;
      }
      if (parentParts != null) {
        _results = [];
        for (_i = 0, _len = cssPropertyNameParts.length; _i < _len; _i++) {
          cssPropertyNamePart = cssPropertyNameParts[_i];
          _results.push(((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = parentParts.length; _i < _len; _i++) {
              parent = parentParts[_i];
              _results.push([parent].concat(cssPropertyNamePart).join("-"));
            }
            return _results;
          })()).join(""));
        }
        return _results;
      } else {
        return cssPropertyNameParts;
      }
    };
    /*

    console.log buildPropertyNames(null,["margin","padding"])
    console.log buildPropertyNames(["font"],["size","weight"])
    */
    /*
    buildProperties : cssPropertyObj, parent -> cssString



    */
    buildProperties = function(cssPropertyObj, parent) {
      var cssPropertyName, cssPropertyVal, parentParts, propertyName, propertyNames, val;
      if (parent == null) {
        parent = null;
      }
      parentParts = parent ? parent.split(", ") : null;
      return ((function() {
        var _results;
        _results = [];
        for (cssPropertyName in cssPropertyObj) {
          cssPropertyVal = cssPropertyObj[cssPropertyName];
          _results.push((propertyNames = buildPropertyNames(parentParts, cssPropertyName.split(",")), isArray(cssPropertyVal) ? ((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = cssPropertyVal.length; _i < _len; _i++) {
              val = cssPropertyVal[_i];
              _results.push(buildProperties(val, propertyNames.join(",")));
            }
            return _results;
          })()).join("") : ((function() {
            var _i, _len, _results;
            _results = [];
            for (_i = 0, _len = propertyNames.length; _i < _len; _i++) {
              propertyName = propertyNames[_i];
              _results.push("  " + propertyName + ": " + cssPropertyVal + ";\n");
            }
            return _results;
          })()).join("")));
        }
        return _results;
      })()).join("");
    };
    /*
    cssPropertyObj1 = "font-size" : 1.4 + "em"
    cssPropertyObj2 = "size" : 1.4 + "em"
    cssPropertyObj3 = "font" : cssPropertyObj2
    cssPropertyObj4 = "margin,padding" : 10 + "px"


    console.log buildProperties cssPropertyObj3
    console.log buildProperties cssPropertyObj4
    */
    this.render = render;
    return this;
  };
  root.Son = new Son();
}).call(this);
