'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:HospiStatisticsCtrl
 * @description
 * # HospiStatisticsCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('hospi.statistics', {
        url: '/statistics',
        templateUrl: 'views/hospi/statistics.html',
        controller: 'StatisticsCtrl',
        controllerAs: 'statiC',
        authenticate: true
      });
  })
  .controller('StatisticsCtrl',['$scope', '$http', '$localStorage', function ($scope, $http, $localStorage) {
    $scope.hosp.tabIndex = 0;

    $scope.stati = [{
                        status: "Not Requested",
                        class: 'label label-default',
                        teams: 0,
                        male_members: 0,
                        female_members: 0
                    },{
                        status: "Request Pending",
                        class: 'label label-info',
                        teams: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        status: "Request Confirmed",
                        class: 'label label-success',
                        teams: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        status: "Request Waitlisted",
                        class: 'label label-warning',
                        teams: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        status: "Request Rejected",
                        class: 'label label-danger',
                        teams: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        status: 'TOTAL',
                        class: 'label label-primary',
                        teams: 0,
                        male_members: 0,
                        female_members: 0
                    }];
    $scope.arrival_stati = [{
                        day: 'Before Day 1',
                        teams: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 1',
                        teams: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 2',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 3',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 4',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 5',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    }];
    $scope.departure_stati = [{
                        day: 'Day 1',
                        teams: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 2',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 3',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 4',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 5',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'After Day 5',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    }];
    $scope.checkin_stati = [{
                        day: 'Before Day 1',
                        teams: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 1',
                        teams: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 2',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 3',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 4',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 5',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    }];
    $scope.checkout_stati = [{
                        day: 'Day 1',
                        teams: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 2',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 3',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 4',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'Day 5',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    },
                    {
                        day: 'After Day 5',
                        team: 0,
                        male_members: 0,
                        female_members: 0
                    }];

    var config = {
          headers : {"Authorization": "Bearer "+ $localStorage.auth_token, "X-Hasura-Role" : "core"} 
        };

    var GetArrivalStati = function(day) {
        $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "team", "where": {"$and": [{"time_of_arrival": {"$gte": moment("1/" + (9 + day) + "/2018", "MM/DD/YYYY")._d}}, {"time_of_arrival": {"$lt": moment("1/" + (10 + day) + "/2018", "MM/DD/YYYY")._d}}, {"accommodation_status": {"$in": ["Request Pending", "Request Confirmed", "Request Waitlisted", "Request Rejected"]}}]}}}, config)
            .then(function(response) {
                $scope.arrival_stati[day].teams = response.data.count;
                if(day!=5) GetArrivalStati(day+1);
            });
        $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "team_member_view", "where": {"$and": [{"member": {"gender": "Male"}}, {"team": {"time_of_arrival": {"$gte": moment("1/" + (9 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"time_of_arrival": {"$lt": moment("1/" + (10 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"accommodation_status": {"$in": ["Request Pending", "Request Confirmed", "Request Waitlisted", "Request Rejected"]}}}]}}}, config)
            .then(function(response) {
                $scope.arrival_stati[day].male_members = response.data.count;
            });
        $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "team_member_view", "where": {"$and": [{"member": {"gender": "Female"}}, {"team": {"time_of_arrival": {"$gte": moment("1/" + (9 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"time_of_arrival": {"$lt": moment("1/" + (10 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"accommodation_status": {"$in": ["Request Pending", "Request Confirmed", "Request Waitlisted", "Request Rejected"]}}}]}}}, config)
            .then(function(response) {
                $scope.arrival_stati[day].female_members = response.data.count;
            });  
    }

    var GetDepartureStati = function(day) {
        $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "team", "where": {"$and": [{"time_of_departure": {"$gte": moment("1/" + (9 + day) + "/2018", "MM/DD/YYYY")._d}}, {"time_of_departure": {"$lt": moment("1/" + (10 + day) + "/2018", "MM/DD/YYYY")._d}}, {"accommodation_status": {"$in": ["Request Pending", "Request Confirmed", "Request Waitlisted", "Request Rejected"]}}]}}}, config)
            .then(function(response) {
                $scope.departure_stati[day-1].teams = response.data.count;
                if(day!=6) GetDepartureStati(day+1);
            });
        $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "team_member_view", "where": {"$and": [{"member": {"gender": "Male"}}, {"team": {"time_of_departure": {"$gte": moment("1/" + (9 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"time_of_departure": {"$lt": moment("1/" + (10 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"accommodation_status": {"$in": ["Request Pending", "Request Confirmed", "Request Waitlisted", "Request Rejected"]}}}]}}}, config)
            .then(function(response) {
                $scope.departure_stati[day-1].male_members = response.data.count;
            });
        $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "team_member_view", "where": {"$and": [{"member": {"gender": "Female"}}, {"team": {"time_of_departure": {"$gte": moment("1/" + (9 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"time_of_departure": {"$lt": moment("1/" + (10 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"accommodation_status": {"$in": ["Request Pending", "Request Confirmed", "Request Waitlisted", "Request Rejected"]}}}]}}}, config)
            .then(function(response) {
                $scope.departure_stati[day-1].female_members = response.data.count;
            });  
    }

    var GetCheckInStati = function(day) {
        $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "team", "where": {"$and": [{"checked_in": {"$gte": moment("1/" + (9 + day) + "/2018", "MM/DD/YYYY")._d}}, {"checked_in": {"$lte": moment("1/" + (10 + day) + "/2018", "MM/DD/YYYY")._d}}, {"accommodation_status": {"$in": ["Request Confirmed"]}}]}}}, config)
            .then(function(response) {
                $scope.checkin_stati[day].teams = response.data.count;
                if(day!=5) GetCheckInStati(day+1);
            });
        $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "team_member_view", "where": {"$and": [{"member": {"gender": "Male"}}, {"team": {"checked_in": {"$gte": moment("1/" + (9 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"checked_in": {"$lte": moment("1/" + (10 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"accommodation_status": {"$in": ["Request Confirmed"]}}}]}}}, config)
            .then(function(response) {
                $scope.checkin_stati[day-1].male_members = response.data.count;
            });
        $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "team_member_view", "where": {"$and": [{"member": {"gender": "Female"}}, {"team": {"checked_in": {"$gte": moment("1/" + (9 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"checked_in": {"$lte": moment("1/" + (10 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"accommodation_status": {"$in": ["Request Confirmed"]}}}]}}}, config)
            .then(function(response) {
                $scope.checkin_stati[day-1].female_members = response.data.count;
            });  
    }

    var GetCheckOutStati = function(day) {
        $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "team", "where": {"$and": [{"checked_out": {"$gte": moment("1/" + (9 + day) + "/2018", "MM/DD/YYYY")._d}}, {"checked_out": {"$lte": moment("1/" + (10 + day) + "/2018", "MM/DD/YYYY")._d}}, {"accommodation_status": {"$in": ["Request Confirmed"]}}]}}}, config)
            .then(function(response) {
                $scope.checkout_stati[day].teams = response.data.count;
                if(day!=6) GetCheckOutStati(day+1);
            });
        $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "team_member_view", "where": {"$and": [{"member": {"gender": "Male"}}, {"team": {"checked_out": {"$gte": moment("1/" + (9 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"checked_out": {"$lte": moment("1/" + (10 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"accommodation_status": {"$in": ["Request Confirmed"]}}}]}}}, config)
            .then(function(response) {
                $scope.checkout_stati[day].male_members = response.data.count;
            });
        $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "team_member_view", "where": {"$and": [{"member": {"gender": "Female"}}, {"team": {"checked_out": {"$gte": moment("1/" + (9 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"checked_out": {"$lte": moment("1/" + (10 + day) + "/2018", "MM/DD/YYYY")._d}}}, {"team": {"accommodation_status": {"$in": ["Request Confirmed"]}}}]}}}, config)
            .then(function(response) {
                $scope.checkout_stati[day].female_members = response.data.count;
            });  
    }
    

    var populateTeams = function(i) {

        var data = {
            "type": "count",
            "args": {
                "table": "team",
                "where": {
                    "accommodation_status": $scope.stati[i].status
                }
            }
        }

        $http.post('https://data.saarang.org/v1/query', data, config)
            .then(function(response) {
                response = response.data;
                $scope.stati[i].teams = response.count;
                if(i==4) {
                    for(var j=0; j<5; ++j){
                        $scope.stati[5].teams += $scope.stati[j].teams;
                    }
                } else {
                    populateTeams(i+1);
                }
            });
    };

    var populateMales = function(i) {

        var data = {
            "type": "count",
            "args": {
                "table": "team_member_view",
                "where": {
                    "$and": [
                        { "member": {"gender": "Male"} },
                        { "team": {"accommodation_status": $scope.stati[i].status} }
                    ]
                }
            }
        }

        $http.post('https://data.saarang.org/v1/query', data, config)
            .then(function(response) {
                response = response.data;
                $scope.stati[i].male_members = response.count;
                if(i==4) {
                    for(var j=0; j<5; ++j){
                        $scope.stati[5].male_members += $scope.stati[j].male_members;
                    }
                } else {
                    populateMales(i+1);
                }
            });
    };

    var populateFemales = function(i) {

        var data = {
            "type": "count",
            "args": {
                "table": "team_member_view",
                "where": {
                    "$and": [
                        { "member": {"gender": "Female"} },
                        { "team": {"accommodation_status": $scope.stati[i].status} }
                    ]
                }
            }
        }

        $http.post('https://data.saarang.org/v1/query', data, config)
            .then(function(response) {
                response = response.data;
                $scope.stati[i].female_members = response.count;
                if(i==4) {
                    for(var j=0; j<5; ++j){
                        $scope.stati[5].female_members += $scope.stati[j].female_members;
                    }
                } else {
                    populateFemales(i+1);
                }
            });
    };

    populateTeams(0);
    populateMales(0);
    populateFemales(0);
    GetArrivalStati(0);
    GetDepartureStati(1);
    GetCheckInStati(0);
    GetCheckOutStati(1);
  }]);
