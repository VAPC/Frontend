(function () {
    'use strict';
    angular
        .module('rockparade', [
            'ngRoute',
            'ngCookies',
            'ngResource',

            'endpointsModule',
            'authModule',
        ]);
}());