'use strict';
angular.module('kanjouMapApp')
    .controller('TweetCtrl', function($scope, colors){
	$scope.colors = colors;
	$scope.currentEmotion = colors.colorKeys[0];
	$scope.setEmotion = function(emotion){
	    $scope.currentEmotion = emotion;
	}
    });
