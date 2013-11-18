angular.module('kanjouMapApp')
    .provider('mapD3', function(){
	var _self = this;
	function basicColor(color){
	    if(color == 'anger'){
	    }else if(color == 'like'){
		return d3.rgb('blue');
	    }else if(color == 'joy'){
		return d3.rgb('green');
	    }else if(color == 'sad'){
		return d3.rgb('black');
	    }else if(color == 'dislike'){
		return d3.rgb('yellow');
	    }else if(color == 'nonanger'){
		return d3.rgb('purple');
	    }else{
		return d3.rgb('white');
	    }
	}
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

	function getColor(kanjoName, value){
	    var candidates = [];
	    if(kanjoName == 'joysad'){
		candidates = ['joy', 'sad'];
	    } else if (kanjoName == 'likedislike') {
		candidates = ['like', 'dislike'];
	    } else if (kanjoName == 'angerfear') {
		candidates = ['anger', 'nonanger'];
	    } else {
		console.info("Received kanjoName " + kanjoName + " which is not a valid return");
		return null;
	    }
	    return basicColor(value>0?candidates[0]:candidates[1]);
	}
	
	function kanjoToColor(kanjo){
	    var base = null;
	    function add(color){
		function compute(key){try{
		    if(base[key] == 0){
			base[key] = color[key];
		    }else if(color[key] != 0){			
			base[key] = parseInt((base[key] + color[key]) / 2);
		    }
		}catch(err){}}
		angular.forEach(['r', 'g','b'], compute);
	    }

	    function normalize(color, value){
		var ratio = parseFloat(Math.abs(value) / 3.0);
		function apply(k){ try{
		    color[k] = parseInt(ratio * color[k]);
		}catch(err){
		}}
		angular.forEach(['r', 'g', 'b'], apply);
		return color;
	    }

	    //Find strongest emotion, use that as base
	    var strongest = null;
	    for(var emotion in kanjo){
		if (strongest == null) {
		    strongest = emotion;
		}else{
		    if (Math.abs(kanjo[strongest]) < Math.abs(kanjo[emotion])){
			strongest = emotion;
		    }
		}
	    }
	    base = normalize(getColor(strongest, kanjo[strongest]), kanjo[strongest]);
	    for(var emotion in kanjo){
	    	if (emotion != strongest) {
	    	    add(normalize(getColor(emotion, kanjo[emotion]), kanjo[emotion]));
	    	}
	    }
	    console.debug(base);
	    return base;
	}

	this.$get = function(){
	    return {
		setData: function(overlay, data){
		    data = _.filter(data, function(item){ return !_.isEmpty(item.kanjoData); });
		    console.info(data);
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
				    attr('fill', function(item){ return kanjoToColor(item.kanjoData);});
				    
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
	      
