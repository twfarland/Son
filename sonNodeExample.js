(function() {
  var Son, eg, rounded, shadow;
  Son = require("./son.js").Son;
  shadow = function(x, y, b, clr) {
    return {
      "box-shadow,-moz-box-shadow,-webkit-box-shadow": "" + x + "px " + y + "px " + b + "px " + clr
    };
  };
  rounded = function() {
    var k, v;
    return {
      "border-radius,-moz-border-radius,-webkit-border-radius": ((function() {
        var _results;
        _results = [];
        for (k in arguments) {
          v = arguments[k];
          _results.push(v + "px");
        }
        return _results;
      }).apply(this, arguments)).join(" ")
    };
  };
  eg = [
    [
      "h3", {
        "font-weight": "bold",
        color: "#000"
      }, shadow(1, 1, 3, "#ccc"), rounded(5)
    ]
  ];
  console.log(Son.render(eg));
  /*
  =>

  h3 {
    font-weight: bold;
    color: #000;
    box-shadow: 1px 1px 3px #ccc;
    -moz-box-shadow: 1px 1px 3px #ccc;
    -webkit-box-shadow: 1px 1px 3px #ccc;
    border-radius: 5px;
    -moz-border-radius: 5px;
    -webkit-border-radius: 5px;
  }

  */
}).call(this);
