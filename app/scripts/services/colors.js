angular.module('kanjouMapApp')
    .factory('colors', function () {
        this.basicColor = function(color){
            if(color == 'anger'){
                return d3.rgb('red');
            }else if(color == 'like'){
                return d3.rgb('blue');
            }else if(color == 'joy'){
                return d3.rgb('green');
            }else if(color == 'sad'){
                return d3.rgb('black');
            }else if(color == 'dislike'){
                return d3.rgb('yellow');
            }else if(color == 'fear'){
                return d3.rgb('purple');
            }else{
                return d3.rgb('white');
            }
        };

        this.getEmotionName = function(kanjoName, value){
            var candidates = [];
            if(kanjoName == 'joysad'){
                candidates = ['joy', 'sad'];
            } else if (kanjoName == 'likedislike') {
                candidates = ['like', 'dislike'];
            } else if (kanjoName == 'angerfear') {
                candidates = ['anger', 'fear'];
            } else {
                console.info("Received kanjoName " + kanjoName + " which is not a valid return");
                return null;
            }
            return value>0?candidates[0]:candidates[1];
        };

        return {
            basicColor: this.basicColor,
	    getEmotionName: this.getEmotionName,
            getStrongest: function(kanjo){
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
                return strongest;
            },

            getColor: function(kanjoName, value){

                return this.basicColor(this.getEmotionName(kanjoName, value));
            },

            colorKeys: ['anger', 'fear', 'joy', 'sad', 'like', 'dislike'],
	    colorDisplay: [
		{
		    key: 'anger',
		    value: '怒り'
		},
		{			       
		    key: 'joy',
		    value: '喜び'
		},
		{
		    key: 'sad',
		    value: '悲しみ'
		},
		{
		    key: 'like',
		    value: '好き'
		},
		{
		    key: 'dislike',
		    value: '嫌い'
		},
		{
		    key: 'fear',
		    value: '怖い'
		}
	    ]
		    
        };
    });
