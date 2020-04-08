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
    createUser();
    function createUser() {
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