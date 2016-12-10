(function () {
    'use strict';
    angular
        .module('rockparade')
        .component('profile', {
            controller: profileCtrl,
            template: template
        });

    const profileConfig = {
        viewing: [
            {id: 0, name: 'Мой профиль'},
            {id: 1, name: 'Мои группы'},
            {id: 2, name: 'Мои мероприятия'}
        ],
        defaultState: {
            viewing: 0
        }
    };

    function template() {
        return `
<div class="container">
    <div class="row">
        <div class="col-xs-12">
            <h3>{{$ctrl.user.name}}</h3>
            <div>{{$ctrl.user.description}}</div>
        </div>
    </div>
    <div class="row">
        <div class="col-xs-9 col-xs-offset-3">
            <div class="p-viewing">
                <ul class="p-viewing-list">
                    <li ng-repeat="item in $ctrl.profileConfig.viewing"
                        ng-class="{'active':item.id===$ctrl.config.viewing}"
                        ng-click="$ctrl.setProfileViewing(item.id)">{{item.name}}</li>
                </ul>
            </div>
        </div>
    </div>
    <div class="row p-content">
        <div class="col-xs-3">
            <p>Создано групп: {{$ctrl.user.created_bands.length}}</p>
            <p>Создано мероприятий: {{$ctrl.user.events.length}}</p>
        </div>
        <div class="col-xs-9">
            <div>
                <div ng-if="$ctrl.config.viewing===0">
                    Здесь отображается публичная информация, которую видят пользователи, зашедшие на ваш профиль.
                </div>
                <div ng-if="$ctrl.config.viewing===1">
                    <p>Создавать группы необходимо...</p>
                    <a href="#/bandCreate">Создать</a>
                    <hr>
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
                            <tr ng-repeat="item in $ctrl.user.created_bands track by item.id">
                                <td><a href="#/band/{{item.id}}">{{item.name}}</a></td>
                                <td>{{item.description}}</td>
                                <td>{{item.creator}}</td>
                                <td>{{item.registration_date}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div ng-if="$ctrl.config.viewing===2">
                    <p>Создавать мероприятия необходимо...</p>
                    <a href="#/eventCreate">Создать</a>
                    <hr>
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
                            <tr ng-repeat="item in $ctrl.user.created_bands track by item.id">
                                <td><a href="#/band/{{item.id}}">{{item.name}}</a></td>
                                <td>{{item.description}}</td>
                                <td>{{item.creator}}</td>
                                <td>{{item.registration_date}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
    `;
    }

    profileCtrl.$inject = [
        '$ngRedux',
        'actions',
        'memoize',
        'bandsEndpoint'
    ];

    function profileCtrl($ngRedux,
                         actions,
                         memoize,
                         bandsEndpoint) {

        var vm = this;
        vm.profileConfig = profileConfig;
        this.$onInit = $onInit;
        this.$onDestroy = $onDestroy;

        let unconnect = $ngRedux.connect(mapState, mapDispatch())(vm);

        function $onInit() {
        }

        function mapState(state) {
            let config = Object.assign({}, profileConfig.defaultState, state.profile);
            return {
                user: state.user,
                config: config
            }
        }

        function mapDispatch() {
            return {
                setProfileViewing: actions.setProfileViewing
            }
        }

        function $onDestroy() {
            unconnect();
        }
    }
}());