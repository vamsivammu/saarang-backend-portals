'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:OutreachCtrl
 * @description
 * # OutreachCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider,$urlRouterProvider) {
  $urlRouterProvider
      .when('/outreach', '/outreach/ambassadors');
    $stateProvider
      .state('outreach', {
        url: '/outreach',
        templateUrl: 'views/outreach.html',
        controller: 'OutreachCtrl',
        authenticate: true,
        department: "Student Relations"
    });
  })
  .controller('OutreachCtrl',['$scope', '$http', '$localStorage' ,function ($scope,$http,$localStorage) {

}]);
