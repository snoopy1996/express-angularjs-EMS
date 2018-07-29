(function () {
    angular.module('LQ_EMS')
        .directive('lqPanel',lqPanel);
    /** @ngInject */
    function lqPanel() {
        return {
            restrict: 'A',
            transclude: true,
            template: function (elem, attrs) {
                var res = '<div class="panel-body" ng-transclude></div>';
                if (attrs.lqPanelTitle) {
                    var titleTpl = '<div style="margin-left: 1%;margin-right: 1%;"> <h4 class="text-left" style="padding-top: 12px;margin-left: 15px">' + attrs.lqPanelTitle + '</h4><hr/> </div>';
                    res = titleTpl + res;
                }

                return res;
            }
        };
    }
})();