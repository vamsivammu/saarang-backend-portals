'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:BillsPaymentCtrl
 * @description
 * # BillsPaymentCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('bills.payment', {
        url: '/payments',
        templateUrl: 'views/bills/payment.html',
        controller: 'BillsPaymentCtrl'
      });
  })
  .controller('BillsPaymentCtrl',['$scope', '$http','Upload','cloudinary', '$localStorage', '$state', function ($scope, $http, $upload, cloudinary, $localStorage, $state) {

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

        if (file && !file.$error && Object.keys($scope.data).length == 11) { 
          $scope.status = true;
            
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/gallerysaarang/upload",
            data: {
              upload_preset: "finance_data",
              tags: 'finance-data',
              context: 'payment=' + $scope.data.purpose,
              file: file
            }
          }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            $scope.progress = file.progress + "%";
          }).success(function (data, status, headers, config) {
            $scope.data.url  = data.url;


            var bill = {
                 "type":"insert",
                 "args": {
                    "table": "finance_payments",
                    "objects": [{
                      "vendor_contact": $scope.data.vendor_contact,
                      "url": $scope.data.url,
                      "department" : $scope.data.department,
                      "purpose": $scope.data.purpose,
                      "bill_number": $scope.data.bill_number,
                      "acc_name": $scope.data.acc_name,
                      "acc_number": $scope.data.acc_number,
                      "ifsc": $scope.data.ifsc,
                      "pan_number": $scope.data.pan_number,
                      "amount": $scope.data.amount,
                      "user_name": $scope.data.name,
                      "user_contact": $scope.data.contact
                    }]
                }
            }
            
            $http.post('https://data.saarang.org/v1/query', bill).then(function(response){
                alert('Successfully uploaded the Payment Receipt!');
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

