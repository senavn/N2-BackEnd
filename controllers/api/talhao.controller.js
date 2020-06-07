var config = require('config.json');
var express = require('express');
var router = express.Router();

var TalhaoService = require('services/Talhao.service')

// routes
router.post('/register', registerTalhao);
router.get('/:_id', getCurrentTalhao);
router.put('/:_id', updateTalhao);
router.delete('/:_id', deleteTalhao);
router.get('/',getAllTalhao);

module.exports = router;

function getAllTalhao(req,res){
    TalhaoService.getAll()
        .then(function (Talhaos) {
            res.send(Talhaos);
        })
        .catch(function (err){
            res.status(400).send(err);
        });
}

function registerTalhao(req, res) {
    TalhaoService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentTalhao(req, res) {
    TalhaoService.getById(req.params._id)
        .then(function (Talhao) {
            if (Talhao) {
                res.send(Talhao);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateTalhao(req, res) {
    TalhaoService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteTalhao(req, res) {
    TalhaoService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}