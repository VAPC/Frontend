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
        '$routeParams'];

    function bandInfoCtrl(bandEndpoint,
                           $routeParams) {
        var vm = this;
        vm.id = $routeParams.id;

        bandEndpoint.getResource().getBand({id: vm.id}, function (response) {
            vm.bandData = response.data;
        });

        return vm;
    }

    function template() {
        return `
            <div class="panel panel-default">
              <div class="panel-body">
                <h3>{{$ctrl.bandData.name}}</h3>
                <p>{{$ctrl.bandData.description}}</p>
                <p>{{$ctrl.bandData.date}}</p>
                <p>{{$ctrl.bandData.place}}</p>
                <p>{{$ctrl.bandData.creator}}</p>
                </div>
            </div>
        `;
    }

}());