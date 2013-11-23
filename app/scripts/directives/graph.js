//Graphs for data based on city directive
angular.module('kanjouMapApp')
    .directive('pieChart', function(){
        return {
            template: "<div class='graph'><svg height='500'><svg></div>",
	    scope: true,
            controller: function($scope, colors){
		console.debug("pie");
                $scope.parseData = function(data){
                    var parsed = {
                        like: 0,
                        dislike: 0,
                        anger: 0,
                        sad: 0,
                        fear: 0,
                        joy: 0
                    };
                    _.each(data, function(item){
                        function parse(goodKey, badKey, value){
                            if (value < 0){
                                parsed[badKey] += Math.abs(value);
                            }else{
                                parsed[goodKey] += value;
                            }
                        }
                        parse('like', 'dislike', item.kanjoData.likedislike);
                        parse('anger', 'fear', item.kanjoData.angerfear);
                        parse('joy', 'sad', item.kanjoData.joysad);
                    });
                    var values = [];
                    for(var key in parsed){
                        values.push({label: key, value: parsed[key]});
                    }
                    return [{
                        key: $scope.currentCity.name + " 感情",
                        values: values
                    }];

                }

                $scope.buildGraph = function(){
		    if(_.isEmpty($scope.data)){
			console.info("Data empty, aborting");
			return;
		    }
		    nv.addGraph(function(){
			var chart = nv.models.pieChart()
                            .x(function(d) { return d.label; })
                            .y(function(d) { return d.value + 0.0; })
			    .color(function(d, i){
				if(d.data){
				    d = d.data;
				}
				return colors.basicColor(d.label);} 
				  )			
                            .donut(true);
			var data = $scope.parseData($scope.data);
			d3.select($scope.pieElement).select('svg')
                            .datum(data[0].values)
                            .transition().duration(1200)
                            .call(chart);
			return chart;
		    });
                }

                $scope.$on('dataRefreshed', function(){
		    //Only build if this is currently showing
		    console.debug("building");
		    if($scope.currentWidget == 'pie'){
			$scope.buildGraph();
		    }

		});
            },

            link: function(scope, iElement, iAttrs, ctrl){
		scope.pieElement = iElement[0];
            }
        };
    });
