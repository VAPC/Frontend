(function () {
    angular
        .module('authModule')
        .component('authWidget', {
            controller: authWidgetCtrl,
            template: template
        });

    authWidgetCtrl.$inject = ['authService',
        'apiUrl', '$rootScope'];

    function authWidgetCtrl(authService,
                            apiUrl,
                            $rootScope) {
        var vm = this;
        vm.loginUrl = apiUrl + '/login/vk';

        // authService.getCurrentUser().then(function (responce) {
        //     console.log('cl responce', responce);
        // });
        vm.isAuth = authService.isAuth();

        vm.login = authService.login;

        vm.logout = logout;

        return vm;

        function logout() {
            authService.logout();
            vm.isAuth = authService.isAuth();
            $rootScope.$emit('authChanged');
        }

    }

    function template() {
        return `
            <div ng-if="!$ctrl.isAuth">
            <a href="{{$ctrl.loginUrl}}">Login with Vkontakte</a>
            </div>
            <div ng-if="$ctrl.isAuth">
            <a ng-click="$ctrl.logout()">Logout</a>
            </div>
         `;
    }

}());
