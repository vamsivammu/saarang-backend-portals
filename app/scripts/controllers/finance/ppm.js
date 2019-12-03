'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:FinancePpmCtrl
 * @description
 * # FinancePpmCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('finance.ppm', {
        url: '/prizemoney',
        templateUrl: 'views/finance/ppm.html',
        controller: 'FinancePpmCtrl',
        authenticate: true
      });
  })
  .controller('FinancePpmCtrl',['$scope','$http','$localStorage', function ($scope, $http,$localStorage) {
  
          var config = {
                  headers:{
                    'Authorization' : "Bearer "+ $localStorage.auth_token,
                }
             };
      
          var sheet = {
                 "type":"select",
                 "args": {
                    "table":"finance_ppm",
                    "columns":["*"]
                }
            }  
      
        $http.post('https://data.saarang.org/v1/query', sheet, config).then(function(response){
                $scope.sheets = response.data;
             }).catch(function(err){
                 console.log(err);
          });
}]);
