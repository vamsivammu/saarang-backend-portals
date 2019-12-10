'use strict';

angular.module('erpSaarangFrontendApp')
  .config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider
      .when('/events', '/events/allevents');
    $stateProvider
      .state('events', {
        url: '/events',
        templateUrl: 'views/events.html',
        controller: 'EventsCtrl',
        controllerAs: 'event_c',
        authenticate: true,
        department: "Events"
      });
  })
 .controller('EventsCtrl',['$scope','$rootScope','$http','$localStorage',function ($scope,$rootScope,$http,$localStorage) {
    /*get request for events*/
    $http({
      method:'POST',
      url:'https://data.saarang.org/v1/query',
      data:{
              "type":"select",
              "args":{
                      "table":"event",
                      "columns":["*",
                        {"name": "category", "columns": ["name"]},
                        {
                          "name": "getEventSubCategory",
                          "columns": [
                              "name"
                          ]
                      }
                      ]
                    }
            },
      headers:{
                'Authorization' :"Bearer "+$localStorage.auth_token,
                'X-Hasura-Role':$localStorage.member.role
             }
      }).then(function(res){
      $rootScope.allevents = res.data;
    }).catch(function(err){
      console.log(err.data);
      // console.log($localStorage.auth_token);
    });
    $http({
      method:'POST',
      url:'https://data.saarang.org/v1/query',
      data:{
              "type":"select",
              "args":{
                      "table":"event_category",
                      "columns":["*"]
                    }
            },
      headers:{
                'Authorization' :"Bearer "+$localStorage.auth_token,
                'X-Hasura-Role':$localStorage.member.role
             }
      }).then(function(res){
      $rootScope.categories = res.data;
    }).catch(function(err){
      console.log(err.data);
      // console.log($localStorage.auth_token);
    });
    $http({
      method:'POST',
      url:'https://data.saarang.org/v1/query',
      data:{
              "type":"select",
              "args":{
                      "table":"event_subcategory",
                      "columns":["*"]
                    }
            },
      headers:{
                'Authorization' :"Bearer "+$localStorage.auth_token,
                'X-Hasura-Role':$localStorage.member.role
             }
      }).then(function(res){
      $rootScope.subcategories = res.data;
    }).catch(function(err){
      console.log(err.data);
      // console.log($localStorage.auth_token);
    });
  }]);
