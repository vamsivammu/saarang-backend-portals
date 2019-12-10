'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:EventsEventscheduleCtrl
 * @description
 * # EventsEventscheduleCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('events.eventschedule', {
        url: '/eventschedule/:name',
        templateUrl: 'views/events/eventschedule.html',
        controller: 'eventscheduleCtrl',
        authenticate: true
      });
  })
   .controller('eventscheduleCtrl',['$scope', '$mdDialog', '$location', '$window', '$rootScope', '$http','$localStorage', function ($scope, $mdDialog, $location, $window, $rootScope, $http,$localStorage) {
  	$scope.eventschedule = {};
  	$scope.event_c.subtab = true;
  	$scope.event_c.subIndex = 2;
  	$scope.edit = false;
  	$scope.ind = -1;
    $scope.event_selected = $rootScope.edit_event;
  	$scope.eventschedule.slot_start = new Date();
  	$scope.eventschedule.slot_end = new Date();
  	$scope.add = function(){
  		$scope.edit = true;
  		$scope.ind = -1;
  	};
  	$scope.cancel = function(){
  		$scope.edit = false;
  		$scope.ind = -1;
  		$scope.eventschedule = {};
  	};
  	$scope.edit_schedule = function(schedule){
  		$scope.eventschedule = schedule;
      $scope.eventschedule.venue_name = schedule.venue;
      $scope.eventschedule.slot_start = new Date($scope.eventschedule.slot_start);
      $scope.eventschedule.slot_end = new Date($scope.eventschedule.slot_end);
  		$scope.ind = 1;
  		$scope.edit = true;
  	}
    if($scope.event_selected == undefined){
      $scope.event_selected = {};
      $location.path('/events');
    }
    
    $scope.venues = $rootScope.venues;
    /*get categories*/
    if($scope.venues == undefined){
      $http({
        method:'POST',
        url:'https://data.saarang.org/v1/query',
        data:{
                "type":"select",
                "args":{
                        "table":"venue",
                        "columns":["*"]
                      }
              },
        headers:{
                  'Authorization' :"Bearer "+$localStorage.auth_token,
                  'X-Hasura-Role' : $localStorage.member.role
               }
        }).then(function(res){
        $scope.venues = res.data;
        var no_venue = {long: "", lat: "", name: "Not yet decided", id:0}
        console.log($rootScope.venues)
        $scope.venues.push(no_venue);
      }).catch(function(err){
        console.log(err);
      });
    }

    $scope.allschedule = {};
    $scope.get = function(){
        $http({
          method:'POST',
          url:'https://data.saarang.org/v1/query',
          data:{
                  "type":"select",
                  "args":{
                        "table":"event_schedule",
                        "columns":["*"],
                        "where":{"event_id":$scope.event_selected.id}
                      }
                },
          headers:{
                    'Authorization' :"Bearer "+$localStorage.auth_token,
                    'X-Hasura-Role' : $localStorage.member.role
                }
          }).then(function(res){
            $scope.allschedule = res.data;
            // console.log($scope.allschedule);
        }).catch(function(err){
          console.log(err.data);
        });
      };
    $scope.get();
  	$scope.onSubmit = function(){
      $scope.eventschedule.slot_start = new Date($scope.eventschedule.slot_start);
      $scope.eventschedule.slot_end = new Date($scope.eventschedule.slot_end);
  		  if($scope.ind == -1){
          $http({
            method:'POST',
            url:'https://data.saarang.org/v1/query',
            data:{
                    "type":"insert",
                    "args":{
                            "table":"event_schedule",
                            "returning": ["id"],
                            "objects":[
                            {
                              "slot_start":$scope.eventschedule.slot_start,
                              "slot_end":$scope.eventschedule.slot_end,
                              "slot_start_time":$scope.eventschedule.slot_start_time,  
                              "slot_end_time":$scope.eventschedule.slot_end_time,
                              "venue":$scope.eventschedule.venue.name,
                              "event_id":parseInt($scope.event_selected.id),
                              "comment":$scope.eventschedule.comment
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
              console.log(err);
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
                              "table":"event_schedule",
                              "$set":
                              {
                                "slot_start":$scope.eventschedule.slot_start,
                                "slot_end":$scope.eventschedule.slot_end,
                                "slot_start_time":$scope.eventschedule.slot_start_time,  
                                "slot_end_time":$scope.eventschedule.slot_end_time,
                                "venue":$scope.eventschedule.venue.name,
                                "event_id":parseInt($scope.event_selected.id),
                                "comment":$scope.eventschedule.comment
                              },
                            "where":{"id":$scope.eventschedule.id}
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
            console.log(err);
            $window.alert("error occurred please try again");
            // console.log($localStorage.auth_token);
          });
  		  }
  	 }

    $scope.delete_schedule = function(schedule){
      if (confirm("Are you sure u want to delete") == true) {
       $http({
          method:'POST',
          url:'https://data.saarang.org/v1/query',
          data:{
              "type":"delete",
              "args":{
              "table":"event_schedule",
              "where":{
                    "id" : schedule.id
                 }
              }
            },
          headers:{
            'Authorization' :"Bearer "+$localStorage.auth_token,
            'X-Hasura-Role' : $localStorage.member.role
          }
        }).then(function(res){
            // console.log("success");
            $scope.get();
        }).catch(function(err){
             $window.alert("an error occurred please try later");
        });
     }
    }
  }]);