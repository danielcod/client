/**
 * @ngdoc function
 * @name realApp.controller:DialogCtrl
 * @description
 * # AdminCtrl
 * Controller of the realApp
 */
angular.module("realApp")
        .controller('UpdateCtrl', function ($scope,$window,$http, $rootScope, ngDialog) {

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
                        $scope.parent_id = $scope.ngDialogData.parent_admin;
                        //console.log(html.data);
                    }
                });
            }


            init();

            $scope.adminSelectChanged = function(v){
                $scope.parent_id = v.parent_id;
            }

            // data format
            $scope.first_name = $scope.ngDialogData.first_name;
            $scope.last_name = $scope.ngDialogData.last_name;
            $scope.user_email = $scope.ngDialogData.user_email;
            $scope.user_password = $scope.ngDialogData.user_password;
            $scope.selection = $scope.ngDialogData.permission == '' ? [] : $scope.ngDialogData.permission.split(",");
            $scope.role = $scope.ngDialogData.role;


            // if save button click
            $scope.btnClk = function() {

                console.log($scope.parent_id);

                var data = {
                        id : $scope.ngDialogData.id,
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
                        $scope.closeThisDialog();
                    }
                });
            }
        });