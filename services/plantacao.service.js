var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('Plantacao');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;
service.update = update;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.Plantacao.find({}).toArray(function (err, result) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(result);
    });

    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    db.Plantacao.findById(_id, function (err, question) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (question) {
            deferred.resolve(question);
        } else {
            // question not found
            deferred.resolve();
        }
    });

    return deferred.promise;
}

function create(createQuestion) {
    var deferred = Q.defer();
    createPlantacao();
    function createPlantacao() {
        var question = _.omit(createQuestion);

        db.Plantacao.insert(
            question,
            function (err, doc) {
                if (err) deferred.reject(err);

                deferred.resolve();
            });
    }

    return deferred.promise;
}

function _delete(_id) {
    var deferred = Q.defer();

    db.Plantacao.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function update(_id, PlantacaoParam) {
    var deferred = Q.defer();

    db.Plantacao.findById(_id, function (err, Plantacao) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (Plantacao.codPlantacao !== PlantacaoParam.codPlantacao) {
            db.Plantacao.findOne(
                { codPlantacao: PlantacaoParam.codPlantacao },
                function (err, Plantacao) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (Plantacao) {
                        // Plantacaoname already exists
                        deferred.reject('Já existem um Plantacao com esse código: "' + req.body.codPlantacao )
                    } else {
                        updatePlantacao();
                    }
                });
        } else {
            updatePlantacao();
        }
    });

    function updatePlantacao() {
        // fields to update
        var set = {
            dtPlantacao: PlantacaoParam.dtPlantacao,
            tipoPlantacao: PlantacaoParam.tipoPlantacao,
            quantidadePlantacao: PlantacaoParam.marcaPlantacao,
            caracteristica: PlantacaoParam.caracteristica,
            nmHectares: PlantacaoParam.nmHectaresPlantacao
        };

        db.Plantacao.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}