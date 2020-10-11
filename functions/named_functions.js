const oracledb = require('oracledb');
const dbConfig = require('../config/database.js');;

function getConnection() {
    oracledb.getConnection(dbConfig, function(err, conn) {
        if (err) {
            console.log('Error getting connection', err);
            return;
        }

        console.log('Connected to database');

        executeQuery(conn);
    });
}

function executeQuery(conn) {
    conn.execute(
        'select * from gerechten', [], // no binds
        {
            outFormat: oracledb.OBJECT
        },
        function(err, result) {
            if (err) {
                console.log('Error executing query', err);
                closeConnection(conn);
                return;
            }

            console.log('Query executed');
            console.log(result.rows);

            closeConnection(conn);
        }
    );
}

function closeConnection(conn) {
    conn.close(function(err) {
        if (err) {
            console.log('Error closing connection', err);
        } else {
            console.log('Connection closed');
        }
    });
}

getConnection();