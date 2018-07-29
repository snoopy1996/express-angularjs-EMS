(function () {
    'use strict';
    angular.module('LQ_EMS')
        .controller('personalCtrl',personalCtrl);
    function personalCtrl($scope,$http,appConfig,$state) {
        console.log('这里是个人信息控制器');
        $scope.thisUser = {};
        var getData = function () {
            $http.get(appConfig.auth.userInfo)
                .then(function (res) {
                    console.log(res.data);
                    if (res.data.code === 200){
                        $scope.thisUser = res.data.result[0];
                        $scope.thisUser.brothDate = new Date($scope.thisUser.brothDate);
                        var basic = $scope.thisUser.basicMoney || 0,
                            bonus = $scope.thisUser.bonusMoney || 0,
                            deleteM = $scope.thisUser.deleteMoney || 0,
                            add = $scope.thisUser.addMoney || 0;
                        $scope.thisUser.finalMoney = basic + bonus + add - deleteM;
                    }else if (res.data.code === 444){
                        $state.go('login');
                    }else swal('',res.data.message,'error');
                },function (err) {
                    console.log('err',err);
                })
        };
        getData();
        $scope.subPersonal = function () {
            console.log(JSON.stringify($scope.thisUser));
            $http.put(appConfig.employee.updateOneForUser,$scope.thisUser)
                .then(function (res) {
                    console.log(res.data);
                    if (res.data.code === 200){
                        getData();
                    }else if (res.data.code === 444){
                        $state.go('login')
                    }else swal('',res.data.message,'error');
                })
        }
    }
})();