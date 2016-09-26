(function () {
    angular.module('authModule')
        .controller('authLoginProcessCtrl', authLoginProcessCtrl);

    authLoginProcessCtrl.$inject = ['$routeParams', '$location', '$cookies', '$rootScope'];

    function authLoginProcessCtrl($routeParams, $location, $cookies, $rootScope) {
        var vm = this;
        if ($routeParams.hasOwnProperty('token')) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 14);
            $cookies.put('AUTH-TOKEN', $routeParams.token, {'expires': expireDate});
        }
        $rootScope.$emit('authChanged');
        setTimeout(function () {
            $location.path('/#/home');
        });
        return vm;
    }
}());