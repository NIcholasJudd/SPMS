var express = require('express'),
    auth = require('./auth.js'),
    user = require('./users.js'),
    project = require('./projects.js'),
    projectTask = require('./projects.tasks.js'),
    projectLink = require('./projects.links.js'),
    userTask = require('./user.tasks.js'),
    userProject = require('./user.projects.js'),
    archiveProject = require('./projects.js'),
    task = require('./tasks.js');


/* Authorisation naming conventions:
 *
 * Routes that can be accessed by any one (login only)
 *    '/*'
 *
 * Routes that can be accessed only by authenticated users:
 *
 *    '/api/auth/*'
 *
 * Routes that can be accessed only by authenticated & authorized(admin only) users:
 *
 *    '/api/auth/admin
 *
 */

var router = express.Router();

router.post('/login', auth.login);

//routes for user CRUD
router.get('/api/auth/users', user.getAll);
router.get('/api/auth/user/:email', user.getOne);
router.post('/api/auth/admin/user/', user.create);
router.put('/api/auth/admin/user/:email', user.update);
router.delete('/api/auth/admin/user/:email', user.delete);
router.put('/api/auth/admin/user/:email/archive', user.archive);

//routes for project CRUD
router.get('/api/auth/projects', project.getAll);
router.get('/api/auth/project/:projectName', project.getOne);
router.post('/api/auth/admin/project', project.create);
router.put('/api/auth/project/:projectName', project.update);
router.delete('/api/auth/admin/project/', project.delete);
router.put('/api/auth/admin/project/:projectName/archive', project.archive);

// routes for tasks involved with a particular project
router.get('/api/auth/project/:projectName/tasks', projectTask.getAll);
router.get('/api/auth/project/:projectName/task/:taskNumber', projectTask.getOne);
router.post('/api/auth/project/:projectName/task', projectTask.create);
//router.put('/api/auth/admin/project/:projectName/task/:taskId', projectTask.update);
router.delete('/api/auth/project/:projectName/task/:taskNumber', projectTask.delete);

// routes for links (dependencies) involved with a particular project
router.get('/api/auth/project/:projectName/links', projectLink.getAll);
router.get('/api/auth/project/:projectName/link/:taskId', projectLink.getOne);
router.post('/api/auth/project/:projectName/link', projectLink.create);
//router.put('/api/auth/admin/project/:projectName/task/:taskId', projectTask.update);
router.delete('/api/auth/project/:projectName/link/:taskId', projectLink.delete);

// get all tasks assigned to a user
router.get('/api/auth/user/:email/tasks', userTask.getAll);

// task api calls
router.get('/api/auth/task/:taskId/userRoles', task.getUserRoles);
router.get('/api/auth/task/:taskId/users', task.getUsers);
router.put('/api/auth/task/:taskId', task.update);
router.put('/api/auth/task/:taskId/archive', task.archive);

// get all projects that a user 'project manages'
router.get('/api/auth/user/:email/projects', userProject.getAll);

module.exports = router;

