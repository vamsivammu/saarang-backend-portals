'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:OutreachTasksCtrl
 * @description
 * # OutreachMilanCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('outreach.tasks', {
        url: '/tasks',
        templateUrl: 'views/outreach/tasks.html',
        controller: 'OutreachTasksCtrl',
        authenticate: true
     });
  })
  .controller('OutreachTasksCtrl',['$scope','$http','Upload','cloudinary','$localStorage','$state', function ($scope, $http, $upload, cloudinary, $localStorage, $state) {

    $scope.title = "Tasks"   
    
    var config = {
        headers:{
          'Authorization' : "Bearer "+ $localStorage.auth_token,
          'X-Hasura-Role':$localStorage.member.role
      }
   }
   var data = {
    "type": "select",
    "args": {
        "table": "taska",
        "columns": ["*"]
    }
}
        $http.post('https://data.saarang.org/v1/query', data, config).then(function(r){
                $scope.tasks = r.data
        })
    $scope.toggleModal = function(x){
      $scope.task = x
      $scope.taskdescription_to_be_updated = x.task_description
      $scope.points_to_be_updated = parseInt(x.points)
      $scope.task_name_to_be_updated = x.task_name
      $('#taskdescupdate').modal('show')
    }

    $scope.deletetask = function(){
      if(confirm('Do you want to delete this task?')){
        var delete_query = {
          "type": "delete",
          "args": {
              "table": "taska",
              "where": {
                  "id": {
                      "$eq": $scope.task.id
                  }
              }
          }
      }
        $scope.deleting_text = "Deleting..."
        $scope.deleting = true
  
        $http.post('https://data.saarang.org/v1/query',delete_query,config).then(function(){
          
          alert("The task has been deleted successfully")
          $scope.deleting = false
          $scope.deleting_text = "Delete Task"
          $('#taskdescupdate').modal('hide')
          window.location.reload()
        })
      }

    }

    $scope.updating_text = "Update Task"
    $scope.updating = false
    $scope.deleting = false
    $scope.deleting_text = "Delete Task"
    $scope.updatedesc = function(e){
      e.preventDefault()
      $scope.updating_text = "Updating..."
      $scope.updating = true
      var update = {
        "type": "update",
        "args": {
            "table": "taska",
            "where": {
                "id": {
                    "$eq": $scope.task.id
                }
            },
            "$set": {
                "task_description": $scope.taskdescription_to_be_updated,
                "points": $scope.points_to_be_updated.toString(),
                "task_name":$scope.task_name_to_be_updated
            }
        }
    }

    $http.post('https://data.saarang.org/v1/query',update,config).then(function(r){
    $scope.updating = false
    alert("The task has been updated successfully")
    $scope.updating_text = 'Update Task'
    $('#taskdescupdate').modal('hide')
        window.location.reload()
    })
    }

  }]);
