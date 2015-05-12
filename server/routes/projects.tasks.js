/**
 * Created by scottmackenzie on 12/05/2015.
 */
/**
 * Created by scottmackenzie on 12/05/2015.
 */

var pg = require('pg'),
    path = require('path'),
    connectionString = require(path.join(__dirname, '../', '../', 'config'));

var rollback = function(client, done) {
    client.query('ROLLBACK', function(err) {
        return done(err);
    });
}


var projectTask = {

    getAll: function(req, res) {
        pg.connect(connectionString, function(err, client, done) {
            if(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            }
            client.query("SELECT * FROM tasks WHERE project_name = $1", [req.params.projectName], function(err, result) {
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
            client.query("SELECT * FROM task WHERE project_name = $1 AND task_id = $2",
                [req.params.projectName, req.body.taskId], function(err, result) {
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
            if(req.params.projectName == '') {
                return res.status(500).send(new Error('project name required'));
            }
            console.log('here');
            /*client.query("SELECT nextval(\'task_task_id_seq\');"), function(err, result) {
                //done();
                console.log(err);
                if(err) {
                    console.error(err.stack);
                    return rollback(client, done);//return res.status(500).send(err);
                }
                query.on('end', function(err, result) {
                    done();
                    client.end();
                    console.log("RESULTS: ", result);
                    return res.json(result);
                });

            }*/
            /*"task_id serial UNIQUE NOT NULL," +
            "task_number int NOT NULL," +
            "project_name varchar(100) REFERENCES project," +
            "task_name varchar(100) NOT NULL," +
            "description text," +
            "start_date date NOT NULL, " +
            "likely_duration interval NOT NULL," +
            "optimistic_duration interval NOT NULL," +
            "pessimistic_duration interval NOT NULL," +
            "progress_percentage real DEFAULT 0 NOT NULL," +
            "status varchar(20) CHECK(status = 'unassigned' OR status = 'on-the-go' OR status = 'finalised' OR " +
            "status = 'complete') DEFAULT 'unassigned' NOT NULL, " +
            "priority varchar(20) CHECK(priority = 'critical' OR priority = 'high' OR priority = 'medium' OR " +
            "priority = 'low') NOT NULL, " +
            "parent_id integer REFERENCES task(task_id)," +
            "PRIMARY KEY(task_number, project_name)" +*/

            //var num = '1';

            client.query("INSERT INTO task(task_number, project_name, task_name, description, start_date, " +
            "likely_duration, optimistic_duration, pessimistic_duration, progress_percentage, status, priority, " +
            "parent_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)",
            //client.query("INSERT INTO task VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)",
                [req.body.taskNumber, req.params.projectName, req.body.taskName, req.body.description, req.body.startDate,
                    req.body.likelyDuration, req.body.optimisticDuration, req.body.pessimisticDuration,
                    0, req.body.status, req.body.priority, req.body.parentId], function(err, result) {
                    if(err) {
                        console.error(err.stack);
                        return rollback(client, done);//return res.status(500).send(err);
                    }
                    /*var sequence_name = req.body.projectName;
                    sequence_name = sequence_name.replace(/\s/g, '');
                    //var seq = "CREATE SEQUENCE " + sequence_name
                    client.query("CREATE SEQUENCE " + sequence_name + "_seq START 1", function(err) {
                        if(err) {
                            console.error(err.stack);
                            return rollback(client, done);//return res.status(500).send(err);
                        }*/
                        done();
                        client.end();
                        console.log("RESULTS: ", result.rows);
                        return res.json(result.rows);
                    //})
                    /*done();
                     client.end();
                     return res.json(result.rows);*/
                });
        });
    }

    /* update, every field except for primary key must be updated */

   /* update: function(req, res) {
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
    }*/
};

module.exports = projectTask;

