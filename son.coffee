###
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
###

#establish root
root = this


#utils
isArray = Array.isArray or ((elem) -> toString.call(elem) is '[object Array]')
toString = Object::toString


#main container
Son = ->


    ###
    Function defs
    ###


    ###
    render : styleSheetArray -> cssString
    ###
    render = (styleSheetArray) ->
        (toCss cssSelectorArray for cssSelectorArray in styleSheetArray).join "\n"
        
    ###
    toCss : cssSelectorArray, parent -> cssString
    where parent is a selector
    and cssString is a string containing an arbitrary number of css selector definitions
    ###
    toCss = (cssSelectorArray, parent = null) ->
       
       #render this with all its properties,
       selector = buildSelector(parent, cssSelectorArray[0]) 
       
       [selector
       " {\n"   
       #renders all properties
       (buildProperties elem for elem in cssSelectorArray[1..] when toString.call(elem) is '[object Object]').join("")  
       "}\n"]
       #render children (all arrays), passing current selector as parent
       .concat(toCss(elem, selector) for elem in cssSelectorArray[1..] when isArray(elem)).join ""
       


       
    ###
    buildSelector : (parent, selector) -> selector
    split selector if multiple, and append parent to each part (if any), and rejoin if split
    e.g: buildSelector("h2", "span, strong") 
        -> "h2 span, h2 strong"
    e.g: buildSelector("#main div, #sub div", "span, strong") 
        -> "#main div span, #main div strong, #sub div span, #sub div strong"
    e.g: -> null, "span, strong"
    ###
    buildSelector = (parent, selector) ->

        if parent?
        
            selectorParts = selector.split(",") #deal with ", " or "," cases later
            parentParts = parent.split(",")
            
            (((parent + " " + part) for part in selectorParts).join(", ") for parent in parentParts).join ", "
            
        else
            selector

    ###
    #tests
    console.log buildSelector("h2", "span, strong") is "h2 span, h2 strong"
    console.log buildSelector("#main div, #sub div", "span, strong") is "#main div span, #main div strong, #sub div span, #sub div strong"
    console.log buildSelector(null, "span, strong") is "span, strong"
    ###



    ###
    buildPropertyNames : (null || array), array -> array
    appends parent selectors to property name parts with "-"
    #e.g: buildPropertyNames(null,["margin","padding"]) 
        -> ["margin","padding"]
    #e.g: buildPropertyNames(["font"],["size","weight"]) 
        -> ["font-size","font-weight"]  
    ###
    buildPropertyNames = (parentParts = null, cssPropertyNameParts) -> 
        
        if parentParts?    
           ([parent].concat(cssPropertyNamePart).join("-") for parent in parentParts).join("") for cssPropertyNamePart in cssPropertyNameParts
            
        else
            cssPropertyNameParts
    ###
    
    console.log buildPropertyNames(null,["margin","padding"])
    console.log buildPropertyNames(["font"],["size","weight"]) 
    ###



    ###
    buildProperties : cssPropertyObj, parent -> cssString

    

    ###
    buildProperties = (cssPropertyObj, parent = null) ->

        parentParts = if parent then parent.split(", ") else null 

        ((propertyNames = buildPropertyNames(parentParts, cssPropertyName.split(","))  
        
        if isArray(cssPropertyVal) 
            #descend into child branch with appended parent
            (buildProperties(val, propertyNames.join(",")) for val in cssPropertyVal).join ""
            
        else        
            #render property pair/s (split)            
            (("  " + propertyName + ": " + cssPropertyVal + ";\n") for propertyName in propertyNames).join ""
        
        ) for cssPropertyName, cssPropertyVal of cssPropertyObj).join ""

    ###
    cssPropertyObj1 = "font-size" : 1.4 + "em"
    cssPropertyObj2 = "size" : 1.4 + "em"
    cssPropertyObj3 = "font" : cssPropertyObj2
    cssPropertyObj4 = "margin,padding" : 10 + "px"

    
    console.log buildProperties cssPropertyObj3
    console.log buildProperties cssPropertyObj4
    ###
    
    
    #expose main convertor
    @render = render
    
    @
    

#provide to root    
root.Son = new Son()

