/**
 * Created by scottmackenzie on 7/05/15.
 */

var pg = require('pg'),
    path = require('path'),
    connectionString = require(path.join(__dirname, '../', '../', 'config'));


var projects = {

    getAll: function(req, res) {
        pg.connect(connectionString, function(err, client, done) {
            if(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            }
            client.query("SELECT * FROM project", function(err, result) {
                done();
                if(err) {
                    console.error(err.stack);
                    return res.status(500).send(err);
                }

                client.end();
                return res.json(result.rows);
            });
        })
    },

    getOne: function(req, res) {
        pg.connect(connectionString, function(err, client, done) {
            if(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            }
            client.query("SELECT * FROM project WHERE project_name = $1", [req.body.projectName], function(err, result) {
                done();
                if(err) {
                    console.error(err.stack);
                    return res.status(500).send(err);
                }
                client.end();
                return res.json(result.rows);
            });
        })
    },

    create: function(req, res) {
        console.log('CREATE: ', req.body);
        pg.connect(connectionString, function(err, client, done) {
            if(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            }
            if(req.body.projectName == '') {
                return res.status(500).send(new Error('project name required'));
            }
            //client.query("INSERT INTO project VALUES($1, $2, $3, $4, to_date($5, 'DD/MM/YYYY'), to_date($6, 'DD/MM/YYYY'), $7, $8)",
            client.query("INSERT INTO project VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
            [req.body.projectName, req.body.description, req.body.budget, req.body.duration,
                    req.body.startDate, req.body.estimatedEndDate, req.body.progress, req.body.projectManager], function(err, result) {
                    done();
                    if(err) {
                        console.error(err.stack);
                        return res.status(500).send(err);
                    }
                    client.end();
                    return res.json(result.rows);
                });
        });
    },

    /* update, every field except for primary key must be updated */

    update: function(req, res) {
        console.log('UPDATE: ', req.body);
        pg.connect(connectionString, function(err, client, done) {
            if(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            }
            if(req.body.projectName == '') {
                return res.status(500).send(new Error('project name required'));
            }
            client.query("UPDATE project SET description=($2), budget=($3), duration=($4), " +
                "start_date=($5), estimated_end_date=($6), progress=($7), project_manager=($8) WHERE project_name = $1",
                [req.body.projectName, req.body.description, req.body.budget, req.body.duration,
                    req.body.startDate, req.body.estimatedEndDate, req.body.progress, req.body.projectManager], function(err, result) {
                    done();
                    if(err) {
                        console.error(err.stack);
                        return res.status(500).send(err);
                    }
                    client.end();
                    return res.json(result.rows);
                });
        });
    },

    delete: function(req, res) {
        console.log('DELETE: ', req.body);
        pg.connect(connectionString, function(err, client, done) {
            if(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            }
            if(req.body.projectName == '') {
                return res.status(500).send(new Error('project name required'));
            }
            client.query("DELETE FROM project WHERE project_name = $1",
                [req.body.projectName], function(err, result) {
                    done();
                    if(err) {
                        console.error(err.stack);
                        return res.status(500).send(err);
                    }
                    client.end();
                    return res.json(result);
                });
        });
    }
};

module.exports = projects;

