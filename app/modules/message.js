'use strict';

const
  db         = require('./db'),
  util       = require('util'),
  ObjectId   = require('mongodb').ObjectId,

  COLLECTION = 'messages';

function _parse (fromid, to, body) {
  if ((typeof fromid == 'undefined') ||
      (!body.message || !body.title) ||
      (!to || !util.isArray(to) || !to.length)) {

    throw Error('Invalid message');
  }

  let messages = [];
  for (let i = 0; i < to.length; i++) {
    messages.push({
      from: fromid,
      to: to[i] + '',
      message: body.message,
      title: body.title
    });
  }
  return messages;
}

function _query (query) {
  return new Promise(function (resolve, reject) {
    db(function (error, db) {
      if (error) {
        console.log('Conn fail', error.message);
        return reject(error.message);
      }
      if ('_id' in query) {
        query._id = ObjectId(query._id);
      }
      console.log('Query', query);
      let col = db.collection(COLLECTION);
      col.find(query).toArray(function(e, docs) {
        if(e) {
          reject(e)
        } else {
          console.log("Result ", docs.length);
          resolve(docs);
        }
        db.close();
      });
    });
  });
}

function _send(messages) {
  return new Promise(function (resolve, reject) {
    db(function (error, db) {
      if (error) {
        console.log('Conn fail', error.message);
        return reject(error.message);
      }
      let col = db.collection(COLLECTION);
      col.insertMany(messages, {}, function (e, result) {
        if (e) {
          reject(e)
        } else {
          let _return = [];
          for (let i = 0; i < result.insertedIds.length; i++) {
            _return.push({
              user: messages[i].to,
              title: messages[i].title,
              _id: result.insertedIds[i] + ''
            })
          }
          resolve(_return);
        }
        db.close();
      });
    });
  });
}

exports.query  = _query;
exports.send   = _send;
exports.parse  = _parse;
