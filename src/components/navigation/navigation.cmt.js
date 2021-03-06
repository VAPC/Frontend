(function () {
    'use strict';
    angular
        .module('rockparade')
        .component('navigation', {
            controller: navigationCtrl,
            template: template
        });

    navigationCtrl.$inject = ['authService', '$rootScope'];

    function navigationCtrl(authService, $rootScope) {
        var vm = this;
        vm.isAuth = authService.isAuth();

        $rootScope.$on('authChanged', authChanged);
        return vm;

        function authChanged() {
            vm.isAuth = authService.isAuth();
        }
    }

    function template() {
        return `
                <ul class="top-nav"> 
                    <li ng-if="$ctrl.isAuth"><a href="#/home">Моя страница</a></li>
                    <li><a href="#/bands">Группы</a></li> 
                    <li><a href="#/events">Мероприятия</a></li>
                    <li>
                        <search-widget></search-widget>
                    </li>
                </ul>
        `;
    }

}());