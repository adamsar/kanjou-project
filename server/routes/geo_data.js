/*jslint node: true */
'use strict';
var mongoose = require('mongoose'),
    _ = require('underscore'),
    moment = require('moment');

var ObjectId = mongoose.Schema.Types.ObjectId;

var EmotionalTweet = mongoose.model('EmotionalTweet'),
    queryDefaults = {
	start: 0,
	limit: 100
    };

function queryBuild(query, param, dict){
    if(query[param]){
	dict[param] = query[param];
    }else if(queryDefaults[param]){
	dict[param] = queryDefaults[param];
    }
    return dict;
}

function objectIdWithTimestamp(timestamp){
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }

    // Convert date object to hex seconds since Unix epoch
    var hexSeconds = Math.floor(timestamp/1000).toString(16);

    // Create an ObjectId with that hex timestamp
    var constructedObjectId = ObjectId(hexSeconds + "0000000000000000");

    return constructedObjectId
}

module.exports.geo = {
    all: function(req, res){
	var latlon = req.params.latlon.split(','),
	    query = {};
	query.latlon = [parseFloat(latlon[0]), parseFloat(latlon[1])];
	//Add more query params based on stuff like type of emotion
	_.each(['start', 'limit'], 
	       function(param){ query = queryBuild(req.query, param, query);});
	console.info(query);
	EmotionalTweet.find({
	    location: { 
		$near: query.latlon, $maxDistance: 2 
	    },
//	    _id: {
//		$gt: objectIdWithTimestamp(moment().subtract('days', 2))
//	    }
	})
//	    .sort("-_id")
	    .limit(query.limit)
	    .skip(query.start)
	    .exec(function(err, docs){
		if(err){
		    console.info(err);
		}
		res.json(docs);
	    });
    }
};
