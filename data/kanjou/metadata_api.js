var config = require('../../config'),
    util = require('util'),
    http = require('http');

var endpoint = "http://ap.mextractr.net/ma9/emotion_analyzer?out=json&apikey=%s&text=%s"
module.exports = {
    getData: function(text, handler){
	http.get(util.format(endpoint, config.kanjou_key, text), function(res){
	    var body = "";
	    res.on('data', function(chunk){ body += chunk; });
	    res.on('end', function(){ handler(JSON.parse(body)); });
	}).on('error', function(error){
	    console.info("Error with kanjou lookup: " + error);
	});
    }
};

