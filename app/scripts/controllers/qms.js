'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:QmsCtrl
 * @description
 * # QmsCtrl
 * Controller of the erpSaarangFrontendApp
 */
angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('qms', {
        url: '/qms',
        templateUrl: 'views/qms.html',
        controller: 'QmsCtrl',
        authenticate: true,
        department: "Quality Management System"
      });
  })
  .controller('QmsCtrl',['$scope', '$http','Upload','cloudinary', '$localStorage', '$state', function ($scope,$http,$upload,cloudinary,$localStorage,$state) {
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

   $scope.fetchDocs = function(){
      // write the fetching code here

      if($scope.data.department) {
    		$scope.fetching = true;
    		$http({
              method:'POST',
              url:'https://data.saarang.org/v1/query',
              data:{
                 "type":"select",
                 "args":{
                      "table":"qms_data",
                      "columns":["*"],
                      "where": {"department": $scope.data.department}
                    }
                },
                headers:{
                          'Authorization' :"Bearer " + $localStorage.auth_token
                       }
              }).then(function(res){
                  $scope.documents = res.data;
                  $scope.fetching = false;
              }).catch(function(err){
                console.log(err.data);
           });
    	}

    	else alert("Please choose a department");
    };

   $scope.uploadFiles = function(file){
          // cloudinary code

          if (!file) alert("Please Upload the file");

            if (file && !file.$error && Object.keys($scope.data).length == 2) {
              $scope.status = true;

              file.upload = $upload.upload({
                url: "https://api.cloudinary.com/v1_1/gallerysaarang/upload",
                data: {
                  upload_preset: "qms_data",
                  tags: 'qms-data',
                  context: 'qms=' + $scope.data.title,
                  file: file
                }
              }).progress(function (e) {
                file.progress = Math.round((e.loaded * 100.0) / e.total);
                $scope.progress = file.progress + "%";
              }).success(function (data, status, headers, config) {
                $scope.data.url  = data.url;


                var doc = {
                     "type":"insert",
                     "args": {
                        "table": "qms_data",
                        "objects": [{
                          "url": $scope.data.url,
                          "department" : $scope.data.department,
                          "title": $scope.data.title
                        }]
                    }
                };

                $http.post('https://data.saarang.org/v1/query', doc).then(function(response){
                    alert('Successfully uploaded the document!');
                    $state.reload();
                 }).catch(function(err){
                    console.log(err);
                });
             });
           }

        else{
          alert("Please fill all the details");
          $state.reload()
        }


   };


 }]);
