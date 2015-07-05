/**
 * Created by scottmackenzie on 12/05/2015.
 */

 var promise = require('promise'),
     db = require('../models/database'),
     filterString = require('../modules/filterString');

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

     getOne: function(req, res) {
         db.one('select * from task where "taskId" = $1',
             [req.params.taskId])
             .then(function(data) {
                 return res.json(data);
             }, function(err) {
                 console.error(err);
                 return res.status(500).send(err);
             })
     },

     getUsers: function(req, res) {
         var filter = filterString.create(req);
         db.query('SELECT ' + filter + ' FROM employee WHERE email IN (SELECT email FROM taskrole WHERE "taskId" = $1) AND active = true',
             [req.params.taskId])
             .then(function(data) {
                 return res.json(data);
             }, function(err) {
                 console.error(err);
                 return res.status(500).send(err);
             })
     },

     getUserRoles: function(req, res) {
         var filter = filterString.create(req);
         db.query('SELECT ' + filter + ' FROM employee JOIN taskrole ON taskrole.email = employee.email WHERE "taskId" = $1 AND employee.active = true',
             [req.params.taskId])
             .then(function(data) {
                 return res.json(data);
             }, function(err) {
                 console.error(err);
                 return res.status(500).send(err);
             })
     },

     /*getAll: function(req, res) {
         db.query('SELECT "taskId", "taskName" FROM task',
             [req.params.taskId])
             .then(function(data) {
                 return res.json(data);
             }, function(err) {
                 console.error(err);
                 return res.status(500).send(err);
             })
     },*/

     getTaskDependencies: function(req, res) {
         //db.query('SELECT "taskId", "taskName" FROM task WHERE "taskId" IN (SELECT source FROM link WHERE target = $1)', [req.params.taskId])
         db.query('SELECT source FROM link WHERE target = $1', [req.params.taskId])
             .then(function (data) {
                 return res.json(data);
             }, function (err) {
                 console.error(err);
                 return res.status(500).send(err);
             })
     },

     updateProgress : function(req, res) {
         console.log("HERE");
         db.one("update task SET progress_percentage = $1 where task_id = $2 returning progress_percentage",
             [req.body.progressPercentage, req.params.taskId])
             .then(function(data) {
                 return res.json(data);
             }, function(err) {
                 console.error(err);
                 return res.status(500).send(err);
             })
     },

     updateStatus : function(req, res) {
         if (req.body.status === 'finalised' || req.body.status === 'complete') {
             db.one("update task SET status = $1, progress_percentage = 1 where task_id = $2 returning status",
                 [req.body.status, req.params.taskId])
                 .then(function (data) {
                     return res.json(data);
                 }, function (err) {
                     console.error(err);
                     return res.status(500).send(err);
                 })
         }
         else {
             db.one("update task SET status = $1 where task_id = $2 returning status",
                 [req.body.status, req.params.taskId])
                 .then(function (data) {
                     return res.json(data);
                 }, function (err) {
                     console.error(err);
                     return res.status(500).send(err);
                 })
         }

     },

     update: function(req, res) {
         console.log('LINK: ', req.body.links);
         db.tx(function(t) {
             var queries = [];
             queries.push(t.query("UPDATE task SET task_name = $1, description = $2, start_date = $3, likely_duration = $4, " +
             "optimistic_duration = $5, pessimistic_duration = $6, comfort_zone = $7, priority = $8, progress_percentage = $9 WHERE task_id = $10",
             [req.body.taskName, req.body.description, req.body.startDate, req.body.likelyDuration,
             req.body.optimisticDuration, req.body.pessimisticDuration, req.body.comfortZone, req.body.priority,
                 req.body.progressPercentage, req.params.taskId]));
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
                     queries.push(t.one("INSERT INTO link VALUES (nextval('link_link_id_seq'), $1, $2, $3, $4)  returning link_id, source",
                         [link.projectName, link.source, req.params.taskId, link.type]));
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
