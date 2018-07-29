/**
 * 参考代码：http://www.mamicode.com/info-detail-1180449.html
 */
(function () {
    'use strict';
    angular.module('LQ_EMS')
        .directive('myEChart',myEChart);
    function myEChart() {
        function link($scope, element, attrs) {

            // 基于准备好的dom，初始化echarts图表
            var myChart = echarts.init(element[0],{subtitleColor:"#62a2a6"});

            //监听options变化
            if (attrs.uiOptions) {
                attrs.$observe('uiOptions', function () {
                    var options = $scope.$eval(attrs.uiOptions);
                    if (angular.isObject(options)) {
                        // console.log('options改变');
                        // console.log(options.series[0].data.length);
                        myChart.setOption(options);
                    }
                }, true);
            }
        }
        return {
            restrict: 'A',
            link: link
        };
    }
})();