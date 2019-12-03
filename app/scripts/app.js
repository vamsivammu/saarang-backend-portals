'use strict';

angular
  .module('erpSaarangFrontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ui.router',
    'ngMaterial',
    'ngFileUpload',
    'cloudinary',
    'ngStorage',
    'angularUtils.directives.dirPagination',
    '720kb.datepicker',
    'vcRecaptcha',
    'pubnub.angular.service',
    'ngNotify'
  ])
  .config(['$routeProvider','$stateProvider','$urlRouterProvider','$localStorageProvider','$qProvider',function ($routeProvider,$stateProvider,$urlRouterProvider,$localStorageProvider,$qProvider) {
    $urlRouterProvider
      .otherwise('/login');
        $qProvider.errorOnUnhandledRejections(false);
    // $locationProvider.html5Mode(true);
    // $httpProvider.interceptors.push('authInterceptor');
  }])
   .run(['$rootScope', '$location','$localStorage', '$state', function ($rootScope, $location,$localStorage, $state) {
    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, previous, previousParams) {
    // Redirect to login if route requires auth and you're not logged in
      if (!$localStorage.auth_token) {
        $rootScope.loggedIn = false;
      }

      else{
        $rootScope.member = $localStorage.member;
        $rootScope.loggedIn = true;
      }

      if(next.authenticate && !$localStorage.auth_token){
        console.log('redirected access to login page because you are not logged in');
        event.preventDefault();
        alert("Please login");
        $state.go('login');
      }

      if(next.department){
          if(next.department != $localStorage.member.department.name && $localStorage.member.department.name != "Developer Operations"){
            console.log("no access");
            event.preventDefault();
            alert("You're not authorized to access this portal");
          }  
      }
    });
  }]);
