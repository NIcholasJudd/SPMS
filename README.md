Download and set up Postgresql

 - Download and install postgres.app: http://postgresapp.com/
 - add psql (command line tool) to your path: http://postgresapp.com/documentation/cli-tools.html
 - Once installed and running, it should open up a window that has a 'open psql' button, which will open up psql in terminal.  however, this will connect to a default database, probably your mac's username.  We don't want that.  type '\q' to exit, and then type 'createdb test' to create a new database called test.  if createdb is 'not found', google it.  You should now be able to connect to a test database by typing 'psql test' in command line.  Keep Postgresql and that psql process open/running.

Download the project

Whether you do this through webstorm, xcode, github desktop is up to you.  Either way, once downloaded open a command line prompt (in webstorm click terminal in bottom left corner) and make sure your in the root directory of the project.

Client side

 - 'cd ./client'
 - 'npm install'
 - 'sudo npm install -g gulp' (you should only have to do this once, it sets up gulp globally)
 - 'gulp'
You should get something starting up, and it should say something like 'Server started http://localhost:2772'

Server side
 - cd ./server
 - npm install
 - nodemon app.js

Express server should be listening on port 3000

In web browser, go to localhost:2772, you should get a login screen

In the app:

 - every time the server restarts, it drops and sets up a test_user table.  it also adds a user with username 'admin', password 'admin', role admin
 - login with admin user
 - go to 'page 3 (sample factory)' in navbar, ignore everything else.  I'll clean it up later.
 - this should show what a 'get all users can do', and the simple form i've set up is for posting a new user.
 - make a user: username : user, password : user, userrole : user
 - log out, log in with the 'user' user
 - try to go to 'page 3', you should be rejected
 - log out and log back in with admin user
 - try to created another admin user with username 'admin'
 - you should get rejected, as 'admin' user already exists.
 - in your psql terminal, you should be able to run '\d' to list all tables, and 'select * from test_user' to list all users in test_user.
