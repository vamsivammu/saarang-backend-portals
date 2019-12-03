'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:CoordportalViewCtrl
 * @description
 * # CoordportalViewCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('coordPortal.view', {
        url: '/view',
        templateUrl: 'views/coordportal/view.html',
        controller: 'CoordportalViewCtrl'
      });
  })
  .controller('CoordportalViewCtrl',['$scope', '$http', function ($scope,$http) {
    $http({
      method:'POST',
      url:'https://data.saarang.org/v1/query',
      data:{
              "type":"select",
              "args":{
                      "table":"department",
                      "columns":["*"]
                    }
            }
      }).then(function(res){
        $scope.departments = res.data;       
    }).catch(function(err){
      console.log(err.data);
    });

      
   $scope.fetchQues = function(){
      // write the fetching code here
    		$http({
              method:'POST',
              url:'https://data.saarang.org/v1/query',
              data:{
                 "type":"select",
                 "args":{
                      "table":"question_apps",
                      "columns":["*"],
                      "where": {"department": $scope.data.department}
                    }
                }
              }).then(function(res){
                  $scope.questions = res.data;
              }).catch(function(err){
                console.log(err.data);
           });
    	
     };
    	
  }]);
