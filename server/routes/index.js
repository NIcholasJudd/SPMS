var express = require('express'),
    auth = require('./auth.js'),
    products = require('./products.js'),
    user = require('./users.js'),
    project = require('./projects.js'),
    projectTask = require('./projects.tasks.js');

var router = express.Router();

var pg = require('pg'),
    path = require('path'),
    connectionString = require(path.join(__dirname, '../', '../', 'config'));

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);

/*
 * Routes that can be accessed only by authenticated users
 */
/* dummy comment */
/*router.get('/api/auth/products', products.getAll);
router.get('/api/auth/product/:id', products.getOne);
router.post('/api/auth/product/', products.create);
router.put('/api/auth/product/:id', products.update);
router.delete('/api/auth/product/:id', products.delete);
*/
/*
 * Routes that can be accessed only by authenticated & authorized users
 */

//router.route('/api/auth/admin/users')
//    .get()
router.get('/api/auth/admin/users', user.getAll);
router.get('/api/auth/admin/user/:email', user.getOne);
router.post('/api/auth/admin/user/', user.create);
router.put('/api/auth/admin/user/:email', user.update);
router.delete('/api/auth/admin/user/:email', user.delete);

router.get('/api/auth/admin/projects', project.getAll);
router.get('/api/auth/admin/project/:project.name', project.getOne);
router.post('/api/auth/admin/project', project.create);
router.put('/api/auth/admin/project/:project.name', project.update);
router.delete('/api/auth/admin/project/', project.delete);

router.get('/api/auth/admin/project/:projectName/tasks', projectTask.getAll);
router.get('/api/auth/admin/project/:projectName/task/:taskNumber', projectTask.getOne);
router.post('/api/auth/admin/task/:projectName', projectTask.create);
//router.put('/api/auth/admin/project/:projectName/task/:taskId', projectTask.update);
router.delete('/api/auth/admin/project/:projectName/task/:taskNumber', projectTask.delete);

module.exports = router;


/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;*/
