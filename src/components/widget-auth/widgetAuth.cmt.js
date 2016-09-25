(function () {
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
        vm.loginUrl = apiUrl;

        authService.getCurrentUser().then(function(responce){
            console.log('cl responce', responce);
        });

        return vm;
    }

    function template() {
        return `
            <div ng-if="!$ctrl.uid"><a href="$ctrl.loginUrl">Login with Vkontakte</a></div>
         `;
    }

}());
