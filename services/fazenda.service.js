var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('Fazenda');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;
service.update = update;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.Fazenda.find({}).toArray(function (err, result) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(result);
    });

    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    db.Fazenda.findById(_id, function (err, question) {
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
    createFazenda();
    function createFazenda() {
        var question = _.omit(createQuestion);

        db.Fazenda.insert(
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

    db.Fazenda.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function update(_id, FazendaParam) {
    var deferred = Q.defer();

    db.Fazenda.findById(_id, function (err, Fazenda) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (Fazenda.codFazenda !== FazendaParam.codFazenda) {
            db.Fazenda.findOne(
                { codFazenda: FazendaParam.codFazenda },
                function (err, Fazenda) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (Fazenda) {
                        // Fazendaname already exists
                        deferred.reject('Já existem um Fazenda com esse código: "' + req.body.codFazenda )
                    } else {
                        updateFazenda();
                    }
                });
        } else {
            updateFazenda();
        }
    });

    function updateFazenda() {
        // fields to update
        var set = {          
            EnderecoFZ: FazendaParam.EnderecoFZ,
            CidadeFZ: FazendaParam.CidadeFZ,
            EstadoFZ: FazendaParam.EstadoFZ,
            ClienteID: FazendaParam.ClienteID,
            nmHectaresFZ: FazendaParam.nmHectaresFZ,
            NomeFZ: FazendaParam.NomeFZ
        };

        db.Fazenda.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}