angular.module('kanjouMapApp')
    .provider('mapD3', function(){
	var _self = this;
	this.padding = 10;
	this.projection = null;
	this.setProjection = function(projection){ this.projection = projection; };

	function transformCircle(data){
	    var mapPoint = new google.maps.LatLng(data.location[0], data.location[1]);
	    mapPoint = _self.projection.fromLatLngToDivPixel(mapPoint);
	    d3.select(this).
		style("left", (mapPoint.x - _self.padding) + "px").
		style("top", (mapPoint.y - _self.padding) + "px");
	    return this;
	}

	function withProjection(projection, cb){
	    _self.setProjection(projection);
	    cb();
	    _self.setProjection(null);
	}

	this.$get = function(){
	    return {
		setData: function(overlay, data){

		    overlay.onAdd = function() {
			var layer = null,
			    dataPoints = null;
			
			layer = d3.select(this.getPanes().overlayLayer).
			    append("div").
			    attr("class", "tweets");

			overlay.draw = function(){
			    withProjection(this.getProjection(), function(){
				var dataPoints = layer.selectAll("svg").
				    data(data).
				    each(transformCircle).
				    enter().append("svg:svg").				    
				    each(transformCircle);

				dataPoints.append("svg:circle").
				    attr('r', 4.5).
				    attr('cx', _self.padding).
				    attr('cy', _self.padding).
				    attr('fill', 'pink').
				    attr('stroke-width', '1.5px');
				
				dataPoints.append("svg:text").
				    attr('dy', '1em').
				    attr('x', _self.padding + 7).
				    attr('y', _self.padding - 7).
				    text(function(d){ 
					var kanjou = [d.kanjoData.joysad, 
						      d.kanjoData.likedislike, 
						      d.kanjoData.angerfear];
					return d.text.substring(0, 7) + "[" + kanjou.join() + "]";
				    });

			    });
			}		    
		    }
		}
	    }
	}
    });
	      
