angular.module('endpointsModule')
    .service('eventEndpoint', eventEndpoint);

eventEndpoint.$inject = ['$resource', 'apiUrl'];

function eventEndpoint($resource, apiUrl) {
    'use strict';

    var queryParam = {};

    return {
        getResource: getResource
    };

    function getResource() {
        return $resource(apiUrl + '/event/:id/:entity', queryParam, {
            getEvent: {
                method: 'GET',
                isArray: false,
            },
            editEvent: {
                method: 'PUT',
                isArray: false,
            },
            createEvent: {
                method: 'POST',
                isArray: false,
            },
        });
    }
}
