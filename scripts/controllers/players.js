'use strict';

/**
 * @ngdoc function
 * @name realApp.controller:PlayersCtrl
 * @description
 * # PlayersCtrl
 * Controller of the realApp
 */
angular.module('realApp')
	.controller('PlayersCtrl', function ($scope, $http, $window) {
		// Login Checkout
		if ($window.sessionStorage.login !== "success") {
			$window.location.href = '/login';
		}else {
			$('.navbar').show();
			$('.navbar-fixed-bottom').show();
		}

		$scope.access_id = $window.sessionStorage.role == "admin" ? $window.sessionStorage.user_id : $window.sessionStorage.parent_admin;

		$scope.updatePlayer = function (id) {
			var data = {
				'player_id': id
			};
			var request = $http({
				method: "post",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				url: HOST_DIRECTORY + "update_player",
				data: $.param(data)
			});
			request.success(
				function (html) {
					if (html.result === "YES") {
						alert("Player "+id+"'s signage will restart in the next 15 minutes");
					}
				}
			);
		}

		$scope.updateAllPlayers = function(){
			var data = {
				'user_id': $scope.access_id
			};
			var request = $http({
				method: "post",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				url: HOST_DIRECTORY + "update_Allplayer",
				data: $.param(data)
			});
			request.success(
					function (html) {
						if (html.result === "YES") {
							alert("All players signage will restart");
						}
					}
			);
		}

		$scope.formateDate = function(date){
			var dateOut;
			if(date){
				dateOut = new Date(date);
				return dateOut;
			}else return date;

		}

		function getPlayers(id){
			console.log(id);
			var param = {
				'user_id': id
			};
			var request = $http({
				method: "post",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				url: HOST_DIRECTORY + "get_players",
				data: $.param(param)
			});
			request.success(function (html) {
				if (html.result === "YES") {
					console.log(html.data);
					$scope.playersInfo = html.data;

				}
			});
		}
		getPlayers($scope.access_id);
	});
