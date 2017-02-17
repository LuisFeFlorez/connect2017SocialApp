var express = require('express') 
  , router = express.Router()
  , jwt = require('jsonwebtoken')
  , Controller = require('../../../controllers/activityStream');

router.get('/', isLoggedIn, function(req, res) {
  Controller.getStream(req, res);
});

router.get('/contact/:user_id', isLoggedIn, function(req, res) {
  Controller.getBasicInfo(req, res);
});

router.get('/:communityId', isLoggedIn, function(req, res) {
  Controller.getCommunityStream(req, res);
});

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    
    var token = req.body.token || req.headers['x-access-token'];

    // decode token
 	if (token) {
 		// verifies secret and checks exp
 		jwt.verify(token, 'IBMConnectionsCloud.01012016', function(err, decoded) {
 			if (err) {
				return res.status(401).send({
					success: false,
					message: 'Failed to authenticate token.'
				});
		 	} else {
		 		// if everything is good, save to request for use in other routes
		 		req.oauthConnections = decoded;
		 		return next();

		 	}
 		});

 	} else {

		// if there is no token
		// return an HTTP response of 403 (access forbidden) and an error message
		return res.status(401).send({
			success: false,
			message: 'No token provided.'
		});
	}
}

module.exports = router;