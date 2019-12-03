'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
 .config(function ($stateProvider) {
    $stateProvider
      .state('main', {
        url: '/',
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        authenticate: true
      });
  })

  .controller('MainCtrl', function ($window, $location) {

  });
