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
    console.info('ver 1.0.1');
}());