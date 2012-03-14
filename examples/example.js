(function() {
  var Son, eg, rounded, shadow;

  Son = require('../lib/son.js').Son;

  shadow = function(x, y, b, clr) {
    return {
      'box-shadow,-moz-box-shadow,-webkit-box-shadow': x + 'px ' + y + 'px ' + b + 'px ' + clr
    };
  };

  rounded = function() {
    var k, res, v;
    res = '';
    for (k in arguments) {
      v = arguments[k];
      res += v + 'px';
    }
    return {
      'border-radius,-moz-border-radius,-webkit-border-radius': res
    };
  };

  eg = [
    [
      '#main', {
        font: [
          {
            size: 1.4 + 'em'
          }, {
            weight: 'normal'
          }
        ],
        'margin, padding': 10 + "px"
      }, [
        'h3', {
          'font-weight': 'bold',
          color: '#000'
        }
      ], shadow(1, 1, 3, '#ccc'), rounded(5)
    ]
  ];

  console.log(Son.render(eg));

}).call(this);
