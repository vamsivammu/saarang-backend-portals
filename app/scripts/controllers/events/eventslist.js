'use strict';

angular.module('erpSaarangFrontendApp')
 .config(function ($stateProvider) {
    $stateProvider
      .state('events.allevents', {
        url: '/allevents',
        templateUrl: 'views/events/eventslist.html',
        controller: 'allEventsCtrl',
        authenticate: true
      });
  })
  .controller('allEventsCtrl',['$scope', '$mdDialog','$rootScope', '$http', '$window','$localStorage', function ($scope, $mdDialog,$rootScope, $http, $window,$localStorage) {
    $scope.event_c.tabIndex = 0;
    $scope.sortType = 'name';       /*table variables*/
    $scope.sortReverse = false;
    $scope.searchTag = '';
    $scope.event_c.subtab = false;
    $scope.showtab = function(event){
      $scope.event_c.subtab = true;
      $rootScope.edit_event = event;
      $scope.edit_event = $rootScope.edit_event;
    }
    $scope.events = $rootScope.allevents;
    if($scope.events == undefined){
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
            res = res.data;
          $rootScope.allevents = res;
          $scope.events = $rootScope.allevents;
        }).catch(function(err){
          console.log(err.data);
          // console.log($localStorage.auth_token);
        });
      };
    $scope.delete = function(eve){
    if (confirm("Are you sure u want to delete '"+eve.name) == true) {
           $http({
             method:'POST',
             url:'https://data.saarang.org/v1/query',
             data:{
                     "type":"delete",
                     "args":{
                             "table":"event",
                             "where":{
                               "id" : eve.id
                             }
                           }
                   },
             headers:{
                       'Authorization' :"Bearer "+$localStorage.auth_token,
                       'X-Hasura-Role' : "core"
                    }
             }).then(function(res){
               // console.log("success");
               $window.location.reload();
           }).catch(function(err){
             console.log(err.data);
             // console.log($localStorage.auth_token);
           });
         }
  }
  }]);