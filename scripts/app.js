'use strict';
var HOST_DIRECTORY = "/onpartv/service/";
var DOWNLOAD_LIMIT_TIME = 24; // when  24 hour , new download // slide.html page

'use strict';

/**
 * @ngdoc overview
 * @name realApp
 * @description
 * # realApp
 *
 * Main module of the application.
 */


angular
        .module('realApp', [
            'ngAnimate',
            'ngRoute',
			'videosharing-embed',
            'as.sortable',
            'ui.bootstrap',
            'bootstrapLightbox',
            'angular-marquee'
        ])
        .config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
            $routeProvider
                    .when('/', {
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl',
                        controllerAs: 'main'
                    })
                    .when('/slide', {
                        templateUrl: 'views/slide.html',
                        controller: 'SlideCtrl',
                        controllerAs: 'slideshow'
                    })
                    .when('/crawl', {
                        templateUrl: 'views/crawl.html',
                        controller: 'CrawlCtrl',
                        controllerAs: 'crawl'
                    })
                    .when('/userinfo', {
                        templateUrl: 'views/userinfo.html',
                        controller: 'UserinfoCtrl',
                        controllerAs: 'userinfo'
                    })
                    .when('/login', {
                        templateUrl: 'views/login.html',
                        controller: 'LoginCtrl',
                        controllerAs: 'login'
                    })
                    .when('/fileupload', {
                        templateUrl: 'views/fileupload.html',
                        controller: 'FileuploadCtrl',
                        controllerAs: 'fileupload'
                    })
                    .when('/edittext', {
                        templateUrl: 'views/edittext.html',
                        controller: 'EditTextCtrl',
                        controllerAs: 'textObj'
                    })
                    .when('/schedule', {
                        templateUrl: 'views/schedule.html',
                        controller: 'ScheduleCtrl',
                        controllerAs: 'schedule'
                    })
					.when('/viewschedule', {
                        templateUrl: 'views/viewschedule.html',
                        controller: 'ViewscheduleCtrl',
                        controllerAs: 'viewschedule'
                    })
                    .when('/players', {
                        templateUrl: 'views/players.html',
                        controller: 'PlayersCtrl',
                        controllerAs: 'players'
                    })
                    .otherwise({
                        redirectTo: '/'
                    });
        }]);



/////////////////////////
//  RootController
//  
/////////////////////////

angular.module('realApp').factory('dragControlListeners',function($http, $window){
    return {
        orderChanged: function(event,FileOrText) {
            var orderApiName = "";
            if(FileOrText == 0){
                orderApiName = "reordering";
            }else if (FileOrText == 1){
                orderApiName = "textreordering";
            }
            var reorderValue = event.dest.sortableScope.modelValue, h = [];

            reorderValue.forEach(function (file) {
                h.push(file.id);
            });
            var reorder_data = {
                ids: h
            };

            var request = $http({
                method: "post",
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                url: HOST_DIRECTORY + orderApiName,
                data: $.param(reorder_data)
            });
            request.success(
                function (html) {

                    if (html === "YES") {
//								console.log(html);
//								$window.localStorage.removeItem('downtime');
                        $window.localStorage.removeItem('local_data');
                    }
                }
            );
        }
    }
});



angular.module("realApp").controller("RootController", function ($scope, $window, $location) {
//	console.log($window.sessionStorage.login);
    // Route Change Watch
    $scope.$on('$routeChangeStart', function () {
        if($window.sessionStorage.login === "success") {
            $scope.isLogin = true;
        }
        else {
            $scope.isLogin = false;
        }
    });
    $scope.logout = function(){
        $window.sessionStorage.login = "";
        $window.sessionStorage.first_name = "";
        $window.sessionStorage.last_name = "";
        $window.sessionStorage.user_id = "";
        $window.sessionStorage.user_email = "";
        $window.sessionStorage.user_password = "";
    };
    $scope.isActive = function(viewLocation) {
        return viewLocation===$location.path();
    }
});