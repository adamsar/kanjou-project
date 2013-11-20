'use strict';
angular.module('kanjouMapApp')
    .service('mapD3', function(colors){
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
            var strongest = colors.getStrongest(kanjo);
            base = normalize(colors.getColor(strongest, kanjo[strongest]), kanjo[strongest]);
            for(var emotion in kanjo){
                if (emotion != strongest) {
                    add(normalize(colors.getColor(emotion, kanjo[emotion]), kanjo[emotion]));
                }
            }
            return base;
        }

        return {
            setData: function(overlay, data){
                data = _.filter(data, function(item){ return !_.isEmpty(item.kanjoData); });
                overlay.onRemove = function() {
                    $(this).find("div").remove();
                }
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
                        });
                    }
                }
            }
	};	
    });
