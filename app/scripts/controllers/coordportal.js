'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:CoordportalCtrl
 * @description
 * # CoordportalCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider
      .when('/coordPortal', '/coordPortal/view');
    $stateProvider
      .state('coordPortal', {
        url: '/coordPortal',
        templateUrl: 'views/coordportal.html',
        controller: 'CoordportalCtrl'
      });
  })
  .controller('CoordportalCtrl',function () {
    
  });
