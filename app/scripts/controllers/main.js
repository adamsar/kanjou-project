'use strict';
angular.module('kanjouMapApp')
  .controller('MainCtrl', function ($scope, cities) {
      $scope.cities = cities;
      $scope.currentCity = cities[0];      
      $scope.navClass = function(city){
	  return $scope.currentCity == city?'active':'';
      };
      $scope.setCurrent = function(city){
	  $scope.currentCity = city;
      }
  });
