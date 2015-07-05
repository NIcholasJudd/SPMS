/**
 * Created by scottmackenzie on 5/07/2015.
 */

/* This module filters the fields returned by an array of json objects.
 * It expects that the fields are provided in the request in the form req.query.fields[]
 *
 * Useful for an in-memory filter of a returned query.  Consider using filterString instead to filter SQL results directly
 * */

var myFilter = {
    filterByFields : function(fields, object) {
        var filteredObject = {};
        fields.forEach(function(field) {
            filteredObject[field] = object[field];
        })
        return filteredObject;
    },
    runFilter : function(req, objectArray) {
        if(req.query && req.query.fields && req.query.fields.length > 0) {
            objectArray = objectArray.map(function(object) { return myFilter.filterByFields(req.query.fields, object) });
            return objectArray;
        } else
            return objectArray;
    }
};

module.exports = myFilter;