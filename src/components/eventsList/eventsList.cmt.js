(function () {
    'use strict';
    angular
        .module('rockparade')
        .component('eventsList', {
            controller: eventsListCtrl,
            template: template
        });

    eventsListCtrl.$inject = ['eventsEndpoint'];

    function eventsListCtrl(eventsEndpoint) {
        var vm = this;
        console.log('cl eventsEndpoint', eventsEndpoint);

        eventsEndpoint.getResource().getEvents({}, function (response) {
            vm.events = response;
        });
        return vm;
    }

    function template() {
        return `
            <div>{{$ctrl.events}}</div>
        `;
    }

}());