//Google map directive
angular.module('kanjouMapApp')
    .directive('googleMap', function(){
	return {
	    scope: true,
	    controller: function($scope, geoEmotion, mapD3){
		$scope.map = null;
		$scope.overlay = null;		
		console.debug("map");

		$scope.updateMap = function(){
		    $scope.map = new google.maps.Map(
			d3.select($scope.mapElement).node(), {
			    zoom: 12,
			    center: new google.maps.LatLng($scope.currentCity.latlon[0], 
							   $scope.currentCity.latlon[1]),
			    mapTypeId: google.maps.MapTypeId.TERRAIN
			});
		}

		$scope.$watch('data', function(newData){
		    if($scope.overlay){
			$scope.overlay.setMap(null);
		    }

		    $scope.overlay = new google.maps.OverlayView();
		    mapD3.setData($scope.overlay, $scope.data);
		    $scope.overlay.setMap($scope.map);
		});
		
		$scope.$watch('currentCity', $scope.updateMap);

	    },

	    link: function(scope, iElement, iAttrs, ctrl){
		scope.mapElement = iElement[0];
		scope.updateMap();
	    }
	};
    });
