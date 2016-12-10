// import reducers from './app/reducers'

(function() {
    'use strict';
    angular
        .module('rockparade', [
            'ngRoute',
            'ngCookies',
            'ngResource',
            'ngRedux',

            'endpointsModule',
            'authModule',
            'searchModule',
        ]);

}());
angular.module('endpointsModule', [])
    .factory('apiUrl', apiUrl);

function apiUrl() {
    var url;
    switch (window.location.hostname) {
        case 'localhost':
            url = 'http://rockparade.creora.ru/api';
            break;
        default:
            url = window.location.origin + '/api';
            break;
    }
    return url;
}

(function() {
    angular.module('searchModule', []);
}());
(function () {
    angular.module('authModule', [])
        // .config(httpInterceptorConfig)
        .run(httpInterceptorRun);

    // httpInterceptorConfig.$inject = ['$httpProvider'];
    //
    // function httpInterceptorConfig($httpProvider) {
    //     $httpProvider.defaults.useXDomain = true;
    //     delete $httpProvider.defaults.headers.common['X-Requested-With'];
    // }

    httpInterceptorRun.$inject = ['$injector'];

    function httpInterceptorRun($injector) {
        'use strict';

        var TOKEN = $injector.get('$cookies').get('AUTH-TOKEN');
        // console.log('cl TOKEN', TOKEN);
        var $http = $injector.get('$http');
        // $http.defaults.headers.common['AUTH-TOKEN'] = 'test';
        if (TOKEN) {
            $http.defaults.headers.common['AUTH-TOKEN'] = TOKEN;
            // $http.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type';
            // $http.defaults.headers.common['Access-Control-Request-Headers'] = 'accept, origin, authorization, key';
            // $http.defaults.headers.common['AUTH-TOKEN'] = 'test';
            // $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            // $http.defaults.headers.put['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        } else {
            console.log('Auth: user authentication error. Cookies doesn\'t contain "AUTH-TOKEN"');
        }
    }

}());
(function () {
    'use strict';
    angular
        .module('rockparade')
        .config(router);

    router.$inject = ['$routeProvider'];

    function router($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'landing.html',
            })
            .when('/home', {
                templateUrl: 'home.html',
            })
            .when('/event/:id', {
                templateUrl: 'event.html',
            })
            .when('/eventCreate', {
                templateUrl: 'eventCreate.html',
            })
            .when('/events', {
                templateUrl: 'events.html',
            })
            .when('/bands', {
                templateUrl: 'bands.html',
            })
            .when('/band/:id', {
                templateUrl: 'band.html',
            })
            .when('/bandCreate', {
                templateUrl: 'bandCreate.html',
            })
            .when('/bandEdit/:id', {
                templateUrl: 'bandEdit.html',
            })
            .when('/search?:bla', {
                templateUrl: 'search.html',
            })
            .when('/login/vk/callback', {
                controller: 'authLoginProcessCtrl',
                template: '',
            })
            .otherwise({
                redirectTo: '/'
            });

        //$locationProvider.html5Mode({
        //    enabled: true,
        //    requireBase: false
        //});
    };

}());
(function () {
    angular
        .module('rockparade')
        .service('actions', actions);

    actions.$inject = [];

    function actions() {
        return {
            changeSearchString: changeSearchString,
            location: location,
            hashSearch: hashSearch,
            setCurrentUser: setCurrentUser,
            setBandListSorting: setBandListSorting,
            setBandListViewing: setBandListViewing,
            setProfileViewing: setProfileViewing,
        };

        function changeSearchString(value) {
            return {
                type: 'CHANGE_SEARCH_STRING',
                value: value
            }
        }

        function location(value) {
            return {
                type: 'LOCATION',
                value: value
            }
        }

        function hashSearch(value) {
            return {
                type: 'HASH_SEARCH',
                value: value
            }
        }

        function setBandListSorting(id) {
            return {
                type: 'SET_BAND_LIST_SORTING',
                payload: id
            }
        }

        function setBandListViewing(id) {
            return {
                type: 'SET_BAND_LIST_VIEWING',
                payload: id
            }
        }

        function setProfileViewing(id) {
            return {
                type: 'SET_PROFILE_VIEWING',
                payload: id
            }
        }

        function setCurrentUser(payload) {
            return {
                type: 'SET_CURRENT_USER',
                payload: payload
            }
        }
    }

}());
(function () {
    function memoize() {
        return (func, equalityCheck = defaultEqualityCheck) => {
            let lastArgs = null;
            let lastResult = null;
            return (...args) => {
                if (
                    lastArgs !== null &&
                    lastArgs.length === args.length &&
                    args.every((value, index) => equalityCheck(value, lastArgs[index]))
                ) {
                    return lastResult;
                }
                lastArgs = args;
                lastResult = func(...args);
                return lastResult;
            }
        };
    }

    function defaultEqualityCheck(a, b) {
        return a === b
    }

    angular
        .module('rockparade')
        .factory('memoize', memoize);


}());

