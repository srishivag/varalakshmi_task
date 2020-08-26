const config = require('./config.js');

var mysql = require('mysql');

var connection = mysql.createConnection({
    host: config.database.host,
    user: config.database.username,
    password: config.database.password,
    database: config.database.db,
    multipleStatements: true
});

// server with db connection is checking
var dbConnection = (req, res, next) => {
    connection.connect(function (err, result) {
        if (err) {
            let response = {
                data: err
            }
            if (response.data.errno === 'ECONNREFUSED') {
                console.log("Databse connection refused, check your db connection", err);
                return res.status(200).json({
                    success: false,
                    statusCode: 500,
                    message: 'Databse connection refused, check your db connection',
                    data: err,
                });
            } else if (response.data.code === 'ER_ACCESS_DENIED_ERROR') {
                console.log("Database access denied for user, check your db credentials", err);
                return res.status(200).json({
                    success: false,
                    statusCode: 500,
                    message: 'Database access denied for user, check your db credentials',
                    data: err,
                });
            }
        } else if (result) {
            // let response = {
            //     success: true,
            //     statusCode: 200,
            //     message: 'Database connection established',
            //     data: result
            // }
            // console.log("Database connection established", response);
            next();
        }
    });
}

module.exports = {
    connection,
    dbConnection
};