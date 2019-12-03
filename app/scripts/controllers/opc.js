'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:OpcCtrl
 * @description
 * # OpcCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('opc', {
        url: '/opc',
        templateUrl: 'views/opc.html',
        controller: 'OpcCtrl',
        authenticate: true
      });
  })
  .controller('OpcCtrl',['$scope','$http','$localStorage', function ($scope,$http,$localStorage) {
 	$scope.sortType = 'name';       /*table variables*/
 	$scope.sortReverse = false;
 	$scope.searchTag = '';
 	$http({
 	    method:'POST',
 	    url:'https://data.saarang.org/v1/query',
 	    data:{
 	            "type":"select",
 	            "args":{
 	                    "table":"opc",
 	                    "columns":["*",{"name":"user","columns":["name","email","mobile"]}]
 	                  }
 	          },
      headers:{
					'Authorization' :"Bearer "+$localStorage.auth_token,
					'X-Hasura-Role': "core"
      }
 	    }).then(function(res){
 	    $scope.opc_registrations = res.data;
 	  }).catch(function(err){
 	    console.log(err);
 	    // console.log($localStorage.auth_token);
 	  });
  }]);
