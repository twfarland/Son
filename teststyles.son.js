(function () {

    var pal = {
	  hilite : "#ff0000",
	  base: "#000",
	  lolite : "#ccc"
    };
    
    var grid = { 
    	x:5,
	y:5
    };
    
    var gridPx = function(multiplier){
	    return ((multiplier || 1) * grid.x) + "px";
    };	   

    var teststyles = {
	  "$.container" : {
	      padding: gridPx()
	  },
        "$#navbar": {
            width: "80%",	//within each top-level selector, always put properties first and selectors last
            height: "23px",
            "$ul": {		//property nesting
                list: {
                    style: {
                        type: "none"
                    }
                }
            },
            "$li": {
                "float": "left",
                border: "1px solid " + pal.hilite,
                "margin, padding" : gridPx(2),		//multi property declarations
		    "padding" : gridPx(6),			//overwriting a property
		    "box, -moz-box, -webkit-box" : {
			   shadow: "2px 2px 2px " + pal.base
		    },
		    "border-radius, -moz-border-radius, -webkit-border-radius" : gridPx(2),
                "$a": {
                    "font-weight": "bold",
                    color: pal.hilite,
			  "$:hover" : {				//nesting subselectors
				  color: pal.base
			  }
                }    
            },
		"$li.myClass": {
			background: "-moz-linear-gradient(bottom,  "+pal.lolite+",  #fff)",
		}
        },
        "$#other": {
            width: "50%",
            "$table": {
                padding: gridPx(2)
            }
        },
	  "$#other{unique}": {				//overwriting a selector with a key uniqueness tag
            width: "80%"
        },
        "$#other, #yetother, .andanother": {	//multi selector declarations
		"font-weight" : "bold",
            "$table": {
                "table-layout": gridPx(3),
                "$td": {
                    padding: gridPx()
                }
            }
        },
        "$code": {
            clear: "both",
            display: "block",
            padding: gridPx(),
		"white-space" : "pre"
        }
    };




    //makes variable available to window (for clientside use)
    this.teststyles = teststyles;

    //returns style object (for node.js use)
    return teststyles;

})();