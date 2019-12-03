'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:BillsPpmCtrl
 * @description
 * # BillsPpmCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('bills.ppm', {
        url: '/prizemoney',
        templateUrl: 'views/bills/ppm.html',
        controller: 'BillsPpmCtrl'
      });
  })
  .controller('BillsPpmCtrl',['$scope','$http','Upload','cloudinary','$localStorage','$state', function ($scope, $http, $upload, cloudinary, $localStorage, $state) {
  
    $scope.uploadFiles = function(file){     

      if (!file) alert("Please Upload the file");

        if (file && !file.$error && Object.keys($scope.data).length == 1) { 
          $scope.status = true;
            
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/gallerysaarang/upload",
            data: {
              upload_preset: "finance_data",
              tags: 'finance-data',
              context: 'ppm=' + $scope.data.title,
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
                    "table":"finance_ppm",
                    "objects": [{
                      "url":$scope.data.url,
                      "event": $scope.data.event
                  }]
                }
            }

            //add post request here

           $http.post('https://data.saarang.org/v1/query', sheet).then(function(response){
               alert('Successfully Uploaded the sheet!');    //refreshing the page after the upload
               $state.reload();
             }).catch(function(err){
                 console.log(err);
             });

          });
        }
        
        else {
          alert('Please fill the sheet title');
          $state.reload();
        } 
      };
  
}]);

