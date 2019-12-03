'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:BillsCtrl
 * @description
 * # BillsCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider
      .when('/bills', '/bills/payments');
    $stateProvider
      .state('bills', {
        url: '/bills',
        templateUrl: 'views/bills.html',
        controller: 'BillsCtrl'
      });
  })
  .controller('BillsCtrl', function () {
    
  });
