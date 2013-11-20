angular.module('kanjouMapApp')
    .directive('tweetBox', function(){
	return {
	    scope: true,
	    template: "<div ng-show='tweets.length == 0'>ない</div><ul ng-repeat='tweet in tweets'><li>{{tweet}}</li><ul>",
	    controller: function($scope, colors){
		console.debug("tweetbox!")
		$scope.updateTweets = function(){
		    var tweets = [];
		    for(var i = 0; i < $scope.data.length; i++){
			var tweet = $scope.data[i];
			var strongest = colors.getStrongest(tweet.kanjoData);
			if(colors.getEmotionName(strongest, tweet.kanjoData[strongest])  == $scope.currentEmotion){
			    tweets.push(tweet.text);
			    if(tweets.length > 4){
				break;
			    }
			}
		    }
		    $scope.tweets = tweets;
		}
		$scope.$watch('currentEmotion', $scope.updateTweets);
		$scope.$watch('data', $scope.updateTweets);
	    }
	};
    });
