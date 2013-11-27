'use strict';

angular.module('kanjouMapApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'geolocation',
    'ui.bootstrap'
]).config(['$routeProvider', function ($routeProvider) {
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
