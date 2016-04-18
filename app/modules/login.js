'use strict';

const
  db         = require('./db'),
  COLLECTION = 'users';

module.exports = function (query) {
  return new Promise (function (resolve, reject) {
    db(function (error, db) {
      if (error) {
        console.log('Conn fail', error.message);
        return reject(error.message);
      }
      console.log('Trying login', query);
      let col = db.collection(COLLECTION);
      col.find(query).toArray(function(e, docs) {
        if(e) {
          reject(e)
        } else {
          console.log("Result ", docs.length);
          resolve(!!docs.length);
        }
        db.close();
      });
    });
  });
}
