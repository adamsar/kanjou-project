'use strict';
angular.module('kanjouMapApp')
    .factory('geoEmotion', function($http){
	var endpointBase = "/data/";
	return {
	    entries: function(latlon, params, cb){
		var url = endpointBase + latlon.join();
		if(!cb && params){
		    cb = params;
		    params = null;
		}
		if(params){
		    url += "?";
		    for(var key in params){
			url += key + "=" + params[key] + "&";
		    }
		}
		$http.get(url).success(cb).
		    error(function(data){
			console.info("Error retrieving data for " + url + ": " + data);
		    });
	    }
	};
    });
