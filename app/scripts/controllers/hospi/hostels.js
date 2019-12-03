'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:HospiHostelsCtrl
 * @description
 * # HospiHostelsCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('hospi.hostels', {
        url: '/hostels',
        templateUrl: 'views/hospi/hostels.html',
        controller: 'HostelsCtrl',
        authenticate: true
      });
  })
  .controller('HostelsCtrl',['$scope', '$http', '$localStorage', '$mdToast', '$state', function ($scope, $http, $localStorage, $mdToast, $state) {
    $scope.hosp.tabIndex = 2;

    var config = {
      headers : {"Authorization": "Bearer "+ $localStorage.auth_token, "X-Hasura-Role" : "core"} 
    };

    $scope.selectedHostel = 0;
    $scope.hostel = {'type': 'Male', 'name': ''};
    $scope.room = {'number': 0, 'capacity': 0};
    $scope.rooms = [];
    $scope.showAddHostel = true;
    $scope.showAddRoom = false;
    $scope.roomDetails = {};

    $scope.getHostels = function() {
      $http.post('https://data.saarang.org/v1/query', {"type": "select", "args": {"table": "hostel", "columns": ["*"]}}, config)
        .then(function(response) {
          response = response.data;
          console.log(response);
          $scope.hostels = response;
          if(response.length)
            $scope.getRooms($scope.hostels[$scope.selectedHostel].id);
        });
    }
    $scope.getHostels();

    $scope.createHostel = function() {
      if($scope.hostel.name!="") {
        $http.post('https://data.saarang.org/v1/query', {"type": "insert", "args": {"table": "hostel", "returning": [], "objects": [{"name": $scope.hostel.name, "type": $scope.hostel.type}]}}, config)
          .then(function(response) {
            $mdToast.show($mdToast.simple().textContent('Success!').hideDelay(3000));
            $state.reload();
          });
      } else $mdToast.show($mdToast.simple().textContent('Enter a valid name!').hideDelay(3000));
    }

    $scope.deleteHostel = function(id) {
      if(confirm("Are you sure you want to delete this hostel") == true){
        if($scope.rooms.length == 0) {
          $http.post('https://data.saarang.org/v1/query', {"type": "delete", "args": {"table": "hostel", "where": {"id": id}}}, config)
            .then(function(response) {
              $mdToast.show($mdToast.simple().textContent('Hostel deleted successfully!').hideDelay(3000));
              $state.reload();
            });
        } else $mdToast.show($mdToast.simple().textContent('Hostel not empty!').hideDelay(3000));
      }
    }

    $scope.getRooms = function(id) {
      $http.post('https://data.saarang.org/v1/query', {"type": "select", "args": {"table": "room", "columns": ["id", "number", "hostel_id","capacity",{"name":"occupants","columns": ["name"]}], "where": {"hostel_id": id}}}, config)
        .then(function(response) {
          response = response.data;
          console.log(response)
          $scope.rooms = response;
        });
    }

    $scope.getOccupants = function(room) {
      $http.post('https://data.saarang.org/v1/query', {"type": "select", "args": {"table": "room", "columns": ["id", "number", "capacity", {"name": "occupants", "columns": ["name", "mobile", "saarang_id"]}], "where": {"id": room.id}}}, config)
        .then(function(response) {
          console.log("Occupants: ")
          console.log(response)
          response = response.data;
          $scope.roomDetails = response[0];
        });
    }

    $scope.createRoom = function(hostel_id) {
      if(($scope.room.number!=0)&&($scope.room.capacity!=0))
        $http.post('https://data.saarang.org/v1/query', {"type": "insert", "args": {"table": "room", "returning": [], "objects": [{"number": $scope.room.number, "hostel_id": hostel_id, "capacity": $scope.room.capacity}]}}, config)
          .then(function(response) {
            $mdToast.show($mdToast.simple().textContent('Room added successfully!').hideDelay(3000));
            $scope.room = {'number': 0, 'capacity': 0};
            $scope.getRooms(hostel_id);
            $scope.showAddRoom = false;
          });
    }

    $scope.deleteRoom = function(room) {
    if(confirm("Are you sure you want to delete this room") == true){
      if (room.occupants.length==0) {
        $http.post('https://data.saarang.org/v1/query', {"type": "delete", "args": {"table": "room", "where": {"id": room.id}}}, config)
          .then(function(response) {
            $mdToast.show($mdToast.simple().textContent('Room deleted successfully!').hideDelay(3000));
            $scope.getRooms(room.hostel_id);
          });
      }
    }    
  }

    $scope.EditRoom =  function() {
      if(confirm("Are you sure you want to edit room details") == true) {
        if(($scope.roomDetails.occupants.length<=$scope.Eroom.capacity)&&($scope.Eroom.number!='')) {
          $http.post('https://data.saarang.org/v1/query', {"type": "update", "args": {"table": "room", "$set": {"number": $scope.Eroom.number, "capacity": $scope.Eroom.capacity}, "where": {"id": $scope.roomDetails.id}}}, config)
            .then(function(response) {
              $mdToast.show($mdToast.simple().textContent('Room updated successfully!').hideDelay(3000));
            });
        } else $mdToast.show($mdToast.simple().textContent('Invalid data!!').hideDelay(3000));
      }
    }

    $scope.addUser = function() {
      if ($scope.addUserSaarangId!='') {
        if($scope.roomDetails.capacity!=$scope.roomDetails.occupants.length) {
          $http.post('https://data.saarang.org/v1/query', {"type": "update", "args": {"table": "users_2019", "$set": {"room": $scope.roomDetails.id}, "returning": ["id"], "where": {"saarang_id": $scope.addUserSaarangId}}}, config)
            .then(function(response) {
              console.log(response)
              if(response.data.affected_rows == 0){
                $mdToast.show($mdToast.simple().textContent('Invalid Saarang ID').hideDelay(3000));
              }
              else{
                $mdToast.show($mdToast.simple().textContent('User checked in!').hideDelay(3000));
              }
              $scope.addUserSaarangId = "";
              $scope.getOccupants($scope.roomDetails);
            });
        } else $mdToast.show($mdToast.simple().textContent('Capacity limit reached!').hideDelay(3000));
      }
    }

    $scope.removeUser = function(saarang_id) {
      $http.post('https://data.saarang.org/v1/query', {"type": "update", "args": {"table": "users_2019", "$set": {"room": null}, "where": {"saarang_id": saarang_id}}}, config)
        .then(function(response) {
          console.log(response)
          $mdToast.show($mdToast.simple().textContent('User checked out!').hideDelay(3000));
          $scope.getOccupants($scope.roomDetails);
        });
    }

  }]);
