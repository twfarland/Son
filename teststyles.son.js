(function(){

	var myColour = "#ff0000";

	var teststyles = {
		"#navbar" : {
			width : "80%",
			height : "23px",		
			ul : { 
				list : {
					style : {
						type : "none"
					}
				}
			},
			li : {
			"float" : "left",
				border : "1px solid " + myColour,
				padding : "10px",
				a : { 
					"font-weight" : "bold" ,
					color : myColour
				}
			}
		},
		"#other" : {
			width : "50%",
			"$table" : {
				padding : "10px"
			}
		},
		"#other|uniq" : {
			width : "80%",
			"$table" : {
				"table-layout" : "15px"
			}
		}
	};

	
	//makes variable available to window (for clientside use)
	this.teststyles = teststyles;

	//returns style object (for node.js use)
	return teststyles;

})();
