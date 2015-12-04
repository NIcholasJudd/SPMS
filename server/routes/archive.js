/**
 * Created by scottmackenzie on 20/05/15.
 */


var promise = require('promise'),
    db = require('../models/database');

/*var archive = {

    project: function(req, res) {
        db.tx(function(t) {
            var q1 = t.query("UPDATE project SET active = $1 WHERE project_name = $2 returning project_name",
                [req.body.active, req.params.projectName]);
            var q2 = t.query("UPDATE task SET active = $1 WHERE project_name = $2 returning project_name",
                [req.body.active, req.params.projectName]);
            return promise.all([q1, q2]);
        }).then(function(data) {
            res.json(data);
        }, function(err) {
            console.log(err);
            return res.status(500).send(err);
        });
    }
}

module.exports = archive;*/
