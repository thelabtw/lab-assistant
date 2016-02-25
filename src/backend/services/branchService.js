'use strict';

const models = require('../models'),
    temporaryLogger = require('../lib/logger').temporarySolution,
    Branch = models.Branch;

function handleError(message) {
    return function(error) {
        temporaryLogger.error(message, { error: error.toString() });
        return models.Sequelize.Promise.reject(message);
    };
}

let transformBranch = dbResult => {
    return dbResult.dataValues;
};

function transformBranches(adapter) {
    return function (dbResult) {
        return dbResult.map(adapter);
    };
}

let list = () => {
    let query = {
        attributes: [
            'key',
            'name'
        ]
    };

    return Branch.findAll(query)
        .then(transformBranches(transformBranch))
        .catch(handleError('An error has occurred while fetching branches'));
};

module.exports = {
    list: list
};