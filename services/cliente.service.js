var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('Cliente');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;
service.update = update;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.Cliente.find({}).toArray(function (err, result) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(result);
    });

    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    db.Cliente.findById(_id, function (err, question) {
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
    createCliente();
    function createCliente() {
        var question = _.omit(createQuestion);

        db.Cliente.insert(
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

    db.Cliente.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function update(_id, ClienteParam) {
    var deferred = Q.defer();

    db.Cliente.findById(_id, function (err, Cliente) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (Cliente.codCliente !== ClienteParam.codCliente) {
            db.Cliente.findOne(
                { codCliente: ClienteParam.codCliente },
                function (err, Cliente) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (Cliente) {
                        // Clientename already exists
                        deferred.reject('Já existem um Cliente com esse código: "' + req.body.codCliente )
                    } else {
                        updateCliente();
                    }
                });
        } else {
            updateCliente();
        }
    });

    function updateCliente() {
        // fields to update
        var set = {
            Nome: ClienteParam.Nome,
            Login: ClienteParam.Login,
            Senha: ClienteParam.Senha,
            Status: ClienteParam.Status,
            dataRegister: ClienteParam.dataRegister
        };

        db.Cliente.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}