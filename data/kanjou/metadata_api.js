var config = require('../../config'),
    util = require('util'),
    http = require('http');

var endpoint = "http://ap.mextractr.net/ma9/emotion_analyzer?out=json&apikey=%s&text=%s"
module.exports = {
    getData: function(text, handler){
	http.get(util.format(endpoint, config.kanjou_key, text), function(res){
	    var body = "";
	    res.on('data', function(chunk){ body += chunk; });
	    res.on('error', function(error){ console.info(error); });
	    res.on('end', function(){ 
		try{
		    var data = JSON.parse(body);
		    handler(data); 
		}catch(err){
		    console.info(err)
		}

	    });
	});
    }
};
