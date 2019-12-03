'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:ApplicationsUploadCtrl
 * @description
 * # ApplicationsUploadCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('applications.upload', {
        url: '/upload',
        templateUrl: 'views/applications/upload.html',
        controller: 'ApplicationsUploadCtrl',
        authenticate: true
      });
  })
  .controller('ApplicationsUploadCtrl',['$scope','$http','$localStorage','Upload','cloudinary', function ($scope,$http,$localStorage,$upload,cloudinary) {
    
     $scope.uploadFiles = function(file){     

      if (!file) alert("Please Upload the file");

        if (file && !file.$error && Object.keys($scope.data).length == 2) { 
          $scope.status = true;
            
          file.upload = $upload.upload({
            url: "https://api.cloudinary.com/v1_1/saarang2017/upload",
            data: {
              upload_preset: "coord_apps",
              tags: 'coord-apps',
              context: 'department=' +$localStorage.member.department.name ,
              file: file
            }
          }).progress(function (e) {
            file.progress = Math.round((e.loaded * 100.0) / e.total);
            $scope.progress = file.progress + "%";
          }).success(function (data, status, headers, config) {
            $scope.data.url  = data.url;


            var quest_apps = {
                 "type":"insert",
                 "args": {
                    "table": "question_apps",
                    "objects": [{
                      "department": $localStorage.member.department.name,
                      "url": $scope.data.url,
                      "sub_department" : $scope.data.sub_department,
                      "position": $scope.data.position,
                      "uploaded_by": $localStorage.member.username
                    }]
                }
            }
            
            $http.post('https://data.saarang.org/v1/query', quest_apps).then(function(response){
                alert('Successfully uploaded the Questionnaire!');
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
