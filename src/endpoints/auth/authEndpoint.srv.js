angular.module('endpointsModule')
    .service('authService', authService);

authService.$inject = ['authEndpoint',
    '$q'];

function authService(authEndpoint,
                     $q) {

    var currentUserDefer;

    return {
        getCurrentUser: getCurrentUser
    };

    function getCurrentUser() {
        if (!currentUserDefer) {
            currentUserDefer = $q.defer;
            authEndpoint.getResource().getCurrentUser({}, function (response) {
                    currentUserDefer.resolve(response);
                }, function (response) {
                    currentUserDefer.reject(response);
                }
            );
        }
        return currentUserDefer.promise;
    }
}
