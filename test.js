var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var Model = require('./model');
var fs = require('fs');
fs.readFile('sample.txt', function(err, data) {
    if(err) throw err;
    var array = data.toString().split("\n");
for (i = 0; i < 6; i++) {
    var user = array[i];
    i++;
        var password = bcrypt.hashSync(array[i]);
        var signUpUser = new Model.User({username: user, password: password});
        signUpUser.save();
}

});
