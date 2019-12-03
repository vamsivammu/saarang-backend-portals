'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:ApplicationCtrl
 * @description
 * # ApplicationCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider,$urlRouterProvider) {
  $urlRouterProvider
      .when('/applications', '/applications/view');
    $stateProvider
      .state('applications', {
        url: '/applications',
        templateUrl: 'views/application.html',
        controller: 'ApplicationCtrl',
        authenticate: true
      });
  })
  .controller('ApplicationCtrl', function () {     

  });
