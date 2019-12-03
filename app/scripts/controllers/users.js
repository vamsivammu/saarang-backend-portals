'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
 .config(function ($stateProvider) {
    $stateProvider
      .state('users', {
        url: '/users',
        templateUrl: 'views/users.html',
        controller: 'UsersCtrl',
        authenticate: true
      });
  })
  .controller('UsersCtrl',['$scope','$http','$localStorage', function ($scope,$http,$localStorage) {

  $scope.sortType = 'saarang_id';       /*table variables*/
 	$scope.sortReverse = false;
 	$scope.searchTag = '';
  $scope.currentPage = 1;

  $scope.GetData = function(pagenumber) {
    $scope.allusers = [];
    var ilike = '%';
    if($scope.searchTag) ilike = '%' + $scope.searchTag + '%';
    $http.post('https://data.saarang.org/v1/query', {"type": "count", "args": {"table": "users_2019", "where": {"mobile": {"$ilike": ilike}}}}, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token}})
      .then(function(response) {
        response = response.data;
        $scope.total_entries = response.count;
      });
    var offset = (pagenumber-1)*20;
    var order_by = "";
    if (!$scope.sortReverse) order_by = $scope.sortType;
    else order_by = "-" + $scope.sortType;
    $http.post('https://data.saarang.org/v1/query', {"type": "select", "args": {"table": "users_2019", "columns": ["*"], "where": {"mobile": {"$ilike": ilike}}, "order_by": order_by, "limit": 20, "offset": offset}}, {"headers": {"Authorization": "Bearer " + $localStorage.auth_token}})
      .then(function(response) {
        $scope.allusers = response.data;
      });
  };
 	$scope.GetData(1);
  }]);
