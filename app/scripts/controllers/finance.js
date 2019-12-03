'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:FinanceCtrl
 * @description
 * # FinanceCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
      .when('/finance', '/finance/payments');
    $stateProvider
      .state('finance', {
        url: '/finance',
        templateUrl: 'views/finance.html',
        controller: 'FinanceCtrl',
        authenticate: true,
        department: "Finance"
      });
  })
  .controller('FinanceCtrl', ['$scope', '$http', function ($scope, $http) {
    
  }]);
