var https = require('https')
	, querystring = require('querystring')
	, jwt = require('jsonwebtoken')
	;

module.exports = {
	reset: function (req, res) {

		var post_data = querystring.stringify({
			'grant_type' : 'refresh_token',
			'client_id': '<client_id>',
			'client_secret': '<client_secret>',
			'refresh_token' : req.user.oauthConnections.refreshToken
		});

		var options = {
			hostname: 'apps.na.collabserv.com',
  			port: 443,
  			path: '/manage/oauth2/token',
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/x-www-form-urlencoded'
  				, 'Content-Length': Buffer.byteLength(post_data)
  			}
		};

		var req = https.request(options, function(respuesta) {
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
		  			var parsed = JSON.parse(body);

		  			req.user.oauthConnections = {
		                accessToken: parsed.accessToken,
		                refreshToken: parsed.refreshToken,
		                params: {
		                	'issued_on': parsed.issued_on,
		                	'expires_in': parsed.expires_in,
		                	'token_type': parsed.token_type
		                }
		            };

		            var token = jwt.sign(profile, 'IBMConnectionsCloud.01012016', {
		                expiresIn: '12h' // expires in 2 hours
		            });

		            var user = {
		                displayName : req.user.displayName,
		                email: req.user.emails[0].value,
		                token: token
		            };
		  			
			        res.status(200).json(user);
			        return;
		  		} else {
		  			console.log('status message', respuesta.statusMessage);
		  			res.status(respuesta.statusCode).send(body);
		  		}
	  			
		  	});
		});
		req.write(post_data);
		req.end();

		req.on('error', (e) => {
			console.error(e);
		  	res.status(500).json({
	        	"message": "Error buscando información, por favor intente de nuevo!"
	        });
		});

	}
	, getToken: function (req, res) {

		var post_data = querystring.stringify({
			'code' : req.body.code,
			'grant_type': 'authorization_code',
			'client_id': '<client_id>',
			'client_secret': '<client_secret>',
			'callback_uri' : 'https://<App Name>.mybluemix.net/#/auth/ibm-connections-cloud/callback'
		});

		var options = {
			hostname: 'apps.na.collabserv.com',
  			port: 443,
  			path: '/manage/oauth2/token',
  			method: 'POST',
  			headers: {
  				'Content-Type': 'application/x-www-form-urlencoded'
  				, 'Content-Length': Buffer.byteLength(post_data)
  			}
		};

		var req = https.request(options, function(respuesta) {
			
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
		  			
		  			var partido = body.split("&");

		  			console.log("BODY::::",body);

		  			req.oauthConnections = {
		                accessToken: partido[0].split("=")[1],
		                refreshToken: partido[1].split("=")[1],
		                params: {
		                	'issued_on': partido[2].split("=")[1],
		                	'expires_in': partido[3].split("=")[1],
		                	'token_type': partido[4].split("=")[1]
		                }
		            };
		            //
		            var token = jwt.sign(req.oauthConnections, 'IBMConnectionsCloud.01012016', {
		                expiresIn: '2h' // expires in 2 hours
		            });

			        res.status(200).json(token);
			        return;
		  		} else {
		  			console.error('status message', respuesta.statusMessage);
		  			res.status(respuesta.statusCode).send(body);
		  		}
	  			
		  	});
		});
		req.write(post_data);
		req.end();

		req.on('error', (e) => {
			console.error(e);
		  	res.status(500).json({
	        	"message": "Error buscando información, por favor intente de nuevo!"
	        });
		});

	}
}