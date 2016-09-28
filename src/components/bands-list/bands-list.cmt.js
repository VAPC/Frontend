(function () {
    'use strict';
    angular
        .module('rockparade')
        .component('bandsList', {
            controller: bandsListCtrl,
            template: template
        });

    bandsListCtrl.$inject = [
        '$ngRedux',
        'memoize',
        'bandsEndpoint'
    ];

    function bandsListCtrl($ngRedux,
                           memoize,
                           bandsEndpoint) {
        var vm = this;

        this.$onDestroy = $onDestroy;

        this.getBands = memoize(function (value) {
            bandsEndpoint.getResource().getBands({}, function (response) {
                vm.bands = response.data;
            });
        });

        var unconnect = $ngRedux.subscribe(() => {
            let state = $ngRedux.getState();
            this.getBands();
        });

        this.getBands();


        return vm;

        function $onDestroy() {
            unconnect();
        }
    }

    function template() {
        return `
            <div class="panel panel-default" ng-repeat="item in $ctrl.bands">
              <div class="panel-body">
                <h3><a href="#/band/{{item.id}}">{{item.name}}</a></h3>
                <p>{{item.description}}</p>
                <p>register: {{item.registration_date}}</p>
                <p>members: {{item.members}}</p>
                <p>creator: {{item.creator}}</p>
                </div>
            </div>
        `;
    }

}());