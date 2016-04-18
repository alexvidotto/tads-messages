'use strict';

const
  db              = require('./db'),
  message         = require('./message'),

  MSG_COLLECTION  = 'messages',
  USER_COLLECTION = 'users';

function drop (collection) {
  return new Promise(function (resolve, reject) {
    // drop collection
    db(function (e, db){
      if (e) {
        reject(e);
        return;
      }
      function _resolve () {
        console.log('Collection ' + collection + ' was successfully dropped');
        db.close();
        resolve();
      }
      let col = db.collection(collection);
       col.drop(function(err, r) {
         if (err) {
           if (err.message == 'ns not found') {
             return _resolve();
           }
           console.log(err);
           reject(err);
         } else {
           _resolve();
         }
       });
    });
  });
}

function setUsers () {
  return new Promise(function (resolve, reject) {
    let users = [
      { _id: '1', user: 'joao', pw: 'joao' },
      { _id: '2', user: 'carlos', pw: 'carlos' },
      { _id: '3', user: 'maria', pw: 'maria' },
      { _id: '4', user: 'priscila', pw: 'priscila' },
      { _id: '5', user: 'talita', pw: 'talita' },
      { _id: '6', user: 'alex', pw: 'alex' }
    ];
    db(function (e, db){
      if (e) {
        reject(e);
        return;
      }
      let col = db.collection(USER_COLLECTION);
       col.insertMany(users, {}, function(err, r) {
         if (err) {
           console.log(err);
           return reject(err);
         }
         console.log('Users has been added')
         db.close();
         resolve();
       });
    });
  });
}

function setMessages () {
  let messages = [];
  for (let i = 1; i <= 6;i++) {
    messages.push({
      from: i + '',
      to: (i == 6 ? 1 : i + 1) + '',
      message: 'Bem-vindo(a) ao sistema de mensagens',
      title: 'Bem-vindo(a)'
    });
  }
  return message.send(messages).then(function () {
    console.log('Messages has been added')
    return Promise.resolve();
  });
}

module.exports = function () {
  console.log('Setuping application');
  debugger;
  return Promise.resolve().then(function () {
    // drop messages
    return drop(MSG_COLLECTION);
  }).then(function () {
    // drop users
    return drop(USER_COLLECTION);
  }).then(function () {
    // set initials users
    return setUsers();
  }).then(function () {
    // set initials wellcome messages
    return setMessages();
  }).catch(function (e) {
    // if any exception, interrupt program
    console.log(e.message)
    process.exit(1);
  });
};
