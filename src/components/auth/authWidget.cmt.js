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
        vm.isAuth = authService.isAuth();
        vm.login = authService.login;
        vm.logout = logout;
        $rootScope.$on('authChanged', authChanged);

        if (vm.isAuth) {
            authService.getCurrentUser().then(function (response) {
                console.log('cl response', response);
                vm.user = response.data;
            });
        }

        return vm;

        function logout() {
            authService.logout();
            $rootScope.$emit('authChanged');
        }

        function authChanged() {
            vm.isAuth = authService.isAuth();
        }

    }

    function template() {
        return `
            <div class="auth-widget__btn-holder" 
                 ng-if="!$ctrl.isAuth">
                <a class="btn btn-default btn-sm" href="{{$ctrl.loginUrl}}">Войти</a>
            </div>
            <div ng-if="$ctrl.isAuth">
                <div>Hi, {{$ctrl.user.login}}!</div>
                <a ng-click="$ctrl.logout()">Logout</a>
            </div>
         `;
    }

}());
