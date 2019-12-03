'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:BillsReimbursementCtrl
 * @description
 * # BillsReimbursementCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('bills.reimbursement', {
        url: '/reimbursements',
        templateUrl: 'views/bills/reimbursement.html',
        controller: 'BillsReimbursementCtrl'
      });
  })
  .controller('BillsReimbursementCtrl',['$scope','$http','Upload','cloudinary','$localStorage','$state', function ($scope, $http, $upload, cloudinary, $localStorage, $state) {
   
     //fetch departments
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

    $scope.uploadFiles = function(file){     

      if (!file) alert("Please Upload the file");

        if (file && !file.$error && Object.keys($scope.data).length == 10) { 
          $scope.status = true;
            
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/gallerysaarang/upload",
            data: {
              upload_preset: "finance_data",
              tags: 'finance-data',
              context: 'reimbursement=' + $scope.data.purpose,
              file: file
            }
          }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            $scope.progress = file.progress + "%";
          }).success(function (data, status, headers, config) {
            
            $scope.data.url  = data.url;
            
            var sheet = {
                 "type":"insert",
                 "args": {
                    "table":"finance_reimbursements",
                    "objects": [{
                      "purpose":$scope.data.purpose,
                      "url":$scope.data.url,
                      "department": $scope.data.department,
                      "event_name": $scope.data.event_name,
                      "amount": $scope.data.amount,
                      "bill_number": $scope.data.bill_number,
                      "event_date": $scope.data.event_date,
                      "bill_date": $scope.data.bill_date,
                      "comments": $scope.data.comments,
                      "user_name": $scope.data.name,
                      "user_contact": $scope.data.contact
                  }]
                }
            }

            //add post request here

           $http.post('https://data.saarang.org/v1/query', sheet).then(function(response){
               alert('Successfully uploaded Invoice!');   
               $state.reload();
             }).catch(function(err){
                 console.log(err);
             });

          });
        }
        
        else {
          alert('Please fill the details');
          $state.reload();
        } 
      };
  
}]);

