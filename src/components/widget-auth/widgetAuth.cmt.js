(function() {
    'use strict';
    angular
        .module('rockparade')
        .component('authWidget', {
            controller: authWidgetCtrl,
            template: template
        });

    authWidgetCtrl.$inject = ['authService',
        'apiUrl'];

    function authWidgetCtrl(authService,
                            apiUrl) {
        var vm = this;
        vm.loginUrl = apiUrl + '/login/vk';

        // authService.getCurrentUser().then(function(responce){
        //     console.log('cl responce', responce);
        // });

        vm.login = authService.login;

        return vm;

    }

    function template() {
        return `
            <div ng-if="!$ctrl.uid">
            <button ng-click="$ctrl.login()">Login with Vkontakte</button>
            <a href="{{$ctrl.loginUrl}}">Login with Vkontakte</a>
            </div>
         `;
    }

}());
