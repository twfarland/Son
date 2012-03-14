
/*
Son.js - pure json css precompiler
By Tim Farland
http://github.com/twfarland/son
*/

(function() {
  var Son, isArray, root, toString;

  root = this;

  toString = {}.toString;

  isArray = Array.isArray || (function(elem) {
    return toString.call(elem) === '[object Array]';
  });

  Son = function() {
    var buildProperties, buildPropertyNames, buildSelector, render, toCss;
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
    toCss = function(cssSelectorArray, parent) {
      var elem, prop, sel, selector, _i, _len, _ref;
      if (parent == null) parent = null;
      selector = buildSelector(parent, cssSelectorArray[0]);
      prop = selector + ' {\n';
      sel = '}\n';
      _ref = cssSelectorArray.slice(1);
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        elem = _ref[_i];
        if (toString.call(elem) === '[object Object]') {
          prop += buildProperties(elem);
        } else if (isArray(elem)) {
          sel += toCss(elem, selector);
        }
      }
      return prop + sel;
    };
    buildSelector = function(parent, selector) {
      var parent, parentParts, part, selectorParts;
      if (parent != null) {
        selectorParts = selector.split(',');
        parentParts = parent.split(',');
        return ((function() {
          var _i, _len, _results;
          _results = [];
          for (_i = 0, _len = parentParts.length; _i < _len; _i++) {
            parent = parentParts[_i];
            _results.push(((function() {
              var _j, _len2, _results2;
              _results2 = [];
              for (_j = 0, _len2 = selectorParts.length; _j < _len2; _j++) {
                part = selectorParts[_j];
                _results2.push(parent + ' ' + part);
              }
              return _results2;
            })()).join(', '));
          }
          return _results;
        })()).join(', ');
      } else {
        return selector;
      }
    };
    buildPropertyNames = function(parentParts, cssPropertyNameParts) {
      var buildNameParts, namePart, _i, _len, _results;
      if (parentParts == null) parentParts = null;
      buildNameParts = function(namePart) {
        var parent, res, _i, _len;
        res = '';
        for (_i = 0, _len = parentParts.length; _i < _len; _i++) {
          parent = parentParts[_i];
          res += [parent].concat(namePart).join('-');
        }
        return res;
      };
      if (parentParts != null) {
        _results = [];
        for (_i = 0, _len = cssPropertyNameParts.length; _i < _len; _i++) {
          namePart = cssPropertyNameParts[_i];
          _results.push(buildNameParts(namePart));
        }
        return _results;
      } else {
        return cssPropertyNameParts;
      }
    };
    buildProperties = function(cssPropertyObj, parent) {
      var cssPropertyName, cssPropertyVal, parentParts, propertyName, propertyNames, res, val, _i, _j, _len, _len2;
      if (parent == null) parent = null;
      parentParts = parent ? parent.split(', ') : null;
      res = '';
      for (cssPropertyName in cssPropertyObj) {
        cssPropertyVal = cssPropertyObj[cssPropertyName];
        propertyNames = buildPropertyNames(parentParts, cssPropertyName.split(','));
        if (isArray(cssPropertyVal)) {
          for (_i = 0, _len = cssPropertyVal.length; _i < _len; _i++) {
            val = cssPropertyVal[_i];
            res += buildProperties(val, propertyNames.join(','));
          }
        } else {
          for (_j = 0, _len2 = propertyNames.length; _j < _len2; _j++) {
            propertyName = propertyNames[_j];
            res += '   ' + propertyName + ': ' + cssPropertyVal + ';\n';
          }
        }
      }
      return res;
    };
    this.render = render;
    return this;
  };

  root.Son = new Son();

}).call(this);
