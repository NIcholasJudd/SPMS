/**
 * Created by scottmackenzie on 22/05/2015.
 */

/**
 * Created by scottmackenzie on 12/05/2015.
 */

var promise = require('promise'),
    db = require('../models/database');

var taskComment = {

    getAll: function(req, res) {
        db.query("SELECT task_comment.*, employee.first_name, employee.last_name FROM task_comment JOIN employee ON " +
            "task_comment.email = employee.email WHERE task_comment.task_id = $1",
            [req.params.taskId])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    },

    create : function(req, res) {
        db.none("insert into task_comment values(nextval('task_comment_comment_id_seq'), $1, $2, $3, $4)",
        [req.params.taskId, req.body.commentDate, req.body.commentText, req.body.email])
            .then(function(data) {
                return res.json(data);
            }, function(err) {
                console.error(err);
                return res.status(500).send(err);
            })
    }
}

module.exports = taskComment;