// function memoize(func, equalityCheck = defaultEqualityCheck) {
//     let lastArgs = null;
//     let lastResult = null;
//     return (...args) => {
//         if (
//             lastArgs !== null &&
//             lastArgs.length === args.length &&
//             args.every((value, index) => equalityCheck(value, lastArgs[index]))
//         ) {
//             return lastResult;
//         }
//         lastArgs = args;
//         lastResult = func(...args);
//         return lastResult;
//     }
// }
(function () {

    const defaultState = {
        location: {
            path: '',
            hashSearch: '',
        },
        search: {
            query: '',
        },
        user: {
            uid: '',
            name: '',
        },
        bandList: {
            sorting: 0,
            viewing: 0,
            filter: {
                search: ''
            }
        }
    };

    function reducers(state = defaultState, action) {
        switch (action.type) {

            case 'CHANGE_SEARCH_STRING':
                state.search.query = action.value;
                return Object.assign(state);

            case 'LOCATION':
                state.location.path = action.value;
                return Object.assign(state);
            case 'HASH_SEARCH':
                state.location.hashSearch = action.value;
                return Object.assign(state);
            case 'SET_BAND_LIST_SORTING':
                const bandListSorting = Object.assign({}, state.bandList, {
                    sorting: action.payload
                });
                return Object.assign({}, state, {
                    bandList: bandListSorting
                });
            case 'SET_BAND_LIST_VIEWING':
                const bandListViewing = Object.assign({}, state.bandList, {
                    viewing: action.payload
                });
                return Object.assign({}, state, {
                    bandList: bandListViewing
                });
            case 'SET_PROFILE_VIEWING':
                const profileViewing = Object.assign({}, state.profile, {
                    viewing: action.payload
                });
                return Object.assign({}, state, {
                    profile: profileViewing
                });
            case 'SET_CURRENT_USER':
                return Object.assign({}, state, {
                    user: action.payload
                });
            default:
                return state;

        }
    }

    angular
        .module('rockparade')
        .config(ngReduxConfig);

    ngReduxConfig.$inject = ['$ngReduxProvider'];

    function ngReduxConfig($ngReduxProvider) {
        const logger = (store) => (next) => (action) => {
            console.log('dispatching', action);
            const result = next(action);
            console.log('next state', store.getState());
            return result;
        };
        $ngReduxProvider.createStoreWith(reducers, [logger]);
    }

}());
(function() {
    'use strict';
    angular
        .module('rockparade')
        .component('bandCreate', {
            controller: bandCreateCtrl,
            template: template
        });

    bandCreateCtrl.$inject = [
        'bandEndpoint',
        '$ngRedux',
        'actions'];

    function bandCreateCtrl(bandEndpoint,
                            $ngRedux,
                            actions) {
        var vm = this;
        vm.formData = {
            name: '',
            description: ''
        };
        vm.formSubmit = formSubmitHandler;

        return vm;

        function formSubmitHandler(e) {
            bandEndpoint.getResource().createBand(vm.formData, function(response) {
                console.log('cl response', response);

                $ngRedux.dispatch(actions.location('/bands'));
            }, function(response) {
                console.log('cl response', response);
            });
        }
    }

    function template() {
        return `
            <div class="panel panel-default">
                <div class="panel-body">
                    <form name="form-create-band" ng-submit="$ctrl.formSubmit()">
                          <div class="form-group">
                              <label for="create-band-name">Название группы</label>
                              <input id="create-band-name" name="create-band-name" ng-model="$ctrl.formData.name" type="text" class="form-control">
                          </div>
                          <div class="form-group">
                              <label for="create-band-description">Описание группы</label>
                              <textarea id="create-band-description" name="create-band-description" ng-model="$ctrl.formData.description" type="text" class="form-control"></textarea>
                          </div>
                          <div class="form-group">
                              <button type="submit" class="btn btn-primary">Создать</button>
                          </div>
                      </form>
                </div>
            </div>
        `;
    }

}());
(function() {
    'use strict';
    angular
        .module('rockparade')
        .component('bandEdit', {
            controller: bandEditCtrl,
            template: template
        });

    bandEditCtrl.$inject = [
        'bandEndpoint',
        '$routeParams',
        '$ngRedux',
        'actions'];

    function bandEditCtrl(bandEndpoint,
                          $routeParams,
                          $ngRedux,
                          actions) {
        var vm = this;
        vm.id = $routeParams.id;

        bandEndpoint.getResource().getBand({id: vm.id}, function(response) {
            vm.bandData = response.data;
        });

        vm.formSubmit = formSubmit;
        vm.formCancel = formCancel;

        return vm;

        function formSubmit() {

            bandEndpoint.getResource({id: vm.id}).editBand(this.bandData, function(response) {
                console.log('cl response', response);

                $ngRedux.dispatch(actions.location('/band/' + vm.id));
            }, function(response) {
                console.log('cl response', response);
            });
        }

        function formCancel() {
            $ngRedux.dispatch(actions.location('/band/' + vm.id));
        }

    }

    function template() {
        return `
            <div ng-hide="$ctrl.bandData">Loading...</div>
            <div ng-show="$ctrl.bandData" class="panel panel-default">
              <div class="panel-body">
                <h3>Редактировать</h3>
                
                    <form name="form-edit-band" ng-submit="$ctrl.formSubmit()">
                          <div class="form-group">
                              <label for="create-band-name">Название группы</label>
                              <input id="create-band-name" name="create-band-name" ng-model="$ctrl.bandData.name" type="text" class="form-control">
                          </div>
                          <div class="form-group">
                              <label for="create-band-description">Описание группы</label>
                              <textarea id="create-band-description" name="create-band-description" ng-model="$ctrl.bandData.description" type="text" class="form-control"></textarea>
                          </div>
                          <div class="form-group">
                              <button type="submit" class="btn btn-primary">Сохранить</button>
                              <button type="reset" class="btn btn-default" ng-click="$ctrl.formCancel()">Отмена</button>
                          </div>
                      </form>
                </div>
            </div>
                <p>{{$ctrl.bandData.registration_date}}</p>
                <p>{{$ctrl.bandData.members}}</p>
                <p>{{$ctrl.bandData.creator}}</p>
        `;
    }

}());
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
(function () {
    angular.module('rockparade')
        .component('content', {
            controller: contentController,
            template: template
        });

    contentController.$inject = [
        '$ngRedux',
        'memoize',
        '$location'];

    function contentController($ngRedux,
                               memoize,
                               $location) {
        var vm = this;

        this.setLocation = memoize(function (value) {
            if (value) {
                $location.path(value);
            }
        });
        this.setHashSearch = memoize(function (value) {
            if (value) {
                $location.search(value);
            }
        });

        $ngRedux.subscribe(() => {
            let state = $ngRedux.getState();
            this.setLocation(state.location.path);
            this.setHashSearch(state.location.hashSearch);
        });

        return vm;
    }

    function template() {
        return `
            <div class="top-menu">
                <div class="top-menu__holder">
                    <div class="row">
                        <div class="col-sm-2"><a href="#/"><img src="css/img/logo2.png" alt="Rockparade"></a></div>
                        <div class="col-sm-8">
                            <navigation></navigation>
                        </div>
                        <div class="col-sm-2">
                            <auth-widget></auth-widget>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content has-top-menu">
                <div ng-view=""></div>
            </div>
        `;
    }

}());
(function () {
    'use strict';
    angular
        .module('rockparade')
        .component('eventCreate', {
            controller: eventCreateCtrl,
            template: template
        });

    eventCreateCtrl.$inject = [
        'eventEndpoint',
        '$ngRedux',
        'actions'];

    function eventCreateCtrl(eventEndpoint,
                             $ngRedux,
                             actions) {
        var vm = this;
        vm.formData = {
            name: '',
            date: '',
            description: '',
            place: '',
        };
        vm.formSubmit = formSubmitHandler;

        return vm;

        function formSubmitHandler(e) {
            eventEndpoint.getResource().createEvent(vm.formData, function (response) {
                $ngRedux.dispatch(actions.location('/bands'));
            }, function (response) {
                console.log('cl response', response);
            });
        }
    }

    function template() {
        return `
<div class="container">
    <div class="row">
        <div class="col-xs-12">
            <h3>Создание мероприятия</h3>
            <div class="panel panel-default">
                <div class="panel-body">
                    <form name="form-create-band" ng-submit="$ctrl.formSubmit()">
                          <div class="form-group">
                              <label for="create-event-name">Название мероприятия</label>
                              <input name="create-event-name" ng-model="$ctrl.formData.name" type="text" class="form-control">
                          </div>
                          <div class="form-group">
                              <label for="create-event-date">Дата проведения мероприятия</label>
                              <input name="create-event-date" ng-model="$ctrl.formData.date" type="text" class="form-control">
                          </div>
                          <div class="form-group">
                              <label for="create-event-place">Место проведения мероприятия</label>
                              <input name="create-event-place" ng-model="$ctrl.formData.place" type="text" class="form-control">
                          </div>
                          <div class="form-group">
                              <label for="create-event-description">Описание мероприятия</label>
                              <textarea name="create-event-description" ng-model="$ctrl.formData.description" type="text" class="form-control"></textarea>
                          </div>
                          <div class="form-group">
                              <button type="submit" class="btn btn-primary">Создать</button>
                          </div>
                      </form>
                </div>
            </div>
            </div>
            </div>
            </div>
        `;
    }

}());
(function() {
    'use strict';
    angular
        .module('rockparade')
        .component('eventInfo', {
            controller: eventInfoCtrl,
            template: template
        });

    eventInfoCtrl.$inject = [
        'eventEndpoint',
        '$routeParams'];

    function eventInfoCtrl(eventEndpoint,
                           $routeParams) {
        var vm = this;
        vm.id = $routeParams.id;

        eventEndpoint.getResource().getEvent({id: vm.id}, function (response) {
            vm.eventData = response.data;
        });

        return vm;
    }

    function template() {
        return `
            <div class="panel panel-default">
              <div class="panel-body">
                <h3>{{$ctrl.eventData.name}}</h3>
                <p>{{$ctrl.eventData.description}}</p>
                <p>{{$ctrl.eventData.date}}</p>
                <p>{{$ctrl.eventData.place}}</p>
                <p>{{$ctrl.eventData.creator}}</p>
                </div>
            </div>
        `;
    }

}());
(function() {
    'use strict';
    angular
        .module('rockparade')
        .component('eventsList', {
            controller: eventsListCtrl,
            template: template
        });

    eventsListCtrl.$inject = [
        '$ngRedux',
        'memoize',
        'eventsEndpoint'
    ];

    function eventsListCtrl($ngRedux,
                            memoize,
                            eventsEndpoint) {
        var vm = this;

        this.$onDestroy = $onDestroy;

        this.getEvents = memoize(function (value) {
            if (value) {
                eventsEndpoint.getResource().getEvents({searchString: value}, function (response) {
                    vm.events = response.data;
                });
            } else {
                eventsEndpoint.getResource().getEventsAll({}, function (response) {
                    vm.events = response.data;
                });
            }
        });

        var unconnect = $ngRedux.subscribe(() => {
            let state = $ngRedux.getState();
            this.getEvents(state.search.query);
        });

        this.getEvents();


        return vm;

        function $onDestroy() {
            unconnect();
        }
    }

    function template() {
        return `
            <div class="panel panel-default" ng-repeat="item in $ctrl.events">
              <div class="panel-body">
                <h3><a href="#/event/{{item.id}}">{{item.name}}</a></h3>
                <p>{{item.description}}</p>
                <p>{{item.date}}</p>
                </div>
            </div>
        `;
    }

}());
(function () {
    'use strict';
    angular
        .module('rockparade')
        .component('navigation', {
            controller: navigationCtrl,
            template: template
        });

    navigationCtrl.$inject = ['authService', '$rootScope'];

    function navigationCtrl(authService, $rootScope) {
        var vm = this;
        vm.isAuth = authService.isAuth();

        $rootScope.$on('authChanged', authChanged);
        return vm;

        function authChanged() {
            vm.isAuth = authService.isAuth();
        }
    }

    function template() {
        return `
                <ul class="top-nav"> 
                    <li ng-if="$ctrl.isAuth"><a href="#/home">Моя страница</a></li>
                    <li><a href="#/bands">Группы</a></li> 
                    <li><a href="#/events">Мероприятия</a></li>
                    <li>
                        <search-widget></search-widget>
                    </li>
                </ul>
        `;
    }

}());
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
                            <tr ng-repeat="item in $ctrl.user.events track by item.id">
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
(function () {
    'use strict';
    angular
        .module('searchModule')
        .component('searchWidget', {
            controller: searchWidgetCtrl,
            template: template
        });

    searchWidgetCtrl.$inject = [
        '$ngRedux',
        'actions'
    ];

    function searchWidgetCtrl($ngRedux,
                              actions) {
        var vm = this;

        var unconnect = $ngRedux.connect(mapStateToThis, actions)(vm);

        this.query = '';
        this.searchKeyPress = searchKeyPress;
        this.searchKeyUp = searchKeyUp;
        this.$onDestroy = $onDestroy;

        return vm;

        function mapStateToThis(state) {
            return {
                state: state
            }
        }

        function searchKeyPress(e) {
            if (e.charCode === 13) {
                e.preventDefault();
                $ngRedux.dispatch(actions.location('/search'));
                $ngRedux.dispatch(actions.hashSearch('q=' + this.query));
            }
        }

        function searchKeyUp(e) {
            $ngRedux.dispatch(actions.changeSearchString(this.query));
        }

        function $onDestroy() {
            unconnect();
        }

    }

    function template() {
        return `
            <div class="search-widget">
                <input type="search" 
                    class="form-control input-sm" 
                    ng-keypress="$ctrl.searchKeyPress($event)"
                    ng-keyup="$ctrl.searchKeyUp($event)"
                    ng-model="$ctrl.query"
                    placeholder="Поиск">
            </div>
        `;
    }

}());
angular.module('endpointsModule')
    .service('authEndpoint', authEndpoint);

authEndpoint.$inject = ['$resource', 'apiUrl', '$cookies'];

function authEndpoint($resource, apiUrl, $cookies) {
    'use strict';

    var queryParam = {};
    var token = $cookies.get('AUTH-TOKEN');
    var star = '*';

    return {
        getResource: getResource
    };

    function getResource() {
        return $resource(apiUrl + '/:entity/:type', queryParam, {
            getCurrentUser: {
                params: {
                    entity: 'user'
                },
                method: 'GET',
                isArray: false
            },
            login: {
                params: {
                    entity: 'login',
                    type: 'vk',
                },
                method: 'GET',
                isArray: false
            }
        });
    }
}

angular.module('endpointsModule')
    .service('bandEndpoint', bandEndpoint);

bandEndpoint.$inject = ['$resource', 'apiUrl'];

function bandEndpoint($resource, apiUrl) {
    'use strict';

    return {
        getResource: getResource
    };

    function getResource(params) {
        return $resource(apiUrl + '/band/:id/:entity', params, {
            getBand: {
                method: 'GET',
                isArray: false,
            },
            editBand: {
                method: 'PUT',
                isArray: false,
            },
            createBand: {
                method: 'POST',
                isArray: false,
            },
            addMemberToBand: {
                method: 'POST',
                isArray: false,
                params: {
                    entity: 'members'
                }
            }
        });
    }
}

angular.module('endpointsModule')
    .service('bandsEndpoint', bandsEndpoint);

bandsEndpoint.$inject = ['$resource', 'apiUrl', '$q'];

function bandsEndpoint($resource, apiUrl, $q) {
    'use strict';

    var queryParam = {};

    return {
        getResource: getResource
    };

    function getResource() {
        return $resource(apiUrl + '/bands/:limit/:offset', queryParam, {
            getBands: {
                method: 'GET',
                isArray: false,
            }
        });
    }
}

