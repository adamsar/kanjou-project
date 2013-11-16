/*jslint node: true */
'use strict';
var mongoose = require('mongoose');
var EmotionalTweet = mongoose.model('EmotionalTweet');

module.exports.geo = {
    all: function(req, res){
	var latlon = req.params.latlon.split(',');
	latlon[0] = parseFloat(latlon[0]);
	latlon[1] = parseFloat(latlon[1]);
	console.info("Looking for " + latlon);
	EmotionalTweet.find({ location: { $near: latlon, $maxDistance: 5 } },
			    function(err, docs){
				res.json(docs);
			    });	
    }
};
