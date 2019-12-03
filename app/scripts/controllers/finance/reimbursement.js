'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:FinanceReimbursementCtrl
 * @description
 * # FinanceReimbursementCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('finance.reimbursement', {
        url: '/reimbursements',
        templateUrl: 'views/finance/reimbursement.html',
        controller: 'FinanceReimbursementCtrl',
        authenticate: true
      });
  })
  .controller('FinanceReimbursementCtrl',['$scope','$http','$localStorage', function ($scope,$http,$localStorage) {

      $http({
      method:'POST',
      url:'https://data.saarang.org/v1/query',
      data:{
              "type":"select",
              "args":{
                      "table":"department",
                      "columns":["*"]
                    }
            }
      }).then(function(res){
        $scope.departments = res.data;       
    }).catch(function(err){
      console.log(err.data);
    });

    $scope.toggleModal = function(x){
       $scope.bill = x;
       $('#billModal').modal('show');
    };

    $scope.fetchBills = function(){
        var config = {
                  headers:{
                    'Authorization' : "Bearer "+ $localStorage.auth_token
                }
             }
      
        var bill = {
                 "type":"select",
                 "args": {
                    "table":"finance_reimbursements",
                    "columns":["*"],
                    "where": {"department": $scope.selected_department}
                }
            }  
      
        $http.post('https://data.saarang.org/v1/query', bill, config).then(function(response){
                $scope.bills = response.data;
             }).catch(function(err){
              console.log(err);
          });
    };


    $scope.statusUpdate = function(){
          var config = {
                      headers:{
                        'Authorization' : "Bearer "+ $localStorage.auth_token
                    }
                 }

          var status = {
                     "type":"update",
                     "args": {
                        "table":"finance_reimbursements",
                        "$set":{
                                    "status": $scope.bill.status
                                },
                        "where": {"id": $scope.bill.id}
                    }
                }

                $http.post('https://data.saarang.org/v1/query',status,config).then(function(res){
                     alert("Update Successful");
                     $('#billModal').modal('hide');
                }).catch(function(err){
                    alert("Please Try Again");
                    console.log(err);
                });
        };

}]);
