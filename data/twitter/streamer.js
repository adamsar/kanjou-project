var util = require("util"),
    config = require("../../config"),
    twitter = require("twitter"),
    kanjou_api = require("../kanjou/metadata_api"),
    mongoose = require("mongoose"),
    Tweet = require("../../server/models/tweet");

mongoose.connect('mongodb://localhost/tweets');

function endsWith(str, suffix){
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}

function validTweet(tweet){
  return (tweet.lang == 'ja' &&
          tweet.text.length > 28 &&
                !endsWith(tweet.text, "笑") &&
                !endsWith(tweet.text, "ww"));
}

var twit = new twitter({
  consumer_key: config.twitter_consumer_key,
  consumer_secret: config.twitter_consumer_secret,
  access_token_key: config.twitter_token_key,
  access_token_secret: config.twitter_token_secret
});

var japan = '125,27,140,43';

function saveTweet(tweet){
  kanjou_api.getData(tweet.text, function(data){
    var pic = null;
    if(data.joysad != 0 || data.likedislike != 0 || data.angerfear != 0){
      try{
        if(tweet.entities && tweet.entities.media){
          pic = tweet.entities.media[0].media_url; //Twit-pics
          console.info(pic);
        }
        var tweet_model = new Tweet({
          user_id: tweet.user.id_str,
          name: tweet.user.name,
          profile_name: tweet.user.screen_name,
          text: tweet.text,
          pic: pic,
          location: tweet.geo.coordinates,
          profile_pic: tweet.user.profile_image_url,
          kanjoData: {
            joysad: data.joysad,
            likedislike: data.likedislike,
            angerfear: data.angerfear
          }
        });

        tweet_model.save(function(error){
          if(error){
            console.info(util.inspect(error));
          }
        });
        console.info(tweet_model);
      }catch(err){
        console.info("Error ingesting tweet: " + err);
      }
    }
  });
}

function doStream(){
try{
    twit.stream('filter', {locations: japan, language: 'ja'}, function(stream){
      stream.on('data', function(tweet){
        if(validTweet(tweet)){
          saveTweet(tweet);
        }else{
          console.info("Invalid tweet: Tweet(lang=" + tweet.lang + ", text=" + tweet.text + ")");
        }
      });
      stream.on('error', function(error){
        console.info(util.inspect(error));
      });
    });
  }catch(err){
    console.info(err);
    doStream();
  }
}

doStream();
