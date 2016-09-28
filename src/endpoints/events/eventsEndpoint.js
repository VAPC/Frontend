angular.module('endpointsModule')
    .service('eventsEndpoint', eventsEndpoint);

eventsEndpoint.$inject = ['$resource', 'apiUrl', '$q'];

function eventsEndpoint($resource, apiUrl, $q) {
    'use strict';

    var queryParam = {};

    return {
        getResource: getResource
    };

    function getResource() {
        return $resource(apiUrl + '/events/:like/:searchString/:limit/:offset', queryParam, {
            getEventsAll: {
                method: 'GET',
                isArray: false,
                params: {
                    like: null,
                    searchString: null,
                }
            },
            getEvents: {
                method: 'GET',
                isArray: false,
                params: {
                    like: 'like',
                }
            },
        });
    }
}
