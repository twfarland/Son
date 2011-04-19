Son = require("./son.js").Son

shadow = (x,y,b,clr) ->
    "box-shadow,-moz-box-shadow,-webkit-box-shadow": "#{x}px #{y}px #{b}px #{clr}"

rounded = ->    
    "border-radius,-moz-border-radius,-webkit-border-radius": (v + "px" for k,v of arguments).join " "

eg = [["h3"
        "font-weight": "bold"
        color: "#000"
        shadow 1,1,3,"#ccc"
        rounded 5]]        

console.log Son.render eg

###
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

###
