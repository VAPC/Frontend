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

        eventsEndpoint.getResource().getEvents({}, function (response) {
            vm.events = response.data;
        });

        return vm;
    }

    function template() {
        return `
            <div class="panel panel-default" ng-repeat="item in $ctrl.events">
              <div class="panel-body">
                <h3>{{item.name}}</h3>
                <p>{{item.description}}</p>
                <p>{{item.date}}</p>
                </div>
            </div>
        `;
    }

}());