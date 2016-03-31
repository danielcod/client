/**
 * @ngdoc function
 * @name realApp.controller:DialogCtrl
 * @description
 * # AdminCtrl
 * Controller of the realApp
 */
angular.module("realApp")
        .controller('DialogCtrl', function ($scope,$window,$http, ngDialog) {

            $scope.selection = [];
            $scope.role = "admin";

            function sortNumber(a,b) {
                return a - b;
            }

            $scope.toggleSelection = function toggleSelection(pageName){
                var idx = $scope.selection.indexOf(pageName);

                if(idx > -1){
                    $scope.selection.splice(idx, 1);
                }else {

                    $scope.selection.push(pageName);
                    $scope.selection.sort(sortNumber);
                }

            };

            function init(){
                var request = $http({
                    method: "post",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    url: HOST_DIRECTORY + "get_adminusers"
                });
                request.success(function (html) {
                    if(html.result==="YES"){
                        $scope.alladmins = html.data;
                    }
                });
            }


            init();

            $scope.adminSelectChanged = function(v){
                $scope.parent_id = v.parent_id;
            }


            // if save button click
            $scope.btnClk = function() {
                var data = {
                        id : "Auto",
                        f : $scope.first_name,
                        l : $scope.last_name,
                        e : $scope.user_email,
                        p : $scope.user_password,
                        r : $scope.role,
                        pp : $scope.selection.toString(),
                        pa : $scope.parent_id
                }
                var request = $http({
                    method: "post",
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                    url: HOST_DIRECTORY + "save_user",
                    data: $.param(data)
                });
                request.success(function (html) {
                    if(html.result==="WORNG_EMAIL"){
                        $scope.wrong_email = true;
                    }
                    else
                    {
                        $scope.wrong_email = false;
                        $scope.first_name = "";
                        $scope.last_name = "";
                        $scope.user_email = "";
                        $scope.user_password = "";
                        $scope.role = "";
                        $scope.selection = [];
						$scope.closeThisDialog();
                        $scope.parent_id = '';
                    }
                });
                
                
            }
            $scope.dg_close = function(){
//                closeThisDialog();
                $window.location.reload();
            }
        });