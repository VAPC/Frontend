angular.module('endpointsModule')
    .service('authService', authService);

authService.$inject = ['authEndpoint',
    '$q'];

function authService(authEndpoint,
                     $q) {

    var currentUserDefer;

    return {
        login: login,
        getCurrentUser: getCurrentUser,
    };

    function login() {
        authEndpoint.getResource().login({}, function(response) {
                console.log('cl response:', response);
            }, function(response) {
                console.log('cl response:', response);
            }
        );
    }

    function getCurrentUser() {
        if (!currentUserDefer) {
            currentUserDefer = $q.defer;
            authEndpoint.getResource().getCurrentUser({}, function(response) {
                    currentUserDefer.resolve(response);
                }, function(response) {
                    currentUserDefer.reject(response);
                }
            );
        }
        return currentUserDefer.promise;
    }
}
