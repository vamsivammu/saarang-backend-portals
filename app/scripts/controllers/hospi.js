'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:HospiCtrl
 * @description
 * # HospiCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .when('/hospi', '/hospi/statistics');
    $stateProvider
      .state('hospi', {
        url: '/hospi',
        templateUrl: 'views/hospi.html',
        controller: 'HospiCtrl',
        controllerAs: 'hosp',
        department: "Hospitality"
      });
  })
  .controller('HospiCtrl', function () {
    
  });
