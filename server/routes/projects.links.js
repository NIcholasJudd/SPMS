/**
 * Created by scottmackenzie on 12/05/15.
 */

var promise = require('promise'),
    db = require('../models/database');


var projectLink = {
    getAll: function(req, res) {
        db.query('SELECT * FROM link WHERE projectName = $1', [req.params.projectName])
            .then(function (data) {
                return res.json(data);
            }, function (err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    getOne: function(req, res) {
        db.one("SELECT * FROM link WHERE project_name = $1 AND link_id = $2",
            [req.params.projectName, req.body.linkId])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    create: function(req, res) {
        db.one("INSERT INTO link(project_name, source, target, type) " +
            " VALUES ($1, $2, $3, $4)",
            [req.params.projectName, req.body.source, req.body.target, req.body.type])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.log(err);
                return res.status(500).send(err);
            })
    },

    update: function(req, res) {
        db.one("UPDATE link SET project_name=($1), source=($2), target=($3), type=($4) WHERE link_id = $1",
            [req.params.projectName, req.body.source, req.body.target, req.body.type])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.log(err);
                return res.status(500).send(err);
            })
    },

    delete: function(req, res) {
        db.query("DELETE FROM link WHERE project_name = $1",
            [req.params.projectName])
        .then(function(data) {
            return res.json(data);
        }, function(err) {
            console.log(err);
            return res.status(500).send(err);
        })
    }
};

module.exports = projectLink;

