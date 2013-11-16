var util = require("util"),
    config = require("../../config"),
    twitter = require("twitter"),
    mongoose = require("mongoose"),
    Tweet = require("../../server/models/tweet");

mongoose.connect('mongodb://localhost/tweets');

function validTweet(tweet){
    return tweet.lang == 'ja' && tweet.text.length > 60;
}

var twit = new twitter({
    consumer_key: config.twitter_consumer_key,
    consumer_secret: config.twitter_consumer_secret,
    access_token_key: config.twitter_token_key,
    access_token_secret: config.twitter_token_secret
});

var japan = '135,30,140,43'

twit.stream('filter', {locations: japan}, function(stream){
    stream.on('data', function(tweet){
	if(validTweet(tweet)){
	    var tweet = new Tweet({
		user_id: tweet.user.id_str,
		name: tweet.user.name,
		profile_name: tweet.user.screen_name,
		text: tweet.text,
		location: tweet.geo.coordinates,
		profile_pic: tweet.user.profile_image_url	    
	    });
	    tweet.save(function(error){
		if(error){
		    console.info(util.inspect(error));
		}
	    });
	    console.info(tweet);
	}else{
	    console.info("Invalid tweet: Tweet(lang=" + tweet.lang + ", text=" + tweet.text + ")");
	}
    });
    stream.on('error', function(error){
	console.info(util.inspect(error));
    });
});

