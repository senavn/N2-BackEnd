var config = require('config.json');
var express = require('express');
var router = express.Router();

var FazendaService = require('services/Fazenda.service')

// routes
router.post('/register', registerFazenda);
router.get('/:_id', getCurrentFazenda);
router.put('/:_id', updateFazenda);
router.delete('/:_id', deleteFazenda);
router.get('/',getAllFazenda);

module.exports = router;

function getAllFazenda(req,res){
    FazendaService.getAll()
        .then(function (Fazendas) {
            res.send(Fazendas);
        })
        .catch(function (err){
            res.status(400).send(err);
        });
}

function registerFazenda(req, res) {
    FazendaService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentFazenda(req, res) {
    FazendaService.getById(req.params._id)
        .then(function (Fazenda) {
            if (Fazenda) {
                res.send(Fazenda);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateFazenda(req, res) {
    FazendaService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteFazenda(req, res) {
    FazendaService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}