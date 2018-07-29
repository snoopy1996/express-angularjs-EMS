(function () {
    'use strict';
    angular.module('LQ_EMS')
        .controller('loginCtrl',loginCtrl);
    function loginCtrl($scope,$state,$window,$http,appConfig) {
        console.log(66666);
        var CookieUtil = {
            // 设置cookie
            set : function (name, value, expires, domain, path, secure) {
                var cookieText = "";
                cookieText += encodeURIComponent(name) + "=" + encodeURIComponent(value);
                if (expires instanceof Date) {
                    cookieText += "; expires=" + expires.toGMTString();
                }
                if (path) {
                    cookieText += "; path=" + path;
                }
                if (domain) {
                    cookieText += "; domain=" + domain;
                }
                if (secure) {
                    cookieText += "; secure";
                }
                document.cookie = cookieText;
            },
            // name=value; expires=expiration_time; path=domain_path; domain=domain_name; secure
            // 获取cookie
            get : function (name) {
                var cookieName = encodeURIComponent(name) + "=",
                    cookieStart = document.cookie.indexOf(cookieName),
                    cookieValue = "";
                if (cookieStart > -1) {
                    var cookieEnd = document.cookie.indexOf (";", cookieStart);
                    if (cookieEnd == -1) {
                        cookieEnd = document.cookie.length;
                    }
                    cookieValue = decodeURIComponent(document.cookie.substring(cookieStart + cookieName.length, cookieEnd));
                }
                return cookieValue;
            },
            // 删除cookie
            unset : function (name, domain, path, secure) {
                this.set(name, "", Date(0), domain, path, secure);
            }
        };
        $scope.login = function () {
            CookieUtil.set("3000Token","96ed4d24-8589-4069-8999-3884c3326eea");
            var username=CookieUtil.get("3000Token");
            console.log(username);
//        document.cookie="token=a1dcb5e3-9694-44a6-8d54-a8a4814e5464";
            window.location.href="http://localhost:3000"

        }
    }
})();