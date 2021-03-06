'use strict';

/**
 * @ngdoc function
 * @name realApp.controller:FileuploadCtrl
 * @description
 * # Fileupload
 * Controller of the realApp
 */
angular.module('realApp')
		.controller('FileuploadCtrl', function ($scope, $window) {
			if ($window.sessionStorage.login !== "success") {
				$window.location.href = '/login';
			}else {
				$('.navbar').show();
				$('.navbar-fixed-bottom').show();
			}
			$scope.back = function () {
				$window.location.href = "/";
			}
		});
