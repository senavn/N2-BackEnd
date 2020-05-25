var config = require('config.json');
var express = require('express');
var router = express.Router();

var LoginService = require('services/Login.service')

// routes
router.post('/register', registerLogin);
router.get('/:login', getCurrentLogin);

module.exports = router;


function registerLogin(req, res) {
    LoginService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentLogin(req, res) {
    LoginService.getById(req.params.login)
        .then(function (Login) {
            if (Login) {
                res.send(Login);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

