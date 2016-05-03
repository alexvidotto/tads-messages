'use strict';

const
  express       = require('express'),
  router        = express.Router(),
  message       = require('../../modules/message'),

  LIST_BY_USER  = '/user/:userid',
  SEND          = '/user/:userid',
  GET_MESSAGE   = '/:msgid';

router.get(LIST_BY_USER, function(req, res, next) {
  message.query({ to: req.params.userid }).then(function (result) {
    return _resOK(res, result);
  }).catch(function (e) {
    return _resError(res, e);
  });
});

router.get(GET_MESSAGE, function(req, res, next) {
  message.query({ _id: req.params.msgid }).then(function (result) {
    return _resOK(res, result);
  }).catch(function (e) {
    return _resError(res, e);
  });
});

router.post(SEND, function(req, res, next) {
  let fromid = req.params.userid;
  let to     = req.body.to;
  return Promise.resolve().then(function () {
    // parse incoming message
    return message.parse(fromid, req.body.to, req.body);
  }).then(function (msgs) {
    // send to database
    return message.send(msgs);
  }).then(function (msgs) {
    // notify all users
    return notify(msgs);
  }).then(function (msgs) {
    return _resOK(res, msgs);
  }).catch(function (e) {
    return _resError(res, e);
  });
});

function notify (msgs) {
  // send websocket message
  return new Promise(function (resolve, reject) {
    resolve(msgs);
  });
}

function _resError(res, e) {
  let msg = e.message || e;
  console.log(msg);
  res.status(500).json({
    status: 'ERROR',
    error: msg
  });
}

function _resOK(res, result) {
  res.json({
    status: 'OK',
    result: result || []
  });
}

module.exports = router;
