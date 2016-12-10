(function () {
    angular
        .module('authModule')
        .component('authWidget', {
            controller: authWidgetCtrl,
            template: template
        });

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

    authWidgetCtrl.$inject = [
        'authService',
        'apiUrl',
        '$rootScope',
        '$ngRedux',
        'actions'
    ];

    function authWidgetCtrl(authService,
                            apiUrl,
                            $rootScope,
                            $ngRedux,
                            actions) {

        this.$onInit = $onInit;
        this.$onDestroy = $onDestroy;
        var vm = this;
        let unconnect = $ngRedux.connect(mapState, mapDispatch())(vm);

        vm.loginUrl = apiUrl + '/login/vk';
        vm.isAuth = authService.isAuth();
        vm.login = authService.login;
        vm.logout = logout;
        $rootScope.$on('authChanged', authChanged);

        if (vm.isAuth) {
            authService.getCurrentUser().then(function (response) {
                // console.log('cl response', response);
                // vm.user = response.data;
                vm.setCurrentUser({
                    created_bands: response.data.created_bands,
                    description: response.data.description,
                    events: response.data.events,
                    login: response.data.login,
                    name: response.data.name,
                    registration_date: response.data.registration_date
                });
            });
        }

        return vm;

        function $onInit() {
        }

        function $onDestroy() {
            unconnect();
        }

        function mapState(state) {
            return {
                user: state.user
            }
        }

        function mapDispatch() {
            return {
                setCurrentUser: actions.setCurrentUser,
            }
        }

        function logout() {
            authService.logout();
            $rootScope.$emit('authChanged');
        }

        function authChanged() {
            vm.isAuth = authService.isAuth();
        }

    }

}());
