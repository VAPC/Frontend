angular.module('endpointsModule')
    .service('authEndpoint', authEndpoint);

authEndpoint.$inject = ['$resource', 'apiUrl'];

function authEndpoint($resource, apiUrl) {
    'use strict';

    var queryParam = {};

    return {
        getResource: getResource
    };

    function getResource() {
        return $resource(apiUrl + '/user', queryParam, {
            getCurrentUser: {
                method: 'GET',
                isArray: false
            }
        });
    }
}
