'use strict';

const
  express       = require('express'),
  router        = express.Router(),
  login         = require('../../modules/login');

router.post('/', function(req, res, next) {
  return Promise.resolve().then(function () {
    return login({ user: req.body.user, pw: req.body.pw });
  }).then(function (success) {
    res.json(success);
  }).catch(function (e) {
    res.json(e);
  });
});

module.exports = router;
