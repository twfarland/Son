###
Son.js - pure json css precompiler
By Tim Farland
http://github.com/twfarland/son
###

root = @


toString = {}.toString
isArray = Array.isArray or ((elem) -> toString.call(elem) is '[object Array]')


Son = ->



    render = (styleSheetArray) ->
        (toCss cssSelectorArray for cssSelectorArray in styleSheetArray).join "\n"



    toCss = (cssSelectorArray, parent = null) ->

        selector = buildSelector parent, cssSelectorArray[0]
        prop = selector + ' {\n'
        sel = '}\n'

        for elem in cssSelectorArray[1..]

                if toString.call(elem) is '[object Object]'
                        prop += buildProperties elem

                else if isArray(elem)
                        sel += toCss elem, selector
        prop + sel



    buildSelector = (parent, selector) ->

        if parent?

                selectorParts = selector.split ','
                parentParts = parent.split ','

                ((parent + ' ' + part for part in selectorParts).join ', ' for parent in parentParts).join ', '

        else
            selector



    buildPropertyNames = (parentParts = null, cssPropertyNameParts) ->

        buildNameParts = (namePart) ->
                res = ''
                for parent in parentParts
                        res += [parent].concat(namePart).join '-'
                res

        if parentParts?
                buildNameParts namePart for namePart in cssPropertyNameParts

        else
                cssPropertyNameParts



    buildProperties = (cssPropertyObj, parent = null) ->

        parentParts = if parent then parent.split ', ' else null

        res = ''

        for cssPropertyName, cssPropertyVal of cssPropertyObj

                propertyNames = buildPropertyNames parentParts, cssPropertyName.split(',')

                if isArray cssPropertyVal
                        for val in cssPropertyVal
                                res += buildProperties val, propertyNames.join(',')
                else
                        for propertyName in propertyNames
                                res += '   ' + propertyName + ': ' + cssPropertyVal + ';\n'
        res



    @render = render


    @


root.Son = new Son()