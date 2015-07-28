/**
 * Created by scottmackenzie on 3/05/2015.
 */
var db = require('./db-connect.js');
//var bcrypt = require('bcrypt');
var promise = require('promise');

//var rootPwd = 'root';

//bcrypt.hash(rootPwd, 10, function(err, hash) {

var dbTables = function(done) {
    db.tx(function(t) {
        var queries = [];
        queries.push(t.none('DROP SEQUENCE IF EXISTS myproject1seq'));
        queries.push(t.none('DROP SEQUENCE IF EXISTS myproject2seq'));
        queries.push(t.none('DROP SEQUENCE IF EXISTS myproject3seq'));
        queries.push(t.none('DROP SEQUENCE IF EXISTS projectflappybirdseq'));
        queries.push(t.none('DROP TABLE IF EXISTS cocomoscore'));
        queries.push(t.none('DROP TABLE IF EXISTS functionpoint'));
        queries.push(t.none('DROP TABLE IF EXISTS taskcomment'));
        queries.push(t.none('DROP TABLE IF EXISTS taskrole'));
        queries.push(t.none('DROP TABLE IF EXISTS link'));
        queries.push(t.none('DROP TABLE IF EXISTS task'));
        queries.push(t.none('DROP TABLE IF EXISTS projectrole'));
        queries.push(t.none('DROP TABLE IF EXISTS project'));
        queries.push(t.none('DROP TABLE IF EXISTS membership'));
        queries.push(t.none('DROP TABLE IF EXISTS account'));
        queries.push(t.none('DROP TABLE IF EXISTS plan'));
        queries.push(t.none('DROP TABLE IF EXISTS employee'));

        queries.push(t.none('CREATE TABLE employee(' +
            'email varchar(100) PRIMARY KEY,' +
            '"firstName" varchar(100) NOT NULL,' +
            '"lastName" varchar(100) NOT NULL,' +
            'password varchar(200) NOT NULL,' +
            'phone varchar(20),' +
            'skills varchar(100)[], ' +
            'active boolean' +
            ')'
        ));

        queries.push(t.none('CREATE TABLE plan(' +
            '"planId" serial PRIMARY KEY,' +
            '"planName" varchar(100) NOT NULL, ' +
            '"userLimit" int NOT NULL,' +
            '"price" NUMERIC NOT NULL ' +
            ');'
        ));

        queries.push(t.none('CREATE TABLE account(' +
            '"accountId" serial PRIMARY KEY, ' +
            '"accountName" varchar(100) UNIQUE NOT NULL,' +
            '"planId" integer REFERENCES plan("planId") NOT NULL, ' +
            '"signUpDate" date NOT NULL, ' +
            'active boolean' +
            ')'
        ));

        queries.push(t.none('CREATE TABLE membership(' +
            'email varchar(100) REFERENCES employee(email), ' +
            '"accountId" integer REFERENCES account("accountId"), ' +
            '"roleType" varchar(100) CHECK("roleType" = \'account holder\' OR "roleType" = \'administrator\' OR "roleType" = \'member\') NOT NULL, ' +
            'PRIMARY KEY(email, "accountId")' +
            ')'
        ));

        queries.push(t.none('CREATE TABLE project(' +
            '"projectId" serial PRIMARY KEY, ' +
            '"projectName" varchar(100) NOT NULL, ' +
            '"accountId" int REFERENCES account, ' +
            'description text NOT NULL, ' +
            'budget real NOT NULL, ' +
            '"startDate" date NOT NULL, ' +
            '"estimatedEndDate" date NOT NULL, ' +
            'active boolean NOT NULL, ' +
            '"archiveReason" text NULL ' +
            ')'
        ));

        queries.push(t.none('CREATE TABLE projectrole (' +
            'email varchar(100) REFERENCES employee NOT NULL, ' +
            '"projectId" int REFERENCES project NOT NULL, ' +
            '"roleType" varchar(20) CHECK ("roleType" = \'project manager\' OR "roleType" = \'team member\') NOT NULL, ' +
            'PRIMARY KEY(email, "projectId")' +
            ')'
        ));

        queries.push(t.none('CREATE TABLE task(' +
            '"taskId" serial UNIQUE NOT NULL,' +
            '"taskNumber" int NOT NULL,' +
            '"projectId" int REFERENCES project ON DELETE CASCADE,' +
            '"taskName" varchar(100) NOT NULL,' +
            'description text,' +
            '"startDate" date NOT NULL, ' +
            '"likelyDuration" interval NOT NULL,' +
            '"optimisticDuration" interval NOT NULL,' +
            '"pessimisticDuration" interval NOT NULL,' +
            '"comfortZone" interval NOT NULL, ' +
            '"progressPercentage" real DEFAULT 0 NOT NULL,' +
            'status varchar(20) CHECK(status = \'unassigned\' OR status = \'on-the-go\' OR status = \'finalised\' OR ' +
            'status = \'complete\') DEFAULT \'unassigned\' NOT NULL, ' +
            'priority varchar(20) CHECK(priority = \'critical\' OR priority = \'high\' OR priority = \'medium\' OR ' +
            'priority = \'low\') NOT NULL, ' +
                //'parentid integer REFERENCES task("taskId"),' +
            'active boolean, ' +
            'PRIMARY KEY("taskNumber", "projectId")' +
            ')'
        ));

        queries.push(t.none('CREATE TABLE link(' +
            '"linkId" serial PRIMARY KEY, ' +
            '"projectId" int REFERENCES project ON DELETE CASCADE, ' +
            'source integer REFERENCES task("taskId") NOT NULL, ' +
            'target integer REFERENCES task("taskId") NOT NULL, ' +
            'type varchar(20) CHECK(type = \'finish to start\' OR ' +
            'type = \'start to start\' OR type = \'finish to finish\' OR type = \'start to finish\'));'
        ));

        queries.push(t.none('CREATE TABLE taskrole(' +
            'email varchar(100) REFERENCES employee(email), ' +
            '"taskId" integer REFERENCES task("taskId") ON DELETE CASCADE, ' +
            '"roleName" varchar(100), ' +
            'active boolean, ' +
            'PRIMARY KEY(email, "taskId", "roleName")' +
            ');'
        ));

        queries.push(t.none('CREATE TABLE taskcomment(' +
            '"commentId" serial PRIMARY KEY, ' +
            '"taskId" int REFERENCES task("taskId") ON DELETE CASCADE, ' +
            '"commentDate" date NOT NULL, ' +
            '"commentText" text NOT NULL, ' +
            'email varchar(100) REFERENCES employee(email) ON DELETE CASCADE NOT NULL' +
            ');'
        ));

        queries.push(t.none('CREATE TABLE functionpoint(' +
            '"projectId" int REFERENCES project ON DELETE CASCADE UNIQUE NOT NULL, ' +
            '"adjustedFunctionPointCount" REAL, ' +
            '"adjustmentFactor" REAL[], ' +
            '"functionCounts" REAL[][], ' +
            'calculated BOOLEAN NOT NULL ' +
            ');'
        ));

        queries.push(t.none('CREATE TABLE cocomoscore(' +
            '"projectId" int REFERENCES project ON DELETE CASCADE UNIQUE NOT NULL, ' +
            '"cocomoScores" REAL[], ' +
            '"personMonths" REAL, ' +
            'calculated BOOLEAN NOT NULL ' +
            ');'
        ));

        return promise.all([queries]);

    }).then(function(data) {
        /*
            TODO: handle errors properly?  difficult to do, but at least its obvious if something fucks up
         */
        done(null, "Tables successfully loaded into database");
    }, function(reason) {
        done(reason, null);
    });
}



//});

module.exports = dbTables;

