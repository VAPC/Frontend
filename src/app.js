(function () {
    'use strict';
    angular
        .module('rockparade', [
            'ngRoute',
            'ngResource',
            'endpointsModule'
        ])
        .config(router);

    router.$inject = ['$routeProvider'];
    function router($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
            })
            .when('/zakaz/', {
                templateUrl: 'zakaz.html',
                controller: 'zakazCtrl',
                controllerAs: 'zakaz'
            })
            .otherwise({
                redirectTo: '/'
            });

        //$locationProvider.html5Mode({
        //    enabled: true,
        //    requireBase: false
        //});
    };
}());