'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:EventsRCtrl
 * @description
 * # EventsRCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('events_r', {
        url: '/events_r',
        templateUrl: 'views/events_r.html',
        controller: 'EventsRCtrl',
        authenticate: true,
        department: "Events"
      });
      
  })

  .controller('EventsRCtrl',['$scope','$http','$localStorage','$state', function ($scope,$http,$localStorage,$state) {
    $scope.sortReverse = false;
    $scope.searchTag = '';

    $http({
      method:'POST',
      url:'https://data.saarang.org/v1/query',
      data:{
              "type":"select",
              "args":{
                      "table":"event",
                      "columns":["*",
                        {"name": "category", "columns": ["name"]}
                      ]
                    }
            },
      headers:{
                'Authorization' :"Bearer "+$localStorage.auth_token
             }
      }).then(function(res){
      $scope.allevents_r = res.data;
    }).catch(function(err){
      console.log(err.data);
    });

    $scope.go_to_event = function (event){
      console.log(event);
      $localStorage.selected_event = event;
      $state.go('event_registration',{'name':event.name});
    };

  }]);
