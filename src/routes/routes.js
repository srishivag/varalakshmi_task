const express = require('express');
var router = express.Router();
var userCtrl = require('../controllers/user-controller');
var custCtrl = require('../controllers/customer-controller.js');

// Server routes
router.get('/server', (req, res, next) => {
    console.log("API works!");
    res.status(200).json({
        success: true,
        statusCode: 200,
        message: 'API works!'
    });
});
router.post('/login', userCtrl.userLogin);

router.post('/getUsers', custCtrl.getUsers);


module.exports = router;