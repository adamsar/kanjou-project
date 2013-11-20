'use strict';
angular.module('kanjouMapApp')
  .controller('MainCtrl', function ($scope, cities, geoEmotion, colors) {
      $scope.cities = cities;
      $scope.data = [];
      $scope.currentCity = cities[0];
      $scope.navClass = function(city){
	  return $scope.currentCity == city?'active':'';
      };

      $scope.setCurrent = function(city){
	  $scope.currentCity = city;
      }

      $scope.updateData = function(){
	  geoEmotion.entries($scope.currentCity.latlon, function(data){
	      if(!_.isEqual($scope.data, data)){
		  $scope.data = _.sortBy(data, function(item){
		      var timestamp = item._id.substring(0, 8);
		      var date = new Date( parseInt( timestamp, 16 ) * 1000 )
		      return date;
		  });
		  console.debug('sorted');

	      }
	  });
      }
      setInterval(function(){ $scope.updateData(); }, 2000);
  });
