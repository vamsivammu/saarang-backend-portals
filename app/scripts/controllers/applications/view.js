'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:ApplicationsViewCtrl
 * @description
 * # ApplicationsViewCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('applications.view', {
        url: '/view',
        templateUrl: 'views/applications/view.html',
        controller: 'ApplicationsViewCtrl',
        authenticate: true
      });
  })
  .controller('ApplicationsViewCtrl',['$scope','$http','$localStorage', function ($scope,$http,$localStorage) {
    	if($localStorage.member.department.name == "QMS"){
            $http({
                method:'POST',
                url:'https://data.saarang.org/v1/query',
                data:{
                   "type":"select",
                   "args":{
                        "table":"applicants",
                        "columns":["*"]
                      }
                  },
                headers:{
                    'Authorization' : "Bearer "+ $localStorage.auth_token
                }  
                }).then(function(res){
                    $scope.applications = res.data;
                }).catch(function(err){
                  console.log(err.data);
             });
        }	
        else{
            $http({
                method:'POST',
                url:'https://data.saarang.org/v1/query',
                data:{
                   "type":"select",
                   "args":{
                        "table":"applicants",
                        "columns":["*"],
                        "where": {"department": $localStorage.member.department.name}
                      }
                  },
                headers:{
                    'Authorization' : "Bearer "+ $localStorage.auth_token
                }  
                }).then(function(res){
                    $scope.applications = res.data;
                }).catch(function(err){
                  console.log(err.data);
             });
        }
    		
  }]);
