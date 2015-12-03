var express = require('express'),
    auth = require('./auth.js'),
    user = require('./users.js'),
    project = require('./projects.js'),
    projectTask = require('./projects.tasks.js'),
    projectLink = require('./projects.links.js'),
    userTask = require('./user.tasks.js'),
    userProject = require('./user.projects.js'),
    archiveProject = require('./projects.js'),
    task = require('./tasks.js'),
    taskComment = require('./task.comment.js'),
    projectFunctionPoints = require('./projects.functionPoints.js'),
    cocomoScores = require('./projects.cocomoScores.js'),
    plans = require('./plans.js'),
    account = require('./accounts.js');


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
//route for plans
router.get('/plans', plans.getAll);

//route for account CRUD
router.get('/account/:email', account.check);

//routes for user CRUD
router.get('/api/auth/users', user.getAll);
router.get('/users/:email', user.check);
router.get('/api/auth/user/:email', user.getOne);
router.post('/api/auth/admin/user/', user.create);
router.put('/api/auth/admin/user/:email', user.update);
router.delete('/api/auth/admin/user/:email', user.delete);
router.put('/api/auth/admin/user/:email/archive', user.archive);
router.put('/api/auth/admin/user/:email/password', user.updatePassword);

//routes for project CRUD
router.get('/api/auth/projects', project.getAll);
router.get('/api/auth/project/:projectName', project.getOne);
router.get('/api/auth/admin/projects', project.getArchivedProjects);
router.post('/api/auth/admin/project', project.create);
router.put('/api/auth/project/:projectName', project.update);
router.delete('/api/auth/admin/project/', project.delete);
router.put('/api/auth/admin/project/:projectName/archive', project.archive);

// routes for tasks involved with a particular project
router.get('/api/auth/project/:projectName/tasks', projectTask.getAll);
router.get('/api/auth/project/:projectName/taskNamesAndNumbers', projectTask.getTaskNamesAndNumbers);
router.get('/api/auth/project/:projectName/task/:taskNumber', projectTask.getOne);
//get all dependencies
router.get('/api/auth/link/:taskId', task.getTaskDependencies);
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
router.get('/api/auth/task/:taskId', task.getOne);
router.get('/api/auth/task/:taskId/userRoles', task.getUserRoles);
router.get('/api/auth/task/:taskId/users', task.getUsers);
router.put('/api/auth/task/:taskId', task.update);
router.put('/api/auth/task/:taskId/status', task.updateStatus);
router.put('/api/auth/task/:taskId/progress', task.updateProgress);
router.put('/api/auth/task/:taskId/archive', task.archive);

router.get('/api/auth/task/:taskId/comments', taskComment.getAll);
router.post('/api/auth/task/:taskId/comment', taskComment.create);

// get all projects that a user 'project manages'
router.get('/api/auth/user/:email/projects', userProject.getAll);

router.get('/api/auth/project/:projectName/functionPoint', projectFunctionPoints.getOne);
router.put('/api/auth/project/:projectName/functionPoint', projectFunctionPoints.update);

router.get('/api/auth/project/:projectName/cocomoScore', cocomoScores.getOne);
router.put('/api/auth/project/:projectName/cocomoScore', cocomoScores.update);

module.exports = router;

