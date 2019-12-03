'use strict';

angular.module('erpSaarangFrontendApp')
.config(function ($stateProvider) {
    $stateProvider
      .state('spons', {
        url: '/spons',
        templateUrl: 'views/spons.html',
        controller: 'SponsCtrl',
        authenticate: true,
        department: "Sponsorship and Public Relations"
      });
  })
  .controller('SponsCtrl',['$scope','$http', '$location','Upload','cloudinary','$rootScope','$localStorage',function ($scope,$http,$location,$upload,cloudinary,$rootScope,$localStorage) {

    $scope.logo = {
        "title":'',
        "sponsor_link":'',
        "priority":-1,
        "logo":'',
        "row_layout":-1,
        "uploaded_by_id":$localStorage._id
    };

    $scope.uploadInprogress = false;
    $scope.uploadthen = false;
    $scope.uploadFailed = false;

    $scope.uploadFiles = function(file, errFiles) {
      var d = new Date();
      console.log(file);
      console.log(errFiles);
      $scope.title = "Image (" + d.getDate() + " - " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + ")";
      $scope.errFile = errFiles && errFiles[0];
      if (file) {
          file.upload = $upload.upload({
          url: "https://api.cloudinary.com/v1_1/saarang2017/upload",
          data: {
            upload_preset: 'saarang',
            tags: 'spons_album',
            context: 'photo=' + $scope.title,
            file: file
          }
        }).progress(function (e) {
          $scope.uploadInprogress = true;
          $scope.uploadFailed = false;
          $scope.uploadthen = false;
          file.progress = Math.round((e.loaded * 100.0) / e.total);
          file.status = "Uploading... " + file.progress + "%";
          $scope.progress = file.progress;
        }).success(function (data, status, headers, config) {
          $scope.uploadFailed = false;
          $scope.uploadInprogress = false;
          $scope.uploadComplete = true;
          data.context = {custom: {photo: $scope.title}};
          file.result = data;
          $scope.logo.logo = file.result.url;
          console.log($scope.logo.logo);
          console.log(data);
        }).error(function (data, status, headers, config) {
          $scope.uploadComplete = false;
          $scope.uploadInprogress = false;
          $scope.uploadFailed = true;
          console.log(data);
          file.result = data;
        });
      }   
    };

    // Diff function for arrays
    Array.prototype.diff = function(a) {
      return this.filter(function(i) {return a.indexOf(i) < 0;}); 
    };

    //Inital array for priorities
    var mainArray = [];
    for (var i = 0; i<=120 ;i++ ) {
      mainArray[i] = i-20; 
    }

    $scope.rows = [1,2,3,4];
    $scope.priorities = [];

    var data = {
      "type":"select",
      "args": {
        "table":"spons_image_upload",
        "columns": ["*"]
      }
    };
    
    $http.post('https://data.saarang.org/v1/query',data)
    .then(function(res) {
      console.log(res);
      res = res.data;
      var temp;
      // collecting all the priorities
      // $scope.used_priorities=[];
      var i,j;
      // for (i = 0;i < res.length;i++) {
      //     $scope.used_priorities.push(res[i].priority);
      // }
      $scope.priorities = mainArray;
      //sorting according to priority
      for(i=1;i<res.length;i++)
      {
        for(j=0;j<res.length-i;j++)
        {
          if(res[j].priority>res[j+1].priority)
          {
            temp=res[j+1];
            res[j+1]=res[j];
            res[j]=temp;
          }
        }
      }
 //sorted according to priority
      var k;
      var mixeddata=[];
      var mix=[];
      for(i=0;i<res.length;i++)
        {
          k=0;
          mix.push(res[i]);
          j=i;
          if(j!==res.length-1)
          {
          while(res[j].row_layout===res[j+1].row_layout && k<(res[i].row_layout-1))
            {
              mix.push(res[j+1]);
              k++;
              j++;
              i=j;
              if(j===res.length-1)
                {
                  break;
                }
            }
          }
          mixeddata.push(mix);
          mix=[];
        }
        $scope.logos = mixeddata; // final sorted data
    }).catch(function(err) {
      console.log(err);
    });
  
    $scope.createLogo = function(){

      //Converting all strings to numbers
      $scope.logo.priority = Number($scope.logo.priority);
      $scope.logo.row_layout = Number($scope.logo.row_layout);
      $scope.logo.uploaded_by_id = Number($scope.logo.uploaded_by_id);

      var config = {
      headers:{
        'Authorization' :"Bearer "+ $localStorage.auth_token,
        'X-Hasura-Role' :"core"
        }
      };
      var data = {
        "type":"insert",
        "returning":["id"],
        "args": {
          "table":"spons_image_upload",
          "objects": [{
                  "title":$scope.logo.title,
                  "sponsor_link":$scope.logo.sponsor_link,
                  "priority":$scope.logo.priority,
                  "logo":$scope.logo.logo,
                  "row_layout":$scope.logo.row_layout,
                  "uploaded_by_id":$scope.logo.uploaded_by_id
              }]
        }
      };
      
      $http.post('https://data.saarang.org/v1/query',data,config).then(function(){
          console.log("row inserted");
          location.reload();     //refreshing the page after the upload
      }).catch(function(err){
          console.log(err);
      });
    };

    $scope.deleteLogo = function(logo){
      if (confirm("Are you sure u want to delete '"+logo.title+"' logo"+"?") === true) {
           var config = {
           headers:{
             'Authorization' :"Bearer "+$localStorage.auth_token,
             'X-Hasura-Role' :"core"
             }
           };
           var data = {
             "type":"delete",
             "args": {
                "table":"spons_image_upload",
                "where":{"id":logo.id}
              }
           };
         $http.post('https://data.saarang.org/v1/query',data,config).then(function(res){
          console.log("delete thenful");
          location.reload();
         }).catch(function(err){
          console.log(err);
         });
      }
    };
 }]);