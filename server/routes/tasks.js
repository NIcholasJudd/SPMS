/**
 * Created by scottmackenzie on 12/05/2015.
 */

 var promise = require('promise'),
     db = require('../models/database');

 var task = {

     archive: function(req, res) {
         db.tx(function(t) {
             var q1 = t.one("UPDATE task SET active = $1 WHERE task_id = $2 returning task_id, active",
                [req.body.active, req.params.taskId]);
             var q2 = t.query("UPDATE task_role set active = $1 WHERE task_id = $2 returning task_id, active",
                 [req.body.active, req.params.taskId]);
             return promise.all([q1, q2]);
             }).then(function(data) {
                    res.json(data);
             }, function(err) {
                    console.log(err);
             return res.status(500).send(err);
         });
     },

     getUsers: function(req, res) {
         db.query("select * from employee where email IN (select email from task_role where task_id = $1) AND active = true",
             [req.params.taskId])
             .then(function(data) {
                 return res.json(data);
             }, function(err) {
                 console.error(err);
                 return res.status(500).send(err);
             })
     },

     getUserRoles: function(req, res) {
         db.query("select * from employee JOIN task_role ON task_role.email = employee.email where task_role.task_id = $1 AND employee.active = true",
             [req.params.taskId])
             .then(function(data) {
                 return res.json(data);
             }, function(err) {
                 console.error(err);
                 return res.status(500).send(err);
             })
     },

     update: function(req, res) {
         db.tx(function(t) {
             var queries = [];
             queries.push(t.query("UPDATE task SET taskName = $1, description = $2, start_date = $3, likely_duration = $4, " +
             "optimistic_duration = $5, pessimistic_duration = $6, priority = $7 WHERE task_id = $8",
             [req.body.taskName, req.body.description, req.body.startDate, req.body.likelyDuration,
             req.body.optimisticDuration, req.body.pessimisticDuration, req.body.priority, req.params.taskId]));
             queries.push(t.query("DELETE FROM task_role WHERE task_id = $1", [req.params.taskId]));
             queries.push(t.query("DELETE FROM link WHERE target = $1", [req.params.taskId]));
             /* add users assigned to task */
             if (req.body.taskRoles) {
                 req.body.taskRoles.forEach(function (taskRole) {
                     queries.push(t.one("INSERT INTO task_role VALUES($1, $2, $3, $4) returning task_id",
                         [taskRole.email, req.params.taskId, taskRole.roleName, true]));
                 })
             }
             /* add every dependency link */
             if (req.body.links) {
                 req.body.links.forEach(function (link) {
                     queries.push(t.one("INSERT INTO link(project_name, source, target, type) VALUES ($1, $2, $3, $4) returning link_id, source",
                         [req.params.projectName, link.source, req.params.taskId, link.type]));
                 })
             }
             return promise.all(queries);
         }).then(function(data) {
             res.json(data);
         }, function(err) {
             console.log(err);
             return res.status(500).send(err);
         });
     }
 }

 module.exports = task;


/*var projects = {

    getAll: function(req, res) {
        pg.connect(connectionString, function(err, client, done) {
            if(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            }
            client.query("SELECT * FROM tasks", function(err, result) {
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
            client.query("SELECT * FROM task WHERE project_name = $1 AND task", [req.body.projectName], function(err, result) {
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
                    if(err) {
                        console.error(err.stack);
                        return rollback(client, done);//return res.status(500).send(err);
                    }
                    var sequence_name = req.body.projectName;
                    sequence_name = sequence_name.replace(/\s/g, '');
                    //var seq = "CREATE SEQUENCE " + sequence_name
                    client.query("CREATE SEQUENCE " + sequence_name + "_seq START 1", function(err) {
                        if(err) {
                            console.error(err.stack);
                            return rollback(client, done);//return res.status(500).send(err);
                        }
                        done();
                        client.end();
                        return res.json(result.rows);
                    })
                    //done();
                     //client.end();
                     //return res.json(result.rows);
                });
        });
    },

    // update, every field except for primary key must be updated

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
                    if(err) {
                        console.error(err.stack);
                        return res.status(500).send(err);
                    }
                    done();

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
                    if(err) {
                        console.error(err.stack);
                        return rollback(client, done);//return res.status(500).send(err);
                    }
                    var sequence_name = req.body.projectName;
                    sequence_name = sequence_name.replace(/\s/g, '');
                    client.query("DROP SEQUENCE IF EXISTS " + sequence_name + "_seq", function(err) {
                        if(err) {
                            console.error(err.stack);
                            return rollback(client, done);//return res.status(500).send(err);
                        }
                        done();
                        client.end();
                        return res.json(result);

                    })
                });
        });
    }
};

module.exports = projects;*/

