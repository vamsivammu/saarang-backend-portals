'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:EventsAddwinnerCtrl
 * @description
 * # EventsAddwinnerCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('events.addWinner', {
        url: '/addWinner',
        templateUrl: 'views/events/addWinner.html',
        controller: 'AddWinnerCtrl',
        authenticate: true
      });
  })
 .controller('AddWinnerCtrl',['$scope','$rootScope','$mdDialog','$http','$localStorage','$window', function ($scope,$rootScope,$mdDialog,$http,$localStorage,$window) {
      $scope.event_c.subtab = false;
      $scope.event_c.tabIndex = 3;
      $scope.events = [];
      $scope.winners = [];
      $scope.winner = null;
      $scope.edit_mod = false;
      $scope.add_mod = false;
      $scope.sortType = 'name';       /*table variables*/
      $scope.sortReverse = false;
      $scope.searchTag = '';
      $scope.get_events = function(){
        if($rootScope.allevents == undefined){
          $http({
              method:'POST',
              url:'https://data.saarang.org/v1/query',
              data:{
                      "type":"select",
                      "args":{
                              "table":"event",
                              "columns":["*"]
                            }
                    },
              headers:{
                        'Authorization' :"Bearer "+$localStorage.auth_token,
                        'X-Hasura-Role' : $localStorage.member.role
                     }
              }).then(function(res){
              $rootScope.allevents = res.data;
              $scope.events = $rootScope.allevents;
            }).catch(function(err){
              console.log(err);
              // console.log($localStorage.auth_token);
            });
          };
          $scope.events = $rootScope.allevents;
      };
      $scope.get_events();
      $scope.get_winners = function(){
        $http({
            method:'POST',
            url:'https://data.saarang.org/v1/query',
            data:{
                    "type":"select",
                    "args":{
                            "table":"event_winner",
                            "columns":["*",
                            {"name":"participant","columns":["*"]},
                            {"name":"team","columns":["*"]},
                            {"name":"added","columns":["*"]}]
                          }
                  },
            headers:{
                      'Authorization' :"Bearer "+$localStorage.auth_token,
                      'X-Hasura-Role' : $localStorage.member.role
                   }
            }).then(function(res){
            $scope.winners = res.data;
            console.log($scope.winners);
          }).catch(function(err){
            console.log(err.data);
            // console.log($localStorage.auth_token);
          });
      };
      $scope.get_winners();
      $scope.delete_winners = function(eve){
        if (confirm("Are you sure u want to delete "+eve.name + " winners") == true) {
          $http({
            method:'POST',
            url:'https://data.saarang.org/v1/query',
            data:{
                    "type":"delete",
                    "args":{
                            "table":"event_winner",
                            "where":{
                              "event_id" : eve.id
                            }
                          }
                  },
            headers:{
                      'Authorization' :"Bearer "+$localStorage.auth_token,
                      'X-Hasura-Role' : $localStorage.member.role
                   }
            }).then(function(res){
              // console.log("success");
             $scope.get_winners();
          }).catch(function(err){
            console.log(err);
            // console.log($localStorage.auth_token);
          });
        }
      };
      $scope.edit = function(pos,win,eve){
        $scope.position = pos;
        $scope.winner = win;
        $scope.event = eve;
        $scope.edit_mod = true;
      };
      $scope.cancel = function(){
        $scope.edit_mod = false;
        $scope.position = null;
        $scope.winner = null;
        $scope.event = null;
        $scope.details = false;
      }
      $scope.add_cancel = function(){
        $scope.add_mod = false;
        $scope.event = null;
      }
      $scope.get_user_details= function(){
        $http({
                  method:'POST',
                  url:'https://data.saarang.org/v1/query',
                  data:{
                      "type":"select",
                      "args":{
                          "table":"users_2019",
                          "columns":["*"],
                          "where":{"saarang_id":$scope.winner.participant.saarang_id}
                          }
                    },
                  headers:{
                      'Authorization' :"Bearer "+$localStorage.auth_token,
                      'X-Hasura-Role' : $localStorage.member.role
                  }
              }).then(function(res){
                res = res.data;
                  $scope.winner.participant = res[0];
                  $scope.details = true;
                  console.log(res);
              }).catch(function(err){
                  console.log(err.data);
              });
      };
      $scope.get_team_details = function(){
        $http({
          method :'POST',
          url: 'https://data.saarang.org/v1/query',
          data:{
            "type" :"select",
            "args":{
              "table":"team",
              "columns":["*",
              {"name":"leader","columns":["*"]},
              {"name":"members","columns":["*"]}],
              "where":{"saarang_id":$scope.winner.team.saarang_id}
            }
          },
          headers:{
            'Authorization':"Bearer "+$localStorage.auth_token,
            'X-Hasura-Role' : $localStorage.member.role
          }
        }).then(function(res){
          res = res.data;
          $scope.winner.team = res[0];
          $scope.details = true;
        }).catch(function(err){
          console.log(err.data);
        });
      };
      $scope.get_user_details1 = function(){
        $http({
                  method:'POST',
                  url:'https://data.saarang.org/v1/query',
                  data:{
                      "type":"select",
                      "args":{
                          "table":"users_2019",
                          "columns":["*"],
                          "where":{"saarang_id":$scope.winner1.participant.saarang_id}
                          }
                    },
                  headers:{
                      'Authorization' :"Bearer "+$localStorage.auth_token,
                      'X-Hasura-Role' : $localStorage.member.role
                  }
              }).then(function(res){
                res = res.data;
                  $scope.winner1.participant = res[0];
                  $scope.details1 = true;
                  console.log(res);
              }).catch(function(err){
                  console.log(err.data);
              });
        //$scope.winner1.participant = $scope.winner.participant;
      }
      $scope.get_user_details2 = function(){
        $http({
                  method:'POST',
                  url:'https://data.saarang.org/v1/query',
                  data:{
                      "type":"select",
                      "args":{
                          "table":"users_2019",
                          "columns":["*"],
                          "where":{"saarang_id":$scope.winner2.participant.saarang_id}
                          }
                    },
                  headers:{
                      'Authorization' :"Bearer "+$localStorage.auth_token,
                      'X-Hasura-Role' : $localStorage.member.role
                  }
              }).then(function(res){
                res = res.data;
                  $scope.winner2.participant = res[0];
                  $scope.details2 = true;
                  console.log(res);
              }).catch(function(err){
                  console.log(err.data);
              });
        //$scope.winner1.participant = $scope.winner.participant;
      }
      $scope.get_user_details3 = function(){
        $http({
                  method:'POST',
                  url:'https://data.saarang.org/v1/query',
                  data:{
                      "type":"select",
                      "args":{
                          "table":"users_2019",
                          "columns":["*"],
                          "where":{"saarang_id":$scope.winner3.participant.saarang_id}
                          }
                    },
                  headers:{
                      'Authorization' :"Bearer "+$localStorage.auth_token,
                      'X-Hasura-Role' : $localStorage.member.role
                  }
              }).then(function(res){
                res = res.data;
                  $scope.winner3.participant = res[0];
                  $scope.details3 = true;
                  console.log(res);
              }).catch(function(err){
                  console.log(err.data);
              });
        //$scope.winner1.participant = $scope.winner.participant;
      };
      $scope.get_team_details1 = function(){
        $http({
          method :'POST',
          url: 'https://data.saarang.org/v1/query',
          data:{
            "type" :"select",
            "args":{
              "table":"team",
              "columns":["*",
              {"name":"leader","columns":["*"]},
              {"name":"members","columns":["*"]}],
              "where":{"saarang_id":$scope.winner1.team.saarang_id}
            }
          },
          headers:{
            'Authorization':"Bearer "+$localStorage.auth_token,
            'X-Hasura-Role' : $localStorage.member.role
          }
        }).then(function(res){
          res = res.data;
          $scope.winner1.team = res[0];
          $scope.details1 = true;
        }).catch(function(err){
          console.log(err.data);
        });
      };
      $scope.get_team_details2 = function(){
        $http({
          method :'POST',
          url: 'https://data.saarang.org/v1/query',
          data:{
            "type" :"select",
            "args":{
              "table":"team",
              "columns":["*",
              {"name":"leader","columns":["*"]},
              {"name":"members","columns":["*"]}],
              "where":{"saarang_id":$scope.winner2.team.saarang_id}
            }
          },
          headers:{
            'Authorization':"Bearer "+$localStorage.auth_token,
            'X-Hasura-Role' : $localStorage.member.role
          }
        }).then(function(res){
          res = res.data;
          $scope.winner2.team = res[0];
          $scope.details2 = true;
        }).catch(function(err){
          console.log(err.data);
        });
      };
      $scope.get_team_details3 = function(){
        $http({
          method :'POST',
          url: 'https://data.saarang.org/v1/query',
          data:{
            "type" :"select",
            "args":{
              "table":"team",
              "columns":["*",
              {"name":"leader","columns":["*"]},
              {"name":"members","columns":["*"]}],
              "where":{"saarang_id":$scope.winner3.team.saarang_id}
            }
          },
          headers:{
            'Authorization':"Bearer "+$localStorage.auth_token,
            'X-Hasura-Role' : $localStorage.member.role
          }
        }).then(function(res){
          res = res.data;
          $scope.winner3.team = res[0];
          $scope.details3 = true;
        }).catch(function(err){
          console.log(err.data);
        });
      };
      $scope.onEdit = function(){
        if($scope.event.is_team_event){
          $http({
            method: 'POST',
            url: 'https://data.saarang.org/v1/query',
            data: {
              "type" : "update",
              "args":{
                "table":"event_winner",
                "$set":{
                  "team_id":$scope.winner.team.id
                },
                "where":{"id":$scope.winner.id}
              }
            },
            headers:{
              'Authorization':"Bearer "+$localStorage.auth_token,
              'X-Hasura-Role' : $localStorage.member.role
            }
          }).then(function(res){
            console.log("success");
            $scope.cancel();
          }).catch(function(err){
            console.log(err.data);
          })
        }else{
          $http({
            method: 'POST',
            url: 'https://data.saarang.org/v1/query',
            data: {
              "type" : "update",
              "args":{
                "table":"event_winner",
                "$set":{
                  "user_id":$scope.winner.participant.id
                },
                "where":{"id":$scope.winner.id}
              }
            },
            headers:{
              'Authorization':"Bearer "+$localStorage.auth_token,
              'X-Hasura-Role' : $localStorage.member.role
            }
          }).then(function(res){
            console.log("success");
            $scope.cancel();
          }).catch(function(err){
            console.log(err.data);
          })
        }
      };
      $scope.add = function(eve){
        $scope.event = eve;
        $scope.add_mod = true;
      };
      $scope.onSubmit = function(){
        if($scope.event.is_team_event){
          $http({
            method:'POST',
            url:'https://data.saarang.org/v1/query',
            data:{
                    "type":"insert",
                    "args":{
                            "table":"event_winner",
                            "returning": ["id"],
                            "objects":[
                            {
                              "position": 1,
                              "team_id":$scope.winner1.team.id,
                              "event_id":$scope.event.id
                            }
                            ]
                          }
              },
            headers:{
                      'Authorization' :"Bearer "+$localStorage.auth_token,
                      'X-Hasura-Role' : $localStorage.member.role
                  }
            }).then(function(res){
              res = res.data;
                $http({
                  method:'POST',
                  url:'https://data.saarang.org/v1/query',
                  data:{
                          "type":"insert",
                          "args":{
                                  "table":"event_winner",
                                  "returning": ["id"],
                                  "objects":[
                                  {
                                    "position": 2,
                                    "team_id":$scope.winner2.team.id,
                                    "event_id":$scope.event.id
                                  }
                                  ]
                                }
                    },
                  headers:{
                            'Authorization' :"Bearer "+$localStorage.auth_token,
                            'X-Hasura-Role' : $localStorage.member.role
                        }
                  }).then(function(res){
                    $http({
                      method:'POST',
                      url:'https://data.saarang.org/v1/query',
                      data:{
                              "type":"insert",
                              "args":{
                                      "table":"event_winner",
                                      "returning": ["id"],
                                      "objects":[
                                      {
                                        "position": 3,
                                        "team_id":$scope.winner3.team.id,
                                        "event_id":$scope.event.id
                                      }
                                      ]
                                    }
                        },
                      headers:{
                                'Authorization' :"Bearer "+$localStorage.auth_token,
                                'X-Hasura-Role' : $localStorage.member.role
                            }
                      }).then(function(res){
                          $scope.add_cancel();
                          $scope.get_winners();
                      }).catch(function(err){
                        console.log(err.data);
                        $window.alert("error occurred please try again");
                        // console.log($localStorage.auth_token);
                      });
                  }).catch(function(err){
                    console.log(err.data);
                    $window.alert("error occurred please try again");
                    // console.log($localStorage.auth_token);
                  });
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
                    "type":"insert",
                    "args":{
                            "table":"event_winner",
                            "returning": ["id"],
                            "objects":[
                            {
                              "position": 1,
                              "user_id":$scope.winner1.participant.id,
                              "event_id":$scope.event.id
                            }
                            ]
                          }
              },
            headers:{
                      'Authorization' :"Bearer "+$localStorage.auth_token,
                      'X-Hasura-Role' : $localStorage.member.role
                  }
            }).then(function(res){
              res = res.data;
                $http({
                  method:'POST',
                  url:'https://data.saarang.org/v1/query',
                  data:{
                          "type":"insert",
                          "args":{
                                  "table":"event_winner",
                                  "returning": ["id"],
                                  "objects":[
                                  {
                                    "position": 2,
                                    "user_id":$scope.winner2.participant.id,
                                    "event_id":$scope.event.id
                                  }
                                  ]
                                }
                    },
                  headers:{
                            'Authorization' :"Bearer "+$localStorage.auth_token,
                            'X-Hasura-Role' : $localStorage.member.role
                        }
                  }).then(function(res){
                    $http({
                      method:'POST',
                      url:'https://data.saarang.org/v1/query',
                      data:{
                              "type":"insert",
                              "args":{
                                      "table":"event_winner",
                                      "returning": ["id"],
                                      "objects":[
                                      {
                                        "position": 3,
                                        "user_id":$scope.winner3.participant.id,
                                        "event_id":$scope.event.id
                                      }
                                      ]
                                    }
                        },
                      headers:{
                                'Authorization' :"Bearer "+$localStorage.auth_token,
                                'X-Hasura-Role' : $localStorage.member.role
                            }
                      }).then(function(res){
                          $scope.add_cancel();
                          $scope.get_winners();
                      }).catch(function(err){
                        console.log(err.data);
                        $window.alert("error occurred please try again");
                        // console.log($localStorage.auth_token);
                      });
                  }).catch(function(err){
                    console.log(err.data);
                    $window.alert("error occurred please try again");
                    // console.log($localStorage.auth_token);
                  });
            }).catch(function(err){
              console.log(err.data);
            $window.alert("error occurred please try again");
              // console.log($localStorage.auth_token);
            });
        }
      }
  }]);

