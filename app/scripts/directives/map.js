//Google map directive
angular.module('kanjouMapApp')
    .directive('googleMap', function(){
	return {
	    require: '^ngModel',
	    template: "<div class='map'></div>",
	    scope: {
		ngModel: "="
	    },
	    controller: function($scope, $element, geoEmotion, mapD3){
		$scope.data = null;
		$scope.map = null;
		$scope.overlay = null;
		$scope.updateData = function(){
		    geoEmotion.entries($scope.ngModel.latlon, function(data){
			if(!_.isEqual($scope.data, data)){
			    console.info ("Updating");
			    $scope.data = data;
			}
		    });
		}

		$scope.updateMap = function(){
		    $scope.map = new google.maps.Map(
			d3.select($element[0]).node(), {
			    zoom: 12,
			    center: new google.maps.LatLng($scope.ngModel.latlon[0], 
							   $scope.ngModel.latlon[1]),
			    mapTypeId: google.maps.MapTypeId.TERRAIN
			});
		}

		$scope.$watch('data', function(newData){
//		    if($scope.overlay){
//			$scope.overlay.setMap(null);
//		    }

		    $scope.overlay = new google.maps.OverlayView();
		    mapD3.setData($scope.overlay, $scope.data);
		    $scope.overlay.setMap($scope.map);

		});
		setInterval(function(){ $scope.updateData(); }, 2000);
	    },

	    link: function(scope, iElement, iAttrs, ctrl){
		scope.$watch('ngModel', function(city){
		    scope.updateMap();
		});
		scope.updateMap();
	    }
	};
    });
