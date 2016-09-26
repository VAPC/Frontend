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

        authService.getCurrentUser().then(function (response) {
            console.log('cl response', response);
            vm.user = response.data;
        });
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
            <div>Hi, {{$ctrl.user.login}}!</div>
            <a ng-click="$ctrl.logout()">Logout</a>
            </div>
         `;
    }

}());
