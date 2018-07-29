(function () {
   'use strict';
   angular.module('LQ_EMS')
       .controller('departmentCtrl',departmentCtrl)
       .controller('addDepartModelCtrl',addDepartModelCtrl)
       .controller('editDepartModelCtrl',editDepartModelCtrl)
       .controller('editDPModalCtrl',editDPModalCtrl);
   function departmentCtrl($scope,ngDialog,$http,appConfig,$state) {
       console.log('这里是部门管理控制器');
       $scope.departmentSet = [];
       $scope.departmentCollection = [].concat($scope.departmentSet);
       for (var i=0;i<15;i++){
           var depart = {
               departmentCode:i+3,
               departmentName:'haha'+i
           }
           $scope.departmentSet.push(depart)
       }
       var getData = function () {
           $scope.departmentSet = [];
           $http.get(appConfig.department.department)
               .then(function (res) {
                   if (res.data.code === 200){
                       $scope.departmentSet = res.data.result;
                       console.log("刷新数据");
                       console.log($scope.departmentCollection);
                   }else if (res.data.code === 444){
                       $state.go('login');
                       console.log(res.data);
                   }else swal('',res.data.message,'error');
               },function (err) {
                   console.log(err);
                   swal('','请求服务失败','error');
               })
       };
       getData();

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
               console.log('删除部门'+row.departmentCode+'!');
               $http.delete(appConfig.department.department+'?departmentCode='+row.departmentCode)
                   .then(function (res) {
                       if (res.data.code === 200) {
                           swal("已删除", "成功删除信息", "success");
                       }else if (res.data.code === 444){
                           $state.go('login');
                       }else swal('',res.data.message,'error');
                       getData();
                   },function (err) {
                       swal("", "请求服务失败", "error")
                       console.log("err",err);
                       getData();
                   })

           });
       };
       $scope.addDepartment = function () {
           var dialog = ngDialog.open({
               template: 'addDepartModel.html',
               width: 600,
               controller: 'addDepartModelCtrl'
           });
           dialog.closePromise.then(function (data) {
               console.log('模态框关闭');
               getData();
           });
       };
       $scope.editDepart = function (row) {
           var dialog = ngDialog.open({
               template: 'editDepartModel.html',
               width: 600,
               controller: 'editDepartModelCtrl',
               resolve: {
                   items: function () {
                       return row;
                   }
               }
           });
           dialog.closePromise.then(function (data) {
               console.log('编辑模态框关闭');
               getData();
           });
       }
       $scope.editDP = function (row) {
           console.log(appConfig.position.position);
           var data = {
               allPosition:[],
               row:row
           }
           $http.get(appConfig.position.position)
               .then(function (res) {
                   if (res.data.code === 200){
                       data.allPosition = res.data.result;
                       var dialog = ngDialog.open({
                           template: 'editDPModal.html',
                           width: 600,
                           controller: 'editDPModalCtrl',
                           resolve: {
                               items: function () {
                                   return data;
                               }
                           }
                       });
                       dialog.closePromise.then(function (data) {
                           console.log('编辑模态框关闭');
                           getData();
                       });
                   }else if (res.data.code === 444){
                       $state.go('login');
                   }else swal('',res.data.message,'error');
               })
       }
   }
   function addDepartModelCtrl($scope,$http,appConfig) {
       console.log('这里是添加部门模态框控制器');
       $scope.newObj = {};
       $scope.disableAdd = true;
       $scope.disableAdd =
       $scope.$watch('newObj',function () {
           var code = $scope.newObj.departmentCode;
           var name = $scope.newObj.departmentName;
           $scope.disableAdd = !(code && code !== '' && name && name !== '');
       },true);
       $scope.addDepart = function () {
           $http.post(appConfig.department.department,$scope.newObj)
               .then(function (res) {
                   if (res.data.code === 200){
                       console.log("添加成功");
                   }else if (res.data.code === 444){
                       $state.go('login');
                   }else swal('',res.data.message,'error');
                   $scope.closeThisDialog();
               },function (err) {
                   swal('','请求服务失败','error');
                   console.log("err",err);
                   $scope.closeThisDialog();
               })
       }
   }
   function editDepartModelCtrl($scope,items,$http,appConfig) {
       console.log('这里是修改部门信息模态框控制器');
       $scope.editObj = angular.copy(items);
       $scope.$watch('newObj',function () {
           var name = $scope.editObj.departmentName;
           $scope.disableEdit = !(name && name !== '')
       },true);
       $scope.editDepart = function () {
           console.log("修改部门");
           $http.put(appConfig.department.department,$scope.editObj)
               .then(function (res) {
                   if (res.data.code === 200){
                       console.log("修改成功");
                   }else if (res.data.code === 444){
                       $state.go('login');
                   }else swal('',res.data.message,'error');
                   $scope.closeThisDialog();
               },function (err) {
                   swal('','请求服务失败','error');
                   console.log("err",err);
                   $scope.closeThisDialog();
               })
       }
   }
   function editDPModalCtrl($scope,items,$http,appConfig) {
        $scope.allPosition = [];
        console.log(appConfig.department.positionByCode+items.row.departmentCode);
        $http.get(appConfig.department.positionByCode+items.row.departmentCode)
            .then(function (res) {
                if (res.data.code === 200){
                    var selectRow = res.data.result;
                    for (var i=0;i<selectRow.length;i++){
                        for(var j=0;j<items.allPosition.length;j++){
                            // console.log(items.allPosition[j].positionCode,selectRow[i].positionCode)
                            if (selectRow[i].positionCode === items.allPosition[j].positionCode){
                                items.allPosition[j].selected = true;
                                console.log(items.allPosition[j])
                            }
                        }
                    }
                    $scope.allPosition = items.allPosition;
                }else if (res.data.code === 444){
                    $state.go('login');
                }else swal('',res.data.message,'error');
            });
        $scope.editDP = function () {
            var data = [];
            for (var i=0;i<$scope.allPosition.length;i++){
                if ($scope.allPosition[i].selected === true){
                    console.log(i,$scope.allPosition[i]);
                    var item = {
                        positionCode : $scope.allPosition[i].positionCode,
                        departmentCode : items.row.departmentCode
                    };
                    data.push(item);
                }
            }
            console.log(data);
            console.log(JSON.stringify(data));
            $http.post(appConfig.department.positionByCode+items.row.departmentCode,data)
                .then(function (res) {
                    if (res.data.code === 200){
                        console.log("添加成功");
                        $scope.closeThisDialog();
                    }else if (res.data.code === 444){
                        $state.go('login');
                    }else swal('',res.data.message,'error');
                })
        }
   }
})();