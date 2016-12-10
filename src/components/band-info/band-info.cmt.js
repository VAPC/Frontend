(function() {
    'use strict';
    angular
        .module('rockparade')
        .component('bandInfo', {
            controller: bandInfoCtrl,
            template: template
        });

    bandInfoCtrl.$inject = [
        'bandEndpoint',
        '$routeParams',
        '$ngRedux',
        'actions'];

    function bandInfoCtrl(bandEndpoint,
                          $routeParams,
                          $ngRedux,
                          actions) {
        var vm = this;
        vm.id = $routeParams.id;

        bandEndpoint.getResource().getBand({id: vm.id}, function(response) {
            vm.bandData = response.data;
        });

        return vm;
    }

    function template() {
        return `
            <div ng-hide="$ctrl.bandData">Loading...</div>
            <div ng-show="$ctrl.bandData">
                <div class="panel panel-default">
                  <div class="panel-body">
                    <h3>{{$ctrl.bandData.name}}</h3>
                    <p>{{$ctrl.bandData.description}}</p>
                    <p>{{$ctrl.bandData.date}}</p>
                    <p>{{$ctrl.bandData.place}}</p>
                    <p>{{$ctrl.bandData.creator}}</p>
                    </div>
                </div>
            </div>
        `;
    }

}());