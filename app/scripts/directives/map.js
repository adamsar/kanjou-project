//Google map directive
angular.module('kanjouMapApp')
    .directive('googleMap', function(){
	return {
	    scope: true,

	    controller: function($scope, geoEmotion, mapD3){

		function validData(item){
		    return !_.isEmpty(item.kanjoData);
		}

		function transformItem(item){
		    return {
			_id: item._id,
			kanjoData: item.kanjoData,
			location: item.location
		    };		    
		}
		
		$scope.$on("dataBlank", function(){
		    $scope.overlay.setMap(null);
		});

		$scope.$on("dataUpdate", function(newEntries){
		    if(!$scope.map || !$scope.overlay){
			console.debug("updatebuild");
			$scope.buildMap();
			$scope.applyData();
		    }else{
			_.chain(newEntries)
			    .filter(validData)
			    .each(function(item){
				$scope.mapData.push(item);
			    });
			mapD3.updateData($scope.overlay, $scope.mapData);
		    }
		});
		
                $scope.$on('dataRefreshed', function(){
		    console.debug("applying data");
		    $scope.applyData();
		});
		
		$scope.applyData = function(){
		    console.debug("applyData");
		    $scope.mapData = _.chain($scope.data)
			.filter(validData)
			.map(transformItem)
			.value();
		    $scope.overlay = new google.maps.OverlayView();		    
		    mapD3.buildInitial($scope.overlay, $scope.mapData);
		    $scope.overlay.setMap($scope.map);
		    console.debug($scope.map);
		}
		
		$scope.buildMap = function(){
		    console.info("buildMap");
		    if($scope.overlay){
			$scope.overlay.setMap(null);
			$scope.overlay = null;
		    }
		    
		    $scope.map = new google.maps.Map(
			d3.select($scope.mapElement).node(), {
			    zoom: 12,
			    center: new google.maps.LatLng($scope.currentCity.latlon[0], 
							   $scope.currentCity.latlon[1]),
			    mapTypeId: google.maps.MapTypeId.TERRAIN
			}			
		    );
		}
		
		$scope.$watch('currentCity', function(){
		    $scope.buildMap();
		    $scope.applyData();
		});		
	    },

	    link: function(scope, iElement, iAttrs, ctrl){
		scope.mapElement = iElement[0];
	    }
	};
    });
