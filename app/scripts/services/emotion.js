'use strict';
angular.module('kanjouMapApp')
    .factory('geoEmotion', function($http){
	console.debug("geo");
	var endpointBase = "/data/";
	return {
	    entries: function(latlon, cb){
		var url = endpointBase + latlon.join();
		$http.get(url).success(cb).
		    error(function(data){
			console.info("Error retrieving data for " + url + ": " + data);
		    });
	    }
	};
    });
