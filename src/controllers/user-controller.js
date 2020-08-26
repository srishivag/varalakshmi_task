const dateFormat = require('dateformat');
const jwt = require('jsonwebtoken');
const SessionStorage = require('sessionstorage');
var userquery = require('../library/userquery.js');
var config = require('../config/config.js');
var users = require('../models/User.js');
var moment = require('moment');

// user Login API
module.exports.userLogin = (req, res, next) => {

    console.log("request fields are:", req.body);

    if (!req.body.username || !req.body.password) {
        return res.status(200).json({
            success: false,
            statusCode: 204,
            message: 'Required fields are empty, Please check once',
            data: null
        });
    }

    let wherecond = `username='${req.body.username}' AND password='${req.body.password}'`;

    (async () => {
        await userquery.simpleselect('users', '*', wherecond).then(async result => {
            console.log("response is:", result);
            if (result == '' || result == null || result == []) {
                console.log("Invalid username or password");
                return res.status(200).json({
                    success: false,
                    statusCode: 404,
                    message: 'Invalid username or password',
                    data: null
                });
            }
            if (result[0].configure == 'Blocked') {
                console.log("User is blocked");
                return res.status(200).json({
                    success: false,
                    statusCode: 405,
                    message: 'User is blocked',
                    data: null
                });
            }
            await userquery.updateTableWithWhere('users', `user_id=${result[0].user_id}`, { status: 'Active' }).then(resp => {
                console.log("Login successful", resp);
                var token = jwt.sign({
                    id: result[0].username
                }, config.database.securitykey, {
                    expiresIn: '24h'
                });
                console.log("token is:", token);
                SessionStorage.setItem('token', token);
                res.status(200).json({
                    success: true,
                    statusCode: 200,
                    message: 'Login successful',
                    data: result,
                    token: token,
                    id: result[0].username,
                    role: result[0].role,
                    firstname: result[0].firstname,
                    lastname: result[0].lastname,
                    password: result[0].password,
                    phonenumber: result[0].phonenumber,
                    designation: result[0].designation,
                    department: result[0].department,
                    created_at: result[0].created_at
                });
            }).catch(err => {
                console.log("Error while activate user", err);
                res.status(200).json({
                    success: false,
                    statusCode: 500,
                    message: 'Error while activate user',
                    data: err
                });
            })
        }).catch(err => {
            console.log("Error while login", err);
            res.status(200).json({
                success: false,
                statusCode: 500,
                message: 'Error while login',
                data: err
            });
        })
    })();
}

