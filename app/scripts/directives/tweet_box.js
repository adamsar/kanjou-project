angular.module('kanjouMapApp')
.directive('tweetBox', function(){
  return {
    scope: {
      "tweets": "="
    },
    templateUrl: "/views/partials/tweet-box.html",

    controller: function($scope){
    },

  };
});
