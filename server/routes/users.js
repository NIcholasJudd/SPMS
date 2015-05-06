var pg = require('pg'),
    path = require('path'),
    connectionString = require(path.join(__dirname, '../', '../', 'config'));


var users = {

  getAll: function(req, res) {
      //console.log('here: ', connectionString);
      pg.connect(connectionString, function(err, client, done) {
          if(err) {
              console.error(err.stack);
              return res.status(500).send(err);//console.error('error running query', err);
          }
          client.query("SELECT * FROM test_user", function(err, result) {
              //console.log(result);
              done();
              if(err) {
                  console.error(err.stack);
                  return res.status(500).send(err);//console.error('error running query', err);
              }

              client.end();
              return res.json(result.rows);//callback(null, result);//
          });
      })
  },

  getOne: function(req, res) {
      pg.connect(connectionString, function(err, client, done) {
          if(err) {
              console.error(err.stack);
              return res.status(500).send(err);//console.error('error running query', err);
          }
          client.query("SELECT * FROM test_user WHERE username = $1", [req.body.username], function(err, result) {
             done();
              if(err) {
                  console.error(err.stack);
                  return res.status(500).send(err);//console.error('error running query', err);
              }
              client.end();
              return result;
          });
      })
  },

  create: function(req, res) {
      console.log('CREATE: ', req.body);
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            console.error(err.stack);
            return res.status(500).send(err);//console.error('error running query', err);
        }
        if(req.body.username == '') {
            return res.status(500).send(new Error('username required'));//return res.status(500).send(err('username required'));
        }
      client.query("INSERT INTO test_user(username, password, userrole) VALUES ($1, $2, $3)",
        [req.body.username, req.body.password, req.body.userrole], function(err, result) {
              done();
              if(err) {
                  console.error(err.stack);
                  return res.status(500).send(err);//console.error('error running query', err);
              }
              client.end();
              return res.json(result.rows);
          });

      /*var query = client.query("SELECT * FROM user WHERE username = $1", [req.body.username]);
      query.on('row', function(row) {
        results.push(row);
      });

      query.on('end', function() {
        client.end();
        return res.json(results);
      });

      if(err) {
        return console.error('error running query', err);
      }*/
    });
  },

  update: function(req, res) {
    var updateuser = req.body;
    var id = req.params.id;
    data[id] = updateuser; // Spoof a DB call
    res.json(updateuser);
  },

  delete: function(req, res) {
    var id = req.params.id;
    data.splice(id, 1) // Spoof a DB call
    res.json(true);
  }
};

/*var data = [{
  name: 'user 1',
  id: '1'
}, {
  name: 'user 2',
  id: '2'
}, {
  name: 'user 3',
  id: '3'
}];*/

module.exports = users;
