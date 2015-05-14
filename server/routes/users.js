var pg = require('pg'),
    path = require('path'),
    connectionString = require(path.join(__dirname, '../', '../', 'config'));


var users = {

  getAll: function(req, res) {
      //console.log('here: ', connectionString);
      pg.connect(connectionString, function(err, client, done) {
          if(err) {
              console.error(err.stack);
              return res.status(500).send(err);
          }
          client.query("SELECT * FROM employee", function(err, result) {
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
          client.query("SELECT * FROM employee WHERE email = $1", [req.body.email], function(err, result) {
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
      //console.log('CREATE: ', req.body.email);
    pg.connect(connectionString, function(err, client, done) {
        if(err) {
            console.error(err.stack);
            return res.status(500).send(err);
        }
        if(req.body.email == '') {
            return res.status(500).send(new Error('email required'));
        }
      client.query("INSERT INTO employee VALUES($1, $2, $3, $4, $5, $6, $7, $8)",
        [req.body.email, req.body.firstName, req.body.lastName, req.body.password,
            req.body.phone, req.body.role, req.body.performanceIndex, req.body.previousRoles], function(err, result) {
              done();
              if(err) {
                  console.error(err.stack);
                  return res.status(500).send(err);
              }
              client.end();
              console.log('user result: ', result.rows);
              return res.json(result.rows);
          });
    });
  },

    /* update, every field except for primary key must be updated */

    update: function(req, res) {
        //console.log('UPDATE: ', req.body);
        pg.connect(connectionString, function(err, client, done) {
            if(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            }
            if(req.body.email == '') {
                return res.status(500).send(new Error('email required'));
            }
            //console.log(req.body.email);
            /*var qs = "UPDATE employee SET ";
            for(var i = 0; i < req.body.fields.length; i++) {
                var row = req.body.fields[i] + ' = ' + req.body.values[i];
                if(i != req.body.fields.length - 1)
                    row += ', ';
                qs += row;
            }
            qs += ' WHERE email = ' + req.body.email;*/
            //console.log(qs);
            client.query("UPDATE employee SET first_name=($2), last_name=($3), password=($4), " +
            "phone=($5), user_type=($6), performance_index=($7), previous_roles=($8) WHERE email=$1",
            [req.body.email, req.body.firstName, req.body.lastName, req.body.password,
             req.body.phone, req.body.role, req.body.performanceIndex, req.body.previousRoles], function(err, result) {
                    done();
                    if(err) {
                        console.error(err.stack);
                        return res.status(500).send(err);
                    }
                    client.end();
                    return res.json(result.rows);
                });
        });
    },

    delete: function(req, res) {
        //console.log('DELETE: ', req.body);
        pg.connect(connectionString, function(err, client, done) {
            if(err) {
                console.error(err.stack);
                return res.status(500).send(err);
            }
            if(req.body.email == '') {
                return res.status(500).send(new Error('email required'));
            }
            client.query("DELETE FROM employee WHERE email = $1",
                [req.body.email], function(err, result) {
                    done();
                    if(err) {
                        console.error(err.stack);
                        return res.status(500).send(err);
                    }
                    client.end();
                    return res.json(result.rows);
                });
        });
    }
};

module.exports = users;
