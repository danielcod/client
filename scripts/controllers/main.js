'use strict';
/**
 * @ngdoc function
 * @name realApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the realApp
 */
angular.module('realApp')
		.controller('MainCtrl', function ($scope, $window, $http, Lightbox, dragControlListeners) {

			if ($window.sessionStorage.login !== "success") {
				$window.location.href = '/login';
			} else {
				$('.navbar').show();
				$('.navbar-fixed-bottom').show();
			}

			var admin_id = $window.sessionStorage.role == "admin" ? $window.sessionStorage.user_id : $window.sessionStorage.parent_admin;
			var data = {
				user_id: admin_id
			};

			$scope.currentTab = 'active';
			$scope.drag_flag = 0;
			$scope.myfiles = [];
			$scope.file_data = [];



			// file upload button define
			$scope.file_page = function () {
				$window.location.href = '/fileupload';
			};
			// file Schedule function
			$scope.editClk = function (id) {
				$window.location.href = '/schedule?id=' + id;
			};


			// gallery file getting

			$scope.load_activedFiles = function(){
				var request = $http({
					method: "post",
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					url: HOST_DIRECTORY + "get_files",
					data: $.param(data)
				});
				request.success(
					function (html) {
						if (html.result === "YES") {
							$scope.myfiles = html.data;
//                            console.log($scope.myfiles);
							$scope.Lightbox = Lightbox;

							//$("ul.reorder-photos-list li").sortable({tolerance: 'pointer'});
						}
					}
				);
			}

			$scope.load_archivedFiles = function(){
				var new_request = $http({
					method: "post",
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					url: HOST_DIRECTORY + "get_archived_files",
					data: $.param(data)
				});
				new_request.success(
					function (html) {
						if (html.result === "YES") {

							$scope.archived_files = html.data;

							$scope.Lightbox = Lightbox;
						}
					}
				);
			}

			// Reordering Function
			$scope.dragControlListeners = {
				orderChanged: function(event){
					dragControlListeners.orderChanged(event,0);
				}
			}

			// file Archive function
			$scope.archiveClk = function (id) {
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
							$scope.load_activedFiles();
						}
					}
				);
			}

			$scope.deleteClk = function(id) {
				if (confirm("Are you sure you want to delete this file?")) {
					var delete_data = {
						id: id
					};
					var request = $http({
						method: "post",
						headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
						url: HOST_DIRECTORY + "delete_file",
						data: $.param(delete_data)
					});
					request.success(
						function (html) {
							if (html.result === "YES") {
								$scope.load_archivedFiles();
							}
						}
					);
				}
			}

			$scope.activeClk = function(id) {
				var active_data = {
					id: id
				};
				var request = $http({
					method: "post",
					headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
					url: HOST_DIRECTORY + "active_file",
					data: $.param(active_data)
				});
				request.success(
					function (html) {
						if (html.result === "YES") {
							$scope.load_archivedFiles();
						}
					}
				);
			}


		});
