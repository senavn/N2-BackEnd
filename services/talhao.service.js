var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('Talhao');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;
service.update = update;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.Talhao.find({}).toArray(function (err, result) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(result);
    });

    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    db.Talhao.findById(_id, function (err, question) {
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
    createTalhao();
    function createTalhao() {
        var question = _.omit(createQuestion);

        db.Talhao.insert(
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

    db.Talhao.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function update(_id, TalhaoParam) {
    var deferred = Q.defer();

    db.Talhao.findById(_id, function (err, Talhao) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (Talhao.codTalhao !== TalhaoParam.codTalhao) {
            db.Talhao.findOne(
                { codTalhao: TalhaoParam.codTalhao },
                function (err, Talhao) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (Talhao) {
                        // Talhaoname already exists
                        deferred.reject('Já existem um Talhao com esse código: "' + req.body.codTalhao )
                    } else {
                        updateTalhao();
                    }
                });
        } else {
            updateTalhao();
        }
    });

    function updateTalhao() {
        // fields to update
        var set = {
            codTalhao: TalhaoParam.codTalhao,
            fazendaID: TalhaoParam.fazendaID,
            caracteristica: TalhaoParam.caracteristica,
            tamanhoTalhao: TalhaoParam.tamanhoTalhao,
            plantacaoID: TalhaoParam.plantacaoID
        };

        db.Talhao.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}