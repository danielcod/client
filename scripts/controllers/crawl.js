'use strict';
/**
 * @ngdoc function
 * @name realApp.controller:CrawlCtrl
 * @description
 * # CrawlCtrl
 * Controller of the realApp
 */
angular.module('realApp')
	.controller('CrawlCtrl', function ($scope, $window, $http, Lightbox, dragControlListeners) {

		
		var user_id = $window.sessionStorage.role == "admin" ? $window.sessionStorage.user_id : $window.sessionStorage.parent_admin;
		var data = {
			'user_id': user_id
		};
		$scope.upload_api_url = HOST_DIRECTORY + "upload_crawlLogo";
		$scope.user_id = user_id;
		$scope.mytexts = [];

		if ($window.sessionStorage.login !== "success") {
			$window.location.href = '/login';
		}else {
			$('.navbar').show();
			$('.navbar-fixed-bottom').show();
		}

		//add text function
		$scope.add_text = function(){
			$window.location.href = '/edittext?add=1';
		};

		// file Schedule function
		$scope.editClk = function (id) {
			$window.location.href = '/edittext?id=' + id;
		};

		$scope.changeBg = function(){
			$('.color-preview').css('background-color','#'+$scope.bg_color);
		};
		// file delete function
		$scope.deleteClk = function (id) {

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
							var new_request = $http({
								method: "post",
								headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
								url: HOST_DIRECTORY + "get_texts",
								data: $.param(data)
							});
							new_request.success(
								function (html) {
									if (html.result === "YES") {
										$scope.mytexts = html.data;
									}
								}
							);
						}
					}
				);
			}

		};
// Texts getting


		$scope.set_bgColor = function(){
			var data = {
				'user_id': user_id,
				'bgColor': $scope.bg_color
			};
			var request = $http({
				method: "post",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				url: HOST_DIRECTORY + "set_crawlColor",
				data: $.param(data)
			});
			request.success(
				function (html) {
					if (html.result === "YES") {
						console.log("Set Crawl Background Successfully");
						alert("Crawl Background Color changed Successfully");
					}
				}
			);
		};



		$scope.upload_logo = function(){
			var fileVal = $('#crawl_logo_file').val();
			if(fileVal == ''){
				alert("Please select Logo file");
			}else {
				$('form#crawl_form').submit();
				alert("Successfully uploaded Logo file");
			}
		};


		var requestColor = $http({
			method: "post",
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			url: HOST_DIRECTORY + "get_crawlColor",
			data: $.param(data)
		});
		requestColor.success(
			function (html) {
				if (html.result) {
					$scope.bg_color = html.result;
					$scope.changeBg();
				}
			}
		);


		var requestSpeed = $http({
			method: "post",
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			url: HOST_DIRECTORY + "get_crawlSpeed",
			data: $.param(data)
		});
		requestSpeed.success(
			function (html) {
				if (html.result) {
					$scope.crawlSpeed = html.result;
				}else{
					$scope.crawlSpeed = 30000;
				}
				$('#speed').val($scope.crawlSpeed);
			}
		);

		var requestLogo = $http({
			method: "post",
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			url: HOST_DIRECTORY + "get_crawlLogo",
			data: $.param(data)
		});
		requestLogo.success(
			function (html) {
				if (html.result) {
					$scope.logo_img = html.result;
				}
			}
		);

		var request = $http({
			method: "post",
			headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
			url: HOST_DIRECTORY + "get_texts",
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

		// Reordering Function
		$scope.dragControlListeners = {
			orderChanged: function(event){
				dragControlListeners.orderChanged(event,1);
			}
		}

		$scope.logo_img_name = "";
		$scope.logo_img = "";
		$scope.fileSelectChanged = function(input){
			if (input.files && input.files[0]) {

				$scope.logo_img_name = input.files[0]['name'];

				console.log(input.files[0]);
				var reader = new FileReader();

				reader.onload = function (e) {
					$scope.logo_img = e.target.result;
					$scope.$apply();

					var imgWidth = document.getElementById('crawl_logo_preview').naturalWidth;
					var imgHeight = document.getElementById('crawl_logo_preview').naturalHeight;
					if(imgHeight > 0){
						imgWidth = imgWidth * parseFloat(100.0/imgHeight);
						if(imgWidth > 200){
							alert("Logo image looks wider");
						}else if(imgWidth < 100){
							alert("Logo image looks too tall");
						}
					}
				};

				reader.readAsDataURL(input.files[0]);
			}
		}

		$scope.change_crawlSpeed = function(){
			var data = {
				'user_id': user_id,
				'speed': $scope.crawlSpeed
			};

			console.log($scope.crawlSpeed);



			var request = $http({
				method: "post",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				url: HOST_DIRECTORY + "set_crawlSpeed",
				data: $.param(data)
			});
			request.success(
				function (html) {
					if (html.result === "YES") {
						console.log("Crawl speed changed successfully");
					}
				}
			);
		}
	});

angular.module('realApp')
	.directive("limitTo", [function() {
	return {
		restrict: "A",
		link: function(scope, elem, attrs) {
			var limit = parseInt(attrs.limitTo);
			angular.element(elem).on("keydown", function() {
				if (this.value.length == limit){
					this.value = '';
					return false;
				}
			});
		}
	}
}]).directive('ngModelOnblur', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, elm, attr) {
			if (attr.type !== 'range') return;
			elm.unbind('input').unbind('mousedown');
		}
	};
});
