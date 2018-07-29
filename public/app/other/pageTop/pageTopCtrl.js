/**
 * Created by 忍把浮名换此生 on 2017/6/29.
 */
(function () {
    'use strict';
    angular.module('LQ_EMS')
        .controller('PageTopCtrl',PageTopCtrl)
        .controller('changePwdModelCtrl',changePwdModelCtrl);
    function PageTopCtrl($scope,$state,$http,appConfig,$window,thisUser,ngDialog) {
        $http.get(appConfig.auth.userInfo)
            .then(function (res) {
                if (res.data.code === 200){
                    thisUser = res.data.result[0];
                    $scope.user = thisUser;
                    console.log(thisUser);
                }
            });


        $scope.logOut = function () {
            $http.get(appConfig.auth.logout)
                .then(function (res) {
                    $window.localStorage.clear();
                })
            $state.go('login');
        };

        $scope.changePwd = function () {
            var dialog = ngDialog.open({
                template: 'changePwdModel.html',
                width: 600,
                controller: 'changePwdModelCtrl'
            });
            dialog.closePromise.then(function (data) {
                console.log('模态框关闭');
                getData();
            });
        }
    }
    function changePwdModelCtrl($scope,$http,appConfig,$state) {
        $scope.user = {
            newPassword : "",
            newPassword2 : ""
        };
        $scope.$watch('user',function () {
            var newPwd = $scope.user.newPassword;
            var newPwd2 = $scope.user.newPassword2;
            $scope.showMessage = (newPwd !== "" && newPwd !== newPwd2);
            $scope.disSub = !(newPwd !== "" && newPwd === newPwd2);
        },true);
        $scope.changePwdModal = function () {
            $http.put(appConfig.auth.updatePwd,$scope.user)
                .then(function (res) {
                    $scope.closeThisDialog();
                    if (res.data.code === 202){
                        swal('','密码已变更，请重新登录','success');
                        $state.go('login');
                    }else if (res.data.code === 444){
                        swal('',res.date.message,'error');
                        $state.go('login');
                    }else swal('','修改失败','error');
                },function (err) {
                    console.log("err",err);
                    swal('','修改失败','error');
                })
        }
    }
})();
