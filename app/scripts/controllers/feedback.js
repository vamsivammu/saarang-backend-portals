'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:FeedbackCtrl
 * @description
 * # FeedbackCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('feedback', {
        url: '/feedback',
        templateUrl: 'views/feedback.html',
        controller: 'FeedbackCtrl',
        authenticate: true
      });
  })
  .controller('FeedbackCtrl',['$scope','$http','$localStorage', function ($scope,$http,$localStorage) {
    $scope.sortReverse = false;
    $scope.searchTag = '';

    $http({
      method:'POST',
      url:'https://data.saarang.org/v1/query',
      data:{
              "type":"select",
              "args":{
                      "table":"feedback_website",
                      "columns":["*"]
                    }
            },
      headers:{
          'Authorization' :"Bearer "+$localStorage.auth_token
        }
      }).then(function(res){
      $scope.feedbacks = res.data;
    }).catch(function(err){
      console.log(err.data);
    });
  }]);
