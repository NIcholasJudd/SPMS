/**
 * Created by nicholasjudd on 24/11/2015.
 */
var promise = require('promise'),
    db = require('../models/database'),
    filterString = require('../modules/filterString');
var accounts = {
    check: function(req,res){
        db.one('SELECT * FROM account WHERE "accountName" = $1', [req.params.email])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    }
};
module.exports = accounts;