var https = require('https')
	, removeMd = require('remove-markdown')
	, watson = require('watson-developer-cloud')
	;

module.exports = {
	personalidad: function (req, res) {

		var textoPlano = removeMd(req.body.texto);

		var personality_insights = watson.personality_insights({
			username: '<username>',
			password: '<password>',
			version: 'v2'
		});

		personality_insights.profile({
  			text: textoPlano,
  			language: 'es' },
  			function (err, response) {
			    if (err)
			      console.error('error en personalidad:', err);
			    else {
			      res.status(200).json(JSON.stringify(response, null, 2));
			    }
			}
		);
	}
}