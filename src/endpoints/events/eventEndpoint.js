angular.module('endpointsModule')
    .service('eventEndpoint', eventEndpoint);

eventEndpoint.$inject = ['$resource', 'apiUrl', '$q'];

function eventEndpoint($resource, apiUrl, $q) {
    'use strict';

    var queryParam = {};

    return {
        getResource: getResource
    };

    function getResource() {
        return $resource(apiUrl + '/event/:id', queryParam, {
            getEvent: {
                method: 'GET',
                isArray: false,
            },
        });
    }
}
