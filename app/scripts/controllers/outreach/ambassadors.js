'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:OutreachAmbassadorsCtrl
 * @description
 * # OutreachAmbassadorsCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('outreach.ambassadors', {
        url: '/ambassadors',
        templateUrl: 'views/outreach/ambassadors.html',
        controller: 'OutreachAmbassadorsCtrl',
        authenticate: true
      });
  })
  .controller('OutreachAmbassadorsCtrl',['$scope','$http','$localStorage', function ($scope,$http,$localStorage) {
   
    $scope.download = function(filename, rows) {
        var processRow = function (row) {
            var finalVal = '';
            for (var j = 0; j < row.length; j++) {
                var innerValue = row[j] === null || row[j]===undefined ? '' : row[j].toString();
                if (row[j] instanceof Date) {
                    innerValue = row[j].toLocaleString();
                };
                var result = innerValue.replace(/"/g, '""');
                if (result.search(/("|,|\n)/g) >= 0)
                    result = '"' + result + '"';
                if (j > 0)
                    finalVal += ',';
                finalVal += result;
            }
            return finalVal + '\n';
        };

        var csvFile = '';
        for (var i = 0; i < rows.length; i++) {
            csvFile += processRow(rows[i]);
        }

        var blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, filename);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) { // feature detection
                // Browsers that support HTML5 download attribute
                var url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }
    
    $scope.toggleModal = function(x){
    $scope.user = x;
    $('#basicModal').modal('show');
  };

  $scope.taskmodal = function(){
      $('#addTask').modal('show')
  }

      var config = {
                headers:{
                  'Authorization' : "Bearer "+ $localStorage.auth_token,
                  "X-Hasura-Role":$localStorage.member.role
              }
           }

      var ca = {
        "type": "select",
        "args": {
            "table": "ambassadors_2020",
            "columns": ["*"]
        }
    }

      $http.post('https://data.saarang.org/v1/query', ca, config).then(function(response){
              $scope.ambassadors = response.data;
              $scope.downloaddata = []
              $scope.downloaddata.push(['name','email','college','city','facebook_id','instagram_id','mobile','score','year','designation'])
              for(var i=0;i<$scope.ambassadors.length;i++){
                  var eachrow = [$scope.ambassadors[i].name,$scope.ambassadors[i].email,$scope.ambassadors[i].college,$scope.ambassadors[i].city,$scope.ambassadors[i].facebook_id,$scope.ambassadors[i].instagram_id,$scope.ambassadors[i].number,$scope.ambassadors[i].score,$scope.ambassadors[i].study_year,$scope.ambassadors[i].designation]
                    $scope.downloaddata.push(eachrow)
                }
                $scope.ambassadorss = response.data
              console.log($scope.ambassadors)
           }).catch(function(err){
            console.log(err);
        });


        $scope.addtask = function(){
            $scope.add_button_disabled = true 
            console.log("ksjdb")
            if($scope.task_name=='' || $scope.task_description=='' || $scope.points=='' || $scope.task_name==undefined || $scope.task_description==undefined || $scope.points==undefined){
                alert("Some fields are empty")
                $scope.add_button_disabled = false
            }else{            
            var config = {
                headers:{
                  'Authorization' : "Bearer "+ $localStorage.auth_token,
                  'X-Hasura-Role':'core'
              }
           }
           var data = {
                "type": "insert",
                "args": {
                    "table": "taska",
                    "objects": [
                        {
                            "points": $scope.points.toString(),
                            "task_description": $scope.task_description,
                            "task_name": $scope.task_name,
                            "region":$scope.region 
                        }
                    ]
                }
            }
            $http.post('https://data.saarang.org/v1/query',data,config).then(function(r){
                alert("Added successfully")
                $scope.task_description =''
                $scope.task_name = ''
                $scope.points = ''
                $scope.add_button_disabled = false
                $('#addTask').modal('hide')
            }).catch(function(e){
                $scope.add_button_disabled = false
                alert("You can't add task")
            })
            
        }
        }

        $scope.scoreUpdate = function(){
          var config = {
                      headers:{
                        'Authorization' : "Bearer "+ $localStorage.auth_token
                    }
                 }

          var status = {
                     "type":"update",
                     "args": {
                        "table":"ambassadors",
                        "$set":{
                                    "score": $scope.user.score
                                },
                        "where": {"id": $scope.user.id}
                    }
                }

                $http.post('https://data.saarang.org/v1/query',status,config).then(function(res){
                     alert("Update Successful");
                     $('#basicModal').modal('hide');
                }).catch(function(err){
                    alert("Please Try Again");
                    console.log(err);
                });
        };

  }]);
