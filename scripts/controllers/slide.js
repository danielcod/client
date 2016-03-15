'use strict';
/**
 * @ngdoc function
 * @name realApp.controller:SlideCtrl
 * @description
 * # SlideCtrl
 * Controller of the realApp
 */
angular.module('realApp')
	.controller('SlideCtrl', function ($scope, $window, $http, $timeout, $routeParams) {
		var NEW_REQUEST = false;
		$('.navbar').hide();
		$('.navbar-fixed-bottom').hide();
		// External Request Reading

		var userId = $window.sessionStorage.user_id || '', paramExist = 0, crawlFlag = 0, offline = 0;

		if(($routeParams['id'] !== undefined)&&($routeParams['id'] != '')){
			userId = $routeParams['id'];
		}
		
		if(($routeParams['crawl'] !== undefined)&&($routeParams['crawl'] != '')){
			if($routeParams['crawl'] == 1){
				crawlFlag = 1;
			}else{
				crawlFlag = 0;
			}
		}

		if(($routeParams['offline'] !== undefined)&&($routeParams['offline'] != '')){
			if($routeParams['offline'] == 1){
				paramExist = 1;
				offline = 1;
			}else{
				offline = 0;
			}
		}

		if(paramExist == 1){
			$window.localStorage.removeItem('downtime');
			$window.localStorage.removeItem('local_data');
		}


		// LocalState Getting
		if ($window.localStorage.downtime) { //
			var now = new Date();
			var then = $window.localStorage.downtime;
			// Difference getting
			var ms = moment(now, "DD/MM/YYYY HH:mm:ss").diff(moment(then, "DD/MM/YYYY HH:mm:ss"));
			var ms = moment.duration(ms);
			var diff_hour = ms.asHours();
			console.log('downtime : '+diff_hour);
			if (diff_hour > DOWNLOAD_LIMIT_TIME) {
				NEW_REQUEST = true;
			}
		} else {//
			var now = new Date();
			$window.localStorage.downtime = now; // first viewing
			NEW_REQUEST = true;
		}
		// get all slides
		$scope.file_data = [];

		var data = {
			user_id: userId
		};

		function get_slideFiles(){
			var request = $http({// new file download begin
				method: "post",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				url: HOST_DIRECTORY + "get_slidefiles",
				data: $.param(data)
			});
			request.success(
				function (html) {

					if (html.result === "YES" && html.data.length !== 0) {
						var fdata = [], cnt = 0,w;
						var now = new Date();
						console.log('NEW_REQUEST-------'+NEW_REQUEST);
						if (NEW_REQUEST) {// when new request
							$scope.file_data = html.data;
							fdata = html.data;
							$window.localStorage.local_data = JSON.stringify(html.data);
							$window.localStorage.downtime = now; // now time update
							console.log("SERVER DATA :" + $window.localStorage.local_data + "/" + now);
						} else {
							if ($window.localStorage.local_data) { // if data
								$scope.file_data = JSON.parse($window.localStorage.local_data); // origin data
								fdata = JSON.parse($window.localStorage.local_data);
								console.log("LOCAL Data:" + $scope.file_data + "/" + now);
							}
							else { // if no data
								$scope.file_data = html.data; // server data
								fdata = html.data;
								$window.localStorage.local_data = JSON.stringify(html.data);
								$window.localStorage.downtime = now; // now time update
								console.log("SERVER DATA :" + $window.localStorage.local_data + "/" + now);
							}
						}

						$scope.startWorker = function () {
							var requestedBytes = 1024 * 1024 * 1024 * 4;
							if (typeof (Worker) !== "undefined") {
								if (typeof (w) == "undefined") {
									w = new Worker(location.origin + "/webworker/worker.js");
								}
								$window.requestFileSystem = $window.webkitRequestFileSystem;
								var onFSInit = function (fs) {
									for (var i = 0; i < fdata.length; i++) {
										w.postMessage([fdata[i].url, fdata[i].file_name]);
									}
									w.onmessage = function (event) {
										cnt = event.data[2];
										$scope.saveFile(fs, event.data[0], event.data[1]);
									};
									for (var j = 0; j < html.data1.length; j ++) {
										$scope.removeFile(fs, ('/' + html.data1[j].file_name));
									}
								};
								navigator.webkitPersistentStorage.requestQuota(requestedBytes, function (grantedBytes) {
										$window.requestFileSystem(PERSISTENT, grantedBytes, onFSInit, $scope.errorHandler);
									}, $scope.errorHandler
								);
							} else {
								console.log("Sorry, your browser does not support Web Workers...");
							}
						};
						$scope.errorHandler = function (e) {
							console.log(e.name);
						};
						$scope.saveFile = function (fs, data, path) {
//								$scope.removeFile(fs, ('/' + path));
							fs.root.getFile(path, {create: true, exclusive: true}, function (fileEntry) {
								fileEntry.createWriter(function (writer) {
									writer.onwriteend = function (e) {
										console.log('complete');
									};
									writer.write(data);
								}, $scope.errorHandler);
							}, $scope.errorHandler);
//								console.log(cnt);
						};
						$scope.removeFile = function (fs, path) {
							fs.root.getFile(path, {create: false}, function (fileEntry) {
								fileEntry.remove(function () {
								}, $scope.errorHandler);
							}, $scope.errorHandler);
						};
						$scope.stopWorker = function () {
							w.terminate();
							w = undefined;
						};

						// slide show begin
						var len = $scope.file_data.length;
						var slide = 0;
						var urlval = '';
						$scope.displaySlide = function () {
							var videocontainer = document.getElementById('video_playerClip');
							if ($scope.file_data[slide].file_type === "image") {
								$scope.view_control = false;

								if (urlval != '') {
									$scope.file_data[slide].url = urlval;
									$scope.image_url = urlval;
								} else {
									$scope.image_url = $scope.file_data[slide].url;
								}
								//start effect setting
								switch ($scope.file_data[slide].start_effect) {
									case "fadein" :
										$scope.effect_style = "slide-enter fadeIn";
										break;
									case "top":
										$scope.effect_style = "slide-enter fadeInDown";
										break;
									case "down":
										$scope.effect_style = "slide-enter fadeInUp";
										break;
									case "left":
										$scope.effect_style = "slide-enter fadeInLeft";
										break;
									case "right":
										$scope.effect_style = "slide-enter fadeInRight";
										break;
									default:
										$scope.effect_style = "slide-enter fadeIn";
										break;
								}
								//end effect setting
								switch ($scope.file_data[slide].end_effect) {
									case "fadeout" :
										$scope.effect_style += " " + "fadeOut";
										break;
									case "top":
										$scope.effect_style += " " + "fadeOutUp";
										break;
									case "down":
										$scope.effect_style += " " + "fadeOutDown";
										break;
									case "left":
										$scope.effect_style += " " + "fadeOutLeft";
										break;
									case "right":
										$scope.effect_style += " " + "fadeOutRight";
										break;
									default:
										$scope.effect_style += " " + "fadeOut";
										break;
								}
								videocontainer.pause();
								$('#video_player_container').hide();
							}
							else {
								$scope.view_control = true;

								$('#video_player_container').show();

								var videosource = document.getElementById('mp4Video');

								var url = urlval || $scope.file_data[slide].url;
								videocontainer.pause();
								videosource.setAttribute('src', url);
								videocontainer.load();
								videocontainer.play();
								//start effect setting
								switch ($scope.file_data[slide].start_effect) {
									case "fadein" :
										$scope.effect_style = "slide-enter fadeIn";
										break;
									case "top":
										$scope.effect_style = "slide-enter fadeInDown";
										break;
									case "down":
										$scope.effect_style = "slide-enter fadeInUp";
										break;
									case "left":
										$scope.effect_style = "slide-enter fadeInLeft";
										break;
									case "right":
										$scope.effect_style = "slide-enter fadeInRight";
										break;
									default:
										$scope.effect_style = "slide-enter fadeIn";
										break;
								}
								//end effect setting
								switch ($scope.file_data[slide].end_effect) {
									case "fadeout" :
										$scope.effect_style += " " + "fadeOut";
										break;
									case "top":
										$scope.effect_style += " " + "fadeOutUp";
										break;
									case "down":
										$scope.effect_style += " " + "fadeOutDown";
										break;
									case "left":
										$scope.effect_style += " " + "fadeOutLeft";
										break;
									case "right":
										$scope.effect_style += " " + "fadeOutRight";
										break;
									default:
										$scope.effect_style += " " + "fadeOut";
										break;
								}
							}
							$scope.timer = $timeout($scope.displaySlide, $scope.file_data[slide].stay_time * 1000);

							// slide transition
							slide++;
							if (slide > len - 1) {
								slide = 0;
							}
							if (cnt == fdata.length) {
								urlval = 'filesystem:' + location.origin + '/persistent/' + $scope.file_data[slide].file_name;
							} else {
								urlval = '';
							}
						};
						$scope.displaySlide();
					} else { // No data
						var sheight = screen.availHeight * 1;
						var noimgstr = '<div class="ng-scope animate-top-enter">';
						noimgstr += '<img class="ng-scope animate-fadein-enter" alt="" orientable src="' + location.origin + '/images/onpartv.png"/>';
						noimgstr += '</div>';
						$('.navbar').remove();
						$('#file_repo').html('').html(noimgstr);
					}
				}
			);
		}

		function get_Texts(){
			var request = $http({// new file download begin
				method: "post",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				url: HOST_DIRECTORY + "get_slideTexts",
				data: $.param(data)
			});
			request.success(
				function (html) {
					if (html.result === "YES" && html.data.length !== 0) {
						var fdata, str = '';

						fdata = html.data;
						fdata.forEach(function (textData) {
							str += textData['text'] + '\xa0 \xa0 \xa0 \u2022 \xa0 \xa0 \xa0 \n';
						});

						$scope.marqueeText = ''+str;
						$scope.scroll = true;
						/*$('.newsticker').hide();
						$('.newsticker').html(str);*/
					}
				}
			);

			$scope.crawlFlag = 1;

			var requestCrawlBG = $http({// new file download begin
				method: "post",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				url: HOST_DIRECTORY + "get_crawlColor",
				data: $.param(data)
			});
			requestCrawlBG.success(
				function (html) {
					if (html.result) {
						$scope.crawl_bg = html.result;
						$(".newsticker").css("background-color", "#" + html.result + " !important");
					}
				}
			);

			var requestCrawlLogo = $http({// new file download begin
				method: "post",
				headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
				url: HOST_DIRECTORY + "get_crawlLogo",
				data: $.param(data)
			});
			requestCrawlLogo.success(
				function (html) {
					if (html.result) {
						$scope.crawl_logo = html.result;
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
						$scope.crawlSpeed = 28000;
					}
					/*console.log($scope.crawlSpeed);
					setTimeout(function () {
						$('.newsticker').show();
						$('.newsticker').marquee({
							duration: $scope.crawlSpeed, //speed in milliseconds of the marquee
							gap: 1, //gap in pixels between the tickers
							allowCss3Support: true,
							duplicated: true //true or false - should the marquee be duplicated to show an effect of continues flow
						});

					}, 50);*/
				}
			);
		}

		// When the DOM element is removed from the page,
		$scope.$on(
			"$destroy",
			function (event) {
				$timeout.cancel($scope.timer);
			}
		);

		var refreshSlides = function() {
			$timeout.cancel($scope.timer);
			console.log('run refreshSlides!');
			var now = new Date();
			var night = new Date(
				now.getFullYear(),
				now.getMonth(),
				now.getDate()+1, // the next day, ...
				3, 30, 0 // ...at 03:30:00 hours
			);
			var msTillMidnight = night.getTime() - now.getTime();
			//var msTillMidnight = 50000;

			console.log(msTillMidnight);

			/*if (offline == 1) {
				console.log('run offline worker');
				if(typeof $scope.startWorker == 'function')
					$scope.startWorker();
			}*/
			if(navigator.onLine == true) {
				console.log("Currently Online");
				var appCache = window.applicationCache;
				if (appCache.status == 1 || appCache.status > 3)
					/*if (appCache.status == window.applicationCache.CHECKING) {
						console.log('cache does not exist, reloading!');
						window.location.reload();
					}*/
					appCache.update(); //this will attempt to update the users cache and changes the application cache status to 'UPDATEREADY'.

				if (appCache.status == window.applicationCache.UPDATEREADY) {
					console.log('found new version!');
					appCache.swapCache(); //replaces the old cache with the new one.
				}
			}
			NEW_REQUEST = true;
			get_slideFiles();
			if(crawlFlag == 1) {
				get_Texts();
			}

			$timeout(refreshSlides, msTillMidnight);
		};

		refreshSlides();
	});
