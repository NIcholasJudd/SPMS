var express = require('express');
var auth = require('./auth.js');
var products = require('./products.js');
var user = require('./users.js');

var router = express.Router();

var pg = require('pg');
    path = require('path'),
    connectionString = require(path.join(__dirname, '../', '../', 'config'));

/*
 * Routes that can be accessed by any one
 */
router.post('/login', auth.login);

/*
 * Routes that can be accessed only by authenticated users
 */
router.get('/api/auth/products', products.getAll);
router.get('/api/auth/product/:id', products.getOne);
router.post('/api/auth/product/', products.create);
router.put('/api/auth/product/:id', products.update);
router.delete('/api/auth/product/:id', products.delete);

/*
 * Routes that can be accessed only by authenticated & authorized users
 */

//router.route('/api/auth/admin/users')
//    .get()
router.get('/api/auth/admin/users', user.getAll);
router.get('/api/auth/admin/user/:id', user.getOne);
router.post('/api/auth/admin/user/', user.create);
router.put('/api/auth/admin/user/:id', user.update);
router.delete('/api/auth/admin/user/:id', user.delete);

module.exports = router;


/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;*/
