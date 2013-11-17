//Google map directive
angular.module('kanjouMapApp')
    .directive('googleMap', function(){
	return {
	    require: '^ngModel',
	    template: "<div class='map'></div>",
	    scope: {
		ngModel: "="
	    },
	    controller: function($scope){
		$scope.bindCity = function(city, element){
		    $scope.map = new google.maps.Map(
			d3.select(element[0]).node(), {
			    zoom: 12,
			    center: new google.maps.LatLng(city.latlon[0], city.latlon[1]),
			    mapTypeId: google.maps.MapTypeId.TERRAIN
			});
		};
	    },
	    link: function(scope, iElement, iAttrs, ctrl){
		scope.bindCity(scope.ngModel, iElement);
		scope.$watch('ngModel', function(city){
		    scope.bindCity(city, iElement);
		});
	    }
	};
    });
