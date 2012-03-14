#SON

'Style Object Notation'
Converts Coffeescript/Javascript to CSS.

No license. Do what you want with this.
Creator: [Tim Farland](http://timfarland.com)


##What can Son do?

###Son lets you use pure json to describe css stylesheets

Son is inspired by [Sass](http://sass-lang.com), but is more Lispy in spirit, in that it is an embedded DSL rather than an external one.

Because of this, styles can be altered using normal js, and no special constructs like 'mixins' are required. This opens up many possibilities for defining, transporting, and manipulating styles.

For terse style definition, I recommend using coffeescript.

All examples given in Coffeescript unless otherwise noted.

###Example:

The array:

    Son.render [['#main'
                    font: 
                        [size: 1.4 + 'em',
                         weight: 'normal']
                    'margin, padding': 10 + 'px'
                    ['h3'
                        'font-weight': 'bold'
                        color: '#000'
                    ]
                ]]    

Is converted to the following string: 

    #main {
      font-size: 1.4em;
      font-weight: normal;
      margin: 10px;
      padding: 10px;
    }
    #main h3 {
      font-weight: bold;
      color: #000;
    }

###Npm

    npm install son    
    
###Node usage

    Son = require('son').Son
    
    cssString = Son.render [stylesheetArray]    
    
    
###Nested selectors

After sass:

    ['#main'
        color: '#333'
        ['h3', 
            color: '#000']]
    =>
    
    #main {
      color: #333;
    }
    #main h3 {
      color: #000;
    }
    
###Nested properties

Nested properties inherit their parent as a prefix, joined with "-". Properties are considered nested when the value of a property declaration pair is an array: 

    ['#main'
        font: 
            [size: 1.4 + 'em',
             weight: 'normal']]
    
    =>
    
    #main {
      font-size: 1.4em;
      font-weight: normal;
    }
    
###Giving multiple properties the same value

In css, you can use multiple selectors in one declaration.
In son, you can also use multiple property names:

    ['#main'
        'margin,padding' : 10 + 'px'] 
    =>
    
    #main {
      margin: 10px;
      padding: 10px;
    }


##Manipulation

Sass-style manipulation like mixins, variables, and inheritance can just be done by manipulating the styles array.


###Variables

Yep, just use js:

    myColour = '#CCC'
    
    ['#main'
        color: myColour]

###Mixins       

Just drop a function in the selector array:

    shadow = (x, y, b, clr) ->
        'box-shadow,-moz-box-shadow,-webkit-box-shadow': x + 'px ' + y + 'px ' + b + 'px ' + clr

    style = ['h3'
                color: '#000'
                shadow 1,1,3,'#ccc']
    
    Son.render [style] =>
    
    h3 {
      color: #000;
      box-shadow: 1px 1px 3px #ccc;
      -moz-box-shadow: 1px 1px 3px #ccc;
      -webkit-box-shadow: 1px 1px 3px #ccc;
    }
    
So functions give you a great deal of control as you build an embedded styling language - all the power of js is available to manipulate your style arrays. As long as the resulting form adheres to what Son.render() expects, it will return valid css.


### Acceptable forms

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

examples:

    cssPropertyObj1 = "font-size" : 1.4 + "em"
    cssPropertyObj2 = "size" : 1.4 + "em"
    cssPropertyObj3 = "font" : [cssPropertyObj2]
    cssPropertyObj4 = "margin,padding" : 10 + "px"

    cssSelectorArray1 = ["#main", cssPropertyObj1]
    cssSelectorArray2 = [".main", cssPropertyObj3]
    cssSelectorArray3 = ["div", cssPropertyObj1, cssPropertyObj4]

    styleSheetArray1 = [cssSelectorArray1,cssSelectorArray3]


##Changelog

14.03.12

- Speed improvements, npm packaging

20.04.11

- Complete rewrite! 
- The new syntax now preserves the ordering of styles
- Allows terser mixins
- More coffeescript-centric
- Has no need for '$' prefixes on selectors
- Is tighter, more testable code

06.01.11

- Added some examples in coffescript.

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
