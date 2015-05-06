// vendor libraries
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var ejs = require('ejs');
var path = require('path');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// custom libraries
// routes
var route = require('./route');
// model
var Model = require('./model');

var expressApp = express();

passport.use(new LocalStrategy(function(username, password, done) {
   new Model.User({username: username}).fetch().then(function(data) {
      var user = data;
      if(user === null) {
         return done(null, false, {message: 'Invalid username or password'});
      } else {
         user = data.toJSON();
         if(!bcrypt.compareSync(password, user.password)) {
            return done(null, false, {message: 'Invalid username or password boob'});
         } else {
            return done(null, user);
         }
      }
   });
}));

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
   new Model.User({username: username}).fetch().then(function(user) {
      done(null, user);
   });
});

expressApp.set('port', process.env.PORT || 3000);
expressApp.set('views', path.join(__dirname, 'views'));
expressApp.set('view engine', 'ejs');

expressApp.use(cookieParser());
expressApp.use(bodyParser());
expressApp.use(session({secret: 'secret strategic xxzzz code'}));
expressApp.use(passport.initialize());
expressApp.use(passport.session());

// GET
expressApp.get('/', route.index);

// signin
// GET
expressApp.get('/signin', route.signIn);
// POST
expressApp.post('/signin', route.signInPost);

expressApp.get('', needsGroup('admin'), function(req, res) {
});

// logout
// GET
expressApp.get('/signout', route.signOut);

/********************************/

/********************************/
// 404 not found
expressApp.use(route.notFound404);

var server = expressApp.listen(expressApp.get('port'), function(err) {
   if(err) throw err;

   var message = 'Server is running @ http://localhost:' + server.address().port;
   console.log(message);
});

var needsGroup = function(group) {
  return [
    passport.authenticate('local'),
    function(req, res, next) {
      if (req.user && req.user.group === group)
        next();
      else
        res.send(401, 'Unauthorized');
    }
  ];
};
