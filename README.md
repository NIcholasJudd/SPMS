Requirements

 - Postgres, running with db table named 'test'
 - Node.js
 - npm
 - nodemon

Installation

In root directory:

 - 'npm install'
 - 'gulp'

In web browser, go to localhost:9000, you should get home page

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
