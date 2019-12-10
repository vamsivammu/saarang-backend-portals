'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:EventsEventtabsCtrl
 * @description
 * # EventsEventtabsCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
 .config(function ($stateProvider) {
    $stateProvider
      .state('events.eventtabs', {
        url: '/eventtabs/:name',
        templateUrl: 'views/events/eventtabs.html',
        controller: 'EventtabsCtrl',
        authenticate: true
      });
  })
 .controller('EventtabsCtrl',['$scope', '$http','$rootScope','$location','$window','$localStorage',function($scope, $http,$rootScope,$location,$window,$localStorage){
  		$scope.eventTab={};
  		$scope.event_c.subtab = true;
  		$scope.event_c.subIndex = 1;
  		$scope.edit =false;
  		$scope.ind = -1;
      $scope.alltabs = {};
  		$scope.event_selected = $rootScope.edit_event;
  		$scope.add = function(){
  			$scope.ind = -1;
  			$scope.edit = true;
  		};
  		$scope.cancel = function(){
  			$scope.ind = -1;
  			$scope.edit = false;
        $scope.eventTab = {};
  		};
  		$scope.edit_tab = function(tab){
  			$scope.ind = 1;
  			$scope.edit = true;
  			$scope.eventTab = tab;
  		}
      if($scope.event_selected == undefined){
        $scope.event_selected = {};
        $location.path('/events');
      }
      $scope.event_id = $scope.event_selected.id;
      $scope.get = function(){
        $http({
          method:'POST',
          url:'https://data.saarang.org/v1/query',
          data:{
                  "type":"select",
                  "args":{
                        "table":"event_tab",
                        "columns":["*"],
                        "where":{"event_id":$scope.event_selected.id}
                      }
                },
          headers:{
                    'Authorization' :"Bearer "+$localStorage.auth_token,
                    'X-Hasura-Role' : $localStorage.member.role
                }
          }).then(function(res){
            console.log(res);
            $scope.alltabs = res.data;
        }).catch(function(err){
          console.log(err.data);
        });
      };
      $scope.get();
  		$scope.delete_tab = function(tab){
        if (confirm("Are you sure u want to delete '"+tab.name) == true) {
          $http({
          method:'POST',
          url:'https://data.saarang.org/v1/query',
          data:{
            "type":"delete",
            "args":{
            "table":"event_tab",
            "where":{
                "id" : tab.id
              }
              }
            },
            headers:{
                'Authorization' :"Bearer "+$localStorage.auth_token,
                'X-Hasura-Role' : $localStorage.member.role
              }
            }).then(function(res){
                console.log("success");
                $scope.get();
               }).catch(function(err){
                 $window.alert("an error occurred please try later");
               });
             }
  		};
  		$scope.onSubmit = function(){
  			if($scope.ind == -1){
          $http({
            method:'POST',
            url:'https://data.saarang.org/v1/query',
            data:{
                    "type":"insert",
                    "args":{
                            "table":"event_tab",
                            "returning": ["id"],
                            "objects":[
                            {
                              "name":$scope.eventTab.name,
                              "event_id":parseInt($scope.event_selected.id),
                              "info":$scope.eventTab.info
                            }
                            ]
                          }
                  },
            headers:{
                      'Authorization' :"Bearer "+$localStorage.auth_token,
                      'X-Hasura-Role' : $localStorage.member.role
                   }
            }).then(function(res){
              // console.log("insertion successful");
              $scope.cancel();
              $scope.get();
          }).catch(function(err){
            console.log(err.data);
            $window.alert("error occurred please try again");
            // console.log($localStorage.auth_token);
          });
  			}
  			else{
          $http({
            method:'POST',
            url:'https://data.saarang.org/v1/query',
            data:{
                    "type":"update",
                    "args":{
                            "table":"event_tab",
                            "$set":
                            {
                              "name":$scope.eventTab.name,
                              "event_id":parseInt($scope.event_selected.id),
                              "info":$scope.eventTab.info
                            },
                            "where":{"id":$scope.eventTab.id}
                          }
                  },
            headers:{
                      'Authorization' :"Bearer "+$localStorage.auth_token,
                      'X-Hasura-Role' : $localStorage.member.role
                   }
            }).then(function(res){
              // console.log("insertion successful");
              $scope.cancel();
              $scope.get();
          }).catch(function(err){
            console.log(err.data);
            $window.alert("error occurred please try again");
            // console.log($localStorage.auth_token);
          });
  			}
  		};

  }]);