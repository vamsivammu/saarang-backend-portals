'use strict';

/**
 * @ngdoc function
 * @name erpSaarangFrontendApp.controller:HospiTeamsCtrl
 * @description
 * # HospiTeamsCtrl
 * Controller of the erpSaarangFrontendApp
 */
const QUERY_URL = "https://data.saarang.org/v1/query";
angular.module('erpSaarangFrontendApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('hospi.teams', {
        url: '/teams',
        templateUrl: 'views/hospi/teams.html',
        controller: 'TeamsCtrl',
        controllerAs: 'TeamsC',
        authenticate: true
      });
  })
  .controller('TeamsCtrl', ['$scope', '$http', '$localStorage', '$mdToast', '$mdDialog', function ($scope, $http, $localStorage, $mdToast, $mdDialog) {
    $scope.hosp.tabIndex = 1;

    var config = {
      headers: { "Authorization": "Bearer " + $localStorage.auth_token, "X-Hasura-Role": "core" }
    };

    $scope.showAddTeam = true;
    $scope.teamMemberDetails = [];
    $scope.statusClasses = {
      "Not Requested": "label label-default",
      "Request Pending": 'label label-info',
      "Request Confirmed": 'label label-success',
      "Request Waitlisted": 'label label-warning',
      "Request Rejected": 'label label-danger'
    };

    $scope.confirmDialog_changeStatus = function (stat) {
      if (confirm('Are you sure you want to change the status to ' + stat) === true) {
        $scope.changeStatusFn(stat);
      }
    }

    $scope.confirmDialog_removeMember = function (tm) {
      if (confirm('Remove \'' + tm.name + '\' from team?') === true) {
        $scope.DeleteMember(tm);
      }
    }

    $scope.confirmDialog_acceptMember = function (tm) {
      if (confirm('Accept \'' + tm.name + '\' from team?') === true) {
        $scope.AcceptMember(tm);
      }
    }

    $scope.confirmDialog_rejectMember = function (tm) {
      if (confirm('Reject \'' + tm.name + '\' from team?') === true) {
        $scope.RejectMember(tm);
      }
    }

    $scope.DateString = function (d) {
      if (d != null) {
        var m = moment(d);
        return m.format("MMM Do, h:mm a");
      }
      else
        return 'N/A';
    }

    $scope.CheckInDateString = function (team) {
      let d = null;
      team.members.forEach(member => {
        if ((d == null || new Date(member.check_in_time).getMilliseconds() < new Date(d).getMilliseconds()) && member.check_in_time != null)
          d = member.check_in_time
      })
      return $scope.DateString(d);
    }

    $scope.CheckOutDateString = function (team) {
      let d = null;
      team.members.forEach(member => {
        if ((d == null || new Date(member.check_out_time).getMilliseconds() > new Date(d).getMilliseconds()) && member.check_out_time != null)
          d = member.check_out_time
      })
      return $scope.DateString(d);
    }

    $scope.teams = [];
    $scope.sortType = 'accommodation_requested_on';
    $scope.sortReverse = false;
    $scope.searchTag = '';
    $scope.currentPage = 1;
    $scope.statusFilter = ["Not Requested", "Request Pending", "Request Confirmed", "Request Waitlisted", "Request Rejected"];
    $scope.GetData = function (pagenumber) {
      $scope.teams = [];
      var ilike = '%';
      if ($scope.searchTag) ilike = '%' + $scope.searchTag + '%';
      //get total team count
      $http.post(QUERY_URL, { "type": "count", "args": { "table": "team2020", "where": { "$and": [{ "accommodation_status": { "$in": $scope.statusFilter } }, { "name": { "$ilike": ilike } }] } } }, config)
        .then(function (response) {
          response = response.data;
          $scope.total_entries = response.count;
        })
        .catch(function (err) { console.log(err); });

      //get data
      var offset = (pagenumber - 1) * 20;
      var order_by = "";
      if (!$scope.sortReverse) order_by = $scope.sortType;
      else order_by = "-" + $scope.sortType;
      $http.post(QUERY_URL, {
        "type": "select",
        "args": {
          "table": "team2020",
          "columns": [
            "*",
            {
              "name": "leader",
              "columns": [
                "mobile",
                "saarang_id",
                "gender"
              ]
            },
            {
              "name": "members",
              "columns": [
                "gender",
                "check_in_time",
                "check_out_time"
              ]
            }
          ], "where": { "$and": [{ "accommodation_status": { "$in": $scope.statusFilter } }, { "name": { "$ilike": ilike } }] }, "order_by": order_by, "limit": 20, "offset": offset
        }
      }, config)
        .then(function (response) {
          response = response.data;
          var teamData = {};
          for (var i = 0; i < response.length; ++i) {
            teamData = response[i];
            teamData["male_members"] = 0;
            for (var j = 0; j < teamData.members.length; ++j) if (teamData.members[j].gender == "Male") teamData["male_members"]++;
            teamData["female_members"] = teamData.members.length - teamData["male_members"];
            $scope.teams.push(teamData);
          }
          console.log($scope.teams)
        })
        .catch(function (err) { console.log(err); });
    }
    $scope.GetData(1);

    $scope.Export = function (format) {
      if (format == 'csv') $scope.hideCSV = true;
      else if (format == 'excel') $scope.hideXLS = true;
      else $scope.hidePDF = true;
      var ilike = '%';
      if ($scope.searchTag) ilike = '%' + $scope.searchTag + '%';
      var order_by = "";
      if (!$scope.sortReverse) order_by = $scope.sortType;
      else order_by = "-" + $scope.sortType;
      // TODO: add check-in, check-out
      $http.post(QUERY_URL, { "type": "select", "args": { "table": "team2020", "columns": ["accommodation_requested_on", "ifsc_no", "acc_no", "accommodation_status", "saarang_id", "name", "time_of_arrival", "time_of_departure", "city", { "name": "leader", "columns": ["mobile"] }, { "name": "members", "columns": ["gender"] }], "where": { "$and": [{ "accommodation_status": { "$in": $scope.statusFilter } }, { "name": { "$ilike": ilike } }] }, "order_by": order_by } }, config)
        .then(function (response) {
          var content = '<table><tr><th>In</th><th>Out</th><th>Status</th><th>ID</th><th>Name</th><th>Arrival</th><th>Departure</th><th>Contact</th><th>M</th><th>F</th><th>Total</th></tr>';
          for (var i = 0; i < response.data.length; ++i) {
            var m = 0;
            for (var j = 0; j < response.data[i].members.length; ++j) if (response.data[i].members[j].user.gender == "Male") m = m + 1;
            content = content + '<tr><td>' + $scope.DateString(response.data[i].checked_in) + '</td><td>' + $scope.DateString(response.data[i].checked_out) + '</td><td>' + response.data[i].accommodation_status + '</td><td>' + response.data[i].saarang_id + '</td><td>' + (response.data[i].name).replace(/[^A-Z0-9\s]+/ig, " ") + '</td><td>' + $scope.DateString(response.data[i].time_of_arrival) + '</td><td>' + $scope.DateString(response.data[i].time_of_departure) + '</td><td>' + response.data[i].leader.mobile + '</td><td>' + m + '</td><td>' + (response.data[i].members.length - m) + '</td><td>' + response.data[i].members.length + '</td></tr>';
          }
          content = content + '</table>';


          if ((format == 'csv') || (format == 'excel')) {
            var uri = 'data:application/vnd.ms-excel;base64,',
              template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
              base64 = function (s) {
                return window.btoa(unescape(encodeURIComponent(s)))
              },
              format = function (s, c) {
                return s.replace(/{(\w+)}/g, function (m, p) {
                  return c[p];
                })
              }
            var toExcel = content
            var ctx = {
              worksheet: name || '',
              table: toExcel
            };
            var link = document.createElement("a");
            link.download = "export.xls";
            link.href = uri + base64(format(template, ctx))
            link.click();
            $scope.hideXLS = false; $scope.hideCSV = false;
          } else {
            content = '<!DOCTYPE html><html><head></head><body onload="setTimeout(function(){window.print();},100);window.onfocus=function(){setTimeout(function(){window.close();},100);}"><style type="text/css">table {width: 100%;font-family:helvetica,sans-serif;font-size:12px;border-collapse:collapse;}th,td{border:1px solid rgb(223,223,223);text-align:left;padding:4px;}th{background-color:rgb(223,223,223);text-align:center;}</style>' + content + '</body></html>';
            var popupWin = window.open('', '_blank');
            popupWin.document.open();
            popupWin.document.write(content);
            popupWin.document.close();
            $scope.hidePDF = false;
          }
        });
    }

    $scope.teamDetails = {};
    $scope.teamDetailsFn = function (t) {
      $scope.teamDetails = t;
      var a = moment(t.time_of_arrival);
      var b = moment(t.time_of_departure);
      $scope.CalculateAmount = 0;
      if (a.month() == 0)
        if (b.date() > a.date()) {
          $scope.teamDetails.days_of_stay = Math.ceil(b.diff(a, 'minutes') / 1440.0);
          if ($scope.teamDetails.days_of_stay > 0) {

            if ($scope.teamDetails.days_of_stay === 1) {
              $scope.CalculateAmount = 350;
            }

            else if ($scope.teamDetails.days_of_stay === 2) {
              $scope.CalculateAmount = 700;
            }

            else if ($scope.teamDetails.days_of_stay > 2 && $scope.teamDetails.days_of_stay < 6) {
              $scope.CalculateAmount = ($scope.teamDetails.days_of_stay * 300) + 100;
            }

            else {
              $scope.CalculateAmount = 1600;
            }
          }
        }

      $http.post(QUERY_URL, { "type": "select", "args": { "table": "user2020", "columns": ["accom_is_confirmed", "id", "saarang_id", "gender", "email", "name", "mobile", "college", "college_id"], "where": { "accom_team_id": parseInt(t.saarang_id.substring(6)) } } }, config)
        .then(function (response) {

          response = response.data;
          $scope.teamMemberDetails = response;

        }).catch(function (e) {
          console.log(e);
        });
      $('#from_date_timeM').datetimepicker({
        format: "MMMM Do YYYY, h:mm a",
        widgetPositioning: { horizontal: 'auto', vertical: 'bottom' },
        enabledDates: [moment("1/9/2020", "MM/DD/YYYY"), moment("1/10/2020", "MM/DD/YYYY"), moment("1/11/2020", "MM/DD/YYYY"), moment("1/12/2020", "MM/DD/YYYY"), moment("1/13/2020", "MM/DD/YYYY"), moment("1/14/2020", "MM/DD/YYYY")]
      });
      $('#to_date_timeM').datetimepicker({
        useCurrent: false,
        format: "MMMM Do YYYY, h:mm a",
        widgetPositioning: { horizontal: 'auto', vertical: 'bottom' },
        enabledDates: [moment("1/9/2020", "MM/DD/YYYY"), moment("1/10/2020", "MM/DD/YYYY"), moment("1/11/2020", "MM/DD/YYYY"), moment("1/12/2020", "MM/DD/YYYY"), moment("1/13/2020", "MM/DD/YYYY"), moment("1/14/2020", "MM/DD/YYYY")]
      });
      $("#from_date_timeM").data("DateTimePicker").date(moment($scope.teamDetails.time_of_arrival));
      $("#to_date_timeM").data("DateTimePicker").date(moment($scope.teamDetails.time_of_departure));
      $('#from_date_timeM').on("dp.change", function (e) {
        from_timestamp = e.date._d;
        $('#to_date_timeM').data("DateTimePicker").minDate(e.date);
      });
      $('#to_date_timeM').on("dp.change", function (e) {
        to_timestamp = e.date._d;
        $('#from_date_timeM').data("DateTimePicker").maxDate(e.date);
      });
    }

    var from_timestamp = moment("1/9/2020", "MM/DD/YYYY")._d;
    var to_timestamp = moment("1/14/2020", "MM/DD/YYYY")._d;
    $(function () {
      $('#from_date_time').datetimepicker({
        format: "MMMM Do YYYY, h:mm a",
        widgetPositioning: { horizontal: 'auto', vertical: 'bottom' },
        defaultDate: moment("1/9/2020", "MM/DD/YYYY"),
        enabledDates: [moment("1/9/2020", "MM/DD/YYYY"), moment("1/10/2020", "MM/DD/YYYY"), moment("1/11/2020", "MM/DD/YYYY"), moment("1/12/2020", "MM/DD/YYYY"), moment("1/13/2020", "MM/DD/YYYY"), moment("1/14/2020", "MM/DD/YYYY")]
      });
    });
    $(function () {
      $('#to_date_time').datetimepicker({
        useCurrent: false,
        format: "MMMM Do YYYY, h:mm a",
        widgetPositioning: { horizontal: 'auto', vertical: 'bottom' },
        defaultDate: moment("1/14/2020", "MM/DD/YYYY"),
        enabledDates: [moment("1/9/2020", "MM/DD/YYYY"), moment("1/10/2020", "MM/DD/YYYY"), moment("1/11/2020", "MM/DD/YYYY"), moment("1/12/2020", "MM/DD/YYYY"), moment("1/13/2020", "MM/DD/YYYY"), moment("1/14/2020", "MM/DD/YYYY")]
      });
    });
    $(function () {
      $('#from_date_time').on("dp.change", function (e) {
        from_timestamp = e.date._d;
        $('#to_date_time').data("DateTimePicker").minDate(e.date);
      });
      $('#to_date_time').on("dp.change", function (e) {
        to_timestamp = e.date._d;
        $('#from_date_time').data("DateTimePicker").maxDate(e.date);
      });
    });

    $scope.team = { name: "", leader_id: "", lid: 0, saarang_id: "", id: 0, city: "" };
    $scope.create = function () {
      var flag = 1;
      if (($scope.team.name != "") && ($scope.team.leader_id != "")) {
        $http.post(QUERY_URL, { "type": "select", "args": { "table": "user2020", "columns": ["id"], "where": { "saarang_id": $scope.team.leader_id } } }, config)
          .then(function (response) {
            response = response.data;
            console.log(response)
            if (response.length == 1) {
              $scope.team.lid = response[0].id;
              console.log(response[0].id)
              $http.post(QUERY_URL, { "type": "select", "args": { "table": "user2020", "columns": ["id", { "name": "accom_team", "columns": ["id", "accommodation_status"] }], "where": { "id": response[0].id } } }, config)
                .then(function (response) {
                  response = response.data;
                  console.log(response)
                  if (response.length == 0) flag = 1;
                  for (var i = 0; i < response.length; ++i) {
                    if (response[i].accom_team != null && response[i].accom_team.accommodation_status != 'Not Required') {
                      flag = 0;
                    }
                  }
                  if (flag) {
                    console.log("sdg")
                    $http.post(QUERY_URL, { "type": "insert", "args": { "table": "team2020", "returning": ["id"], "objects": [{ "name": $scope.team.name, "leader_id": $scope.team.lid, "accommodation_status": "Not Requested", "time_of_arrival": from_timestamp, "time_of_departure": to_timestamp, "city": $scope.team.city, "acc_no": $scope.team.acc_no, "ifsc_no": $scope.team.ifsc_no }] } }, config)
                      .then(function (response) {
                        response = response.data;
                        $scope.team.id = response.returning[0].id;
                        $scope.team.saarang_id = "SA20TH" + $scope.team.id.toString().padStart(5, '0');
                        $http.post(QUERY_URL, { "type": "update", "args": { "table": "team2020", "$set": { "saarang_id": $scope.team.saarang_id }, "where": { "id": $scope.team.id } } }, config)
                          .then(function (response) {
                            response = response.data;
                            // $http.post(QUERY_URL, { "type": "insert", "args": { "table": "team_member", "objects": [{ "team_id": $scope.team.id, "is_confirmed": true, "member_id": $scope.team.lid }] } }, config)
                            $http.post(QUERY_URL, { "type": "update", "args": { "table": "user2020", "where": { "id": $scope.team.lid }, "$set": { "accom_team_id": $scope.team.id, "accom_is_confirmed": true } } }, config)
                              .then(function (response) {
                                response = response.data;
                                $mdToast.show($mdToast.simple().textContent('Team created successfully!').hideDelay(3000));
                                $scope.showAddTeam = true;
                                $scope.team = { name: "", leader_id: "", lid: 0, saarang_id: "", id: 0, city: "" };
                                $scope.GetData(1);
                              });
                          });
                      });
                  } else $mdToast.show($mdToast.simple().textContent('Member already belong to a team which requires accomodation!').hideDelay(3000));
                });
            } else $mdToast.show($mdToast.simple().textContent('Invalid Leader Id!').hideDelay(3000));
          });
        8
      } else $mdToast.show($mdToast.simple().textContent('All fields are required!').hideDelay(3000));
    }

    $scope.changeDate = function () {
      if ($scope.teamDetails.name != '') {
        $http.post(QUERY_URL, { "type": "update", "args": { "table": "team", "$set": { "name": $scope.teamDetails.name, "city": $scope.teamDetails.city, "time_of_arrival": from_timestamp, "time_of_departure": to_timestamp }, "where": { "saarang_id": $scope.teamDetails.saarang_id } } }, config)
          .then(function (response) {
            response = response.data;
            $scope.teamDetails.time_of_arrival = from_timestamp;
            $scope.teamDetails.time_of_departure = to_timestamp;
            $scope.showChangeDate = false;
            $mdToast.show($mdToast.simple().textContent('Team updated successfully!').hideDelay(3000));
            $('#teamDetails').modal('toggle');
            $scope.GetData($scope.currentPage);
          });
      } else $mdToast.show($mdToast.simple().textContent('Invalid Name!').hideDelay(3000));
    }

    $scope.changeStatusFn = function (stat) {
      $http.post(QUERY_URL, { "type": "update", "args": { "table": "team2020", "$set": { "accommodation_status": stat }, "where": { "saarang_id": $scope.teamDetails.saarang_id } } }, config)
        .then(function (response) {
          response = response.data;
          $scope.teamDetails.accommodation_status = stat;
          $mdToast.show($mdToast.simple().textContent('Status changed successfully!').hideDelay(3000));
          $('#teamDetails').modal('toggle');
          $scope.GetData($scope.currentPage);
        });
    }

    $scope.printSAAR = function () {
      var content = '';
      var leader = 0;
      for (var i = 0; i < $scope.teamDetails.members.length; ++i) {
        if ($scope.teamMemberDetails[i].saarang_id == $scope.teamDetails.leader.saarang_id) {
          leader = i;
          content = '<!DOCTYPE html><html><head></head><body onload="setTimeout(function(){window.print();},100);window.onfocus=function(){setTimeout(function(){window.close();},100);}"><style type="text/css">.main_container{margin:0 0;font-size:12px;font-family:helvetica,sans-serif;page-break-after:always;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid rgb(223,223,223);text-align:left;padding:4px;}th{background-color:rgb(223,223,223);text-align:center;}.equalwidth4>td{width:25%;}.center_align>td{text-align:center;}.right_align{text-align:right !important;}.small_font{font-size:10px;}.large_font{font-size:15px;}</style><div><div class="main_container"><div style="display:table;height:20vw;"><div style="width:20%;display:table-cell;vertical-align:middle;"><img src="images/iitm.png" style="width:18vw;"></div><div style="width:60%;text-align:center;display:table-cell;vertical-align:middle;"><p><span style="font-size:35px;color:rgb(226,95,50);font-weight:900;">SAAR</span><br><span style="font-size:16px;color:rgb(167,194,43);font-weight:700;">Saarang Advance Accommodation Registration</span><br><span style="font-size:23px;color:rgb(75,180,218);font-weight:800;">Saarang 2020</span></p></div><div style="width:20%;display:table-cell;vertical-align:middle;"><img src="images/saar.png" style="width:18vw;"></div></div><table><tr><th colspan="2">Team Details</th></tr><tr><td style="width:35%;">Name</td><td>' + $scope.teamDetails.name + '</td></tr><tr><td>Team Saarang ID</td><td>' + $scope.teamDetails.saarang_id + '</td></tr><tr><td>City</td><td>' + $scope.teamDetails.city + '</td></tr><tr><td>No. of team members (including leader)</td><td>' + $scope.teamDetails.members.length + '</td></tr><tr><td>Accomodation Request</td><td><strong style="color:green;">CONFIRMED</strong></td></tr><tr><th colspan="2">Team Leader</th></tr><tr><td>Name</td><td>' + $scope.teamMemberDetails[i].name + '</td></tr><tr><td>Saarang ID</td><td>' + $scope.teamMemberDetails[i].saarang_id + '</td></tr><tr><td>Email</td><td>' + $scope.teamMemberDetails[i].email + '</td></tr><tr><td>Mobile</td><td>' + $scope.teamMemberDetails[i].mobile + '</td></tr><tr><td>College</td><td>' + $scope.teamMemberDetails[i].college + '</td></tr><tr><th colspan="2">Accommodation details</th></tr><tr><td>From</td><td>' + moment($scope.teamDetails.time_of_arrival).format("MMMM Do, h:mm a") + '</td></tr><tr><td>To</td><td>' + moment($scope.teamDetails.time_of_departure).format("MMMM Do, h:mm a") + '</td></tr></table><table><tr><th colspan="6">Team Members</th></tr>' + content;
        }
        content = content + '<tr><td>' + (i + 1) + '</td><td>' + $scope.teamMemberDetails[i].saarang_id + '</td><td>' + $scope.teamMemberDetails[i].name + '</td><td>' + $scope.teamMemberDetails[i].email + '</td><td>' + $scope.teamMemberDetails[i].gender + '</td><td>' + $scope.teamMemberDetails[i].mobile + '</td></tr>';
      }
      content = content + '</table><table><tr><th colspan="4">Billing details</th></tr><tr class="equalwidth4 center_align"><td>Days of stay</td><td>No. of members</td><td>Amount/team member</td><td><strong>Total</strong></td></tr><tr class="equalwidth4 center_align"><td>' + $scope.teamDetails.days_of_stay + '</td><td>' + $scope.teamDetails.members.length + '</td><td>' + $scope.CalculateAmount + '</td><td class="right_align"><strong>' + $scope.CalculateAmount * $scope.teamDetails.members.length + '</strong></td></tr><tr class="small_font"><td colspan="3" class="right_align"><strong>Caution Deposit</strong></td><td class="right_align"><strong>' + 300 * $scope.teamDetails.members.length + '</strong></td></tr><tr class="large_font"><td colspan="3" class="right_align"><strong>Amount Payable</strong></td><td class="right_align"><strong>' + ($scope.CalculateAmount + 300) * $scope.teamDetails.members.length + '</strong></td></tr></table></div></div><div class="main_container" style="font-size:10px;"><h4 style="text-align:center;"><u>TERMS AND CONDITIONS - ACCOMMODATION - SAARANG 2020</u></h4><p style="text-align:center;">(To be signed by team leader and submitted at the Control Room at the time of check-in)</p><ul style="line-height:18px;"><li>Accommodation Charges per person<br>&nbsp;&nbsp;1 Day : 350 INR<br>&nbsp;&nbsp;2 Days : 700 INR<br>&nbsp;&nbsp;3 Days : 1000 INR<br>&nbsp;&nbsp;4 Days : 1300 INR<br>&nbsp;&nbsp;5 Days : 1600 INR</li><li>Caution deposit: Rs. 300 per person</li><li>Accommodation is strictly provided only for students and not for any other person accompanying with student, if it is the case then such persons should make their own arrangements.</li><li>Participants need to carry SAAR and photocopy of their college ID cards along with the original Bonafide certificate from college is necessary to avail accommodation.</li><li>The process of Checking in will be done at Control rooms located in the hostel zone. So, participants are requested to come to the Control rooms as soon as they come to IIT Campus. The exact location of the control rooms will be intimated later.</li><li>Accommodation will be provided only from 9 AM on 9th January to 6 AM on 14th January.<br>(A participant can stay for the days he/she registered for. Any cases of overstay within the above time period will attract additional payment such that the total accommodation charges paid is in line with the total number of days stayed as given above)</li><li>We will provide you with mattresses. But participants are requested to get their own locks & keys for the rooms that they will be allotted during Saarang.<br>(Note: You may have to share rooms with other participants. So plan accordingly upon reaching).</li><li>Girls are not allowed in boys hostels and vice versa.</li><li>Control room is open from midnight (12 AM) to 5 PM every day, i.e. for 18 hours per day.</li><li>It will remain closed from 5 PM to 12 AM due to Professional Shows.</li><li>The control room will close at 9 AM on 14th January. All the formalities of checking out have to be done before that.</li><li>If any delay is made in checking out, caution deposit will not be refunded.</li><li>Refund of caution deposit is subject to terms and conditions (like condition of the room, condition of mattresses while checking out) along with the return of receipt provided at the time of check in.</li><li>Participants would necessarily need to share accommodation. Single rooms will not be provided to any participant.</li><li>Valuable items should not be kept along with the luggage in the room. Saarang 2020 will not be responsible for any loss or damage of property. Please secure your belongings and put your details on the same.</li><li>Please make entries in the register kept with the hostel security whenever you move in and out of the room.</li><li>Possession and consumption of alcohol and narcotics in any form is strictly prohibited. If reported, the participant status of the person will be ipso facto null and void and the case will be severely dealt with.</li><li>Smoking is prohibited in the campus.</li><li>Outstation participants are not allowed to use the sports equipment of the hostels. If any usage or damage is reported, the cost of the equipment will be collected.</li><li>Participants will not be allowed to occupy the rooms they have been allotted beyond the date for which they have registered.</li><li>Please keep the rooms and hostel area clean.</li><li>Saarang 2020, Office of Hostel Management or IIT Madras is not responsible for any injuries or accidents caused during your stay.</li></ul><br><h4 style="text-align:center;"><u>DECLARATION</u></h4><p>I and my team members agree to abide by the Terms and Conditions of Saarang 2020. Failing to do so will result in my accommodation being cancelled.</p><br><p style="text-align:right;">(Signature)<br>' + $scope.teamMemberDetails[leader].name + '<br>Team Leader<br>Team: ' + $scope.teamDetails.name + '</p><p style="text-align:center;">-- Wishing you a pleasant, comfortable stay at IIT Madras. Hospitality Team, Saarang 2020 --</p><div style="display:table;text-align:center;"><div style="display:table-cell;width:7%;vertical-align:middle;"><img src="images/iitm.png" style="width:7vw;"></div><div style="display:table-cell;width:86%;vertical-align:middle;"><img src="images/canara.jpg" style="width:25vw;"></div><div style="display:table-cell;width:7%;vertical-align:middle;position:relative;"><img src="images/saar.png" style="width:7vw;position:absolute;top:0;left:0;"></div></div></div></body></html>';
      var popupWin = window.open('', '_blank');
      popupWin.document.open();
      popupWin.document.write(content);
      popupWin.document.close();
    }

    $scope.printBill = function () {
      var content = '';
      for (var i = 0; i < $scope.teamDetails.members.length; ++i)

        if ($scope.teamMemberDetails[i].saarang_id == $scope.teamDetails.leader.saarang_id)
          content = '<!DOCTYPE html><html><head></head><body onload="setTimeout(function(){window.print();},100);window.onfocus=function(){setTimeout(function(){window.close();},100);}"><style type="text/css">body{font-size:12px;font-family:helvetica,sans-serif;}table{width:100%;border-collapse:collapse;}th,td{border:1px solid rgb(223,223,223);text-align:left;padding:4px;}th{background-color:rgb(223,223,223);text-align:center;}</style><div><div style="display:table;height:10vh;width:100vw;"><div style="width:20%;display:table-cell;vertical-align:middle;"><img src="images/iitm.png" style="width:10vw;"></div><div style="width:80vw;text-align:center;display:table-cell;vertical-align:middle;"><p><span style="font-size:28px;color:rgb(167,194,43);font-weight:700;">Saarang Accommodation</span><br><span style="font-size:20px;color:rgb(75,180,218);font-weight:800;">Saarang 2020</span></p></div><div style="width:20%;display:table-cell;vertical-align:middle;"><img src="images/saar.png" style="width:10vw;"></div></div><br><table><tr><th>Saarang Copy</th><th colspan="2">Saarang 2020 Accommodation Team Details</th><th>Generated at: ' + moment().format("MMMM Do, h:mm a") + '</th></tr><tr><td style="width:15%;">Team</td><td style="width:35%;">' + $scope.teamDetails.name + '</td><td style="width:15%;">Saarang ID</td><td style="width:35%;">' + $scope.teamDetails.saarang_id + '</td></tr><tr><td>City</td><td>' + $scope.teamDetails.city + '</td><td>Leader</td><td>' + $scope.teamMemberDetails[i].member_view.name + '</td></tr><tr><td>Mobile</td><td>' + $scope.teamMemberDetails[i].member_view.mobile + '</td><td rowspan="2">College</td><td rowspan="2">' + $scope.teamMemberDetails[i].member_view.college + '</td></tr><tr><td>Email</td><td>' + $scope.teamMemberDetails[i].member_view.email + '</td></tr></table><table><tr><th colspan="5">Accommodation details</th></tr><tr><td style="width:15%;">From</td><td style="width:35%;">' + moment($scope.teamDetails.time_of_arrival).format("MMMM Do, h:mm a") + '</td><td style="width:15%;">To</td><td style="width:35%;">' + moment($scope.teamDetails.time_of_departure).format("MMMM Do, h:mm a") + '</td></tr><tr><td style="width:25%;"></td><td style="width:25%;">Mattresses issued</td><td style="width:25%;">Pillows issued</td><td style="width:25%;">Blankets issued</td></tr><tr><td style="width:25%;">Check-In</td><td style="width:25%;">' + (($scope.teamDetails.mattress_count == null) ? ' ' : $scope.teamDetails.mattress_count) + '</td><td style="width:25%;">' + (($scope.teamDetails.pillow_count == null) ? ' ' : $scope.teamDetails.pillow_count) + '</td><td style="width:25%;">' + (($scope.teamDetails.blanket_count == null) ? ' ' : $scope.teamDetails.blanket_count) + '</td></tr><tr><td style="width:25%;">Check-Out</td><td style="width:25%;">' + (($scope.teamDetails.mattress_returned == null) ? ' ' : $scope.teamDetails.mattress_returned) + '</td><td style="width:25%;">' + (($scope.teamDetails.pillow_returned == null) ? ' ' : $scope.teamDetails.pillow_returned) + '</td><td style="width:25%;">' + (($scope.teamDetails.blanket_returned == null) ? ' ' : $scope.teamDetails.blanket_returned) + '</td></tr></table><table><tr><th colspan="4">Billing details</th></tr><tr><td style="width:25%;">Days of stay</td><td style="width:25%">No. of members</td><td style="width:25%">Amount/team member</td><td style="width:25%;"><strong>Total</strong></td></tr><tr><td>' + $scope.teamDetails.days_of_stay + '</td><td>' + $scope.teamMemberDetails.length + '</td><td>' + $scope.CalculateAmount + ' INR</td><td><strong>' + $scope.CalculateAmount * $scope.teamMemberDetails.length + ' INR</strong></td></tr><tr><td colspan="3" style="text-align:right;"><strong>Caution Deposit (Refundable)</strong></td><td><strong>' + $scope.teamMemberDetails.length * 300 + ' INR</strong></td></tr><tr style="font-size:14px;"><td colspan="3" style="text-align:right;"><strong>Amount payable</strong></td><td><strong>' + $scope.teamMemberDetails.length * ($scope.CalculateAmount + 300) + ' INR </strong></td></tr><tr><td colspan="2">(Sign)</td><td colspan="2">(Sign)</td></tr><tr><td colspan="2">' + $scope.teamMemberDetails[i].member_view.name + '(Team Leader)</td><td colspan="2">' + '</td></tr></table></div><div>The above caution deposit will be returned to the participant given that the correct account details and IFSC are provided</div><hr><br>' + '<div><div style="display:table;height:10vh;width:100vw;"><div style="width:20%;display:table-cell;vertical-align:middle;"><img src="images/iitm.png" style="width:10vw;"></div><div style="width:80vw;text-align:center;display:table-cell;vertical-align:middle;"><p><span style="font-size:28px;color:rgb(167,194,43);font-weight:700;">Saarang Accommodation</span><br><span style="font-size:20px;color:rgb(75,180,218);font-weight:800;">Saarang 2020</span></p></div><div style="width:20%;display:table-cell;vertical-align:middle;"><img src="images/saar.png" style="width:10vw;"></div></div><br><table><tr><th>Team Copy</th><th colspan="2">Saarang 2020 Accommodation Team Details</th><th>Generated at: ' + moment().format("MMMM Do, h:mm a") + '</th></tr><tr><td style="width:15%;">Team</td><td style="width:35%;">' + $scope.teamDetails.name + '</td><td style="width:15%;">Saarang ID</td><td style="width:35%;">' + $scope.teamDetails.saarang_id + '</td></tr><tr><td>City</td><td>' + $scope.teamDetails.city + '</td><td>Leader</td><td>' + $scope.teamMemberDetails[i].member_view.name + '</td></tr><tr><td>Mobile</td><td>' + $scope.teamMemberDetails[i].member_view.mobile + '</td><td rowspan="2">College</td><td rowspan="2">' + $scope.teamMemberDetails[i].member_view.college + '</td></tr><tr><td>Email</td><td>' + $scope.teamMemberDetails[i].member_view.email + '</td></tr></table><table><tr><th colspan="5">Accommodation details</th></tr><tr><td style="width:15%;">From</td><td style="width:35%;">' + moment($scope.teamDetails.time_of_arrival).format("MMMM Do, h:mm a") + '</td><td style="width:15%;">To</td><td style="width:35%;">' + moment($scope.teamDetails.time_of_departure).format("MMMM Do, h:mm a") + '</td></tr><tr><td style="width:25%;"></td><td style="width:25%;">Mattresses issued</td><td style="width:25%;">Pillows issued</td><td style="width:25%;">Blankets issued</td></tr><tr><td style="width:25%;">Check-In</td><td style="width:25%;">' + (($scope.teamDetails.mattress_count == null) ? ' ' : $scope.teamDetails.mattress_count) + '</td><td style="width:25%;">' + (($scope.teamDetails.pillow_count == null) ? ' ' : $scope.teamDetails.pillow_count) + '</td><td style="width:25%;">' + (($scope.teamDetails.blanket_count == null) ? ' ' : $scope.teamDetails.blanket_count) + '</td></tr><tr><td style="width:25%;">Check-Out</td><td style="width:25%;">' + (($scope.teamDetails.mattress_returned == null) ? ' ' : $scope.teamDetails.mattress_returned) + '</td><td style="width:25%;">' + (($scope.teamDetails.pillow_returned == null) ? ' ' : $scope.teamDetails.pillow_returned) + '</td><td style="width:25%;">' + (($scope.teamDetails.blanket_returned == null) ? ' ' : $scope.teamDetails.blanket_returned) + '</td></tr></table><table><tr><th colspan="4">Billing details</th></tr><tr><td style="width:25%;">Days of stay</td><td style="width:25%">No. of members</td><td style="width:25%">Amount/team member</td><td style="width:25%;"><strong>Total</strong></td></tr><tr><td>' + $scope.teamDetails.days_of_stay + '</td><td>' + $scope.teamMemberDetails.length + '</td><td>' + $scope.CalculateAmount + ' INR</td><td><strong>' + $scope.CalculateAmount * $scope.teamMemberDetails.length + ' INR</strong></td></tr><tr><td colspan="3" style="text-align:right;"><strong>Caution Deposit (Refundable)</strong></td><td><strong>' + $scope.teamMemberDetails.length * 300 + ' INR</strong></td></tr><tr style="font-size:14px;"><td colspan="3" style="text-align:right;"><strong>Amount payable</strong></td><td><strong>' + $scope.teamMemberDetails.length * ($scope.CalculateAmount + 300) + ' INR</strong></td></tr><tr><td colspan="2">(Sign)</td><td colspan="2">(Sign)</td></tr><tr><td colspan="2">' + $scope.teamMemberDetails[i].member_view.name + '(Team Leader)</td><td colspan="2">' + '</td></tr></table></div><div>The above caution deposit will be returned to the participant given that the correct account details and IFSC are provided</div></body></html>';
      var popupWin = window.open('', '_blank');
      popupWin.document.open();
      popupWin.document.write(content);
      popupWin.document.close();
    }

    $scope.DeleteMember = function (tm) {
      var index = $scope.teamMemberDetails.indexOf(tm);
      // $http.post(QUERY_URL, { "type": "delete", "args": { "table": "team_member", "where": { "$and": [{ "team_id": $scope.teamDetails.id }, { "member_id": tm.member_view.id }] } } }, config)
      $http.post(QUERY_URL, { "type": "update", "args": { "table": "user2020", "where": { "id": tm.id }, "$set": { "accom_team_id": null, "accom_is_confirmed": null } } }, config)
        .then(function (response) {
          response = response.data;
          $scope.teamMemberDetails.splice(index, 1);
          $mdToast.show($mdToast.simple().textContent('Member deleted successfully!').hideDelay(3000));
          $scope.GetData($scope.currentPage);
        });
    }

    $scope.AcceptMember = function (tm) {
      var index = $scope.teamMemberDetails.indexOf(tm);
      //$http.post(QUERY_URL, { "type": "update", "args": { "table": "team_member", "where": { "$and": [{ "team_id": $scope.teamDetails.id }, { "member_id": tm.member_view.id }] }, "$set": { "is_confirmed": "true" } } }, config)
      $http.post(QUERY_URL, { "type": "update", "args": { "table": "user2020", "where": { "id": tm.id }, "$set": { "accom_team_id": $scope.teamDetails.id, "accom_is_confirmed": true } } }, config)
        .then(function (response) {
          response = response.data;
          $scope.teamMemberDetails[index].is_confirmed = true;
          $mdToast.show($mdToast.simple().textContent('Member accepted successfully!').hideDelay(3000));
          $scope.GetData($scope.currentPage);
        });
    }

    $scope.RejectMember = function (tm) {
      var index = $scope.teamMemberDetails.indexOf(tm);
      // $http.post(QUERY_URL, { "type": "delete", "args": { "table": "team_member", "where": { "$and": [{ "team_id": $scope.teamDetails.id }, { "member_id": tm.member_view.id }] } } }, config)
      $http.post(QUERY_URL, { "type": "update", "args": { "table": "user2020", "where": { "id": tm.id }, "$set": { "accom_team_id": null, "accom_is_confirmed": null } } }, config)
        .then(function (response) {
          response = response.data;
          $scope.teamMemberDetails.splice(index, 1);
          $mdToast.show($mdToast.simple().textContent('Member rejected successfully!').hideDelay(3000));
          $scope.GetData($scope.currentPage);
        });
    }

    $scope.AddMember = function (sid) {
      var flag = 1;
      var userDetails = {};
      $http.post(QUERY_URL, { "type": "select", "args": { "table": "user2020", "columns": ["*", { "name": "accom_team", "columns": ["id", "accommodation_status"] }], "where": { "saarang_id": sid } } }, config)
        .then(function (response) {
          response = response.data;
          userDetails = response[0];

          if (response.length == 1) {
            var memberId = userDetails.id;
            // $http.post(QUERY_URL, { "type": "select", "args": { "table": "team_member", "columns": ["member_id", { "name": "team", "columns": ["id", "accommodation_status"] }], "where": { "member_id": response[0].id } } }, config)
            //   .then(function (response) {
            //     response = response.data;
            if (userDetails.accom_team_id == null) flag = 1;
            if (userDetails.accom_team != null && userDetails.accom_team.accommodation_status != 'Not Required')
              flag = 0;
            if (flag) {
              // $http.post(QUERY_URL, { "type": "insert", "args": { "table": "team_member", "objects": [{ "member_id": memberId, "is_confirmed": true, "team_id": $scope.teamDetails.id }] } }, config)
              $http.post(QUERY_URL, { "type": "update", "args": { "table": "user2020", "where": { "id": memberId }, "$set": { "accom_team_id": $scope.teamDetails.id, "accom_is_confirmed": true } } }, config)
                .then(function (response) {
                  console.log($scope.teamMemberDetails[0])
                  console.log(userDetails)
                  $scope.teamMemberDetails.push(userDetails);
                  $scope.new_member_id = "";
                  $mdToast.show($mdToast.simple().textContent('Member added successfully!').hideDelay(3000));
                  $scope.GetData($scope.currentPage);
                })
            }
            else { $mdToast.show($mdToast.simple().textContent('Member already in a team with accomodation request!').hideDelay(3000)) };
            // });
          } else { $mdToast.show($mdToast.simple().textContent('Invalid Id!').hideDelay(3000)) };
        });
    }

    $scope.SplitTeam = function () {
      $scope.oldSplitTeam = $scope.teamMemberDetails;
      console.log($scope.oldSplitTeam)
      $scope.newSplitTeam = [];
      $scope.split_Team = { 'name': '', 'leader_id': '' };
    }

    $scope.MoveMember = function (index) {
      $scope.newSplitTeam.push($scope.oldSplitTeam[index]);
      $scope.oldSplitTeam.splice(index, 1);
    }

    $scope.UndoMoveMember = function (index) {
      $scope.oldSplitTeam.push($scope.newSplitTeam[index]);
      $scope.newSplitTeam.splice(index, 1);
    }

    $scope.SaveSplitTeam = function () {
      var flag = -1;
      if (($scope.split_Team.name != "") && ($scope.split_Team.leader_id != "") && ($scope.newSplitTeam.length != 0)) {
        for (var i = 0; i < $scope.newSplitTeam.length; ++i)
          if ($scope.newSplitTeam[i].member_view.saarang_id == $scope.split_Team.leader_id) flag = i;
        if (flag != -1) {
          console.log($scope.newSplitTeam)
          $http.post(QUERY_URL, { "type": "insert", "args": { "table": "team2020", "returning": ["id"], "objects": [{ "name": $scope.split_Team.name, "leader_id": $scope.split_Team.leader_id, "accommodation_status": "Request Confirmed", "time_of_arrival": $scope.teamDetails.time_of_arrival, "time_of_departure": $scope.teamDetails.time_of_departure, "city": $scope.teamDetails.city, "ifsc_no": $scope.teamDetails.ifsc_no, "acc_no": $scope.teamDetails.acc_no, "leader_id": $scope.newSplitTeam[flag].id }] } }, config)
            .then(function (response) {
              response = response.data;
              var tid = response.returning[0].id;
              var s = "SA19TH" + response.returning[0].id.toString().padStart(5, '0');
              $http.post(QUERY_URL, { "type": "update", "args": { "table": "team", "$set": { "saarang_id": s }, "where": { "id": response.returning[0].id } } }, config)
                .then(function (response) {
                  for (var j = 0; j < $scope.newSplitTeam.length; ++j)
                    $http.post(QUERY_URL, { "type": "update", "args": { "table": "user2020", "$set": { "accom_team_id": tid, "accom_is_confirmed": false }, "where": { "id": $scope.newSplitTeam[j].id } } }, config)
                      .then(function (response) {
                      });
                  $('#splitTeam').modal('toggle');
                  $('#teamDetails').modal('toggle');
                  $scope.GetData($scope.currentPage);
                });
            });
        } else $mdToast.show($mdToast.simple().textContent('Leader not found in new team list!').hideDelay(3000));
      } else $mdToast.show($mdToast.simple().textContent('All fields are necessary!').hideDelay(3000));
    }

    $scope.CheckIn = function () {
      $scope.checkInMembers = [];
      $scope.checkInMembers = JSON.parse(JSON.stringify($scope.teamMemberDetails));

      // Changing field 'member_view' to 'user'
      // $scope.checkInMembers.forEach(item => {
      //   item['user'] = item.member_view;
      //   delete item.member_view;
      // });

      // $scope.CheckIn_hostels = [];
      $scope.CheckIn_Mattress = 0;
      $scope.CheckIn_Pillow = 0;
      $scope.CheckIn_Blanket = 0;
      if (($scope.teamDetails.male_members != 0) && ($scope.teamDetails.female_members != 0)) $mdToast.show($mdToast.simple().textContent('Split team to Check In!').hideDelay(3000));
      else {
        var gender = '';
        if ($scope.teamDetails.male_members == 0) gender = 'Female';
        else if ($scope.teamDetails.female_members == 0) gender = 'Male';
        $http.post(QUERY_URL, { "type": "select", "args": { "table": "hostel", "columns": ["*"], "where": { "type": gender } } }, config)
          .then(function (response) {
            $scope.CheckIn_hostels = response.data;
          });
      }
    }

    $scope.GetCheckInRooms = function (index) {
      $scope.checkInMembers[index].rooms = [];
      $http.post(QUERY_URL, { "type": "select", "args": { "table": "room", "columns": ["*", { "name": "occupants", "columns": ["id"] }], "where": { "hostel_id": $scope.checkInMembers[index].hostel_id } } }, config)
        .then(function (response) {
          for (var i = 0; i < response.data.length; ++i)
            if (response.data[i].capacity > response.data[i].occupants.length) $scope.checkInMembers[index].rooms.push(response.data[i]);
        });
    }

    $scope.SaveCheckIn = function () {
      // var flag=1;
      var flag1 = 1;
      var roomarray = [];
      console.log($scope.checkInMembers)
      for (var i = 0; i < $scope.checkInMembers.length; ++i) {
        roomarray.push($scope.checkInMembers[i].room_id);
        if ($scope.checkInMembers[i].room_id == null || $scope.checkInMembers[i].hostel_id == null) {
          flag1 = 0;
        }
      }

      if (flag1) {
        // $http.post(QUERY_URL, {"type": "select", "args": {"table": "room", "columns": ["*", {"name": "occupants", "columns": ["id"]}], "where": {"id": {"$in": roomarray}}}}, config)
        //   .then(function(response) {

        //     for(var j=0; j<response.data.length; ++j)
        //       if(response.data[j].capacity<=response.data[j].occupants.length)
        //         flag = 0;

        // if(flag) {
        for (var k = 0; k < $scope.checkInMembers.length; ++k) {
          $http.post(QUERY_URL, { "type": "update", "args": { "table": "user2020", "$set": { "room_id": $scope.checkInMembers[k].room_id, "check_in_time": moment()._d }, "where": { "id": $scope.checkInMembers[k].id } } }, config)
            .then(function (response) {

            })
            .catch(function (err) { console.log(err); });
        }

        $http.post(QUERY_URL, { "type": "update", "args": { "table": "team2020", "$set": { "mattress_count": $scope.CheckIn_Mattress, "pillow_count": $scope.CheckIn_Pillow, "blanket_count": $scope.CheckIn_Blanket, "is_checked_in": true }, "where": { "id": $scope.teamDetails.id } } }, config)
          .then(function (response) {
            $mdToast.show($mdToast.simple().textContent('Checked In!').hideDelay(3000));
            $('#checkIn').modal('toggle');
            $('#teamDetails').modal('toggle');
            $scope.GetData($scope.currentPage);
          })
          .catch(function (err) { console.log(err); });
        // } else $mdToast.show($mdToast.simple().textContent('Please try again!').hideDelay(3000));
        //});
      }
      else $mdToast.show($mdToast.simple().textContent('All fields are mandatory!').hideDelay(3000));
    }

    $scope.CheckOut = function () {
      var userarray = [];
      for (var i = 0; i < $scope.teamMemberDetails.length; ++i) userarray.push($scope.teamMemberDetails[i].id);
      $http.post(QUERY_URL, { "type": "update", "args": { "table": "user2020", "$set": { "room_id": null, "check_out_time": moment()._d }, "where": { "id": { "$in": userarray } } } }, config)
        .then(function (response) {
          $http.post(QUERY_URL, { "type": "update", "args": { "table": "team2020", "$set": { "mattress_returned": $scope.CheckOut_Mattress, "pillow_returned": $scope.CheckOut_Pillow, "blanket_returned": $scope.CheckOut_Blanket, "is_checked_out": true }, "where": { "id": $scope.teamDetails.id } } }, config)
            .then(function (response) {
              $mdToast.show($mdToast.simple().textContent('Checked Out!').hideDelay(3000));
              $('#teamDetails').modal('toggle');
              $scope.GetData($scope.currentPage);
              $scope.CheckOutActive = false;
            });
        });
    }

    $scope.ExportInner = function (format) {
      var content = '<table><thead><tr><th>Saarang Id</th><th>Gender</th><th>Email</th><th>Name</th><th>Mobile</th><th>College</th><th>Roll No</th></tr></thead><tbody>';
      for (var i = 0; i < $scope.teamMemberDetails.length; ++i) {
        content = content + '<tr><td>' + $scope.teamMemberDetails[i].saarang_id + '</td><td>' + $scope.teamMemberDetails[i].gender + '</td><td>' + $scope.teamMemberDetails[i].email + '</td><td>' + $scope.teamMemberDetails[i].name + '</td><td>' + $scope.teamMemberDetails[i].mobile + '</td><td>' + $scope.teamMemberDetails[i].college + '</td><td>' + $scope.teamMemberDetails[i].college_id + '</td></tr>';
      }
      content = content + '</tbody></table>';
      if ((format == 'csv') || (format == 'excel')) {
        $('#ExportContainer').html(content);
        $('#ExportContainer>table').tableExport({ type: format, escape: 'false', filename: 'Hospitality' });
      } else {
        content = '<!DOCTYPE html><html><head></head><body onload="setTimeout(function(){window.print();},100);window.onfocus=function(){setTimeout(function(){window.close();},100);}"><style type="text/css">table {width: 100%;font-family:helvetica,sans-serif;font-size:12px;border-collapse:collapse;}th,td{border:1px solid rgb(223,223,223);text-align:left;padding:4px;}th{background-color:rgb(223,223,223);text-align:center;}</style>' + content + '</body></html>';
        var popupWin = window.open('', '_blank');
        popupWin.document.open();
        popupWin.document.write(content);
        popupWin.document.close();
      }
    }

  }]);