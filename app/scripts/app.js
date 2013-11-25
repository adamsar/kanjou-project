'use strict';

angular.module('kanjouMapApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'geolocation'
]).config(['$routeProvider', function ($routeProvider) {
    console.debug('tst');
    $routeProvider
	.when('/map', {
	    templateUrl: 'views/map.html',
	    controller: 'MapCtrl'
	})
	.when('/tweet', {
	    templateUrl: '/views/tweet.html',
	    controller: 'TweetCtrl'
	})
	.otherwise({
	    redirectTo: '/map'
	});
}]);
