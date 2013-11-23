'use strict';
angular.module('kanjouMapApp')
  .controller('MainCtrl', function ($scope, cities, geoEmotion, colors) {
      var updateInterval = null;
      $scope.cities = cities;
      $scope.data = [];
      $scope.currentCity = cities[0];
      $scope.started = false;
      $scope.navClass = function(city){
	  return $scope.currentCity == city?'active':'';
      };

      $scope.setCurrent = function(city){
	  if(!_.isEqual($scope.currentCity,city)){
	      $scope.currentCity = city;
	      $scope.data = [];
	      console.debug("data blank");
	      $scope.$broadcast("dataBlank");
	      bootstrapData();
	  }
      }

      $scope.updateData = function(){
	  geoEmotion.entries($scope.currentCity.latlon, {start: 0, limit: 10}, function(data){
	      var changed = false;
	      var newEntries = [];
	      for(var i = 0; i < data.length; i++){
		  if(!_.isEqual($scope.data[0], data[i])){
		      $scope.data.push(data[i]);
		      newEntries.push(data[i]);
		      changed = true;
		  }else{
		      break;
		  }
	      }
	      if(changed){
		  $scope.$broadcast("dataUpdate", newEntries);
	      }else{
		  console.debug($scope.data.slice(0, 10));
	      }
	  });
      }

      function bootstrapData(){
	  if(updateInterval){
	      clearInterval(updateInterval);
	  }

	  _.each(_.range(0, 1000, 100), function(index){
	      geoEmotion.entries($scope.currentCity.latlon, 
				 {limit: 100, start: index},
				 function(data){
				     _.each(data, function(item){
					 $scope.data.push(item);
					 if($scope.data.length == 1000){
					     console.debug("dataRefreshed");
					     $scope.$broadcast("dataRefreshed");
					     $scope.started = true;
					     updateInterval = setInterval($scope.updateData, 5000);
					 }
				     })
		});
	  });
      }
      bootstrapData();
  });
