var userquery = require('../library/userquery.js');
var User = require('../models/User.js');
var User = require('../models/Customer.js');
var config = require('../config/config.js');
const fs = require('fs');
const path = require('path');
 

// Get All Users API's
module.exports.getUsers = async (req, res, next) => {
    let offset = Number(req.body.page) * Number(req.body.perpage);
    let limit = Number(req.body.perpage);
    let fullresp;
    let total;
    console.log(req.body,'%%%%%%%%%%%%%%%%%%%%%%');
    await userquery.simpleselect('users', '*',`role!='customer'`).then(resp1 => {
        total = resp1.length;
       // fullresp = resp1;
    }).catch(err => {
        res.status(200).send(err);
    })
    await userquery.filterTable('users', '*',`role!='customer'`, limit, offset).then(resp => {
        
       res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'User data read successfully',
            data: resp,
           // data1: fullresp,
            total: total
        });
    }).catch(err => {
        res.status(200).send(err);
    })
}

module.exports.updateUser = (req, res, next) => {
}

// Upadate User by id API's
module.exports.updateUserById = (req, res, next) => {
    userquery.updateTableWithWhere('users', `user_id=${req.body.user_id} or username='${req.body.username}'`, req.body).then(resp => {
        console.log("User details updated successful");
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'User details updated successful',
            data: resp
        });
    }).catch(err => {
        console.log("Error while updating user details", err);
        res.status(200).json({
            success: false,
            statusCode: 500,
            message: 'Error while updating user details',
            data: err
        });
    })
}

/**add customer */
module.exports.addCustomercon = (req, res, next) => {
    console.log('a m i n', req.body);
    userquery.insertTable('customers', req.body).then(resp => {
        console.log(resp, 'resppppppp');
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Data inserted successfully',
            data: resp
        });
    }).catch(err => {
        res.status(200).send(err);
    })
}

/**get all customers */
module.exports.getAllCustomerscon = (req, res, next) => {
    userquery.simpleselect('customers', '*').then(resp => {
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'User data read successfully',
            data: resp
        });
    }).catch(err => {
        res.status(200).send(err);
    })
}

/**update customer */
module.exports.updateCustomercon = (req, res, next) => {
    let obj = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    }
    userquery.updateTableWithWhere('users', `user_id=${req.body.user_id}`, obj).then(resp => {
        console.log("Customer details updated successful");
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Customer details updated successful',
            data: resp
        });
    }).catch(err => {
        console.log("Error while updating Customer details", err);
        res.status(200).json({
            success: false,
            statusCode: 500,
            message: 'Error while updating Customer details',
            data: err
        });
    })
}

/**delete customer */
module.exports.deleteCustomerCon = (req, res, next) => {
    userquery.updateTableWithWhere('users', `user_id = '${req.body.user_id}'`, { status: "Inactive" }).then(resp => {
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Data deleted successfully',
            data: resp
        });
    }).catch(err => {
        res.status(200).send(err);
    })
}
