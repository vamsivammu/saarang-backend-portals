'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:OutreachSubmissionsCtrl
 * @description
 * # OutreachMilanCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('outreach.submissions', {
        url: '/submissions',
        templateUrl: 'views/outreach/submissions.html',
        controller: 'OutreachSubmissionsCtrl',
        authenticate: true
     });
  })
  .controller('OutreachSubmissionsCtrl',['$scope','$http','Upload','cloudinary','$localStorage','$state', function ($scope, $http, $upload, cloudinary, $localStorage, $state) {

    $scope.title = "Submissions"
    $scope.loading = false
    var config = {
        headers:{
          'Authorization' : "Bearer "+ $localStorage.auth_token,
          'X-Hasura-Role':$localStorage.member.role
      }
   }

    var ca = {
    "type": "select",
    "args": {
        "table": "submissions",
        "columns": [
            "*",
            {
                "name": "caID",
                "columns": [
                    "name",
                    "score"
                ]
            },
            {
                "name": "taskID",
                "columns": [
                    "task_name",
                    "points"
                ]
            }
        ]
    }
    }

    $http.post('https://data.saarang.org/v1/query',ca,config).then(function(r){
        $scope.submissions = r.data
    })
    $scope.open_submission = function(x){
        $scope.submission = x
        $scope.images = x.images.images
        $scope.images_to_be_shown = []
        for(var i=0;i<$scope.images.length;i++){
            $scope.images_to_be_shown.push('https://filestore.saarang.org/v1/file/'+$scope.images[i])
        }
        $('#subdesc').modal('show')

    }
    $scope.accept = function(){
        var confirmation = {
            "type": "select",
            "args": {
                "table": "submissions",
                "columns": [
                    "status",
                    "allotted_points"
                ],
                "where": {
                    "$and": [
                        {
                            "ca_id": {
                                "$eq": $scope.submission.ca_id
                            }
                        },
                        {
                            "task_id": {
                                "$eq": $scope.submission.task_id
                            }
                        }
                    ]
                }
            }
        }
        $http.post('https://data.saarang.org/v1/query',confirmation,config).then(function(rr){
            var statuses = rr.data
            var is_already_successful = false
            var cur_max_score=0
            for(var i=0;i<statuses.length;i++){
                console.log(statuses[i])
                if(statuses[i].status=='successful'){
                    is_already_successful = true
                    break
                }else if(statuses[i].status=="partially_correct"){
                    var temp = parseInt(statuses[i].allotted_points,10)
                    if(temp>cur_max_score){
                        cur_max_score = temp
                    }
                }
            }
            if(is_already_successful){
                if(confirm('The user has been already awarded for this task.No more extra points will be awarded.Proceed?')){
                    $scope.loading = true
                    var ca_id = $scope.submission.ca_id
                    var updated_score = parseInt($scope.submission.taskID.points,10) + parseInt($scope.submission.caID.score,10)
                    var get_submissions = {
                        "type": "select",
                        "args": {
                            "table": "taska",
                            "columns": [
                                "num_successful",
                                "num_pending"
                            ],
                            "where": {
                                "id": {
                                       "$eq": $scope.submission.task_id
                                }
                            }
                        }
                    }
                    try{
                        $http.post('https://data.saarang.org/v1/query',get_submissions,config).then(function(r){
                            var updated_successful_submissions = parseInt(r.data[0].num_successful,10)+1
                            var updated_pending = parseInt(r.data[0].num_pending,10)-1
                            var updated_data = {
                                "type": "bulk",
                                "args": [
                                    {
                                        "type": "update",
                                        "args": {
                                            "table": "taska",
                                            "where": {
                                                "id": {
                                                    "$eq": $scope.submission.task_id
                                                }
                                            },
                                            "$set": {
                                                "num_successful": updated_successful_submissions.toString(),
                                                "num_pending": updated_pending.toString()
                                            }
                                        }
                                    },
                                    {
                                        "type": "update",
                                        "args": {
                                            "table": "submissions",
                                            "where": {
                                                "id": {
                                                    "$eq": $scope.submission.id
                                                }
                                            },
                                            "$set": {
                                                "status": "successful"
                                            }
                                        }
                                    }
                                ]
                            }
                            $http.post('https://data.saarang.org/v1/query',updated_data,config).then(function(r1){
                                $scope.loading = false
                                $('#subdesc').modal('hide')
                            }).catch(function(e){
                                $scope.loading = false
                                $('#subdesc').modal('hide')
                                alert('some error occured')
                            })
                        }).catch(function(e){
                            $scope.loading = false
                            $('#subdesc').modal('hide')
                            alert('some error occured')
                        })             
                    }catch(e){
                        $scope.loading = false
                        $('#subdesc').modal('hide')
                        alert('some error occured')
        
                    }
        
                }
            }else{
                if(confirm('Do you want to award full points?')){

                    $scope.loading = true
                    var ca_id = $scope.submission.ca_id
                    var updated_score = parseInt($scope.submission.taskID.points,10) + parseInt($scope.submission.caID.score,10) - parseInt(cur_max_score,10)
                    var get_submissions = {
                        "type": "select",
                        "args": {
                            "table": "taska",
                            "columns": [
                                "num_successful",
                                "num_pending"
                            ],
                            "where": {
                                "id": {
                                       "$eq": $scope.submission.task_id
                                }
                            }
                        }
                    }
                    try{
                        $http.post('https://data.saarang.org/v1/query',get_submissions,config).then(function(r){
                            var updated_successful_submissions = parseInt(r.data[0].num_successful,10)+1
                            var updated_pending = parseInt(r.data[0].num_pending,10)-1
                            var updated_data = {
                                "type": "bulk",
                                "args": [
                                    {
                                        "type": "update",
                                        "args": {
                                            "table": "taska",
                                            "where": {
                                                "id": {
                                                    "$eq": $scope.submission.task_id
                                                }
                                            },
                                            "$set": {
                                                "num_successful": updated_successful_submissions.toString(),
                                                "num_pending": updated_pending.toString()
                                            }
                                        }
                                    },
                                    {
                                        "type": "update",
                                        "args": {
                                            "table": "ambassadors_2020",
                                            "where": {
                                                "hasura_id": {
                                                    "$eq": ca_id
                                                }
                                            },
                                            "$set": {
                                                "score": updated_score.toString()
                                            }
                                        }
                                    },
                                    {
                                        "type": "update",
                                        "args": {
                                            "table": "submissions",
                                            "where": {
                                                "id": {
                                                    "$eq": $scope.submission.id
                                                }
                                            },
                                            "$set": {
                                                "status": "successful",
                                                "allotted_points":$scope.submission.taskID.points.toString()
                                            }
                                        }
                                    }
                                ]
                            }
                            $http.post('https://data.saarang.org/v1/query',updated_data,config).then(function(r1){
                                $scope.loading = false
                                $('#subdesc').modal('hide')
                            }).catch(function(e){
                                $scope.loading = false
                                $('#subdesc').modal('hide')
                                alert('some error occured')
                            })
                        }).catch(function(e){
                            $scope.loading = false
                            $('#subdesc').modal('hide')
                            alert('some error occured')
                        })             
                    }catch(e){
                        $scope.loading = false
                        $('#subdesc').modal('hide')
                        alert('some error occured')
        
                    }
        
        
                }else{
                    var partial_score = prompt("Enter partial marks","0")
                    var reason = prompt("Enter reason for partial marking","no reason stated")
                    reason = (reason!=null && reason!=undefined)?reason:"no reason stated"
                    if(parseInt(partial_score,10)>0 && parseInt(partial_score,10)<$scope.submission.taskID.points && !isNaN(parseInt(partial_score,10))){
                        $scope.loading = true
                        
                    var ca_id = $scope.submission.ca_id
                    var updated_score
                    if(parseInt(cur_max_score,10)>=parseInt(partial_score,10)){
                        updated_score = parseInt($scope.submission.caID.score,10)
                    }else{
                        updated_score = parseInt(partial_score,10) + parseInt($scope.submission.caID.score,10)-parseInt(cur_max_score,10)
                    }
                    
                    var get_submissions = {
                        "type": "select",
                        "args": {
                            "table": "taska",
                            "columns": [
                                "num_successful",
                                "num_pending"
                            ],
                            "where": {
                                "id": {
                                       "$eq": $scope.submission.task_id
                                }
                            }
                        }
                    }
                    try{
                        $http.post('https://data.saarang.org/v1/query',get_submissions,config).then(function(r){
                            var updated_successful_submissions = parseInt(r.data[0].num_successful,10)+1
                            var updated_pending = parseInt(r.data[0].num_pending,10)-1
                            var updated_data = {
                                "type": "bulk",
                                "args": [
                                    {
                                        "type": "update",
                                        "args": {
                                            "table": "taska",
                                            "where": {
                                                "id": {
                                                    "$eq": $scope.submission.task_id
                                                }
                                            },
                                            "$set": {
                                                "num_successful": updated_successful_submissions.toString(),
                                                "num_pending": updated_pending.toString()
                                            }
                                        }
                                    },
                                    {
                                        "type": "update",
                                        "args": {
                                            "table": "ambassadors_2020",
                                            "where": {
                                                "hasura_id": {
                                                    "$eq": ca_id
                                                }
                                            },
                                            "$set": {
                                                "score": updated_score.toString()
                                            }
                                        }
                                    },
                                    {
                                        "type": "update",
                                        "args": {
                                            "table": "submissions",
                                            "where": {
                                                "id": {
                                                    "$eq": $scope.submission.id
                                                }
                                            },
                                            "$set": {
                                                "status": "partially_correct",
                                                "reason":reason,
                                                "allotted_points":partial_score.toString()
                                            }
                                        }
                                    }
                                ]
                            }
                            $http.post('https://data.saarang.org/v1/query',updated_data,config).then(function(r1){
                                $scope.loading = false
                                $('#subdesc').modal('hide')
                            }).catch(function(e){
                                $scope.loading = false
                                $('#subdesc').modal('hide')
                                alert('some error occured')
                            })
                        }).catch(function(e){
                            $scope.loading = false
                            $('#subdesc').modal('hide')
                            alert('some error occured')
                        })             
                    }catch(e){
                        $scope.loading = false
                        $('#subdesc').modal('hide')
                        alert('some error occured')
        
                    }
                    }
                }
            }
        })
        
    }
    $scope.reject = function(){
        if(confirm('Do you want to reject the submission?')){
            var message = prompt("Reason for rejection","no reason stated")
            message = (message!=null &&message != undefined)?message:'no reason stated'
            $scope.loading = true
            var ca_id = $scope.submission.ca_id
            var get_submissions = {
                "type": "select",
                "args": {
                    "table": "taska",
                    "columns": [
                        "num_pending"
                    ],
                    "where": {
                        "id": {
                               "$eq": $scope.submission.task_id
                        }
                    }
                }
            }
            try{
                $http.post('https://data.saarang.org/v1/query',get_submissions,config).then(function(r){
                    var updated_pending = parseInt(r.data[0].num_pending,10)-1
                    var updated_data = {
                        "type": "bulk",
                        "args": [
                            {
                                "type": "update",
                                "args": {
                                    "table": "taska",
                                    "where": {
                                        "id": {
                                            "$eq": $scope.submission.task_id
                                        }
                                    },
                                    "$set": {
                                        "num_pending": updated_pending.toString()
                                    }
                                }
                            },
                            {
                                "type": "update",
                                "args": {
                                    "table": "submissions",
                                    "where": {
                                        "id": {
                                            "$eq": $scope.submission.id
                                        }
                                    },
                                    "$set": {
                                        "status": "rejected",
                                        "reason":message
                                    }
                                }
                            }
                        ]
                    }
                    $http.post('https://data.saarang.org/v1/query',updated_data,config).then(function(r1){
                        $scope.loading = false
                        $('#subdesc').modal('hide')
                        window.location.reload()
                    }).catch(function(e){
                        $scope.loading = false
                        alert('Some error occured')
                        $('#subdesc').modal('hide')
                    })
                }).catch(function(e){
                    $scope.loading = false
                    alert('Some error occured')
                    $('#subdesc').modal('hide')
                })
            }catch(e){
                $scope.loading = false
                alert('some error occured, please try again after some time')
                $('#subdesc').modal('hide')
            }

        }else{
            
        }
    }

    $scope.re_evaluate = function(){

        var points = prompt("How many points you want to award?","0")
        points = points!=null && points!=undefined ? points :"0"
        if(points.toString()=="0"){
            var status = "rejected"
            var reason = prompt("State the reason","no reason stated")
            reason = reason!=null && reason != undefined ? reason:"no reason stated"

        }else if($scope.submission.taskID.points.toString()==points.toString()){

        }else if(parseInt($scope.submission.taskID.points,10)>parseInt(points,10)){
            var status = "partially correct"
            var reason = prompt("State the reason","no reason stated")
            reason = reason!=null && reason != undefined ? reason:"no reason stated"
        
        }

    }
  }]);
