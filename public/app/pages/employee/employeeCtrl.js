(function () {
    'use strict';
    angular.module('LQ_EMS')
        .controller('employeeCtrl',employeeCtrl)
        .controller('employeeModalCtrl',employeeModalCtrl);
    function employeeCtrl($scope,$http,appConfig,ngDialog,$state) {
        console.log('这里是员工管理控制器');
        $scope.employeeSet = [];
        $scope.employeeCollection = [].concat($scope.employeeSet);
        for(var i=0;i<15;i++){
            var employee = {
                employeeCode : i+"2017",
                employeeName : i+"Name"
            }
            $scope.employeeSet.push(employee);
        }
        var getData = function () {
            $http.get(appConfig.employee.employee)
                .then(function (res) {
                    if (res.data.code === 200){
                        $scope.employeeSet = res.data.result;
                    }else if (res.data.code === 444){
                        $state.go('login');
                        console.log(res.data);
                    }else swal('','删除失败，'+res.data.message,'error');
                })
        };
        getData();
        $scope.addEmployee = function () {
            var action = {
                title : "添加员工信息",
                method : "post",
            };
            var dialog = ngDialog.open({
                template: 'employeeModal.html',
                width: 600,
                controller: 'employeeModalCtrl',
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
        $scope.editEmployee = function (row) {
            var action = {
                title : "修改员工信息",
                method : "put",
                row : row
            };
            console.log(row);
            var dialog = ngDialog.open({
                template: 'employeeModal.html',
                width: 600,
                controller: 'employeeModalCtrl',
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
        $scope.deleteDepart = function (row) {
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
                $http.delete(appConfig.employee.deleteEmployee+row.employeeCode)
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
    function employeeModalCtrl($scope,$http,items,appConfig,$state) {
        $scope.action = items;
        $scope.enum = {
            departmentSet:[],
            positionSet:[]
        };
        if (items.method === "put"){
            $scope.employeeObj = angular.copy(items.row);
            $scope.disEdit = true;
            $scope.disSub = false;
        }else {
            $scope.employeeObj = {
                role : 'customer',
                status : '是',
                bonusMoney : 0,
                deleteMoney : 0,
                addMoney : 0
            };
            $scope.disEdit = false;
            $scope.disSub = true;
        }
        $scope.$watch('employeeObj',function () {
            var code = $scope.employeeObj.employeeCode;
            var name = $scope.employeeObj.employeeName;
            $scope.disSub = !(code && code !== '' && name && name !== '');
        },true);
        $scope.getPosition = function () {
            $http.get(appConfig.department.positionByCode+$scope.employeeObj.employeeDepartmentCode)
                .then(function (res) {
                    console.log(res.data);
                    if (res.data.code === 200){
                        $scope.enum.positionSet = res.data.result;
                        if (!$scope.employeeObj.employeePositionCode){
                            $scope.employeeObj.employeePositionCode =  res.data.result[0].positionCode;
                            $scope.employeeObj.basicMoney = $scope.enum.positionSet[0].basicMoney;
                        }
                    }else if (res.data.code === 444){
                        $state.go('login');
                        console.log(res.data);
                    }else swal('',res.data.message,'error');
                })
        };
        $scope.setBasicMoney = function () {
            for(var i=0;i<$scope.enum.positionSet.length;i++){
                if ($scope.employeeObj.employeePositionCode === $scope.enum.positionSet[i].positionCode){
                    $scope.employeeObj.basicMoney = $scope.enum.positionSet[i].basicMoney;
                    break;
                }
            }
        }
        $http.get(appConfig.department.department)
            .then(function (res) {
                if (res.data.code === 200){
                    $scope.enum.departmentSet = res.data.result;
                    if (!$scope.employeeObj.employeeDepartmentCode){
                        $scope.employeeObj.employeeDepartmentCode = res.data.result[0].departmentCode;
                    }
                    $scope.getPosition();
                    console.log("获取部门列表");
                }else if (res.data.code === 444){
                    $state.go('login');
                }else swal('',res.data.message,'error');

            });
        $scope.doEmployee = function () {
            if (items.method === 'post'){
                console.log($scope.employeeObj);
                console.log(JSON.stringify($scope.employeeObj));
                $http.post(appConfig.employee.employee,$scope.employeeObj)
                    .then(function (res) {
                        if (res.data.code === 200){
                            var newUser = {
                                userName : $scope.employeeObj.employeeCode,
                                password : $scope.employeeObj.employeeCode,
                                role : $scope.employeeObj.role,
                                status : $scope.employeeObj.status
                            };
                            $http.post(appConfig.auth.register,newUser)
                                .then(function (res) {
                                    if (res.data.code === 200){
                                        console.log('注册成功');
                                    }else if (res.data.code === 444){
                                        $state.go('login');
                                    }else swal('',res.data.message,'error');
                                    $scope.closeThisDialog();
                                },function (err) {
                                    swal('','请求注册服务失败','error');
                                    console.log('err',err);
                                    $scope.closeThisDialog();
                                })
                        }else {
                            if (res.data.code === 444){
                                $state.go('login');
                            }else swal('',res.data.message,'error');
                            $scope.closeThisDialog();
                        }
                    },function (err) {
                        swal('','请求添加员工服务失败','error');
                        console.log('err',err);
                        $scope.closeThisDialog();
                    });
            }else {
                console.log(JSON.stringify($scope.employeeObj));
                $http.put(appConfig.employee.employee,$scope.employeeObj)
                    .then(function (res) {
                        if (res.data.code === 200){
                            console.log("修改成功");
                        }else if (res.data.code === 444){
                            $state.go('login');
                        }else swal('',res.data.message,'error');
                        $scope.closeThisDialog();
                    },function (err) {
                        console.log(err);
                        swal('','请求服务失败','error');
                    })
            }
        }
    }
})();