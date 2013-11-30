'use strict';
angular.module('kanjouMapApp')
.controller('TweetCtrl', function($scope, colors){
  $scope.$parent.page = 'tweet';
  $scope.colors = colors;
  $scope.currentEmotion = colors.colorKeys[0];
  $scope.currentTweets = [];
  $scope.tweets = {};

  $scope.setTweets = function(){
      $scope.currentTweets = $scope.tweets[$scope.currentEmotion];
  }

  $scope.setEmotion = function(emotion){
    $scope.currentEmotion = emotion;
    $scope.setTweets();
  }

  function blankTweets(){
    $scope.tweets = {};
    _.each(colors.colorKeys, function(emotion){
      $scope.tweets[emotion] = [];
    });
  }

  blankTweets();

  $scope.organizeTweets = function(){
    _.each($scope.data, function(item){
      var strongest = colors.getStrongest(item.kanjoData);
      var key = colors.getEmotionName(strongest, item.kanjoData[strongest]);
      $scope.tweets[key].push({
        _id: item._id,
        name: item.name,
        text: item.text,
        profile_pic: item.profile_pic,
        pic: item.pic,
        value: Math.abs(item.kanjoData[strongest])});
    });

    _.each(colors.colorKeys, function(emotion){
      $scope.tweets[emotion] = _.sortBy($scope.tweets[emotion],
                                        function(tweet){return tweet.value;});
    });
    $scope.$broadcast("tweetsChanged");
  }

  $scope.$on("tweetsChanged", $scope.setTweets);
  $scope.$on("dataBlank", blankTweets);
  $scope.$on("dataRefreshed", $scope.organizeTweets);

  if($scope.started){
    $scope.organizeTweets();
  }
});
