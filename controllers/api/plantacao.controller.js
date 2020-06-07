var config = require('config.json');
var express = require('express');
var router = express.Router();

var PlantacaoService = require('services/Plantacao.service')

// routes
router.post('/register', registerPlantacao);
router.get('/:_id', getCurrentPlantacao);
router.put('/:_id', updatePlantacao);
router.delete('/:_id', deletePlantacao);
router.get('/',getAllPlantacao);

module.exports = router;

function getAllPlantacao(req,res){
    PlantacaoService.getAll()
        .then(function (Plantacaos) {
            res.send(Plantacaos);
        })
        .catch(function (err){
            res.status(400).send(err);
        });
}

function registerPlantacao(req, res) {
    PlantacaoService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentPlantacao(req, res) {
    PlantacaoService.getById(req.params._id)
        .then(function (Plantacao) {
            if (Plantacao) {
                res.send(Plantacao);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updatePlantacao(req, res) {
    PlantacaoService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deletePlantacao(req, res) {
    PlantacaoService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}