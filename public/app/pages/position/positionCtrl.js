(function () {
    'use strict';
    angular.module('LQ_EMS')
        .controller('positionCtrl', positionCtrl)
        .controller('positionModalCtrl',positionModalCtrl);
    function positionCtrl($scope, $http, appConfig, ngDialog,$state) {
        console.log('这里是职位信息管理');
        $scope.positionSet = [];
        $scope.positionCollection = [].concat($scope.positionSet);
        for (var i = 0; i < 15; i++) {
            var position = {
                positionCode: i,
                positionName: "名字" + i
            };
            $scope.positionSet.push(position);
        }
        console.log($scope.positionCollection);
        //刷新数据
        var getData = function () {
            $scope.positionSet = [];
            $http.get(appConfig.position.position)
                .then(function (res) {
                    if (res.data.code === 200) {
                        $scope.positionSet = res.data.result;
                        console.log(res.data.result);
                    }else if (res.data.code === 444){
                        $state.go('login');
                    }else swal('',res.data.message,'error');
                },function (err) {
                    console.log("err",err);
                    swal('',"服务请求失败",'error');
                });
        }
        getData();
        $scope.addPosition = function () {
            var action = {
                title:"添加职位信息",
                method:'post'
            }
            var dialog = ngDialog.open({
                template: 'positionModal.html',
                width: 600,
                controller: 'positionModalCtrl',
                resolve: {
                    items: function () {
                        return action;
                    }
                }
            });
            dialog.closePromise.then(function (data) {
                console.log('编辑模态框关闭');
                getData();
            });
        }
        $scope.editPosition = function (row) {
            var action = {
                title:"修改职位信息",
                method:'put',
                row:row
            };
            var dialog = ngDialog.open({
                template: 'positionModal.html',
                width: 600,
                controller: 'positionModalCtrl',
                resolve: {
                    items: function () {
                        return action;
                    }
                }
            });
            dialog.closePromise.then(function (data) {
                console.log('编辑模态框关闭');
                getData();
            });
        }
        $scope.deletePosition = function (row) {
            swal({
                title: "",
                text: "确定删除这条信息吗？删除之后将不能恢复信息！",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "确认",
                cancelButtonText: "取消",
                closeOnConfirm: false
                //closeOnCancel: false
            }, function () {
                console.log('删除职位'+row.positionCode+'!');
                $http.delete(appConfig.position.deletePosition+row.positionCode)
                    .then(function (res) {
                        if (res.data.code === 200) {
                            swal("已删除", "成功删除信息", "success");
                        }else if (res.data.code === 444){
                            $state.go('login');
                        }else swal('','删除失败，'+res.data.message,'error');
                        getData();
                    },function (err) {
                        swal("", "请求服务失败", "error")
                        console.log("err",err);
                        getData();
                    })

            });
        }
    }
    function positionModalCtrl($scope,items,$http,appConfig) {
        $scope.action = {
            title:items.title
        };
        if (items.method === 'put'){
            $scope.positionObj = angular.copy(items.row);
            $scope.disEdit = true;
            $scope.disSub = false;
        }else {
            $scope.positionObj = {};
            $scope.disEdit = false;
            $scope.disSub = true;
        }
        $scope.$watch('positionObj',function () {
            var code = $scope.positionObj.positionCode;
            var name = $scope.positionObj.positionName;
            $scope.disSub = !(code && code !== '' && name && name !== '');
        },true);
        $scope.doPosition = function () {
            if (items.method === 'put'){
                $http.put(appConfig.position.position,$scope.positionObj)
                    .then(function (res) {
                        if (res.data.code === 200){
                            console.log("success")
                        }else if (res.data.code === 444){
                            $state.go('login');
                        }else swal('',res.data.message,'error');
                        $scope.closeThisDialog();
                    },function (err) {
                        console.log("err",err);
                        swal('','请求服务失败','error');
                        $scope.closeThisDialog();
                    })
            }else {
                $http.post(appConfig.position.position,$scope.positionObj)
                    .then(function (res) {
                        if (res.data.code === 200){
                            console.log("success")
                        }else if (res.data.code === 444){
                            $state.go('login');
                        }else swal('',res.data.message,'error');
                        $scope.closeThisDialog();
                    },function (err) {
                        console.log("err",err);
                        swal('','请求服务失败','error');
                        $scope.closeThisDialog();
                    })
            }
        }
    }
})();