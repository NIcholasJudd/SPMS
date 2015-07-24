/**
 * Created by scottmackenzie on 3/05/2015.
 */

var dbConfig = {
    development : {
        connectionString : 'postgres://localhost:5432/dev'
    },
    test : {
        connectionString : 'postgres://localhost:5432/test'
    }
}

module.exports = dbConfig;
