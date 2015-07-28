/**
 * Created by nicholasjudd on 20/07/15.
 */
var promise = require('promise'),
    db = require('../models/db-connect');

var plan = {
    getAll: function(req, res) {
        db.query('SELECT * FROM plan')
            .then(function (data) {
                return res.json(data);
            }, function (err) {
                console.log(err);
                return res.status(500).send(err);
            })
    }
};

module.exports = plan;