'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:EventsRegistrationsCtrl
 * @description
 * # EventsRegistrationsCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
 .config(function ($stateProvider) {
    $stateProvider
      .state('events.registrations', {
        url: '/registrations/:name',
        templateUrl: 'views/events/registrations.html',
        controller: 'RegistrationsCtrl'
      });
  })
.controller('RegistrationsCtrl',['$scope','$rootScope', '$mdToast', '$mdDialog','$window','$state','$localStorage', '$location','$http',function ($scope,$rootScope, $mdToast, $mdDialog,$window,$state,$localStorage, $location,$http) {
    $scope.event_c.subIndex = 3;
    $scope.members = [];
    $scope.event_c.subtab = true;
    $scope.newReg = {};
    $scope.details = false;
    if($rootScope.edit_event == undefined){
        //$scope.event_selected = {};
        $location.path('/events');
    }
    $scope.sortReverse = false;
    $scope.searchTag = "";
    $scope.allregs = {};
    $scope.disableLeader = false;
    $scope.selected_event = $rootScope.edit_event;
    var newEditTeamMembers = [];
// GETTING ALL REGISTRATIONS FOR THIS EVENT

    if($scope.selected_event.is_team_event){
      $http({
        method:'POST',
        url:'https://data.saarang.org/v1/query',
        data:{
          "type": "select",
          "args": {
                        "table": "event_team",
                        "columns": [
                          {
                              "name": "event",
                              "columns": [
                                  "*"
                              ]
                          },
                          "*"
                      ],
                        "where": {
                          "event_id": {
                              "$eq": $scope.selected_event.id
                          }
                      }
                      }
              },
        headers:{
                  'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
              }
        }).then(function(res){
          console.log(res.data)
        $scope.allregs = res.data;
        $scope.sortType = 'team.saarang_id';       /*table variables*/
      }).catch(function(err){
        console.log(err.data);
      });
      $http({
        method:'POST',
        url:'https://data.saarang.org/v1/query',
        data:{
            "type": "select",
            "args": {
                "table": "event_team_member_view",
                "columns": [
                    "college",
                    "email",
                    "mobile",
                    "name",
                    "saarang_id",
                    {
                        "name": "team",
                        "columns": [
                            "name",
                            "saarang_id",
                            "participated",
                            "registered_by"
                        ]
                    }
                ],
                "where": {
                    "team": {
                        "event_id": {
                            "$eq": $scope.selected_event.id
                        }
                    }
                }
            }
        },
        headers:{
                  'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
              }
        }).then(function(res){
          console.log(res.data)
        $scope.allregs2 = res.data;      /*table variables*/
      }).catch(function(err){
        console.log(err.data);
      });
    }else{
      $http({
        method:'POST',
        url:'https://data.saarang.org/v1/query',
        data:{
                "type":"select",
                "args":{
                        "table":"event_registration",
                        "columns":["*",
                          {"name":"participant","columns":["*"]},
                          {"name":"event","columns":["*"]}
                        ],
                        "where": {
                          "$and": [
                          {"event_id": $scope.selected_event.id},
                          {"team_id": null},
                        ]}
                      }
              },
        headers:{
                  'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
              }
        }).then(function(res){
        $scope.allregs = res.data;
        $scope.sortType = 'participant.saarang_id';       /*table variables*/
      }).catch(function(err){
        console.log(err.data);
      });
    }

    $scope.show_user_reg_modal = function (reg) {
      document.getElementById('user_reg_modal').style.display = "block";
      $scope.reg = reg;
    };

    $scope.hide_user_reg_modal = function () {
      document.getElementById('user_reg_modal').style.display = "none";
    };

    $scope.show_team_reg_modal = function (reg) {
      document.getElementById('team_reg_modal').style.display = "block";

      $http({
        method:'POST',
        url:'https://data.saarang.org/v1/query',
        data:{
                "type":"select",
                "args":{
                        "table":"event_team",
                        "columns":["*",
                          {"name":"leader","columns":["*"]},
                          {"name":"members_view","columns":["*",
                            {"name":"member","columns":["*"]}
                          ]}
                        ],
                        "where":{
                          "id": reg.team_id
                        }
                      }
              },
        headers:{
                  'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
              }
        }).then(function(res){
          console.log(res);
          res = res.data;
          $scope.reg_team = res[0];
      }).catch(function(err){
        console.log(err.data);
      });
    };

    $scope.hide_team_reg_modal = function () {
      document.getElementById('team_reg_modal').style.display = "none";
    };

// TOGGLE SINGLE PARTICIPATION
 $scope.toggle_single_participation = function(reg){
   if(reg.participant.desk_registration === false){
     alert("User is not registered at Hospitality desk");
     console.log("User is not registered at Hospitality desk");
  }else if(confirm("Are you sure you want to update Participation Status of "+ reg.participant.name) === true){
        
          $http({
              method:'POST',
              url:'https://data.saarang.org/v1/query',
              data:{
                      "type":"update",
                      "args":{
                              "table":"event_registration",
                              "$set":
                              {
                                "participated": !reg.participated,
                                "registered_by":$localStorage.member
                              },
                              "where":{"id":reg.id}
                            }
                    },
              headers:{
                        'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
                    }
              }).then(function(res){
                console.log(res)
                $state.reload();
            }).catch(function(err){
              console.log(err.data);
              $state.reload();
            });
            
      }
    };

// CODE FOR NEW SINGLE EVENT REGISTRATION BEGIN
    $scope.new_reg = {};

    $scope.show_new_single_reg_modal = function (reg) {
      document.getElementById('new_single_reg_modal').style.display = "block";
    };

    $scope.hide_new_single_reg_modal = function () {
      document.getElementById('new_single_reg_modal').style.display = "none";
      $state.reload();
    };

// FETCHING DETAILS OF THE USER
      $scope.get_user_details = function(new_single_reg){
        $scope.err_message = null;
          if(new_single_reg.saarang_id){
            $http({
              method:'POST',
              url:'https://data.saarang.org/v1/query',
              data:{
                      "type":"select",
                      "args":{
                              "table":"users_2019",
                              "columns":["*"],
                              "where":{
                                "saarang_id": new_single_reg.saarang_id 
                              }
                            }
                    },
              headers:{
                        'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
                    }
              }).then(function(res){
                console.log(res);
                $scope.new_single_res = res.data[0];
                for(var i = 0;i<$scope.allregs.length;i++){
                  if($scope.allregs[i].participant.saarang_id === new_single_reg.saarang_id){
                    $scope.err_message = "This user is already registered for this event";
                    break;
                  }else if(i === $scope.allregs.length-1 && $scope.new_single_res.desk_registration === false){
                      $scope.err_message = "This user is not registered at Hospitality Desk";
                  }
                }
            }).catch(function(err){
              console.log(err.data);
              $scope.err_message = "Sorry, there are no users with this SaarangID";
            });
          }else if(new_single_reg.mobile){
              $http({
                method:'POST',
                url:'https://data.saarang.org/v1/query',
                data:{
                        "type":"select",
                        "args":{
                                "table":"users_2019",
                                "columns":["*"],
                                "where":{
                                  "mobile": new_single_reg.mobile 
                                }
                              }
                      },
                headers:{
                          'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
                      }
                }).then(function(res){
                  console.log(res);
                $scope.new_single_res = res.data[0];
                for(var i = 0;i<$scope.allregs.length;i++){
                  if($scope.allregs[i].participant.mobile === new_single_reg.mobile){
                    $scope.err_message = "This user is already registered for this event";
                    break;
                  }else if(i === $scope.allregs.length-1 && $scope.new_single_res.desk_registration === false){
                      $scope.err_message = "This user is not registered at Hospitality Desk";
                  }
                }
              }).catch(function(err){
                console.log(err.data);
                $scope.err_message = "Sorry, there are no users with this Mobile Number";
              });
          }
    };
    
  //  ADDING A NEW REGISTRATION TO THE EVENT
    $scope.register_new_single = function(new_single_res){
      $http({
        method:'POST',
        url:'https://data.saarang.org/v1/query',
        data:{
                "type":"insert",
                "args":{
                        "table":"event_registration",
                        "objects":[
                          {
                              'event_id' : $scope.selected_event.id,
                              'user_id' : new_single_res.id,
                              'registered_on':new Date(),
                              'registered_by': $localStorage.member,
                              'participated':false
                          }
                        ]
                      }
              },
        headers:{
                  'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
              }
        }).then(function(res){
            $mdToast.show(
              $mdToast.simple()
                .textContent(new_single_res.name +" is registered for " + $scope.selected_event.name)
                .position('top')
                .hideDelay(3000)
           );
           $scope.hide_new_single_reg_modal();
      }).catch(function(err){
        alert(err.data);
        console.log(err);
      });
    };

    $scope.Dialog = function(title, ok, cancel, callback1, callback2) {
      var a = $mdDialog.confirm()
        .clickOutsideToClose(true)
        .title(title)
        .ok(ok)
        .cancel(cancel);
      $mdDialog.show(a)
        .then(function() {
          callback1();
        }, function() {
          callback2();
        });
    };

    $scope.AddExistingTeam = function() {
      $scope.AddExistingTeamEdit = true;
      $scope.AddExistingTeamShowDetails = false;
      newEditTeamMembers = [];
      $scope.AddExistingTeamMemberID = "";
      $('#AddExistingTeam').modal('toggle');
    };

    $scope.AddExistingTeamFind = function(id) {
      if(!id) {
        $mdToast.show($mdToast.simple().textContent('Invalid Id!').hideDelay(3000));
      } else {
        $http.post('https://data.saarang.org/v1/query', {"type": "select", "args": {"table": "event_team", "columns": ["id", "saarang_id", "name", {"name": "leader", "columns": ["name","mobile", "saarang_id"]}, {"name": "members_view", "columns": [{"name": "member", "columns": ["*"]}]}], "where": {"saarang_id": id}}}, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role}})
          .then(function(response) {
            if(response.data.length!=0) {
              $scope.AddExistingTeamSaarangID = '';
              $scope.AddExistingTeamDetails = response.data[0];
              $scope.AddExistingTeamShowDetails = true;
              $scope.AddExistingTeamEdit = true;
            } else {$mdToast.show($mdToast.simple().textContent('Team not found!').hideDelay(3000));}
          });
      }
    };

    $scope.AddExistingTeamMember = function(sid) {
      var flag = 1;
      for(var i=0; i<$scope.AddExistingTeamDetails.members_view.length; ++i) {
        if($scope.AddExistingTeamDetails.members_view[i].member.saarang_id===sid) {flag=0;}
      }
      var userdetails = {member : {}}
      if(flag){
        $http.post('https://data.saarang.org/v1/query', {
          "type": "select",
          "args": {
              "table": "users_2019",
              "columns": ["*",
                  {
                      "name": "eventTeams",
                      "columns": [
                          {
                              "name": "members_view",
                              "columns": [
                                  "saarang_id"
                              ],
                              "where": {
                                  "saarang_id": {
                                      "$eq": sid
                                  }
                              }
                          },
                          {
                              "name": "event",
                              "columns": [
                                  "id"
                              ]
                          }
                      ],
                      "where": {
                          "event_id": {
                              "$eq": $scope.selected_event.id
                          }
                      }
                  }
              ],
              "where": {
                  "saarang_id": {
                      "$eq": sid
                  }
              }
          }
      }, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role}})
          .then(function(response) {
            console.log(response)
            if(response.data[0].eventTeams.length > 0){
              $mdToast.show($mdToast.simple().textContent('User already registered in another team for this event!').hideDelay(3000));
              $scope.err_message = "User already registered in another team for this event!"
            }

            else{
              userdetails.member = response.data[0];

              $http.post('https://data.saarang.org/v1/query', {
                  "type": "insert",
                  "args": {
                      "table": "event_team_member",
                      "objects": [
                          {
                              "team_id": $scope.AddExistingTeamDetails.id,
                              "registered_by": $localStorage.member,
                              "member_id": response.data[0].id
                          }
                      ]
                  }
              }, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role}})
              .then(function(res) {
                console.log(res)
                $scope.AddExistingTeamDetails.members_view.push(userdetails);
              }); 
            }
          }).catch(function(err){
          console.log(err);
          $scope.err_message = "Invalid ID";
        });
      }else {
        $scope.AddExistingTeamMemberID = '';
        $mdToast.show($mdToast.simple().textContent('Member already exists in this team!').hideDelay(3000));
      }
    };

    $scope.RemoveExistingTeamMember = function(index) {
      console.log($scope.AddExistingTeamDetails.members_view)
      $http.post('https://data.saarang.org/v1/query', {
        "type": "delete",
        "args": {
            "table": "event_team_member",
            "where": {
                "$and": [
                    {
                        "member": {
                            "id": {
                                "$eq": $scope.AddExistingTeamDetails.members_view[index].member.id
                            }
                        }
                    },
                    {
                        "team": {
                            "event": {
                                "id": {
                                    "$eq": $scope.selected_event.id
                                }
                            }
                        }
                    }
                ]
            }
        }
    }, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role}})
        .then(function(response) {
          console.log(response.data)

          $scope.AddExistingTeamDetails.members_view.splice(index, 1);
        });
    };

    $scope.SaveAndRegisterExistingTeam = function() {
      $http.post('https://data.saarang.org/v1/query', {"type": "select", "args": {"table": "event_team", "columns": ["*"], "where": {"$and": [{"event_id": $scope.selected_event.id}, {"id": $scope.AddExistingTeamDetails.id}]}}}, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role}})
        .then(function(response) {
          console.log(response.data)

          // if(response.data.length==0) {
          //   $http.post('https://data.saarang.org/v1/query', {"type": "insert", "args": {"table": "event_registration", "objects": [{"event_id": $scope.selected_event.id, "team_id": $scope.AddExistingTeamDetails.id, "participated": false, "registered_on": moment()._d, "registered_by": $localStorage.member}]}}, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role}})
          //     .then(function(response) {
          //       $mdToast.show($mdToast.simple().textContent('Registration Successfull!').hideDelay(3000));
          //       $('#AddExistingTeam').modal('toggle');
          //       $('body').removeClass('modal-open');
          //       $('.modal-backdrop').remove();
          //       $state.reload();
          //     });
          //   } else {
          //     $mdToast.show($mdToast.simple().textContent('Registration updated!').hideDelay(3000));
          //     $('#AddExistingTeam').modal('toggle');
          //     $('body').removeClass('modal-open');
          //     $('.modal-backdrop').remove();
          //     $state.reload();
          //   }
        });
    };

    $scope.AddNewTeam = function() {
      $scope.AddNewTeamDetails = {'name': '', 'leader_id': '', 'saarang_id': '', 'members': []};
      $scope.disableLeader = false;
      $scope.leader = {};
      document.getElementById('conf').style.display = "block";
      $scope.err_message = "";
      $scope.AddNewTeamMemberID = '';
      $('#AddNewTeam').modal('toggle');
    };

    $scope.AddNewTeamMember = function(sid) {
      var flag=1;
      $scope.err_message = "";
      for(var i=0; i<$scope.AddNewTeamDetails.members.length; ++i)
        if($scope.AddNewTeamDetails.members[i].saarang_id==$scope.AddNewTeamMemberID) {flag=0;}
      if(flag){
        $http.post('https://data.saarang.org/v1/query', {
          "type": "select",
          "args": {
              "table": "users_2019",
              "columns": ["*",
                  {
                      "name": "eventTeams",
                      "columns": [
                          {
                              "name": "members_view",
                              "columns": [
                                  "saarang_id"
                              ],
                              "where": {
                                  "saarang_id": {
                                      "$eq": sid
                                  }
                              }
                          },
                          {
                              "name": "event",
                              "columns": [
                                  "id"
                              ]
                          }
                      ],
                      "where": {
                          "event_id": {
                              "$eq": $scope.selected_event.id
                          }
                      }
                  }
              ],
              "where": {
                  "saarang_id": {
                      "$eq": sid
                  }
              }
          }
      }, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role}})
          .then(function(response) {
            console.log(response)
            if(response.data[0].eventTeams.length > 0){
              $mdToast.show($mdToast.simple().textContent('User already registered in another team for this event!').hideDelay(3000));
              $scope.err_message = "User already registered in another team for this event!"
            }

            else{
              $scope.AddNewTeamDetails.members.push(response.data[0]);
            }



          }).catch(function(err){
          console.log(err);
          $scope.err_message = "Invalid ID";
        });
      }else {
        $scope.AddNewTeamMemberID = '';
        $mdToast.show($mdToast.simple().textContent('Member already exists in this team!').hideDelay(3000));
      }
    };

    $scope.deleteParticipant = function(par){
      console.log(par)
      if (confirm("Are you sure u want to delete participant "+ par.participant.name) == true) {
        $http({
          method:'POST',
          url:'https://data.saarang.org/v1/query',
          data:
          {
            "type": "delete",
            "args": {
                "table": "event_registration",
                "where": {
                    "$and": [
                        {
                            "event_id": {
                                "$eq": $scope.selected_event.id
                            }
                        },
                        {
                            "user_id": {
                                "$eq": par.user_id
                            }
                        }
                    ]
                }
            }
        },
          headers:{
                    'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
                 }
          }).then(function(res){
            console.log(res)
            $state.reload();
        }).catch(function(err){
          console.log(err.data);
          // console.log($localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role);
        });
      }
    };

    $scope.deleteTeam = function(team){
      console.log(team)
      if (confirm("Are you sure u want to delete team "+ team.name) == true) {
        $http({
          method:'POST',
          url:'https://data.saarang.org/v1/query',
          data:{
                  "type":"delete",
                  "args":{
                          "table":"event_team_member",
                          "where":{
                            "team_id" : team.id
                          }
                        }
                },
          headers:{
                    'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
                 }
          }).then(function(res){
            console.log("deleted team members")
            $http({
              method:'POST',
              url:'https://data.saarang.org/v1/query',
              data:{
                      "type":"delete",
                      "args":{
                              "table":"event_team",
                              "where":{
                                "id" : team.id
                              }
                            }
                    },
              headers:{
                        'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
                     }
              }).then(function(resp){
                console.log("deleted team")
                $state.reload();
                $window.location.reload();
            })
        }).catch(function(err){
          console.log(err.data);
          // console.log($localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role);
        });
      }
    };

    $scope.RemoveNewTeamMember = function(index, id) {
      if(id == $scope.AddNewTeamDetails.leader_id){
        $scope.AddNewTeamDetails.leader_id = "";
        $scope.disableLeader=false;
      }
      $scope.AddNewTeamDetails.members.splice(index, 1);
    };

    $scope.getLeader = function(id){
      $scope.err_message= "";
      $http({
        method:'POST',
        url:'https://data.saarang.org/v1/query',
        data:{
            "type": "select",
            "args": {
                "table": "users_2019",
                "columns": [
                    {
                        "name": "eventTeams",
                        "columns": [
                            {
                                "name": "members_view",
                                "columns": [
                                    "saarang_id"
                                ],
                                "where": {
                                    "saarang_id": {
                                        "$eq": id
                                    }
                                }
                            },
                            {
                                "name": "event",
                                "columns": [
                                    "id"
                                ]
                            }
                        ],
                        "where": {
                            "event_id": {
                                "$eq": $scope.selected_event.id
                            }
                        }
                    }
                ],
                "where": {
                    "saarang_id": {
                        "$eq": id
                    }
                }
            }
        },
        headers:{
                  'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
              }
        }).then(function(res){
          console.log(res.data[0].eventTeams.length);
          if(res.data[0].eventTeams.length > 0){
            $mdToast.show($mdToast.simple().textContent('User already registered in another team for this event!').hideDelay(3000));
            $scope.err_message = "User already registered in another team for this event!"
          }
          else{
            $http.post('https://data.saarang.org/v1/query', {
              "type": "select",
              "args": {
                  "table": "users_2019",
                  "columns": ["*"],
                  "where": {
                      "saarang_id": {
                          "$eq": id
                      }
                  }
              }
          }, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role}})
                    .then(function(response) {
                      $scope.leader = response.data[0];
                    });
          }
          
          
      }).catch(function(err){
        console.log(err);
        $scope.err_message = "Invalid ID";
      });
    }

    $scope.confirmLeader = function() {
      $scope.disableLeader = true;
      document.getElementById('conf').style.display = "none";
      $scope.AddNewTeamDetails.members.push($scope.leader)
    }

    $scope.SaveAndRegisterNewTeam = function() {
    if(($scope.AddNewTeamDetails.name==='')||($scope.AddNewTeamDetails.leader_id==='')) {$mdToast.show($mdToast.simple().textContent('All fields are necessary!').hideDelay(3000));}
    else if($scope.AddNewTeamDetails.members.length===0) {$mdToast.show($mdToast.simple().textContent('No members added!').hideDelay(3000));}
      else {
        var flag=0;
        for(var i=0; i<$scope.AddNewTeamDetails.members.length; ++i)
          if($scope.AddNewTeamDetails.leader_id===$scope.AddNewTeamDetails.members[i].saarang_id) {flag=$scope.AddNewTeamDetails.members[i].id;}
        if(flag) {
          $http.post('https://data.saarang.org/v1/query', {"type": "insert", "args": {"table": "event_team", "returning": ["id"], "objects": [{"leader_id": $scope.leader.id, "event_id": $scope.selected_event.id, "registered_by": $localStorage.member , "name": $scope.AddNewTeamDetails.name}]}}, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role}})
            .then(function(response) {
               if(response.data.returning[0].id<10000){

                 if(response.data.returning[0].id>=1000) {$scope.AddNewTeamDetails.saarang_id = "SA19TE" + response.data.returning[0].id;}
               
                 else if(response.data.returning[0].id>=100) {$scope.AddNewTeamDetails.saarang_id = "SA19TE0" + response.data.returning[0].id;}
               
                 else if(response.data.returning[0].id>=10) {$scope.AddNewTeamDetails.saarang_id = "SA19TE00" + response.data.returning[0].id;}
               
                 else {$scope.AddNewTeamDetails.saarang_id = "SA19TE000" + response.data.returning[0].id;}
               }
              $http.post('https://data.saarang.org/v1/query', {"type": "update", "args": {"table": "event_team", "returning": ["id"], "$set": {"saarang_id": $scope.AddNewTeamDetails.saarang_id}, "where": {"id": response.data.returning[0].id}}}, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role}})
                .then(function(response) {
                  var team_memberArray = [];
                  for(var j=0; j<$scope.AddNewTeamDetails.members.length; ++j)
                    team_memberArray.push({"team_id": response.data.returning[0].id, "member_id": $scope.AddNewTeamDetails.members[j].id});
                  $http.post('https://data.saarang.org/v1/query', {"type": "insert", "args": {"table": "event_team_member", "objects": team_memberArray}}, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role}})
                    .then(function(response) {
                    //  $http.post('https://data.saarang.org/v1/query', {"type": "insert", "args": {"table": "event_registration", "objects": [{"event_id": $scope.selected_event.id, "team_id": team_memberArray[0].team_id, "participated": false, "registered_on": moment()._d}]}}, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role}})
                    //  .then(function(response) {
                          $mdToast.show($mdToast.simple().textContent('Team created and event registered successfully!').hideDelay(3000));
                          $('#AddNewTeam').modal('toggle');
                          $scope.leader = {};
                          $scope.err_message = "";
                          $('body').removeClass('modal-open');
                          $('.modal-backdrop').remove();
                          $state.reload();
                    //});
                    });
                  });
            });
        } else {$mdToast.show($mdToast.simple().textContent('Leader not found in members list!').hideDelay(3000));}
      }
    };

// TOGGLE TEAM PARTICIPATION
 $scope.toggle_team_participation = function(reg){
  if(confirm("Are you sure you want to update Participation Status of "+ reg.name) === true){
        
          $http({
              method:'POST',
              url:'https://data.saarang.org/v1/query',
              data: {
                      "type":"update",
                      "args":{
                              "table":"event_team",
                              "$set":
                              {
                                "participated": !reg.participated,
                                "registered_by":$localStorage.member
                              },
                              "where":{"id":reg.id}
                            }
                    },
              headers:{
                        'Authorization' :"Bearer "+$localStorage.auth_token, 'X-Hasura-Role' : $localStorage.member.role
                    }
              }).then(function(res){
                $state.reload();
            }).catch(function(err){
              console.log(err.data);
              $state.reload();
            });
      }
    };


  }]);
