var config = require('config.json');
var express = require('express');
var router = express.Router();

var itemService = require('services/item.service')

// routes
router.post('/register', registeritem);
router.get('/:_id', getCurrentitem);
router.put('/:_id', updateitem);
router.delete('/:_id', deleteitem);
router.get('/',getAllitem);

module.exports = router;

function getAllitem(req,res){
    itemService.getAll()
        .then(function (items) {
            res.send(items);
        })
        .catch(function (err){
            res.status(400).send(err);
        });
}

function registeritem(req, res) {
    itemService.create(req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function getCurrentitem(req, res) {
    itemService.getById(req.params._id)
        .then(function (item) {
            if (item) {
                res.send(item);
            } else {
                res.sendStatus(404);
            }
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function updateitem(req, res) {
    itemService.update(req.params._id, req.body)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}

function deleteitem(req, res) {
    itemService.delete(req.params._id)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
}