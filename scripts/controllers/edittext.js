'use strict';

/**
 * @ngdoc function
 * @name realApp.controller:EditTextCtrl
 * @description
 * # EditTextCtrl
 * Controller of the realApp
 */
angular.module('realApp')
	.controller('EditTextCtrl', function ($scope, $http, $location, $window) {

		if ($window.sessionStorage.login !== "success") {
			$window.location.href = '/login';
		}else {
			$('.navbar').show();
			$('.navbar-fixed-bottom').show();
		}
		//text id getting
		var AddOrEdit = 0;
		if($location.search().add == 1)
			AddOrEdit = 1;
		$scope.addoredit = AddOrEdit;
		var buf = $window.location.href;
		$scope.bufAry = buf.split("?");
		if ($scope.bufAry[1]) {
			$scope.bufAry1 = $scope.bufAry[1].split("=");
			if ($scope.bufAry1[0] === "id") {
				$scope.text_id = $scope.bufAry1[1];
			}else if ($scope.bufAry[0] === "add"){
				AddOrEdit = 1;
				$scope.text_id = 0;
			}
		}

		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!

		var yyyy = today.getFullYear();
		if(dd<10){
			dd='0'+dd
		}
		if(mm<10){
			mm='0'+mm
		}
		today = mm+'/'+dd+'/'+yyyy;

		$scope.sdate = today;
		$scope.edate = today;
		if(AddOrEdit == 0) {
			// file schedule data getting
			$scope.text_data = [];
			var data = {
				'text_id': $scope.text_id
			};
			var request = $http({
				method: "post",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				url: HOST_DIRECTORY + "get_text",
				data: $.param(data)
			});

			request.success(
				function (html) {
					if (html.result === "YES") {

						$scope.text_data = html.data[0];

//  					Configuration Form
						$scope.text_content = $scope.text_data['text'];

						$scope.active_always = Boolean(parseInt($scope.text_data['active_always']));

						var bdateary = $scope.text_data['begin_date'].split('-');
						var edateary = $scope.text_data['end_date'].split('-');
						$scope.sdate = (bdateary[1] + '/' + bdateary[2] + '/' + bdateary[0]);
						$scope.edate = (edateary[1] + '/' + edateary[2] + '/' + edateary[0]);
						$scope.active_time = $scope.sdate + "-" + $scope.edate;
						// time picker control
						$('input[name="daterange"]').daterangepicker({
							format: 'MM/DD/YYYY',
							startDate: $scope.sdate,
							endDate: $scope.edate
						}, function (start, end, label) {
						});

					}
				}
			);
		}else if(AddOrEdit == 1) {
			$('input[name="daterange"]').daterangepicker({
				format: 'MM/DD/YYYY',
				startDate: $scope.sdate,
				endDate: $scope.edate
			}, function (start, end, label) {
			});
		}
			// schedule update function
			$scope.updateClk = function () {
				if(AddOrEdit == 0) {
					var active_time = scheduleForm.elements["daterange"].value;
					var active_always = $scope.active_always ? 1 : 0;
					var param = {
						'id': $scope.text_data['id'],
						'user_id': $window.sessionStorage.user_id,
						'text': $scope.text_content,
						'active_time': active_time,
						'active_always': active_always
					};

					var request = $http({
						method: "post",
						headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
						url: HOST_DIRECTORY + "text_update",
						data: $.param(param)
					});
					request.success(function () {
	//					$window.localStorage.clear();
						$window.localStorage.removeItem('local_data');
						$window.location.href = "/crawl";
					});
				}else if(AddOrEdit == 1){
					var datebuff = [today,today];
					if(scheduleForm.elements["daterange"].value) {
						datebuff = scheduleForm.elements["daterange"].value.replace( /\s/g, "").split('-');
					}

					param = {
						'user_id': $window.sessionStorage.user_id,
						'text': $scope.text_content,
						'start_date': convertDateFormat(datebuff[0]),
						'end_date': convertDateFormat(datebuff[1])
					};
					console.log(datebuff);
					console.log(param);
					request = $http({
						method: "post",
						headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
						url: HOST_DIRECTORY + "add_text",
						data: $.param(param)
					});
					request.success(function () {
						//$window.localStorage.clear();
						$window.localStorage.removeItem('local_data');
						$window.location.href = "/crawl";
					});
				}
			};
			$scope.back = function () {
				$window.location.href = "/crawl";
			};

	});
function convertDateFormat(dateValue){
	var datesbuff = dateValue.split('/');
	return datesbuff[2]+'-'+datesbuff[0]+'-'+datesbuff[1];
}