angular.module('endpointsModule')
    .service('eventEndpoint', eventEndpoint);

eventEndpoint.$inject = ['$resource', 'apiUrl'];

function eventEndpoint($resource, apiUrl) {
    'use strict';

    var queryParam = {};

    return {
        getResource: getResource
    };

    function getResource() {
        return $resource(apiUrl + '/event/:id/:entity', queryParam, {
            getEvent: {
                method: 'GET',
                isArray: false,
            },
            editEvent: {
                method: 'PUT',
                isArray: false,
            },
            createEvent: {
                method: 'POST',
                isArray: false,
            },
        });
    }
}

angular.module('endpointsModule')
    .service('eventsEndpoint', eventsEndpoint);

eventsEndpoint.$inject = ['$resource', 'apiUrl', '$q'];

function eventsEndpoint($resource, apiUrl, $q) {
    'use strict';

    var queryParam = {};

    return {
        getResource: getResource
    };

    function getResource() {
        return $resource(apiUrl + '/events/:like/:searchString/:limit/:offset', queryParam, {
            getEventsAll: {
                method: 'GET',
                isArray: false,
                params: {
                    like: null,
                    searchString: null,
                }
            },
            getEvents: {
                method: 'GET',
                isArray: false,
                params: {
                    like: 'like',
                }
            },
        });
    }
}

angular.module('authModule')
    .service('authService', authService);

authService.$inject = ['authEndpoint',
    '$q',
    '$cookies',
    '$location'];

function authService(authEndpoint,
                     $q,
                     $cookies,
                     $location) {

    var currentUserDefer;

    return {
        isAuth: isAuth,
        login: login,
        logout: logout,
        getCurrentUser: getCurrentUser,
    };

    function isAuth() {
        return !!$cookies.get('AUTH-TOKEN');
    }

    function login() {
        authEndpoint.getResource().login({}, function (response) {
                console.log('cl response:', response);
            }, function (response) {
                console.log('cl response:', response);
            }
        );
    }

    function logout() {
        $cookies.remove('AUTH-TOKEN');
        $location.path('/#');
    }

    function getCurrentUser() {
        if (!currentUserDefer) {
            currentUserDefer = $q.defer();
            authEndpoint.getResource().getCurrentUser({}, function (response) {
                    currentUserDefer.resolve(response);
                }, function (response) {
                    currentUserDefer.reject(response);
                }
            );
        }
        return currentUserDefer.promise;
    }
}

