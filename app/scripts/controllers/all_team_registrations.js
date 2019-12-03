'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:AllTeamRegistrationsCtrl
 * @description
 * # AllTeamRegistrationsCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('all_team_registrations', {
        url: '/all_team_registrations',
        templateUrl: 'views/all_team_registrations.html',
        controller: 'AllTeamRegistrationsCtrl',
        authenticate: true,
        department: "Hospitality"
      });
  })
  .controller('AllTeamRegistrationsCtrl',['$scope','$http','$localStorage','$state', function ($scope,$http,$localStorage,$state) {
    $scope.sortType = 'saarang_id';       /*table variables*/
    $scope.sortReverse = false;
    $scope.searchTag = '';
    console.log("yo")

    $http({
      method:'POST',
      url:'https://data.saarang.org/v1/query',
      data:{
              "type":"select",
              "args":{
                      "table":"event_registration",
                      "columns":["*",
                      {"name":"event","columns":["*"]}, 
                      {"name":"team","columns":["*",
                        {"name":"leader","columns":["*"]},
                        {"name":"members","columns":["*",
                          {"name":"user","columns":["*"]}
                          ]}
                        ]}
                      ],
                      "where":{"user_id":null}
                    }
            },
      headers:{
                'Authorization' :"Bearer "+$localStorage.auth_token
             }
      }).then(function(res){
        console.log("youo")
        console.log(res.data)
        $scope.all_team_regs = []
        for(var i = 0;i<res.data.length;i++){
          if(res.data[i].team.name == 'Crescendo Girls'){
              $scope.all_team_regs.push(res.data[i]);
              console.log($scope.all_team_regs)
          }
        }
    }).catch(function(err){
      console.log(err.data);
    });




    $scope.show_team_modal = function (reg) {
      console.log("yo")
      document.getElementById('team_modal').style.display = "block";
      $scope.reg = reg;
    }

    $scope.hide_team_modal = function () {
      console.log("yoyo")
      document.getElementById('team_modal').style.display = "none";
    }

    $scope.team_update = false;

    $scope.show_update_team = function(){
      $scope.team_update = !$scope.team_update;
    }

    $scope.update_team = function (reg) {
          $http({
              method:'POST',
              url:'https://data.saarang.org/v1/query',
              data:{
                      "type":"update",
                      "args":{
                              "table":"team",
                              "$set":
                              {
                                "name":reg.team.name,
                                "city":reg.team.city
                              },
                              "where":{"id":reg.team.id}
                            }
                    },
              headers:{
                        'Authorization' :"Bearer "+$localStorage.auth_token
                    }
              }).then(function(res){
                console.log(res.data)
            $scope.team_update = !$scope.team_update;
            }).catch(function(err){
              console.log(err.data);
              $window.alert("error occurred please try again");
            });
    }



// FUNCTION USED FOR DEBUGGING
    // $scope.delete_teamreg = function(regs){
    //   for(var x = 0;x<regs.length;x++){
    //     console.log(regs[x].team_id)
    //     $http({
    //       method:'POST',
    //       url:'https://data.saarang.org/v1/query',
    //       data:{
    //               "type":"delete",
    //               "args":{
    //                       "table":"event_registration",
    //                       "where":{"team_id":regs[x].team_id}
    //                     }
    //             },
    //       headers:{
    //                 'Authorization' :"Bearer "+$localStorage.auth_token
    //             }
    //       }).then(function(res){
    //         console.log(res)
    //     }).catch(function(err){
    //       console.log(err.data);
    //     });
    //   }
    // }

  }]);
