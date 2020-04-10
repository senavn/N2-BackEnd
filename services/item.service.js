var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('item');

var service = {};

service.getAll = getAll;
service.getById = getById;
service.create = create;
service.delete = _delete;
service.update = update;

module.exports = service;

function getAll() {
    var deferred = Q.defer();

    db.item.find({}).toArray(function (err, result) {
        if (err)
            deferred.reject(err.name + ': ' + err.message);

        deferred.resolve(result);
    });

    return deferred.promise;
}


function getById(_id) {
    var deferred = Q.defer();

    db.item.findById(_id, function (err, question) {
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
    createitem();
    function createitem() {
        var question = _.omit(createQuestion);

        db.item.insert(
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

    db.item.remove(
        { _id: mongo.helper.toObjectID(_id) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}

function update(_id, itemParam) {
    var deferred = Q.defer();

    db.item.findById(_id, function (err, item) {
        if (err) deferred.reject(err.name + ': ' + err.message);

        if (item.codItem !== itemParam.codItem) {
            db.item.findOne(
                { codItem: itemParam.codItem },
                function (err, item) {
                    if (err) deferred.reject(err.name + ': ' + err.message);

                    if (item) {
                        // itemname already exists
                        deferred.reject('Já existem um item com esse código: "' + req.body.codItem )
                    } else {
                        updateitem();
                    }
                });
        } else {
            updateitem();
        }
    });

    function updateitem() {
        // fields to update
        var set = {
            codItem: itemParam.codItem,
            dtEntrada: itemParam.dtEntrada,
            tipoItem: itemParam.tipoItem,
            marcaItem: itemParam.marcaItem,
            caracteristica: itemParam.caracteristica,
            tamanhoItem: itemParam.tamanhoItem,
            corItem: itemParam.corItem,
            valorEtiquetaCompraItem: itemParam.valorEtiquetaCompraItem,
            valorPagoItem: itemParam.valorPagoItem,
            valorPagoMargemItem: itemParam.valorPagoMargemItem,
            precoSugeridoItem: itemParam.precoSugeridoItem
        };

        db.item.update(
            { _id: mongo.helper.toObjectID(_id) },
            { $set: set },
            function (err, doc) {
                if (err) deferred.reject(err.name + ': ' + err.message);

                deferred.resolve();
            });
    }

    return deferred.promise;
}