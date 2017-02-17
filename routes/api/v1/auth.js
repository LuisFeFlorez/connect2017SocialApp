var express = require('express') 
  , router = express.Router()
  , jwt = require('jsonwebtoken')
  , Controller = require('../../../controllers/auth');

router.post('/', function(req, res) {
  Controller.getToken(req, res);
});

module.exports = router;