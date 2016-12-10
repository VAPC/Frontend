(function() {
    'use strict';
    angular
        .module('rockparade')
        .component('bandsList', {
            controller: bandsListCtrl,
            template: template
        });

    const bandListConfig = {
        sorting: [
            { id: 0, name: 'по популярности' },
            { id: 1, name: 'по цене' },
            { id: 2, name: 'по рейтингу' },
            { id: 3, name: 'по новизне' }
        ],
        viewing: [
            { id: 0, name: 'таблица' },
            { id: 1, name: 'блоки' },
            { id: 2, name: 'карточки' }
        ],
        defaultState: {
            sorting: 0,
            viewing: 0,
            filter: {
                search: ''
            }
        }
    };

    function template() {
        return `
<div class="container">
    <div class="row">
        <div class="col-xs-12">
            <h3>Артисты и группы</h3>
            <div class="bl-content">
                <div class="bl-header">
                    <div class="bl-sorting">
                        <ul class="bl-sorting-list">
                            <li ng-repeat="item in $ctrl.bandListConfig.sorting"
                                ng-class="{'active':item.id===$ctrl.config.sorting}"
                                ng-click="$ctrl.setBandListSorting(item.id)">{{item.name}}</li>
                        </ul>
                    </div>
                    <div class="bl-viewing">
                        <ul class="bl-viewing-list">
                            <li ng-repeat="item in $ctrl.bandListConfig.viewing"
                                ng-class="{'active':item.id===$ctrl.config.viewing}"
                                ng-click="$ctrl.setBandListViewing(item.id)">{{item.name}}</li>
                        </ul>
                    </div>
                </div>
                
                <div ng-if="$ctrl.config.viewing===0">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>Автор</th>
                                <th>Дата создания</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="item in $ctrl.bands track by item.id">
                                <td><a href="#/band/{{item.id}}">{{item.name}}</a></td>
                                <td>{{item.description}}</td>
                                <td>{{item.creator}}</td>
                                <td>{{item.registration_date}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div class="bl-clocks" 
                    ng-if="$ctrl.config.viewing===1">
                    <div class="bl-clocks-item"
                        ng-repeat="item in $ctrl.bands track by item.id">
                        <h3><a href="#/band/{{item.id}}">{{item.name}}</a></h3>
                        <p>{{item.description}}</p>
                        <p>register: {{item.registration_date}}</p>
                        <p>members: {{item.members}}</p>
                        <p>creator: {{item.creator}}</p>
                        <p><a href="#/bandEdit/{{item.id}}">Редактировать</a></p>
                    </div>
                </div>
                
                <div class="bl-cards" 
                    ng-if="$ctrl.config.viewing===2">
                    <div class="bl-cards-item"
                        ng-repeat="item in $ctrl.bands track by item.id">
                        <h3><a href="#/band/{{item.id}}">{{item.name}}</a></h3>
                        <p>{{item.description}}</p>
                        <p>register: {{item.registration_date}}</p>
                        <p>members: {{item.members}}</p>
                        <p>creator: {{item.creator}}</p>
                        <p><a href="#/bandEdit/{{item.id}}">Редактировать</a></p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
        `;
    }

    bandsListCtrl.$inject = [
        '$ngRedux',
        'actions',
        'memoize',
        'bandsEndpoint'
    ];

    function bandsListCtrl(
        $ngRedux,
        actions,
        memoize,
        bandsEndpoint) {
        var vm = this;
        vm.bandListConfig = bandListConfig;
        this.$onInit = $onInit;
        this.$onDestroy = $onDestroy;

        vm.getBands = memoize((value) => {
            bandsEndpoint.getResource().getBands({}, function(response) {
                vm.bands = response.data;
            });
        });

        let unconnect = $ngRedux.connect(mapState, mapDispatch())(vm);

        function $onInit() {
            vm.getBands();
        }

        function mapState(state) {
            let config = Object.assign({}, bandListConfig.defaultState, state.bandList);
            return {
                config: config
            }
        }

        function mapDispatch() {
            return {
                setBandListSorting: actions.setBandListSorting,
                setBandListViewing: actions.setBandListViewing
            }
        }

        function $onDestroy() {
            unconnect();
        }
    }
}());