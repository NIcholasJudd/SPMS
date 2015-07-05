/**
 * Created by scottmackenzie on 5/07/2015.
 */

/* This module creates a return field string for a SQL query - if no
    fields are provided in req.query.fields, the query returns all ('*') by default

    The module expects fields in format req.query.fields[]
     */

var filterString = {
    create : function(req) {
        if(req.query && req.query.fields && req.query.fields.length > 0) {
            return req.query.fields.toString();
        } else
            return "*";
    }
};

module.exports = filterString;