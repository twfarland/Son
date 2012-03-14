Son = require('../lib/son.js').Son

shadow = (x,y,b,clr) ->
    'box-shadow,-moz-box-shadow,-webkit-box-shadow':
        x + 'px ' + y + 'px ' + b + 'px ' + clr

rounded = ->
    res = ''
    for k,v of arguments
        res += v + 'px'
    'border-radius,-moz-border-radius,-webkit-border-radius': res


eg = [['#main'
                font:
                    [size: 1.4 + 'em',
                     weight: 'normal']
                'margin, padding': 10 + "px"
                ['h3'
                    'font-weight': 'bold'
                    color: '#000'
                ]
                shadow 1,1,3,'#ccc'
                rounded 5
            ]]

console.log Son.render eg


