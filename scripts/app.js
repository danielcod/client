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
            'ngDialog',
            'angular-marquee',
            'angularUtils.directives.dirPagination'
        ])
        .config(['$routeProvider','$locationProvider', function ($routeProvider,$locationProvider) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
            $routeProvider
                    .when('/', {
                        authorization: true,
                        templateUrl: 'views/main.html',
                        controller: 'MainCtrl',
                        controllerAs: 'main'
                    })
                    .when('/slide', {
                        authorization: false,
                        templateUrl: 'views/slide.html',
                        controller: 'SlideCtrl',
                        controllerAs: 'slideshow'
                    })
                    .when('/crawl', {
                        authorization: true,
                        templateUrl: 'views/crawl.html',
                        controller: 'CrawlCtrl',
                        controllerAs: 'crawl'
                    })
                    .when('/myinfo', {
                        authorization: false,
                        templateUrl: 'views/myinfo.html',
                        controller: 'MyinfoCtrl',
                        controllerAs: 'myinfo'
                    })
                    .when('/login', {
                        authorization: false,
                        templateUrl: 'views/login.html',
                        controller: 'LoginCtrl',
                        controllerAs: 'login'
                    })
                    .when('/fileupload', {
                        authorization: false,
                        templateUrl: 'views/fileupload.html',
                        controller: 'FileuploadCtrl',
                        controllerAs: 'fileupload'
                    })
                    .when('/edittext', {
                        authorization: false,
                        templateUrl: 'views/edittext.html',
                        controller: 'EditTextCtrl',
                        controllerAs: 'textObj'
                    })
                    .when('/schedule', {
                        authorization: false,
                        templateUrl: 'views/schedule.html',
                        controller: 'ScheduleCtrl',
                        controllerAs: 'schedule'
                    })
					.when('/viewschedule', {
                        authorization: true,
                        templateUrl: 'views/viewschedule.html',
                        controller: 'ViewscheduleCtrl',
                        controllerAs: 'viewschedule'
                    })
                    .when('/subusers', {
                        authorization: false,
                        templateUrl: 'views/subusers.html',
                        controller: 'SubusersCtrl',
                        controllerAs: 'subusers'
                    })
                    .when('/players', {
                        authorization: true,
                        templateUrl: 'views/players.html',
                        controller: 'PlayersCtrl',
                        controllerAs: 'players'
                    })
                    .when('/slides', {
                        authorization: false,
                        templateUrl: 'views/slides.html',
                        controller: 'SlidesCtrl',
                        controllerAs: 'slides'
                    })
                    .when('/slideedit', {
                        authorization: false,
                        templateUrl: 'views/slideedit.html',
                        controller: 'SlideEditCtrl',
                        controllerAs: 'slideedit'
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


angular.module("realApp").config(['ngDialogProvider', function (ngDialogProvider) {
    ngDialogProvider.setDefaults({
        className: 'ngdialog-theme-default',
        plain: false,
        showClose: true,
        closeByDocument: true,
        closeByEscape: true,
        appendTo: false,
        preCloseCallback: function () {
            console.log('default pre-close callback');
        }
    });
}]);


angular.module("realApp").controller("RootController", function ($scope, $window, $location) {
//	console.log($window.sessionStorage.login);
    // Route Change Watch

    $scope.$on('$routeChangeStart', function(event, toState, toParams) {
        if($window.sessionStorage.login === "success") {
            $scope.isLogin = true;
        }
        else {
            $scope.isLogin = false;
        }

        if(toState.originalPath != '/login') {
            if($window.sessionStorage.permission && $window.sessionStorage.role){
                var permission_array = $window.sessionStorage.permission.split(',');
                $scope.permission = permission_array;
                $scope.role = $window.sessionStorage.role;

                if (toState.authorization && !(permission_array.indexOf(toState.originalPath) > -1)) {
                    event.preventDefault();
                    if (toState.originalPath === '/') {
                        if(permission_array[0] != '')
                            $location.path(permission_array[0]);
                        else
                            $location.path('/');
                    }
                }
            }
        }
    });

    $scope.logout = function(){
        $window.sessionStorage.login = "";
        $window.sessionStorage.first_name = "";
        $window.sessionStorage.last_name = "";
        $window.sessionStorage.user_id = "";
        $window.sessionStorage.user_email = "";
        $window.sessionStorage.user_password = "";
        $window.sessionStorage.permission = "";
        $window.sessionStorage.role = "";
        if($window.sessionStorage.role == "user")
            $window.sessionStorage.parent_admin = "";
    };
    $scope.isActive = function(viewLocation) {
        return viewLocation===$location.path();
    }
});