(function () {
    angular.module('authModule')
        .controller('authLoginProcessCtrl', authLoginProcessCtrl);

    authLoginProcessCtrl.$inject = ['$routeParams', '$location', '$cookies', '$rootScope'];

    function authLoginProcessCtrl($routeParams, $location, $cookies, $rootScope) {
        var vm = this;
        if ($routeParams.hasOwnProperty('token')) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 14);
            $cookies.put('AUTH-TOKEN', $routeParams.token, {'expires': expireDate});
        }
        $rootScope.$emit('authChanged');
        setTimeout(function () {
            $location.path('/#/home');
        });
        return vm;
    }
}());
(function () {
    angular
        .module('authModule')
        .component('authWidget', {
            controller: authWidgetCtrl,
            template: template
        });

    function template() {
        return `
            <div class="auth-widget__btn-holder" 
                 ng-if="!$ctrl.isAuth">
                <a class="btn btn-default btn-sm" href="{{$ctrl.loginUrl}}">Войти</a>
            </div>
            <div ng-if="$ctrl.isAuth">
                <div>Hi, {{$ctrl.user.login}}!</div>
                <a ng-click="$ctrl.logout()">Logout</a>
            </div>
         `;
    }

    authWidgetCtrl.$inject = [
        'authService',
        'apiUrl',
        '$rootScope',
        '$ngRedux',
        'actions'
    ];

    function authWidgetCtrl(authService,
                            apiUrl,
                            $rootScope,
                            $ngRedux,
                            actions) {

        this.$onInit = $onInit;
        this.$onDestroy = $onDestroy;
        var vm = this;
        let unconnect = $ngRedux.connect(mapState, mapDispatch())(vm);

        vm.loginUrl = apiUrl + '/login/vk';
        vm.isAuth = authService.isAuth();
        vm.login = authService.login;
        vm.logout = logout;
        $rootScope.$on('authChanged', authChanged);

        if (vm.isAuth) {
            authService.getCurrentUser().then(function (response) {
                // console.log('cl response', response);
                // vm.user = response.data;
                vm.setCurrentUser({
                    created_bands: response.data.created_bands,
                    description: response.data.description,
                    events: response.data.events,
                    login: response.data.login,
                    name: response.data.name,
                    registration_date: response.data.registration_date
                });
            });
        }

        return vm;

        function $onInit() {
        }

        function $onDestroy() {
            unconnect();
        }

        function mapState(state) {
            return {
                user: state.user
            }
        }

        function mapDispatch() {
            return {
                setCurrentUser: actions.setCurrentUser,
            }
        }

        function logout() {
            authService.logout();
            $rootScope.$emit('authChanged');
        }

        function authChanged() {
            vm.isAuth = authService.isAuth();
        }

    }

}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImVuZHBvaW50cy9lbmRwb2ludHMubWRsLmpzIiwiY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoLm1kbC5qcyIsImNvbXBvbmVudHMvYXV0aC9hdXRoLm1kbC5qcyIsInJvdXRlci5qcyIsImFwcC9hY3Rpb25zLmpzIiwiYXBwL21lbW9pemUuanMiLCJhcHAvcmVkdWNlcnMuanMiLCJjb21wb25lbnRzL2JhbmQtY3JlYXRlL2JhbmQtY3JlYXRlLmNtdC5qcyIsImNvbXBvbmVudHMvYmFuZC1lZGl0L2JhbmQtZWRpdC5jbXQuanMiLCJjb21wb25lbnRzL2JhbmQtaW5mby9iYW5kLWluZm8uY210LmpzIiwiY29tcG9uZW50cy9iYW5kcy1saXN0L2JhbmRzLWxpc3QuY210LmpzIiwiY29tcG9uZW50cy9jb250ZW50L2NvbnRlbnQuY210LmpzIiwiY29tcG9uZW50cy9ldmVudC1jcmVhdGUvZXZlbnQtY3JlYXRlLmNtdC5qcyIsImNvbXBvbmVudHMvZXZlbnQtaW5mby9ldmVudHMtaW5mby5jbXQuanMiLCJjb21wb25lbnRzL2V2ZW50cy1saXN0L2V2ZW50cy1saXN0LmNtdC5qcyIsImNvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmNtdC5qcyIsImNvbXBvbmVudHMvcHJvZmlsZS9wcm9maWxlLmNtdC5qcyIsImNvbXBvbmVudHMvc2VhcmNoL3NlYXJjaFdpZGdldC5jbXQuanMiLCJlbmRwb2ludHMvYXV0aC9hdXRoRW5kcG9pbnQuanMiLCJlbmRwb2ludHMvYmFuZHMvYmFuZEVuZHBvaW50LmpzIiwiZW5kcG9pbnRzL2JhbmRzL2JhbmRzRW5kcG9pbnQuanMiLCJlbmRwb2ludHMvZXZlbnRzL2V2ZW50RW5kcG9pbnQuanMiLCJlbmRwb2ludHMvZXZlbnRzL2V2ZW50c0VuZHBvaW50LmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGguc3J2LmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGhMb2dpblByb2Nlc3MuY3RybC5qcyIsImNvbXBvbmVudHMvYXV0aC9hdXRoV2lkZ2V0LmNtdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHJlZHVjZXJzIGZyb20gJy4vYXBwL3JlZHVjZXJzJ1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnLCBbXHJcbiAgICAgICAgICAgICduZ1JvdXRlJyxcclxuICAgICAgICAgICAgJ25nQ29va2llcycsXHJcbiAgICAgICAgICAgICduZ1Jlc291cmNlJyxcclxuICAgICAgICAgICAgJ25nUmVkdXgnLFxyXG5cclxuICAgICAgICAgICAgJ2VuZHBvaW50c01vZHVsZScsXHJcbiAgICAgICAgICAgICdhdXRoTW9kdWxlJyxcclxuICAgICAgICAgICAgJ3NlYXJjaE1vZHVsZScsXHJcbiAgICAgICAgXSk7XHJcblxyXG59KCkpOyIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnLCBbXSlcclxuICAgIC5mYWN0b3J5KCdhcGlVcmwnLCBhcGlVcmwpO1xyXG5cclxuZnVuY3Rpb24gYXBpVXJsKCkge1xyXG4gICAgdmFyIHVybDtcclxuICAgIHN3aXRjaCAod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKSB7XHJcbiAgICAgICAgY2FzZSAnbG9jYWxob3N0JzpcclxuICAgICAgICAgICAgdXJsID0gJ2h0dHA6Ly9yb2NrcGFyYWRlLmNyZW9yYS5ydS9hcGknO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgJy9hcGknO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHJldHVybiB1cmw7XHJcbn1cclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NlYXJjaE1vZHVsZScsIFtdKTtcclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2F1dGhNb2R1bGUnLCBbXSlcclxuICAgICAgICAvLyAuY29uZmlnKGh0dHBJbnRlcmNlcHRvckNvbmZpZylcclxuICAgICAgICAucnVuKGh0dHBJbnRlcmNlcHRvclJ1bik7XHJcblxyXG4gICAgLy8gaHR0cEludGVyY2VwdG9yQ29uZmlnLiRpbmplY3QgPSBbJyRodHRwUHJvdmlkZXInXTtcclxuICAgIC8vXHJcbiAgICAvLyBmdW5jdGlvbiBodHRwSW50ZXJjZXB0b3JDb25maWcoJGh0dHBQcm92aWRlcikge1xyXG4gICAgLy8gICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMudXNlWERvbWFpbiA9IHRydWU7XHJcbiAgICAvLyAgICAgZGVsZXRlICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtUmVxdWVzdGVkLVdpdGgnXTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBodHRwSW50ZXJjZXB0b3JSdW4uJGluamVjdCA9IFsnJGluamVjdG9yJ107XHJcblxyXG4gICAgZnVuY3Rpb24gaHR0cEludGVyY2VwdG9yUnVuKCRpbmplY3Rvcikge1xyXG4gICAgICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgICAgdmFyIFRPS0VOID0gJGluamVjdG9yLmdldCgnJGNvb2tpZXMnKS5nZXQoJ0FVVEgtVE9LRU4nKTtcclxuICAgICAgICAvLyBjb25zb2xlLmxvZygnY2wgVE9LRU4nLCBUT0tFTik7XHJcbiAgICAgICAgdmFyICRodHRwID0gJGluamVjdG9yLmdldCgnJGh0dHAnKTtcclxuICAgICAgICAvLyAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQVVUSC1UT0tFTiddID0gJ3Rlc3QnO1xyXG4gICAgICAgIGlmIChUT0tFTikge1xyXG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQVVUSC1UT0tFTiddID0gVE9LRU47XHJcbiAgICAgICAgICAgIC8vICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gPSAnQ29udGVudC1UeXBlJztcclxuICAgICAgICAgICAgLy8gJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0FjY2Vzcy1Db250cm9sLVJlcXVlc3QtSGVhZGVycyddID0gJ2FjY2VwdCwgb3JpZ2luLCBhdXRob3JpemF0aW9uLCBrZXknO1xyXG4gICAgICAgICAgICAvLyAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQVVUSC1UT0tFTiddID0gJ3Rlc3QnO1xyXG4gICAgICAgICAgICAvLyAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLnBvc3RbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCc7XHJcbiAgICAgICAgICAgIC8vICRodHRwLmRlZmF1bHRzLmhlYWRlcnMucHV0WydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBdXRoOiB1c2VyIGF1dGhlbnRpY2F0aW9uIGVycm9yLiBDb29raWVzIGRvZXNuXFwndCBjb250YWluIFwiQVVUSC1UT0tFTlwiJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb25maWcocm91dGVyKTtcclxuXHJcbiAgICByb3V0ZXIuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInXTtcclxuXHJcbiAgICBmdW5jdGlvbiByb3V0ZXIoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGFuZGluZy5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9ob21lJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdob21lLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2V2ZW50LzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZXZlbnQuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvZXZlbnRDcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2V2ZW50Q3JlYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2V2ZW50cycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZXZlbnRzLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2JhbmRzJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdiYW5kcy5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9iYW5kLzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmFuZC5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9iYW5kQ3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdiYW5kQ3JlYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2JhbmRFZGl0LzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmFuZEVkaXQuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvc2VhcmNoPzpibGEnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NlYXJjaC5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9sb2dpbi92ay9jYWxsYmFjaycsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdhdXRoTG9naW5Qcm9jZXNzQ3RybCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJycsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vdGhlcndpc2Uoe1xyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XHJcbiAgICAgICAgLy8gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAvLyAgICByZXF1aXJlQmFzZTogZmFsc2VcclxuICAgICAgICAvL30pO1xyXG4gICAgfTtcclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuc2VydmljZSgnYWN0aW9ucycsIGFjdGlvbnMpO1xyXG5cclxuICAgIGFjdGlvbnMuJGluamVjdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGlvbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2hhbmdlU2VhcmNoU3RyaW5nOiBjaGFuZ2VTZWFyY2hTdHJpbmcsXHJcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcclxuICAgICAgICAgICAgaGFzaFNlYXJjaDogaGFzaFNlYXJjaCxcclxuICAgICAgICAgICAgc2V0Q3VycmVudFVzZXI6IHNldEN1cnJlbnRVc2VyLFxyXG4gICAgICAgICAgICBzZXRCYW5kTGlzdFNvcnRpbmc6IHNldEJhbmRMaXN0U29ydGluZyxcclxuICAgICAgICAgICAgc2V0QmFuZExpc3RWaWV3aW5nOiBzZXRCYW5kTGlzdFZpZXdpbmcsXHJcbiAgICAgICAgICAgIHNldFByb2ZpbGVWaWV3aW5nOiBzZXRQcm9maWxlVmlld2luZyxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VTZWFyY2hTdHJpbmcodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdDSEFOR0VfU0VBUkNIX1NUUklORycsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9jYXRpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdMT0NBVElPTicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFzaFNlYXJjaCh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ0hBU0hfU0VBUkNIJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXRCYW5kTGlzdFNvcnRpbmcoaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdTRVRfQkFORF9MSVNUX1NPUlRJTkcnLFxyXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogaWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0QmFuZExpc3RWaWV3aW5nKGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnU0VUX0JBTkRfTElTVF9WSUVXSU5HJyxcclxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IGlkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldFByb2ZpbGVWaWV3aW5nKGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnU0VUX1BST0ZJTEVfVklFV0lORycsXHJcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiBpZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXRDdXJyZW50VXNlcihwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnU0VUX0NVUlJFTlRfVVNFUicsXHJcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBtZW1vaXplKCkge1xyXG4gICAgICAgIHJldHVybiAoZnVuYywgZXF1YWxpdHlDaGVjayA9IGRlZmF1bHRFcXVhbGl0eUNoZWNrKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBsYXN0QXJncyA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBsYXN0UmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdEFyZ3MgIT09IG51bGwgJiZcclxuICAgICAgICAgICAgICAgICAgICBsYXN0QXJncy5sZW5ndGggPT09IGFyZ3MubGVuZ3RoICYmXHJcbiAgICAgICAgICAgICAgICAgICAgYXJncy5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBlcXVhbGl0eUNoZWNrKHZhbHVlLCBsYXN0QXJnc1tpbmRleF0pKVxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0QXJncyA9IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBsYXN0UmVzdWx0ID0gZnVuYyguLi5hcmdzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZWZhdWx0RXF1YWxpdHlDaGVjayhhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIGEgPT09IGJcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmZhY3RvcnkoJ21lbW9pemUnLCBtZW1vaXplKTtcclxuXHJcblxyXG59KCkpO1xyXG5cclxuLy8gZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCBlcXVhbGl0eUNoZWNrID0gZGVmYXVsdEVxdWFsaXR5Q2hlY2spIHtcclxuLy8gICAgIGxldCBsYXN0QXJncyA9IG51bGw7XHJcbi8vICAgICBsZXQgbGFzdFJlc3VsdCA9IG51bGw7XHJcbi8vICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcclxuLy8gICAgICAgICBpZiAoXHJcbi8vICAgICAgICAgICAgIGxhc3RBcmdzICE9PSBudWxsICYmXHJcbi8vICAgICAgICAgICAgIGxhc3RBcmdzLmxlbmd0aCA9PT0gYXJncy5sZW5ndGggJiZcclxuLy8gICAgICAgICAgICAgYXJncy5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBlcXVhbGl0eUNoZWNrKHZhbHVlLCBsYXN0QXJnc1tpbmRleF0pKVxyXG4vLyAgICAgICAgICkge1xyXG4vLyAgICAgICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgbGFzdEFyZ3MgPSBhcmdzO1xyXG4vLyAgICAgICAgIGxhc3RSZXN1bHQgPSBmdW5jKC4uLmFyZ3MpO1xyXG4vLyAgICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xyXG4vLyAgICAgfVxyXG4vLyB9IiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjb25zdCBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICAgICAgcGF0aDogJycsXHJcbiAgICAgICAgICAgIGhhc2hTZWFyY2g6ICcnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoOiB7XHJcbiAgICAgICAgICAgIHF1ZXJ5OiAnJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVzZXI6IHtcclxuICAgICAgICAgICAgdWlkOiAnJyxcclxuICAgICAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBiYW5kTGlzdDoge1xyXG4gICAgICAgICAgICBzb3J0aW5nOiAwLFxyXG4gICAgICAgICAgICB2aWV3aW5nOiAwLFxyXG4gICAgICAgICAgICBmaWx0ZXI6IHtcclxuICAgICAgICAgICAgICAgIHNlYXJjaDogJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gcmVkdWNlcnMoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikge1xyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ0NIQU5HRV9TRUFSQ0hfU1RSSU5HJzpcclxuICAgICAgICAgICAgICAgIHN0YXRlLnNlYXJjaC5xdWVyeSA9IGFjdGlvbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ0xPQ0FUSU9OJzpcclxuICAgICAgICAgICAgICAgIHN0YXRlLmxvY2F0aW9uLnBhdGggPSBhY3Rpb24udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSk7XHJcbiAgICAgICAgICAgIGNhc2UgJ0hBU0hfU0VBUkNIJzpcclxuICAgICAgICAgICAgICAgIHN0YXRlLmxvY2F0aW9uLmhhc2hTZWFyY2ggPSBhY3Rpb24udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSk7XHJcbiAgICAgICAgICAgIGNhc2UgJ1NFVF9CQU5EX0xJU1RfU09SVElORyc6XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYW5kTGlzdFNvcnRpbmcgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5iYW5kTGlzdCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRpbmc6IGFjdGlvbi5wYXlsb2FkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhbmRMaXN0OiBiYW5kTGlzdFNvcnRpbmdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjYXNlICdTRVRfQkFORF9MSVNUX1ZJRVdJTkcnOlxyXG4gICAgICAgICAgICAgICAgY29uc3QgYmFuZExpc3RWaWV3aW5nID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuYmFuZExpc3QsIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3aW5nOiBhY3Rpb24ucGF5bG9hZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgICAgICBiYW5kTGlzdDogYmFuZExpc3RWaWV3aW5nXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY2FzZSAnU0VUX1BST0ZJTEVfVklFV0lORyc6XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9maWxlVmlld2luZyA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnByb2ZpbGUsIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3aW5nOiBhY3Rpb24ucGF5bG9hZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9maWxlOiBwcm9maWxlVmlld2luZ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNhc2UgJ1NFVF9DVVJSRU5UX1VTRVInOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcjogYWN0aW9uLnBheWxvYWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb25maWcobmdSZWR1eENvbmZpZyk7XHJcblxyXG4gICAgbmdSZWR1eENvbmZpZy4kaW5qZWN0ID0gWyckbmdSZWR1eFByb3ZpZGVyJ107XHJcblxyXG4gICAgZnVuY3Rpb24gbmdSZWR1eENvbmZpZygkbmdSZWR1eFByb3ZpZGVyKSB7XHJcbiAgICAgICAgY29uc3QgbG9nZ2VyID0gKHN0b3JlKSA9PiAobmV4dCkgPT4gKGFjdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGlzcGF0Y2hpbmcnLCBhY3Rpb24pO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXh0KGFjdGlvbik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXh0IHN0YXRlJywgc3RvcmUuZ2V0U3RhdGUoKSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkbmdSZWR1eFByb3ZpZGVyLmNyZWF0ZVN0b3JlV2l0aChyZWR1Y2VycywgW2xvZ2dlcl0pO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYmFuZENyZWF0ZScsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogYmFuZENyZWF0ZUN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGJhbmRDcmVhdGVDdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJ2JhbmRFbmRwb2ludCcsXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnYWN0aW9ucyddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGJhbmRDcmVhdGVDdHJsKGJhbmRFbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uZm9ybURhdGEgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICcnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJydcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZtLmZvcm1TdWJtaXQgPSBmb3JtU3VibWl0SGFuZGxlcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtU3VibWl0SGFuZGxlcihlKSB7XHJcbiAgICAgICAgICAgIGJhbmRFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmNyZWF0ZUJhbmQodm0uZm9ybURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5sb2NhdGlvbignL2JhbmRzJykpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gbmFtZT1cImZvcm0tY3JlYXRlLWJhbmRcIiBuZy1zdWJtaXQ9XCIkY3RybC5mb3JtU3VibWl0KClcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3JlYXRlLWJhbmQtbmFtZVwiPtCd0LDQt9Cy0LDQvdC40LUg0LPRgNGD0L/Qv9GLPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY3JlYXRlLWJhbmQtbmFtZVwiIG5hbWU9XCJjcmVhdGUtYmFuZC1uYW1lXCIgbmctbW9kZWw9XCIkY3RybC5mb3JtRGF0YS5uYW1lXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiPtCe0L/QuNGB0LDQvdC40LUg0LPRgNGD0L/Qv9GLPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIiBuYW1lPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIiBuZy1tb2RlbD1cIiRjdHJsLmZvcm1EYXRhLmRlc2NyaXB0aW9uXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj7QodC+0LfQtNCw0YLRjDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdiYW5kRWRpdCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogYmFuZEVkaXRDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBiYW5kRWRpdEN0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnYmFuZEVuZHBvaW50JyxcclxuICAgICAgICAnJHJvdXRlUGFyYW1zJyxcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdhY3Rpb25zJ107XHJcblxyXG4gICAgZnVuY3Rpb24gYmFuZEVkaXRDdHJsKGJhbmRFbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAkcm91dGVQYXJhbXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblxyXG4gICAgICAgIGJhbmRFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEJhbmQoe2lkOiB2bS5pZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHZtLmJhbmREYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdm0uZm9ybVN1Ym1pdCA9IGZvcm1TdWJtaXQ7XHJcbiAgICAgICAgdm0uZm9ybUNhbmNlbCA9IGZvcm1DYW5jZWw7XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9ybVN1Ym1pdCgpIHtcclxuXHJcbiAgICAgICAgICAgIGJhbmRFbmRwb2ludC5nZXRSZXNvdXJjZSh7aWQ6IHZtLmlkfSkuZWRpdEJhbmQodGhpcy5iYW5kRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZScsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmxvY2F0aW9uKCcvYmFuZC8nICsgdm0uaWQpKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZScsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtQ2FuY2VsKCkge1xyXG4gICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmxvY2F0aW9uKCcvYmFuZC8nICsgdm0uaWQpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgbmctaGlkZT1cIiRjdHJsLmJhbmREYXRhXCI+TG9hZGluZy4uLjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IG5nLXNob3c9XCIkY3RybC5iYW5kRGF0YVwiIGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8aDM+0KDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Yw8L2gzPlxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gbmFtZT1cImZvcm0tZWRpdC1iYW5kXCIgbmctc3VibWl0PVwiJGN0cmwuZm9ybVN1Ym1pdCgpXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNyZWF0ZS1iYW5kLW5hbWVcIj7QndCw0LfQstCw0L3QuNC1INCz0YDRg9C/0L/RizwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNyZWF0ZS1iYW5kLW5hbWVcIiBuYW1lPVwiY3JlYXRlLWJhbmQtbmFtZVwiIG5nLW1vZGVsPVwiJGN0cmwuYmFuZERhdGEubmFtZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIj7QntC/0LjRgdCw0L3QuNC1INCz0YDRg9C/0L/RizwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cImNyZWF0ZS1iYW5kLWRlc2NyaXB0aW9uXCIgbmFtZT1cImNyZWF0ZS1iYW5kLWRlc2NyaXB0aW9uXCIgbmctbW9kZWw9XCIkY3RybC5iYW5kRGF0YS5kZXNjcmlwdGlvblwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+0KHQvtGF0YDQsNC90LjRgtGMPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInJlc2V0XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBuZy1jbGljaz1cIiRjdHJsLmZvcm1DYW5jZWwoKVwiPtCe0YLQvNC10L3QsDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5yZWdpc3RyYXRpb25fZGF0ZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5tZW1iZXJzfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLmNyZWF0b3J9fTwvcD5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYmFuZEluZm8nLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGJhbmRJbmZvQ3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgYmFuZEluZm9DdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJ2JhbmRFbmRwb2ludCcsXHJcbiAgICAgICAgJyRyb3V0ZVBhcmFtcycsXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnYWN0aW9ucyddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGJhbmRJbmZvQ3RybChiYW5kRW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvdXRlUGFyYW1zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cclxuICAgICAgICBiYW5kRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRCYW5kKHtpZDogdm0uaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICB2bS5iYW5kRGF0YSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZtLmJhbmRFZGl0ID0gYmFuZEVkaXQ7XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYmFuZEVkaXQoKSB7XHJcbiAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9iYW5kRWRpdC8nICsgdm0uaWQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRlbnRfX2JhbmRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJoZXJvLWltYWdlXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2lkZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaWRlLWxlZnRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJhbmRfX2xlZnQtYm94XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmFuZF9fcGhvdG9cIj48aW1nIHNyYz1cIi4uL2Fzc2V0cy9hbnRvbi5wbmdcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiYW5kX19zdWJzY3JpYmVcIj48YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+0J/QvtC00L/QuNGB0LDQvTwvYnV0dG9uPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJhbmRfX2NvdW50ZXJzXCI+OTk5OTwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiYW5kX19sZWZ0LWJveFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxlZnQtYm94X19oZWFkZXJcIj7QodC+0YHRgtC+0LjRgiDQsiDQs9GA0YPQv9C/0LDRhSAyPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdC1ib3hfX2dyb3Vwc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJncm91cHNfX2dyb3VwXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNpZGUtY2VudGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1cHBlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVwcGVyX19uYW1lXCI+0JDQvdGC0L7QvSDQmtC+0YDQtdC70Y/QutC+0LI8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1cHBlcl9fYnV0dG9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj7QodC+0L7QsdGJ0LXQvdC40LU8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+0J/RgNC40LPQu9Cw0YHQuNGC0Yw8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IG5nLWhpZGU9XCIkY3RybC5iYW5kRGF0YVwiPkxvYWRpbmcuLi48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBuZy1zaG93PVwiJGN0cmwuYmFuZERhdGFcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDM+e3skY3RybC5iYW5kRGF0YS5uYW1lfX08L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLmRlc2NyaXB0aW9ufX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEuZGF0ZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLnBsYWNlfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEuY3JlYXRvcn19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBuZy1jbGljaz1cIiRjdHJsLmJhbmRFZGl0KClcIj7QoNC10LTQsNC60YLQuNGA0L7QstCw0YLRjDwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYmFuZHNMaXN0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBiYW5kc0xpc3RDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBjb25zdCBiYW5kTGlzdENvbmZpZyA9IHtcclxuICAgICAgICBzb3J0aW5nOiBbXHJcbiAgICAgICAgICAgIHsgaWQ6IDAsIG5hbWU6ICfQv9C+INC/0L7Qv9GD0LvRj9GA0L3QvtGB0YLQuCcgfSxcclxuICAgICAgICAgICAgeyBpZDogMSwgbmFtZTogJ9C/0L4g0YbQtdC90LUnIH0sXHJcbiAgICAgICAgICAgIHsgaWQ6IDIsIG5hbWU6ICfQv9C+INGA0LXQudGC0LjQvdCz0YMnIH0sXHJcbiAgICAgICAgICAgIHsgaWQ6IDMsIG5hbWU6ICfQv9C+INC90L7QstC40LfQvdC1JyB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICB2aWV3aW5nOiBbXHJcbiAgICAgICAgICAgIHsgaWQ6IDAsIG5hbWU6ICfRgtCw0LHQu9C40YbQsCcgfSxcclxuICAgICAgICAgICAgeyBpZDogMSwgbmFtZTogJ9Cx0LvQvtC60LgnIH0sXHJcbiAgICAgICAgICAgIHsgaWQ6IDIsIG5hbWU6ICfQutCw0YDRgtC+0YfQutC4JyB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBkZWZhdWx0U3RhdGU6IHtcclxuICAgICAgICAgICAgc29ydGluZzogMCxcclxuICAgICAgICAgICAgdmlld2luZzogMCxcclxuICAgICAgICAgICAgZmlsdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2g6ICcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbjxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XHJcbiAgICAgICAgICAgIDxoMz7QkNGA0YLQuNGB0YLRiyDQuCDQs9GA0YPQv9C/0Ys8L2gzPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmwtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJibC1zb3J0aW5nXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImJsLXNvcnRpbmctbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIG5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwuYmFuZExpc3RDb25maWcuc29ydGluZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xhc3M9XCJ7J2FjdGl2ZSc6aXRlbS5pZD09PSRjdHJsLmNvbmZpZy5zb3J0aW5nfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xpY2s9XCIkY3RybC5zZXRCYW5kTGlzdFNvcnRpbmcoaXRlbS5pZClcIj57e2l0ZW0ubmFtZX19PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmwtdmlld2luZ1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJibC12aWV3aW5nLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLmJhbmRMaXN0Q29uZmlnLnZpZXdpbmdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsYXNzPVwieydhY3RpdmUnOml0ZW0uaWQ9PT0kY3RybC5jb25maWcudmlld2luZ31cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsaWNrPVwiJGN0cmwuc2V0QmFuZExpc3RWaWV3aW5nKGl0ZW0uaWQpXCI+e3tpdGVtLm5hbWV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgPGRpdiBuZy1pZj1cIiRjdHJsLmNvbmZpZy52aWV3aW5nPT09MFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+0J3QsNC30LLQsNC90LjQtTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPtCe0L/QuNGB0LDQvdC40LU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD7QkNCy0YLQvtGAPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+0JTQsNGC0LAg0YHQvtC30LTQsNC90LjRjzwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5iYW5kcyB0cmFjayBieSBpdGVtLmlkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxhIGhyZWY9XCIjL2JhbmQve3tpdGVtLmlkfX1cIj57e2l0ZW0ubmFtZX19PC9hPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7aXRlbS5kZXNjcmlwdGlvbn19PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3tpdGVtLmNyZWF0b3J9fTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7aXRlbS5yZWdpc3RyYXRpb25fZGF0ZX19PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmwtY2xvY2tzXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgbmctaWY9XCIkY3RybC5jb25maWcudmlld2luZz09PTFcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmwtY2xvY2tzLWl0ZW1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLmJhbmRzIHRyYWNrIGJ5IGl0ZW0uaWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPjxhIGhyZWY9XCIjL2JhbmQve3tpdGVtLmlkfX1cIj57e2l0ZW0ubmFtZX19PC9hPjwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt7aXRlbS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5yZWdpc3Rlcjoge3tpdGVtLnJlZ2lzdHJhdGlvbl9kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPm1lbWJlcnM6IHt7aXRlbS5tZW1iZXJzfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPmNyZWF0b3I6IHt7aXRlbS5jcmVhdG9yfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjL2JhbmRFZGl0L3t7aXRlbS5pZH19XCI+0KDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Yw8L2E+PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJibC1jYXJkc1wiIFxyXG4gICAgICAgICAgICAgICAgICAgIG5nLWlmPVwiJGN0cmwuY29uZmlnLnZpZXdpbmc9PT0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJsLWNhcmRzLWl0ZW1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLmJhbmRzIHRyYWNrIGJ5IGl0ZW0uaWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPjxhIGhyZWY9XCIjL2JhbmQve3tpdGVtLmlkfX1cIj57e2l0ZW0ubmFtZX19PC9hPjwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt7aXRlbS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5yZWdpc3Rlcjoge3tpdGVtLnJlZ2lzdHJhdGlvbl9kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPm1lbWJlcnM6IHt7aXRlbS5tZW1iZXJzfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPmNyZWF0b3I6IHt7aXRlbS5jcmVhdG9yfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjL2JhbmRFZGl0L3t7aXRlbS5pZH19XCI+0KDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Yw8L2E+PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG4gICAgYmFuZHNMaXN0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnLFxyXG4gICAgICAgICdtZW1vaXplJyxcclxuICAgICAgICAnYmFuZHNFbmRwb2ludCdcclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gYmFuZHNMaXN0Q3RybChcclxuICAgICAgICAkbmdSZWR1eCxcclxuICAgICAgICBhY3Rpb25zLFxyXG4gICAgICAgIG1lbW9pemUsXHJcbiAgICAgICAgYmFuZHNFbmRwb2ludCkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uYmFuZExpc3RDb25maWcgPSBiYW5kTGlzdENvbmZpZztcclxuICAgICAgICB0aGlzLiRvbkluaXQgPSAkb25Jbml0O1xyXG4gICAgICAgIHRoaXMuJG9uRGVzdHJveSA9ICRvbkRlc3Ryb3k7XHJcblxyXG4gICAgICAgIHZtLmdldEJhbmRzID0gbWVtb2l6ZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgYmFuZHNFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEJhbmRzKHt9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0uYmFuZHMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IHVuY29ubmVjdCA9ICRuZ1JlZHV4LmNvbm5lY3QobWFwU3RhdGUsIG1hcERpc3BhdGNoKCkpKHZtKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uSW5pdCgpIHtcclxuICAgICAgICAgICAgdm0uZ2V0QmFuZHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcFN0YXRlKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIGxldCBjb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBiYW5kTGlzdENvbmZpZy5kZWZhdWx0U3RhdGUsIHN0YXRlLmJhbmRMaXN0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcERpc3BhdGNoKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2V0QmFuZExpc3RTb3J0aW5nOiBhY3Rpb25zLnNldEJhbmRMaXN0U29ydGluZyxcclxuICAgICAgICAgICAgICAgIHNldEJhbmRMaXN0Vmlld2luZzogYWN0aW9ucy5zZXRCYW5kTGlzdFZpZXdpbmdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uRGVzdHJveSgpIHtcclxuICAgICAgICAgICAgdW5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnY29udGVudCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogY29udGVudENvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGNvbnRlbnRDb250cm9sbGVyLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnbWVtb2l6ZScsXHJcbiAgICAgICAgJyRsb2NhdGlvbiddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnRlbnRDb250cm9sbGVyKCRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtb2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbikge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TG9jYXRpb24gPSBtZW1vaXplKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2V0SGFzaFNlYXJjaCA9IG1lbW9pemUoZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJG5nUmVkdXguc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHN0YXRlID0gJG5nUmVkdXguZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRMb2NhdGlvbihzdGF0ZS5sb2NhdGlvbi5wYXRoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRIYXNoU2VhcmNoKHN0YXRlLmxvY2F0aW9uLmhhc2hTZWFyY2gpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvcC1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9wLW1lbnVfX2hvbGRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0yXCI+PGEgaHJlZj1cIiMvXCI+PGltZyBzcmM9XCJjc3MvaW1nL2xvZ28yLnBuZ1wiIGFsdD1cIlJvY2twYXJhZGVcIj48L2E+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5hdmlnYXRpb24+PC9uYXZpZ2F0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YXV0aC13aWRnZXQ+PC9hdXRoLXdpZGdldD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50IGhhcy10b3AtbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBuZy12aWV3PVwiXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnZXZlbnRDcmVhdGUnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGV2ZW50Q3JlYXRlQ3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgZXZlbnRDcmVhdGVDdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJ2V2ZW50RW5kcG9pbnQnLFxyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBldmVudENyZWF0ZUN0cmwoZXZlbnRFbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5mb3JtRGF0YSA9IHtcclxuICAgICAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgICAgIGRhdGU6ICcnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXHJcbiAgICAgICAgICAgIHBsYWNlOiAnJyxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZtLmZvcm1TdWJtaXQgPSBmb3JtU3VibWl0SGFuZGxlcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtU3VibWl0SGFuZGxlcihlKSB7XHJcbiAgICAgICAgICAgIGV2ZW50RW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5jcmVhdGVFdmVudCh2bS5mb3JtRGF0YSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmxvY2F0aW9uKCcvYmFuZHMnKSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cclxuICAgICAgICAgICAgPGgzPtCh0L7Qt9C00LDQvdC40LUg0LzQtdGA0L7Qv9GA0LjRj9GC0LjRjzwvaDM+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxmb3JtIG5hbWU9XCJmb3JtLWNyZWF0ZS1iYW5kXCIgbmctc3VibWl0PVwiJGN0cmwuZm9ybVN1Ym1pdCgpXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNyZWF0ZS1ldmVudC1uYW1lXCI+0J3QsNC30LLQsNC90LjQtSDQvNC10YDQvtC/0YDQuNGP0YLQuNGPPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJjcmVhdGUtZXZlbnQtbmFtZVwiIG5nLW1vZGVsPVwiJGN0cmwuZm9ybURhdGEubmFtZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3JlYXRlLWV2ZW50LWRhdGVcIj7QlNCw0YLQsCDQv9GA0L7QstC10LTQtdC90LjRjyDQvNC10YDQvtC/0YDQuNGP0YLQuNGPPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJjcmVhdGUtZXZlbnQtZGF0ZVwiIG5nLW1vZGVsPVwiJGN0cmwuZm9ybURhdGEuZGF0ZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3JlYXRlLWV2ZW50LXBsYWNlXCI+0JzQtdGB0YLQviDQv9GA0L7QstC10LTQtdC90LjRjyDQvNC10YDQvtC/0YDQuNGP0YLQuNGPPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJjcmVhdGUtZXZlbnQtcGxhY2VcIiBuZy1tb2RlbD1cIiRjdHJsLmZvcm1EYXRhLnBsYWNlXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjcmVhdGUtZXZlbnQtZGVzY3JpcHRpb25cIj7QntC/0LjRgdCw0L3QuNC1INC80LXRgNC+0L/RgNC40Y/RgtC40Y88L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgbmFtZT1cImNyZWF0ZS1ldmVudC1kZXNjcmlwdGlvblwiIG5nLW1vZGVsPVwiJGN0cmwuZm9ybURhdGEuZGVzY3JpcHRpb25cIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPtCh0L7Qt9C00LDRgtGMPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2V2ZW50SW5mbycsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZXZlbnRJbmZvQ3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgZXZlbnRJbmZvQ3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICdldmVudEVuZHBvaW50JyxcclxuICAgICAgICAnJHJvdXRlUGFyYW1zJ107XHJcblxyXG4gICAgZnVuY3Rpb24gZXZlbnRJbmZvQ3RybChldmVudEVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAkcm91dGVQYXJhbXMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cclxuICAgICAgICBldmVudEVuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0RXZlbnQoe2lkOiB2bS5pZH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICB2bS5ldmVudERhdGEgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgPGgzPnt7JGN0cmwuZXZlbnREYXRhLm5hbWV9fTwvaDM+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmV2ZW50RGF0YS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5ldmVudERhdGEuZGF0ZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5ldmVudERhdGEucGxhY2V9fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuZXZlbnREYXRhLmNyZWF0b3J9fTwvcD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnZXZlbnRzTGlzdCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZXZlbnRzTGlzdEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGV2ZW50c0xpc3RDdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnbWVtb2l6ZScsXHJcbiAgICAgICAgJ2V2ZW50c0VuZHBvaW50J1xyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiBldmVudHNMaXN0Q3RybCgkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9pemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBldmVudHNFbmRwb2ludCkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuJG9uRGVzdHJveSA9ICRvbkRlc3Ryb3k7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0RXZlbnRzID0gbWVtb2l6ZShmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudHNFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEV2ZW50cyh7c2VhcmNoU3RyaW5nOiB2YWx1ZX0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmV2ZW50cyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50c0VuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0RXZlbnRzQWxsKHt9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ldmVudHMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIHVuY29ubmVjdCA9ICRuZ1JlZHV4LnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzdGF0ZSA9ICRuZ1JlZHV4LmdldFN0YXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0RXZlbnRzKHN0YXRlLnNlYXJjaC5xdWVyeSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0RXZlbnRzKCk7XHJcblxyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uICRvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgICAgIHVuY29ubmVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiIG5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwuZXZlbnRzXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgIDxoMz48YSBocmVmPVwiIy9ldmVudC97e2l0ZW0uaWR9fVwiPnt7aXRlbS5uYW1lfX08L2E+PC9oMz5cclxuICAgICAgICAgICAgICAgIDxwPnt7aXRlbS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3tpdGVtLmRhdGV9fTwvcD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ25hdmlnYXRpb24nLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IG5hdmlnYXRpb25DdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBuYXZpZ2F0aW9uQ3RybC4kaW5qZWN0ID0gWydhdXRoU2VydmljZScsICckcm9vdFNjb3BlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gbmF2aWdhdGlvbkN0cmwoYXV0aFNlcnZpY2UsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlzQXV0aCA9IGF1dGhTZXJ2aWNlLmlzQXV0aCgpO1xyXG5cclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignYXV0aENoYW5nZWQnLCBhdXRoQ2hhbmdlZCk7XHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhdXRoQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdm0uaXNBdXRoID0gYXV0aFNlcnZpY2UuaXNBdXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJ0b3AtbmF2XCI+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBuZy1pZj1cIiRjdHJsLmlzQXV0aFwiPjxhIGhyZWY9XCIjL2hvbWVcIj7QnNC+0Y8g0YHRgtGA0LDQvdC40YbQsDwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9iYW5kc1wiPtCT0YDRg9C/0L/RizwvYT48L2xpPiBcclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvZXZlbnRzXCI+0JzQtdGA0L7Qv9GA0LjRj9GC0LjRjzwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNlYXJjaC13aWRnZXQ+PC9zZWFyY2gtd2lkZ2V0PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgncHJvZmlsZScsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogcHJvZmlsZUN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHByb2ZpbGVDb25maWcgPSB7XHJcbiAgICAgICAgdmlld2luZzogW1xyXG4gICAgICAgICAgICB7aWQ6IDAsIG5hbWU6ICfQnNC+0Lkg0L/RgNC+0YTQuNC70YwnfSxcclxuICAgICAgICAgICAge2lkOiAxLCBuYW1lOiAn0JzQvtC4INCz0YDRg9C/0L/Riyd9LFxyXG4gICAgICAgICAgICB7aWQ6IDIsIG5hbWU6ICfQnNC+0Lgg0LzQtdGA0L7Qv9GA0LjRj9GC0LjRjyd9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBkZWZhdWx0U3RhdGU6IHtcclxuICAgICAgICAgICAgdmlld2luZzogMFxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cclxuICAgICAgICAgICAgPGgzPnt7JGN0cmwudXNlci5uYW1lfX08L2gzPlxyXG4gICAgICAgICAgICA8ZGl2Pnt7JGN0cmwudXNlci5kZXNjcmlwdGlvbn19PC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTkgY29sLXhzLW9mZnNldC0zXCI+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwLXZpZXdpbmdcIj5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cInAtdmlld2luZy1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIG5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwucHJvZmlsZUNvbmZpZy52aWV3aW5nXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xhc3M9XCJ7J2FjdGl2ZSc6aXRlbS5pZD09PSRjdHJsLmNvbmZpZy52aWV3aW5nfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsaWNrPVwiJGN0cmwuc2V0UHJvZmlsZVZpZXdpbmcoaXRlbS5pZClcIj57e2l0ZW0ubmFtZX19PC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93IHAtY29udGVudFwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtM1wiPlxyXG4gICAgICAgICAgICA8cD7QodC+0LfQtNCw0L3QviDQs9GA0YPQv9C/OiB7eyRjdHJsLnVzZXIuY3JlYXRlZF9iYW5kcy5sZW5ndGh9fTwvcD5cclxuICAgICAgICAgICAgPHA+0KHQvtC30LTQsNC90L4g0LzQtdGA0L7Qv9GA0LjRj9GC0LjQuToge3skY3RybC51c2VyLmV2ZW50cy5sZW5ndGh9fTwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTlcIj5cclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgbmctaWY9XCIkY3RybC5jb25maWcudmlld2luZz09PTBcIj5cclxuICAgICAgICAgICAgICAgICAgICDQl9C00LXRgdGMINC+0YLQvtCx0YDQsNC20LDQtdGC0YHRjyDQv9GD0LHQu9C40YfQvdCw0Y8g0LjQvdGE0L7RgNC80LDRhtC40Y8sINC60L7RgtC+0YDRg9GOINCy0LjQtNGP0YIg0L/QvtC70YzQt9C+0LLQsNGC0LXQu9C4LCDQt9Cw0YjQtdC00YjQuNC1INC90LAg0LLQsNGIINC/0YDQvtGE0LjQu9GMLlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IG5nLWlmPVwiJGN0cmwuY29uZmlnLnZpZXdpbmc9PT0xXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHA+0KHQvtC30LTQsNCy0LDRgtGMINCz0YDRg9C/0L/RiyDQvdC10L7QsdGF0L7QtNC40LzQvi4uLjwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9iYW5kQ3JlYXRlXCI+0KHQvtC30LTQsNGC0Yw8L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgPGhyPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+0J3QsNC30LLQsNC90LjQtTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPtCe0L/QuNGB0LDQvdC40LU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD7QkNCy0YLQvtGAPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+0JTQsNGC0LAg0YHQvtC30LTQsNC90LjRjzwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC51c2VyLmNyZWF0ZWRfYmFuZHMgdHJhY2sgYnkgaXRlbS5pZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48YSBocmVmPVwiIy9iYW5kL3t7aXRlbS5pZH19XCI+e3tpdGVtLm5hbWV9fTwvYT48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2l0ZW0uZGVzY3JpcHRpb259fTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7aXRlbS5jcmVhdG9yfX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2l0ZW0ucmVnaXN0cmF0aW9uX2RhdGV9fTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgbmctaWY9XCIkY3RybC5jb25maWcudmlld2luZz09PTJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8cD7QodC+0LfQtNCw0LLQsNGC0Ywg0LzQtdGA0L7Qv9GA0LjRj9GC0LjRjyDQvdC10L7QsdGF0L7QtNC40LzQvi4uLjwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9ldmVudENyZWF0ZVwiPtCh0L7Qt9C00LDRgtGMPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDxocj5cclxuICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPtCd0LDQt9Cy0LDQvdC40LU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD7QntC/0LjRgdCw0L3QuNC1PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+0JDQstGC0L7RgDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPtCU0LDRgtCwINGB0L7Qt9C00LDQvdC40Y88L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIG5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwudXNlci5ldmVudHMgdHJhY2sgYnkgaXRlbS5pZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48YSBocmVmPVwiIy9iYW5kL3t7aXRlbS5pZH19XCI+e3tpdGVtLm5hbWV9fTwvYT48L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2l0ZW0uZGVzY3JpcHRpb259fTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7aXRlbS5jcmVhdG9yfX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2l0ZW0ucmVnaXN0cmF0aW9uX2RhdGV9fTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbiAgICBgO1xyXG4gICAgfVxyXG5cclxuICAgIHByb2ZpbGVDdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnYWN0aW9ucycsXHJcbiAgICAgICAgJ21lbW9pemUnLFxyXG4gICAgICAgICdiYW5kc0VuZHBvaW50J1xyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiBwcm9maWxlQ3RybCgkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBtZW1vaXplLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgYmFuZHNFbmRwb2ludCkge1xyXG5cclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnByb2ZpbGVDb25maWcgPSBwcm9maWxlQ29uZmlnO1xyXG4gICAgICAgIHRoaXMuJG9uSW5pdCA9ICRvbkluaXQ7XHJcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gJG9uRGVzdHJveTtcclxuXHJcbiAgICAgICAgbGV0IHVuY29ubmVjdCA9ICRuZ1JlZHV4LmNvbm5lY3QobWFwU3RhdGUsIG1hcERpc3BhdGNoKCkpKHZtKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uSW5pdCgpIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcFN0YXRlKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIGxldCBjb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBwcm9maWxlQ29uZmlnLmRlZmF1bHRTdGF0ZSwgc3RhdGUucHJvZmlsZSk7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB1c2VyOiBzdGF0ZS51c2VyLFxyXG4gICAgICAgICAgICAgICAgY29uZmlnOiBjb25maWdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWFwRGlzcGF0Y2goKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZXRQcm9maWxlVmlld2luZzogYWN0aW9ucy5zZXRQcm9maWxlVmlld2luZ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiAkb25EZXN0cm95KCkge1xyXG4gICAgICAgICAgICB1bmNvbm5lY3QoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdzZWFyY2hNb2R1bGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3NlYXJjaFdpZGdldCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogc2VhcmNoV2lkZ2V0Q3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgc2VhcmNoV2lkZ2V0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNlYXJjaFdpZGdldEN0cmwoJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgdW5jb25uZWN0ID0gJG5nUmVkdXguY29ubmVjdChtYXBTdGF0ZVRvVGhpcywgYWN0aW9ucykodm0pO1xyXG5cclxuICAgICAgICB0aGlzLnF1ZXJ5ID0gJyc7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hLZXlQcmVzcyA9IHNlYXJjaEtleVByZXNzO1xyXG4gICAgICAgIHRoaXMuc2VhcmNoS2V5VXAgPSBzZWFyY2hLZXlVcDtcclxuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSAkb25EZXN0cm95O1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcFN0YXRlVG9UaGlzKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZTogc3RhdGVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoS2V5UHJlc3MoZSkge1xyXG4gICAgICAgICAgICBpZiAoZS5jaGFyQ29kZSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9zZWFyY2gnKSk7XHJcbiAgICAgICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmhhc2hTZWFyY2goJ3E9JyArIHRoaXMucXVlcnkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoS2V5VXAoZSkge1xyXG4gICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmNoYW5nZVNlYXJjaFN0cmluZyh0aGlzLnF1ZXJ5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiAkb25EZXN0cm95KCkge1xyXG4gICAgICAgICAgICB1bmNvbm5lY3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZWFyY2gtd2lkZ2V0XCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInNlYXJjaFwiIFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgbmcta2V5cHJlc3M9XCIkY3RybC5zZWFyY2hLZXlQcmVzcygkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICBuZy1rZXl1cD1cIiRjdHJsLnNlYXJjaEtleVVwKCRldmVudClcIlxyXG4gICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVwiJGN0cmwucXVlcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi0J/QvtC40YHQulwiPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdhdXRoRW5kcG9pbnQnLCBhdXRoRW5kcG9pbnQpO1xyXG5cclxuYXV0aEVuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJGNvb2tpZXMnXTtcclxuXHJcbmZ1bmN0aW9uIGF1dGhFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJGNvb2tpZXMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG4gICAgdmFyIHRva2VuID0gJGNvb2tpZXMuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICB2YXIgc3RhciA9ICcqJztcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvOmVudGl0eS86dHlwZScsIHF1ZXJ5UGFyYW0sIHtcclxuICAgICAgICAgICAgZ2V0Q3VycmVudFVzZXI6IHtcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogJ3VzZXInXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxvZ2luOiB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6ICdsb2dpbicsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZrJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2JhbmRFbmRwb2ludCcsIGJhbmRFbmRwb2ludCk7XHJcblxyXG5iYW5kRW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCddO1xyXG5cclxuZnVuY3Rpb24gYmFuZEVuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRSZXNvdXJjZTogZ2V0UmVzb3VyY2VcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmVzb3VyY2UocGFyYW1zKSB7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZShhcGlVcmwgKyAnL2JhbmQvOmlkLzplbnRpdHknLCBwYXJhbXMsIHtcclxuICAgICAgICAgICAgZ2V0QmFuZDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlZGl0QmFuZDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjcmVhdGVCYW5kOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZGRNZW1iZXJUb0JhbmQ6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6ICdtZW1iZXJzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScpXHJcbiAgICAuc2VydmljZSgnYmFuZHNFbmRwb2ludCcsIGJhbmRzRW5kcG9pbnQpO1xyXG5cclxuYmFuZHNFbmRwb2ludC4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnYXBpVXJsJywgJyRxJ107XHJcblxyXG5mdW5jdGlvbiBiYW5kc0VuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsLCAkcSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBxdWVyeVBhcmFtID0ge307XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRSZXNvdXJjZTogZ2V0UmVzb3VyY2VcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmVzb3VyY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZShhcGlVcmwgKyAnL2JhbmRzLzpsaW1pdC86b2Zmc2V0JywgcXVlcnlQYXJhbSwge1xyXG4gICAgICAgICAgICBnZXRCYW5kczoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScpXHJcbiAgICAuc2VydmljZSgnZXZlbnRFbmRwb2ludCcsIGV2ZW50RW5kcG9pbnQpO1xyXG5cclxuZXZlbnRFbmRwb2ludC4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnYXBpVXJsJ107XHJcblxyXG5mdW5jdGlvbiBldmVudEVuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHF1ZXJ5UGFyYW0gPSB7fTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvZXZlbnQvOmlkLzplbnRpdHknLCBxdWVyeVBhcmFtLCB7XHJcbiAgICAgICAgICAgIGdldEV2ZW50OiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVkaXRFdmVudDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjcmVhdGVFdmVudDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdldmVudHNFbmRwb2ludCcsIGV2ZW50c0VuZHBvaW50KTtcclxuXHJcbmV2ZW50c0VuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJHEnXTtcclxuXHJcbmZ1bmN0aW9uIGV2ZW50c0VuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsLCAkcSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBxdWVyeVBhcmFtID0ge307XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRSZXNvdXJjZTogZ2V0UmVzb3VyY2VcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmVzb3VyY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZShhcGlVcmwgKyAnL2V2ZW50cy86bGlrZS86c2VhcmNoU3RyaW5nLzpsaW1pdC86b2Zmc2V0JywgcXVlcnlQYXJhbSwge1xyXG4gICAgICAgICAgICBnZXRFdmVudHNBbGw6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpa2U6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoU3RyaW5nOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRFdmVudHM6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpa2U6ICdsaWtlJyxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXV0aE1vZHVsZScpXHJcbiAgICAuc2VydmljZSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZSk7XHJcblxyXG5hdXRoU2VydmljZS4kaW5qZWN0ID0gWydhdXRoRW5kcG9pbnQnLFxyXG4gICAgJyRxJyxcclxuICAgICckY29va2llcycsXHJcbiAgICAnJGxvY2F0aW9uJ107XHJcblxyXG5mdW5jdGlvbiBhdXRoU2VydmljZShhdXRoRW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICRxLFxyXG4gICAgICAgICAgICAgICAgICAgICAkY29va2llcyxcclxuICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uKSB7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRVc2VyRGVmZXI7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpc0F1dGg6IGlzQXV0aCxcclxuICAgICAgICBsb2dpbjogbG9naW4sXHJcbiAgICAgICAgbG9nb3V0OiBsb2dvdXQsXHJcbiAgICAgICAgZ2V0Q3VycmVudFVzZXI6IGdldEN1cnJlbnRVc2VyLFxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBpc0F1dGgoKSB7XHJcbiAgICAgICAgcmV0dXJuICEhJGNvb2tpZXMuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9naW4oKSB7XHJcbiAgICAgICAgYXV0aEVuZHBvaW50LmdldFJlc291cmNlKCkubG9naW4oe30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlOicsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2U6JywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgICAgICAgJGNvb2tpZXMucmVtb3ZlKCdBVVRILVRPS0VOJyk7XHJcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8jJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXIoKSB7XHJcbiAgICAgICAgaWYgKCFjdXJyZW50VXNlckRlZmVyKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyRGVmZXIgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICBhdXRoRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRDdXJyZW50VXNlcih7fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXJEZWZlci5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyRGVmZXIucmVqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRVc2VyRGVmZXIucHJvbWlzZTtcclxuICAgIH1cclxufVxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2F1dGhNb2R1bGUnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdhdXRoTG9naW5Qcm9jZXNzQ3RybCcsIGF1dGhMb2dpblByb2Nlc3NDdHJsKTtcclxuXHJcbiAgICBhdXRoTG9naW5Qcm9jZXNzQ3RybC4kaW5qZWN0ID0gWyckcm91dGVQYXJhbXMnLCAnJGxvY2F0aW9uJywgJyRjb29raWVzJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoTG9naW5Qcm9jZXNzQ3RybCgkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgJGNvb2tpZXMsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIGlmICgkcm91dGVQYXJhbXMuaGFzT3duUHJvcGVydHkoJ3Rva2VuJykpIHtcclxuICAgICAgICAgICAgdmFyIGV4cGlyZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBleHBpcmVEYXRlLnNldERhdGUoZXhwaXJlRGF0ZS5nZXREYXRlKCkgKyAxNCk7XHJcbiAgICAgICAgICAgICRjb29raWVzLnB1dCgnQVVUSC1UT0tFTicsICRyb3V0ZVBhcmFtcy50b2tlbiwgeydleHBpcmVzJzogZXhwaXJlRGF0ZX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdhdXRoQ2hhbmdlZCcpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLyMvaG9tZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB2bTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2F1dGhNb2R1bGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2F1dGhXaWRnZXQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGF1dGhXaWRnZXRDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYXV0aC13aWRnZXRfX2J0bi1ob2xkZXJcIiBcclxuICAgICAgICAgICAgICAgICBuZy1pZj1cIiEkY3RybC5pc0F1dGhcIj5cclxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbVwiIGhyZWY9XCJ7eyRjdHJsLmxvZ2luVXJsfX1cIj7QktC+0LnRgtC4PC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBuZy1pZj1cIiRjdHJsLmlzQXV0aFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdj5IaSwge3skY3RybC51c2VyLmxvZ2lufX0hPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YSBuZy1jbGljaz1cIiRjdHJsLmxvZ291dCgpXCI+TG9nb3V0PC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbiAgICBhdXRoV2lkZ2V0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICdhdXRoU2VydmljZScsXHJcbiAgICAgICAgJ2FwaVVybCcsXHJcbiAgICAgICAgJyRyb290U2NvcGUnLFxyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhXaWRnZXRDdHJsKGF1dGhTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpVXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucykge1xyXG5cclxuICAgICAgICB0aGlzLiRvbkluaXQgPSAkb25Jbml0O1xyXG4gICAgICAgIHRoaXMuJG9uRGVzdHJveSA9ICRvbkRlc3Ryb3k7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICBsZXQgdW5jb25uZWN0ID0gJG5nUmVkdXguY29ubmVjdChtYXBTdGF0ZSwgbWFwRGlzcGF0Y2goKSkodm0pO1xyXG5cclxuICAgICAgICB2bS5sb2dpblVybCA9IGFwaVVybCArICcvbG9naW4vdmsnO1xyXG4gICAgICAgIHZtLmlzQXV0aCA9IGF1dGhTZXJ2aWNlLmlzQXV0aCgpO1xyXG4gICAgICAgIHZtLmxvZ2luID0gYXV0aFNlcnZpY2UubG9naW47XHJcbiAgICAgICAgdm0ubG9nb3V0ID0gbG9nb3V0O1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdhdXRoQ2hhbmdlZCcsIGF1dGhDaGFuZ2VkKTtcclxuXHJcbiAgICAgICAgaWYgKHZtLmlzQXV0aCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5nZXRDdXJyZW50VXNlcigpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS51c2VyID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIHZtLnNldEN1cnJlbnRVc2VyKHtcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2JhbmRzOiByZXNwb25zZS5kYXRhLmNyZWF0ZWRfYmFuZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHJlc3BvbnNlLmRhdGEuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiByZXNwb25zZS5kYXRhLmV2ZW50cyxcclxuICAgICAgICAgICAgICAgICAgICBsb2dpbjogcmVzcG9uc2UuZGF0YS5sb2dpbixcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiByZXNwb25zZS5kYXRhLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uX2RhdGU6IHJlc3BvbnNlLmRhdGEucmVnaXN0cmF0aW9uX2RhdGVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uSW5pdCgpIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uICRvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgICAgIHVuY29ubmVjdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWFwU3RhdGUoc3RhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHVzZXI6IHN0YXRlLnVzZXJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWFwRGlzcGF0Y2goKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZXRDdXJyZW50VXNlcjogYWN0aW9ucy5zZXRDdXJyZW50VXNlcixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5sb2dvdXQoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnYXV0aENoYW5nZWQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSgpKTtcclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
