(function() {
    'use strict';
    angular.module('LQ_EMS',[
        'ui.router',
        'smart-table',
        'ngDialog'
    ])
        .factory('sessionInteceptor', ["$q", "$location", '$window', function($q, $location, $window) {

            var myInterceptor = {};
            myInterceptor.request = function(requestConfig) {
              // var requedtOption = requestConfig.getOption();
                requestConfig["headers"]["token"] = $window.localStorage.getItem('token');
                return requestConfig;
            };
            return myInterceptor;

        }])
        .config(["$stateProvider", "$httpProvider", function($stateProvider, $httpProvider) {
            //添加拦截器
            $httpProvider.interceptors.push('sessionInteceptor');

        }])
        .config(['$urlRouterProvider','$stateProvider','$locationProvider',function ($urlRouterProvider,$stateProvider,$locationProvider) {
            $urlRouterProvider.otherwise('/login');
            $stateProvider
                .state('base', {
                    abstract: true,
                    url: '',
                    templateUrl: 'app/pages/base.html'
                })
                .state('login', {
                    url: '/login',
                    templateUrl:'app/pages/login/login.html',
                    controller:'loginCtrl'
                    // parent:'base',
                })
                .state('index',{
                    url:'/index',
                    templateUrl:'app/pages/index/index.html',
                    parent:'base',
                    controller:'indexCtrl'
                })
                .state('department',{
                    url:'/department',
                    templateUrl:'app/pages/department/department.html',
                    parent:'base',
                    controller:'departmentCtrl'
                })
                .state('employee',{
                    url:'/employee',
                    templateUrl:'app/pages/employee/employee.html',
                    parent:'base',
                    controller:'employeeCtrl'
                })
                .state('position',{
                    url:'/position',
                    templateUrl:'app/pages/position/position.html',
                    parent:'base',
                    controller:'positionCtrl'
                })
                .state('personal',{
                    url:'/personal',
                    templateUrl:'app/pages/personal/personal.html',
                    parent:'base',
                    controller:'personalCtrl'
                });
            $locationProvider.html5Mode(true);
        }])
        .filter('unique',unique)
        .directive('pageSelect',pageSelect)
        .factory('appConfig',appConfig)
        .factory('thisUser',thisUser);
    function pageSelect() {
        return {
            restrict: 'E',
            template: '<input type="text" class="select-page" ng-model="inputPage" ng-change="selectPage(inputPage)">',
            link: function(scope, element, attrs) {
                scope.$watch('currentPage', function(c) {
                    scope.inputPage = c;
                });
            }
        }
    }
    function unique() {
        return function(arr, field) {
            var o = {},
                i, l = arr.length,
                r = [];
            for (i = 0; i < l; i += 1) {
                o[arr[i][field]] = arr[i];
            }
            for (i in o) {
                r.push(o[i]);
            }
            return r;
        };
    }
    function appConfig() {
        var appConfig = {
            department:{
                department:'/api/department/',       //增删改查--post/delete/put/get
                positionByCode:'/api/department/positionList?departmentCode='  //获取部门下职位列表
            },
            position:{
                position: '/api/position/',         //增删改查--post/delete/put/get
                deletePosition: '/api/position?positionCode='
            },
            auth:{
                login: '/api/auth/login/',
                logout: '/api/auth/logout/',
                register: '/api/auth/register/',
                userInfo: '/api/auth/testToken/',
                updatePwd: '/api/auth/updatePwd/'
            },
            employee:{
                employee: '/api/employee/',
                deleteEmployee: '/api/employee?employeeCode=',
                updateOneForUser: '/api/employee/updateOne/'
            }

        }
        return appConfig;
    }
    function thisUser() {
        var thisUser = {

        }
        return thisUser;
    }
})();

