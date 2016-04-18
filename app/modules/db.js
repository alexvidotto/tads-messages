'use strict'

const
  MongoClient = require('mongodb').MongoClient,
  mongoUri = 'mongodb://tads:tads@ds011251.mlab.com:11251/tads-messages';

module.exports = function (callback) {
  MongoClient.connect(mongoUri, function(err, db) {
    callback(err, db);
  });
};
