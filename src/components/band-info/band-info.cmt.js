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

        vm.bandEdit = bandEdit;

        return vm;

        function bandEdit() {
            $ngRedux.dispatch(actions.location('/bandEdit/' + vm.id));
        }
    }

    function template() {
        return `
            <div class="content__band">
                <div class="hero-image"></div>
                <div class="side">
                    <div class="side-left">
                        <div class="band__left-box">
                            <div class="band__photo"><img src="../assets/anton.png"></div>
                            <div class="band__subscribe"><button class="btn btn-default">Подписан</button></div>
                            <div class="band__counters">9999</div>
                        </div>       
                        <div class="band__left-box">
                            <div class="left-box__header">Состоит в группах 2</div>
                            <div class="left-box__groups">
                                <div class="groups__group"></div>
                            </div>
                        </div>               
                    </div>
                    <div class="side-center">
                        <div class="upper">
                            <div class="upper__name">Антон Кореляков</div>
                            <div class="upper__buttons">
                                <button class="btn btn-default">Сообщение</button>
                                <button class="btn btn-default">Пригласить</button>
                            </div>
                        </div>                    
                    </div>
                </div>
            </div>
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
                <button class="btn btn-default" ng-click="$ctrl.bandEdit()">Редактировать</button>
            </div>
        `;
    }

}());