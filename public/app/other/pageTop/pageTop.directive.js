/**
 * Created by 忍把浮名换此生 on 2017/6/29.
 */
(function () {
    angular.module('LQ_EMS')
        .directive('pageTop',pageTop);
    /** @ngInject */
    function pageTop() {
        return {
            restrict: 'E',
            templateUrl: 'app/other/pageTop/pageTop.html',
            controller: 'PageTopCtrl'
        };
    }
})();