'use strict';

/**
 * @ngdoc function
 * @name realApp.controller:ViewscheduleCtrl
 * @description
 * # ViewscheduleCtrl
 * Controller of the realApp
 */
angular.module('realApp')
		.controller('ViewscheduleCtrl', function ($scope, $http, $window, Lightbox, $routeParams) {

			console.log($window.sessionStorage.login);
			if ($window.sessionStorage.login !== "success") {
				$window.location.href = '/login';
			}else {
				$('.navbar').show();
				$('.navbar-fixed-bottom').show();
			}

			$scope.date = new Date();

			$scope.dateOptions = {
				startingDay: 0
			};
			$scope.popupOpened = false;
			$scope.currentTab = 'slides';


			var userId = $window.sessionStorage.role == "admin" ? $window.sessionStorage.user_id : $window.sessionStorage.parent_admin, paramExist = 0, file_id;

			if(($routeParams['id'] !== undefined)&&($routeParams['id'] != '')){
				userId = $routeParams['id'];
				paramExist = 1;
			}
			//file id getting
			if(($routeParams['file_id'] !== undefined)&&($routeParams['file_id'] != '')){
				file_id = $routeParams['file_id'];
				$scope.file_id = file_id;
				paramExist = 1;
			}
			$scope.openDatePicker = function(){
				$scope.popupOpened = true;
			}

			$scope.dateSelectChanged = function(){

				if($scope.currentTab == 'slides') {
					$scope.load_scheduledFiles();
				}
				else if($scope.currentTab == 'crawls'){
					$scope.load_texts();
				}

			}
			$scope.editClk = function (id) {
				$window.location.href = '/schedule?id=' + id;
			};

			$scope.archiveClk = function (id) {
				if (confirm("Are you sure you want to archive this file?")) {
					var archive_data = {
						id: id
					};
					var request = $http({
						method: "post",
						headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
						url: HOST_DIRECTORY + "archive_file",
						data: $.param(archive_data)
					});
					request.success(
						function (html) {
							if (html.result === "YES") {
								$scope.load_scheduledFiles();
							}
						}
					);
				}
			}

			$scope.editTextClk = function (id) {
				$window.location.href = '/edittext?id=' + id;
			};
			$scope.deleteTextClk = function (id) {

				if (confirm("Are you sure you want to delete this text?")) {
					var delete_data = {
						'id': id
					};
					var request = $http({
						method: "post",
						headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
						url: HOST_DIRECTORY + "delete_text",
						data: $.param(delete_data)
					});
					request.success(
						function (html) {
							if (html.result === "YES") {
								$scope.load_texts();
							}
						}
					);
				}

			};

			$scope.load_scheduledFiles = function(){
				var data = {
					id: userId
				};
				$scope.currentTab = 'slides';
				var today = $scope.date;
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!

				var yyyy = today.getFullYear();
				if(dd<10){
					dd='0'+dd
				}
				if(mm<10){
					mm='0'+mm
				}
				data.date = yyyy + '-' + mm + '-' + dd;

				var request = $http({
					method: "post",
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					url: HOST_DIRECTORY + "scheduled_files",
					data: $.param(data)
				});
				request.success(
					function (html) {
						if (html.result === "YES") {
							$scope.scheduled_files = html.data;
							$scope.Lightbox = Lightbox;
						}
					}
				);
			}


			$scope.load_texts = function(){
				var data = {
					id: userId
				};

				$scope.currentTab = 'slides';
				var today = $scope.date;
				var dd = today.getDate();
				var mm = today.getMonth()+1; //January is 0!

				var yyyy = today.getFullYear();
				if(dd<10){
					dd='0'+dd
				}
				if(mm<10){
					mm='0'+mm
				}
				data.date = yyyy + '-' + mm + '-' + dd;

				$scope.currentTab = 'crawls';





				var request = $http({
					method: "post",
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					url: HOST_DIRECTORY + "get_scheduledTexts",
					data: $.param(data)
				});
				request.success(
					function (html) {
						if (html.result === "YES") {
							$scope.mytexts = html.data;
							$scope.Lightbox = Lightbox;
						}
					}
				);
			}
		});