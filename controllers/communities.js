var https = require('https')
	, xmlreader = require('xmlreader')
	;

module.exports = {
	getBlogs: function (req, res) {
		
		var options = {
			hostname: 'apps.na.collabserv.com',
  			port: 443,
  			path: '/blogs/' + req.params.communityId + '/api/entries?lang=es_es',
  			method: 'GET',
  			headers: { 'Authorization': 'Bearer ' + req.oauthConnections.accessToken }
		};

		var req = https.request(options, function(respuesta) {
			var body = '';
		  	respuesta.on('data', (d) => {
		    	body += d;
		  	}).on('end', function(){
		  		if (respuesta.statusCode == 200) {
		  			xmlreader.read(body, function (err, result){
						if(err) return console.log(err);

						var blogs = [];

						for(var i = 0; i < result.feed.entry.count(); i++){
							blogs[i] = {
								nombre : result.feed.entry.at(i).title.text(),
								texto : result.feed.entry.at(i).content.text()
							}
						}
		  				res.status(200).json(blogs);
		  				return;
					});
		  		} else {
					res.status(respuesta.statusCode).send(body);
		  		}
		  	});
		});
		req.end();

		req.on('error', (e) => {
			console.error(e);
		  	res.status(500).json({
	        	"message": "Error buscando información, por favor intente de nuevo!"
	        });
		});

	}
}