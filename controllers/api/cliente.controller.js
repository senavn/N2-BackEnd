var config = require('config.json');
var express = require('express');
var router = express.Router();

var ClienteService = require('services/Cliente.service')

// routes
router.post('/register', registerCliente);
router.get('/:_id', getCurrentCliente);
router.put('/:_id', updateCliente);
router.delete('/:_id', deleteCliente);
router.get('/',getAllCliente);

module.exports = router;

function getAllCliente(req,res){
    ClienteService.getAll()
        .then(function (Clientes) {
            res.send(Clientes);
        })
        .catch(function (err){
            res.status(400).send(err);
        });
}

function registerCliente(req, res) {
    ClienteService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentCliente(req, res) {
    ClienteService.getById(req.params._id)
        .then(function (Cliente) {
            if (Cliente) {
                res.send(Cliente);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateCliente(req, res) {
    ClienteService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteCliente(req, res) {
    ClienteService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}