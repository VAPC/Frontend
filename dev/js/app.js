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
(function() {
    angular.module('searchModule', []);
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
                $ngRedux.dispatch(actions.location('/home'));
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
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="item in $ctrl.user.created_bands track by item.id">
                                <td><a href="#/band/{{item.id}}">{{item.name}}</a></td>
                                <td>{{item.description}}</td>
                                <td>{{item.creator}}</td>
                                <td>{{item.registration_date}}</td>
                                <td><a href="#/bandEdit/{{item.id}}">Редактировать</a></td>
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
                                <th>Место</th>
                                <th>Описание</th>
                                <th>Автор</th>
                                <th>Дата мероприятия</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr ng-repeat="item in $ctrl.user.events track by item.id">
                                <td><a href="#/band/{{item.id}}">{{item.name}}</a></td>
                                <td>{{item.place}}</td>
                                <td>{{item.description}}</td>
                                <td>{{item.creator}}</td>
                                <td>{{item.date}}</td>
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImVuZHBvaW50cy9lbmRwb2ludHMubWRsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGgubWRsLmpzIiwiY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoLm1kbC5qcyIsInJvdXRlci5qcyIsImFwcC9hY3Rpb25zLmpzIiwiYXBwL21lbW9pemUuanMiLCJhcHAvcmVkdWNlcnMuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aC5zcnYuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aExvZ2luUHJvY2Vzcy5jdHJsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGhXaWRnZXQuY210LmpzIiwiY29tcG9uZW50cy9iYW5kLWNyZWF0ZS9iYW5kLWNyZWF0ZS5jbXQuanMiLCJjb21wb25lbnRzL2JhbmQtZWRpdC9iYW5kLWVkaXQuY210LmpzIiwiY29tcG9uZW50cy9iYW5kLWluZm8vYmFuZC1pbmZvLmNtdC5qcyIsImNvbXBvbmVudHMvYmFuZHMtbGlzdC9iYW5kcy1saXN0LmNtdC5qcyIsImNvbXBvbmVudHMvY29udGVudC9jb250ZW50LmNtdC5qcyIsImNvbXBvbmVudHMvZXZlbnQtY3JlYXRlL2V2ZW50LWNyZWF0ZS5jbXQuanMiLCJjb21wb25lbnRzL2V2ZW50LWluZm8vZXZlbnRzLWluZm8uY210LmpzIiwiY29tcG9uZW50cy9ldmVudHMtbGlzdC9ldmVudHMtbGlzdC5jbXQuanMiLCJjb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jbXQuanMiLCJjb21wb25lbnRzL3NlYXJjaC9zZWFyY2hXaWRnZXQuY210LmpzIiwiZW5kcG9pbnRzL2F1dGgvYXV0aEVuZHBvaW50LmpzIiwiZW5kcG9pbnRzL2JhbmRzL2JhbmRFbmRwb2ludC5qcyIsImVuZHBvaW50cy9iYW5kcy9iYW5kc0VuZHBvaW50LmpzIiwiZW5kcG9pbnRzL2V2ZW50cy9ldmVudEVuZHBvaW50LmpzIiwiZW5kcG9pbnRzL2V2ZW50cy9ldmVudHNFbmRwb2ludC5qcyIsImNvbXBvbmVudHMvcHJvZmlsZS9wcm9maWxlLmNtdC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDL0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHJlZHVjZXJzIGZyb20gJy4vYXBwL3JlZHVjZXJzJ1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnLCBbXHJcbiAgICAgICAgICAgICduZ1JvdXRlJyxcclxuICAgICAgICAgICAgJ25nQ29va2llcycsXHJcbiAgICAgICAgICAgICduZ1Jlc291cmNlJyxcclxuICAgICAgICAgICAgJ25nUmVkdXgnLFxyXG5cclxuICAgICAgICAgICAgJ2VuZHBvaW50c01vZHVsZScsXHJcbiAgICAgICAgICAgICdhdXRoTW9kdWxlJyxcclxuICAgICAgICAgICAgJ3NlYXJjaE1vZHVsZScsXHJcbiAgICAgICAgXSk7XHJcblxyXG59KCkpOyIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnLCBbXSlcclxuICAgIC5mYWN0b3J5KCdhcGlVcmwnLCBhcGlVcmwpO1xyXG5cclxuZnVuY3Rpb24gYXBpVXJsKCkge1xyXG4gICAgdmFyIHVybDtcclxuICAgIHN3aXRjaCAod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKSB7XHJcbiAgICAgICAgY2FzZSAnbG9jYWxob3N0JzpcclxuICAgICAgICAgICAgdXJsID0gJ2h0dHA6Ly9yb2NrcGFyYWRlLmNyZW9yYS5ydS9hcGknO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgJy9hcGknO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHJldHVybiB1cmw7XHJcbn1cclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhdXRoTW9kdWxlJywgW10pXHJcbiAgICAgICAgLy8gLmNvbmZpZyhodHRwSW50ZXJjZXB0b3JDb25maWcpXHJcbiAgICAgICAgLnJ1bihodHRwSW50ZXJjZXB0b3JSdW4pO1xyXG5cclxuICAgIC8vIGh0dHBJbnRlcmNlcHRvckNvbmZpZy4kaW5qZWN0ID0gWyckaHR0cFByb3ZpZGVyJ107XHJcbiAgICAvL1xyXG4gICAgLy8gZnVuY3Rpb24gaHR0cEludGVyY2VwdG9yQ29uZmlnKCRodHRwUHJvdmlkZXIpIHtcclxuICAgIC8vICAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnVzZVhEb21haW4gPSB0cnVlO1xyXG4gICAgLy8gICAgIGRlbGV0ZSAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLVJlcXVlc3RlZC1XaXRoJ107XHJcbiAgICAvLyB9XHJcblxyXG4gICAgaHR0cEludGVyY2VwdG9yUnVuLiRpbmplY3QgPSBbJyRpbmplY3RvciddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGh0dHBJbnRlcmNlcHRvclJ1bigkaW5qZWN0b3IpIHtcclxuICAgICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAgIHZhciBUT0tFTiA9ICRpbmplY3Rvci5nZXQoJyRjb29raWVzJykuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICAgICAgLy8gY29uc29sZS5sb2coJ2NsIFRPS0VOJywgVE9LRU4pO1xyXG4gICAgICAgIHZhciAkaHR0cCA9ICRpbmplY3Rvci5nZXQoJyRodHRwJyk7XHJcbiAgICAgICAgLy8gJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0FVVEgtVE9LRU4nXSA9ICd0ZXN0JztcclxuICAgICAgICBpZiAoVE9LRU4pIHtcclxuICAgICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0FVVEgtVE9LRU4nXSA9IFRPS0VOO1xyXG4gICAgICAgICAgICAvLyAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQWNjZXNzLUNvbnRyb2wtQWxsb3ctSGVhZGVycyddID0gJ0NvbnRlbnQtVHlwZSc7XHJcbiAgICAgICAgICAgIC8vICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBY2Nlc3MtQ29udHJvbC1SZXF1ZXN0LUhlYWRlcnMnXSA9ICdhY2NlcHQsIG9yaWdpbiwgYXV0aG9yaXphdGlvbiwga2V5JztcclxuICAgICAgICAgICAgLy8gJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0FVVEgtVE9LRU4nXSA9ICd0ZXN0JztcclxuICAgICAgICAgICAgLy8gJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5wb3N0WydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnO1xyXG4gICAgICAgICAgICAvLyAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLnB1dFsnQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JztcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQXV0aDogdXNlciBhdXRoZW50aWNhdGlvbiBlcnJvci4gQ29va2llcyBkb2VzblxcJ3QgY29udGFpbiBcIkFVVEgtVE9LRU5cIicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NlYXJjaE1vZHVsZScsIFtdKTtcclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb25maWcocm91dGVyKTtcclxuXHJcbiAgICByb3V0ZXIuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInXTtcclxuXHJcbiAgICBmdW5jdGlvbiByb3V0ZXIoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGFuZGluZy5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9ob21lJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdob21lLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2V2ZW50LzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZXZlbnQuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvZXZlbnRDcmVhdGUnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2V2ZW50Q3JlYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2V2ZW50cycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZXZlbnRzLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2JhbmRzJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdiYW5kcy5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9iYW5kLzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmFuZC5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9iYW5kQ3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdiYW5kQ3JlYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2JhbmRFZGl0LzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmFuZEVkaXQuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvc2VhcmNoPzpibGEnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NlYXJjaC5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9sb2dpbi92ay9jYWxsYmFjaycsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdhdXRoTG9naW5Qcm9jZXNzQ3RybCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJycsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vdGhlcndpc2Uoe1xyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XHJcbiAgICAgICAgLy8gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAvLyAgICByZXF1aXJlQmFzZTogZmFsc2VcclxuICAgICAgICAvL30pO1xyXG4gICAgfTtcclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuc2VydmljZSgnYWN0aW9ucycsIGFjdGlvbnMpO1xyXG5cclxuICAgIGFjdGlvbnMuJGluamVjdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGlvbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2hhbmdlU2VhcmNoU3RyaW5nOiBjaGFuZ2VTZWFyY2hTdHJpbmcsXHJcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcclxuICAgICAgICAgICAgaGFzaFNlYXJjaDogaGFzaFNlYXJjaCxcclxuICAgICAgICAgICAgc2V0Q3VycmVudFVzZXI6IHNldEN1cnJlbnRVc2VyLFxyXG4gICAgICAgICAgICBzZXRCYW5kTGlzdFNvcnRpbmc6IHNldEJhbmRMaXN0U29ydGluZyxcclxuICAgICAgICAgICAgc2V0QmFuZExpc3RWaWV3aW5nOiBzZXRCYW5kTGlzdFZpZXdpbmcsXHJcbiAgICAgICAgICAgIHNldFByb2ZpbGVWaWV3aW5nOiBzZXRQcm9maWxlVmlld2luZyxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VTZWFyY2hTdHJpbmcodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdDSEFOR0VfU0VBUkNIX1NUUklORycsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9jYXRpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdMT0NBVElPTicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gaGFzaFNlYXJjaCh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ0hBU0hfU0VBUkNIJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXRCYW5kTGlzdFNvcnRpbmcoaWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdTRVRfQkFORF9MSVNUX1NPUlRJTkcnLFxyXG4gICAgICAgICAgICAgICAgcGF5bG9hZDogaWRcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2V0QmFuZExpc3RWaWV3aW5nKGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnU0VUX0JBTkRfTElTVF9WSUVXSU5HJyxcclxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IGlkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldFByb2ZpbGVWaWV3aW5nKGlkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnU0VUX1BST0ZJTEVfVklFV0lORycsXHJcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiBpZFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZXRDdXJyZW50VXNlcihwYXlsb2FkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnU0VUX0NVUlJFTlRfVVNFUicsXHJcbiAgICAgICAgICAgICAgICBwYXlsb2FkOiBwYXlsb2FkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBtZW1vaXplKCkge1xyXG4gICAgICAgIHJldHVybiAoZnVuYywgZXF1YWxpdHlDaGVjayA9IGRlZmF1bHRFcXVhbGl0eUNoZWNrKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBsYXN0QXJncyA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBsYXN0UmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdEFyZ3MgIT09IG51bGwgJiZcclxuICAgICAgICAgICAgICAgICAgICBsYXN0QXJncy5sZW5ndGggPT09IGFyZ3MubGVuZ3RoICYmXHJcbiAgICAgICAgICAgICAgICAgICAgYXJncy5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBlcXVhbGl0eUNoZWNrKHZhbHVlLCBsYXN0QXJnc1tpbmRleF0pKVxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0QXJncyA9IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBsYXN0UmVzdWx0ID0gZnVuYyguLi5hcmdzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZWZhdWx0RXF1YWxpdHlDaGVjayhhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIGEgPT09IGJcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmZhY3RvcnkoJ21lbW9pemUnLCBtZW1vaXplKTtcclxuXHJcblxyXG59KCkpO1xyXG5cclxuLy8gZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCBlcXVhbGl0eUNoZWNrID0gZGVmYXVsdEVxdWFsaXR5Q2hlY2spIHtcclxuLy8gICAgIGxldCBsYXN0QXJncyA9IG51bGw7XHJcbi8vICAgICBsZXQgbGFzdFJlc3VsdCA9IG51bGw7XHJcbi8vICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcclxuLy8gICAgICAgICBpZiAoXHJcbi8vICAgICAgICAgICAgIGxhc3RBcmdzICE9PSBudWxsICYmXHJcbi8vICAgICAgICAgICAgIGxhc3RBcmdzLmxlbmd0aCA9PT0gYXJncy5sZW5ndGggJiZcclxuLy8gICAgICAgICAgICAgYXJncy5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBlcXVhbGl0eUNoZWNrKHZhbHVlLCBsYXN0QXJnc1tpbmRleF0pKVxyXG4vLyAgICAgICAgICkge1xyXG4vLyAgICAgICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgbGFzdEFyZ3MgPSBhcmdzO1xyXG4vLyAgICAgICAgIGxhc3RSZXN1bHQgPSBmdW5jKC4uLmFyZ3MpO1xyXG4vLyAgICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xyXG4vLyAgICAgfVxyXG4vLyB9IiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICBjb25zdCBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICAgICAgcGF0aDogJycsXHJcbiAgICAgICAgICAgIGhhc2hTZWFyY2g6ICcnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoOiB7XHJcbiAgICAgICAgICAgIHF1ZXJ5OiAnJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVzZXI6IHtcclxuICAgICAgICAgICAgdWlkOiAnJyxcclxuICAgICAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBiYW5kTGlzdDoge1xyXG4gICAgICAgICAgICBzb3J0aW5nOiAwLFxyXG4gICAgICAgICAgICB2aWV3aW5nOiAwLFxyXG4gICAgICAgICAgICBmaWx0ZXI6IHtcclxuICAgICAgICAgICAgICAgIHNlYXJjaDogJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gcmVkdWNlcnMoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikge1xyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ0NIQU5HRV9TRUFSQ0hfU1RSSU5HJzpcclxuICAgICAgICAgICAgICAgIHN0YXRlLnNlYXJjaC5xdWVyeSA9IGFjdGlvbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ0xPQ0FUSU9OJzpcclxuICAgICAgICAgICAgICAgIHN0YXRlLmxvY2F0aW9uLnBhdGggPSBhY3Rpb24udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSk7XHJcbiAgICAgICAgICAgIGNhc2UgJ0hBU0hfU0VBUkNIJzpcclxuICAgICAgICAgICAgICAgIHN0YXRlLmxvY2F0aW9uLmhhc2hTZWFyY2ggPSBhY3Rpb24udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSk7XHJcbiAgICAgICAgICAgIGNhc2UgJ1NFVF9CQU5EX0xJU1RfU09SVElORyc6XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYW5kTGlzdFNvcnRpbmcgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5iYW5kTGlzdCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRpbmc6IGFjdGlvbi5wYXlsb2FkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhbmRMaXN0OiBiYW5kTGlzdFNvcnRpbmdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBjYXNlICdTRVRfQkFORF9MSVNUX1ZJRVdJTkcnOlxyXG4gICAgICAgICAgICAgICAgY29uc3QgYmFuZExpc3RWaWV3aW5nID0gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUuYmFuZExpc3QsIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3aW5nOiBhY3Rpb24ucGF5bG9hZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgICAgICBiYW5kTGlzdDogYmFuZExpc3RWaWV3aW5nXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgY2FzZSAnU0VUX1BST0ZJTEVfVklFV0lORyc6XHJcbiAgICAgICAgICAgICAgICBjb25zdCBwcm9maWxlVmlld2luZyA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLnByb2ZpbGUsIHtcclxuICAgICAgICAgICAgICAgICAgICB2aWV3aW5nOiBhY3Rpb24ucGF5bG9hZFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7fSwgc3RhdGUsIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9maWxlOiBwcm9maWxlVmlld2luZ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNhc2UgJ1NFVF9DVVJSRU5UX1VTRVInOlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgdXNlcjogYWN0aW9uLnBheWxvYWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb25maWcobmdSZWR1eENvbmZpZyk7XHJcblxyXG4gICAgbmdSZWR1eENvbmZpZy4kaW5qZWN0ID0gWyckbmdSZWR1eFByb3ZpZGVyJ107XHJcblxyXG4gICAgZnVuY3Rpb24gbmdSZWR1eENvbmZpZygkbmdSZWR1eFByb3ZpZGVyKSB7XHJcbiAgICAgICAgY29uc3QgbG9nZ2VyID0gKHN0b3JlKSA9PiAobmV4dCkgPT4gKGFjdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGlzcGF0Y2hpbmcnLCBhY3Rpb24pO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXh0KGFjdGlvbik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXh0IHN0YXRlJywgc3RvcmUuZ2V0U3RhdGUoKSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkbmdSZWR1eFByb3ZpZGVyLmNyZWF0ZVN0b3JlV2l0aChyZWR1Y2VycywgW2xvZ2dlcl0pO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXV0aE1vZHVsZScpXHJcbiAgICAuc2VydmljZSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZSk7XHJcblxyXG5hdXRoU2VydmljZS4kaW5qZWN0ID0gWydhdXRoRW5kcG9pbnQnLFxyXG4gICAgJyRxJyxcclxuICAgICckY29va2llcycsXHJcbiAgICAnJGxvY2F0aW9uJ107XHJcblxyXG5mdW5jdGlvbiBhdXRoU2VydmljZShhdXRoRW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICRxLFxyXG4gICAgICAgICAgICAgICAgICAgICAkY29va2llcyxcclxuICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uKSB7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRVc2VyRGVmZXI7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpc0F1dGg6IGlzQXV0aCxcclxuICAgICAgICBsb2dpbjogbG9naW4sXHJcbiAgICAgICAgbG9nb3V0OiBsb2dvdXQsXHJcbiAgICAgICAgZ2V0Q3VycmVudFVzZXI6IGdldEN1cnJlbnRVc2VyLFxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBpc0F1dGgoKSB7XHJcbiAgICAgICAgcmV0dXJuICEhJGNvb2tpZXMuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9naW4oKSB7XHJcbiAgICAgICAgYXV0aEVuZHBvaW50LmdldFJlc291cmNlKCkubG9naW4oe30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlOicsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2U6JywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgICAgICAgJGNvb2tpZXMucmVtb3ZlKCdBVVRILVRPS0VOJyk7XHJcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8jJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXIoKSB7XHJcbiAgICAgICAgaWYgKCFjdXJyZW50VXNlckRlZmVyKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyRGVmZXIgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICBhdXRoRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRDdXJyZW50VXNlcih7fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXJEZWZlci5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyRGVmZXIucmVqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRVc2VyRGVmZXIucHJvbWlzZTtcclxuICAgIH1cclxufVxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2F1dGhNb2R1bGUnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdhdXRoTG9naW5Qcm9jZXNzQ3RybCcsIGF1dGhMb2dpblByb2Nlc3NDdHJsKTtcclxuXHJcbiAgICBhdXRoTG9naW5Qcm9jZXNzQ3RybC4kaW5qZWN0ID0gWyckcm91dGVQYXJhbXMnLCAnJGxvY2F0aW9uJywgJyRjb29raWVzJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoTG9naW5Qcm9jZXNzQ3RybCgkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgJGNvb2tpZXMsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIGlmICgkcm91dGVQYXJhbXMuaGFzT3duUHJvcGVydHkoJ3Rva2VuJykpIHtcclxuICAgICAgICAgICAgdmFyIGV4cGlyZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBleHBpcmVEYXRlLnNldERhdGUoZXhwaXJlRGF0ZS5nZXREYXRlKCkgKyAxNCk7XHJcbiAgICAgICAgICAgICRjb29raWVzLnB1dCgnQVVUSC1UT0tFTicsICRyb3V0ZVBhcmFtcy50b2tlbiwgeydleHBpcmVzJzogZXhwaXJlRGF0ZX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdhdXRoQ2hhbmdlZCcpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLyMvaG9tZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB2bTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2F1dGhNb2R1bGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2F1dGhXaWRnZXQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGF1dGhXaWRnZXRDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYXV0aC13aWRnZXRfX2J0bi1ob2xkZXJcIiBcclxuICAgICAgICAgICAgICAgICBuZy1pZj1cIiEkY3RybC5pc0F1dGhcIj5cclxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbVwiIGhyZWY9XCJ7eyRjdHJsLmxvZ2luVXJsfX1cIj7QktC+0LnRgtC4PC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBuZy1pZj1cIiRjdHJsLmlzQXV0aFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdj5IaSwge3skY3RybC51c2VyLmxvZ2lufX0hPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YSBuZy1jbGljaz1cIiRjdHJsLmxvZ291dCgpXCI+TG9nb3V0PC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbiAgICBhdXRoV2lkZ2V0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICdhdXRoU2VydmljZScsXHJcbiAgICAgICAgJ2FwaVVybCcsXHJcbiAgICAgICAgJyRyb290U2NvcGUnLFxyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhXaWRnZXRDdHJsKGF1dGhTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpVXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucykge1xyXG5cclxuICAgICAgICB0aGlzLiRvbkluaXQgPSAkb25Jbml0O1xyXG4gICAgICAgIHRoaXMuJG9uRGVzdHJveSA9ICRvbkRlc3Ryb3k7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICBsZXQgdW5jb25uZWN0ID0gJG5nUmVkdXguY29ubmVjdChtYXBTdGF0ZSwgbWFwRGlzcGF0Y2goKSkodm0pO1xyXG5cclxuICAgICAgICB2bS5sb2dpblVybCA9IGFwaVVybCArICcvbG9naW4vdmsnO1xyXG4gICAgICAgIHZtLmlzQXV0aCA9IGF1dGhTZXJ2aWNlLmlzQXV0aCgpO1xyXG4gICAgICAgIHZtLmxvZ2luID0gYXV0aFNlcnZpY2UubG9naW47XHJcbiAgICAgICAgdm0ubG9nb3V0ID0gbG9nb3V0O1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdhdXRoQ2hhbmdlZCcsIGF1dGhDaGFuZ2VkKTtcclxuXHJcbiAgICAgICAgaWYgKHZtLmlzQXV0aCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5nZXRDdXJyZW50VXNlcigpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAvLyB2bS51c2VyID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIHZtLnNldEN1cnJlbnRVc2VyKHtcclxuICAgICAgICAgICAgICAgICAgICBjcmVhdGVkX2JhbmRzOiByZXNwb25zZS5kYXRhLmNyZWF0ZWRfYmFuZHMsXHJcbiAgICAgICAgICAgICAgICAgICAgZGVzY3JpcHRpb246IHJlc3BvbnNlLmRhdGEuZGVzY3JpcHRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnRzOiByZXNwb25zZS5kYXRhLmV2ZW50cyxcclxuICAgICAgICAgICAgICAgICAgICBsb2dpbjogcmVzcG9uc2UuZGF0YS5sb2dpbixcclxuICAgICAgICAgICAgICAgICAgICBuYW1lOiByZXNwb25zZS5kYXRhLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgcmVnaXN0cmF0aW9uX2RhdGU6IHJlc3BvbnNlLmRhdGEucmVnaXN0cmF0aW9uX2RhdGVcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uSW5pdCgpIHtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uICRvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgICAgIHVuY29ubmVjdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWFwU3RhdGUoc3RhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHVzZXI6IHN0YXRlLnVzZXJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWFwRGlzcGF0Y2goKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzZXRDdXJyZW50VXNlcjogYWN0aW9ucy5zZXRDdXJyZW50VXNlcixcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5sb2dvdXQoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnYXV0aENoYW5nZWQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2JhbmRDcmVhdGUnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGJhbmRDcmVhdGVDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBiYW5kQ3JlYXRlQ3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICdiYW5kRW5kcG9pbnQnLFxyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBiYW5kQ3JlYXRlQ3RybChiYW5kRW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmZvcm1EYXRhID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2bS5mb3JtU3VibWl0ID0gZm9ybVN1Ym1pdEhhbmRsZXI7XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9ybVN1Ym1pdEhhbmRsZXIoZSkge1xyXG4gICAgICAgICAgICBiYW5kRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5jcmVhdGVCYW5kKHZtLmZvcm1EYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9iYW5kcycpKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZScsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxmb3JtIG5hbWU9XCJmb3JtLWNyZWF0ZS1iYW5kXCIgbmctc3VibWl0PVwiJGN0cmwuZm9ybVN1Ym1pdCgpXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNyZWF0ZS1iYW5kLW5hbWVcIj7QndCw0LfQstCw0L3QuNC1INCz0YDRg9C/0L/RizwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNyZWF0ZS1iYW5kLW5hbWVcIiBuYW1lPVwiY3JlYXRlLWJhbmQtbmFtZVwiIG5nLW1vZGVsPVwiJGN0cmwuZm9ybURhdGEubmFtZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIj7QntC/0LjRgdCw0L3QuNC1INCz0YDRg9C/0L/RizwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cImNyZWF0ZS1iYW5kLWRlc2NyaXB0aW9uXCIgbmFtZT1cImNyZWF0ZS1iYW5kLWRlc2NyaXB0aW9uXCIgbmctbW9kZWw9XCIkY3RybC5mb3JtRGF0YS5kZXNjcmlwdGlvblwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+0KHQvtC30LTQsNGC0Yw8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYmFuZEVkaXQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGJhbmRFZGl0Q3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgYmFuZEVkaXRDdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJ2JhbmRFbmRwb2ludCcsXHJcbiAgICAgICAgJyRyb3V0ZVBhcmFtcycsXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnYWN0aW9ucyddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGJhbmRFZGl0Q3RybChiYW5kRW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvdXRlUGFyYW1zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cclxuICAgICAgICBiYW5kRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRCYW5kKHtpZDogdm0uaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICB2bS5iYW5kRGF0YSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZtLmZvcm1TdWJtaXQgPSBmb3JtU3VibWl0O1xyXG4gICAgICAgIHZtLmZvcm1DYW5jZWwgPSBmb3JtQ2FuY2VsO1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1TdWJtaXQoKSB7XHJcblxyXG4gICAgICAgICAgICBiYW5kRW5kcG9pbnQuZ2V0UmVzb3VyY2Uoe2lkOiB2bS5pZH0pLmVkaXRCYW5kKHRoaXMuYmFuZERhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5sb2NhdGlvbignL2JhbmQvJyArIHZtLmlkKSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9ybUNhbmNlbCgpIHtcclxuICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5sb2NhdGlvbignL2JhbmQvJyArIHZtLmlkKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IG5nLWhpZGU9XCIkY3RybC5iYW5kRGF0YVwiPkxvYWRpbmcuLi48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBuZy1zaG93PVwiJGN0cmwuYmFuZERhdGFcIiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgPGgzPtCg0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMPC9oMz5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDxmb3JtIG5hbWU9XCJmb3JtLWVkaXQtYmFuZFwiIG5nLXN1Ym1pdD1cIiRjdHJsLmZvcm1TdWJtaXQoKVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjcmVhdGUtYmFuZC1uYW1lXCI+0J3QsNC30LLQsNC90LjQtSDQs9GA0YPQv9C/0Ys8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjcmVhdGUtYmFuZC1uYW1lXCIgbmFtZT1cImNyZWF0ZS1iYW5kLW5hbWVcIiBuZy1tb2RlbD1cIiRjdHJsLmJhbmREYXRhLm5hbWVcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNyZWF0ZS1iYW5kLWRlc2NyaXB0aW9uXCI+0J7Qv9C40YHQsNC90LjQtSDQs9GA0YPQv9C/0Ys8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiIG5hbWU9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiIG5nLW1vZGVsPVwiJGN0cmwuYmFuZERhdGEuZGVzY3JpcHRpb25cIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPtCh0L7RhdGA0LDQvdC40YLRjDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJyZXNldFwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgbmctY2xpY2s9XCIkY3RybC5mb3JtQ2FuY2VsKClcIj7QntGC0LzQtdC90LA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEucmVnaXN0cmF0aW9uX2RhdGV9fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEubWVtYmVyc319PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5jcmVhdG9yfX08L3A+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2JhbmRJbmZvJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBiYW5kSW5mb0N0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGJhbmRJbmZvQ3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICdiYW5kRW5kcG9pbnQnLFxyXG4gICAgICAgICckcm91dGVQYXJhbXMnLFxyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBiYW5kSW5mb0N0cmwoYmFuZEVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICRyb3V0ZVBhcmFtcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcbiAgICAgICAgYmFuZEVuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0QmFuZCh7aWQ6IHZtLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdm0uYmFuZERhdGEgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBuZy1oaWRlPVwiJGN0cmwuYmFuZERhdGFcIj5Mb2FkaW5nLi4uPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgbmctc2hvdz1cIiRjdHJsLmJhbmREYXRhXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoMz57eyRjdHJsLmJhbmREYXRhLm5hbWV9fTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEuZGF0ZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEucGxhY2V9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLmNyZWF0b3J9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYmFuZHNMaXN0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBiYW5kc0xpc3RDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBjb25zdCBiYW5kTGlzdENvbmZpZyA9IHtcclxuICAgICAgICBzb3J0aW5nOiBbXHJcbiAgICAgICAgICAgIHsgaWQ6IDAsIG5hbWU6ICfQv9C+INC/0L7Qv9GD0LvRj9GA0L3QvtGB0YLQuCcgfSxcclxuICAgICAgICAgICAgeyBpZDogMSwgbmFtZTogJ9C/0L4g0YbQtdC90LUnIH0sXHJcbiAgICAgICAgICAgIHsgaWQ6IDIsIG5hbWU6ICfQv9C+INGA0LXQudGC0LjQvdCz0YMnIH0sXHJcbiAgICAgICAgICAgIHsgaWQ6IDMsIG5hbWU6ICfQv9C+INC90L7QstC40LfQvdC1JyB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICB2aWV3aW5nOiBbXHJcbiAgICAgICAgICAgIHsgaWQ6IDAsIG5hbWU6ICfRgtCw0LHQu9C40YbQsCcgfSxcclxuICAgICAgICAgICAgeyBpZDogMSwgbmFtZTogJ9Cx0LvQvtC60LgnIH0sXHJcbiAgICAgICAgICAgIHsgaWQ6IDIsIG5hbWU6ICfQutCw0YDRgtC+0YfQutC4JyB9XHJcbiAgICAgICAgXSxcclxuICAgICAgICBkZWZhdWx0U3RhdGU6IHtcclxuICAgICAgICAgICAgc29ydGluZzogMCxcclxuICAgICAgICAgICAgdmlld2luZzogMCxcclxuICAgICAgICAgICAgZmlsdGVyOiB7XHJcbiAgICAgICAgICAgICAgICBzZWFyY2g6ICcnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbjxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XHJcbiAgICAgICAgICAgIDxoMz7QkNGA0YLQuNGB0YLRiyDQuCDQs9GA0YPQv9C/0Ys8L2gzPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmwtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJibC1zb3J0aW5nXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImJsLXNvcnRpbmctbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpIG5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwuYmFuZExpc3RDb25maWcuc29ydGluZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xhc3M9XCJ7J2FjdGl2ZSc6aXRlbS5pZD09PSRjdHJsLmNvbmZpZy5zb3J0aW5nfVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmctY2xpY2s9XCIkY3RybC5zZXRCYW5kTGlzdFNvcnRpbmcoaXRlbS5pZClcIj57e2l0ZW0ubmFtZX19PC9saT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmwtdmlld2luZ1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJibC12aWV3aW5nLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLmJhbmRMaXN0Q29uZmlnLnZpZXdpbmdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsYXNzPVwieydhY3RpdmUnOml0ZW0uaWQ9PT0kY3RybC5jb25maWcudmlld2luZ31cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsaWNrPVwiJGN0cmwuc2V0QmFuZExpc3RWaWV3aW5nKGl0ZW0uaWQpXCI+e3tpdGVtLm5hbWV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgPGRpdiBuZy1pZj1cIiRjdHJsLmNvbmZpZy52aWV3aW5nPT09MFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+0J3QsNC30LLQsNC90LjQtTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPtCe0L/QuNGB0LDQvdC40LU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD7QkNCy0YLQvtGAPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+0JTQsNGC0LAg0YHQvtC30LTQsNC90LjRjzwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIgbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5iYW5kcyB0cmFjayBieSBpdGVtLmlkXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxhIGhyZWY9XCIjL2JhbmQve3tpdGVtLmlkfX1cIj57e2l0ZW0ubmFtZX19PC9hPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7aXRlbS5kZXNjcmlwdGlvbn19PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3tpdGVtLmNyZWF0b3J9fTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7aXRlbS5yZWdpc3RyYXRpb25fZGF0ZX19PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmwtY2xvY2tzXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgbmctaWY9XCIkY3RybC5jb25maWcudmlld2luZz09PTFcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmwtY2xvY2tzLWl0ZW1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLmJhbmRzIHRyYWNrIGJ5IGl0ZW0uaWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPjxhIGhyZWY9XCIjL2JhbmQve3tpdGVtLmlkfX1cIj57e2l0ZW0ubmFtZX19PC9hPjwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt7aXRlbS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5yZWdpc3Rlcjoge3tpdGVtLnJlZ2lzdHJhdGlvbl9kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPm1lbWJlcnM6IHt7aXRlbS5tZW1iZXJzfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPmNyZWF0b3I6IHt7aXRlbS5jcmVhdG9yfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjL2JhbmRFZGl0L3t7aXRlbS5pZH19XCI+0KDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Yw8L2E+PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJibC1jYXJkc1wiIFxyXG4gICAgICAgICAgICAgICAgICAgIG5nLWlmPVwiJGN0cmwuY29uZmlnLnZpZXdpbmc9PT0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJsLWNhcmRzLWl0ZW1cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLmJhbmRzIHRyYWNrIGJ5IGl0ZW0uaWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPjxhIGhyZWY9XCIjL2JhbmQve3tpdGVtLmlkfX1cIj57e2l0ZW0ubmFtZX19PC9hPjwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt7aXRlbS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD5yZWdpc3Rlcjoge3tpdGVtLnJlZ2lzdHJhdGlvbl9kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPm1lbWJlcnM6IHt7aXRlbS5tZW1iZXJzfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPmNyZWF0b3I6IHt7aXRlbS5jcmVhdG9yfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjL2JhbmRFZGl0L3t7aXRlbS5pZH19XCI+0KDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Yw8L2E+PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbjwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG4gICAgYmFuZHNMaXN0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnLFxyXG4gICAgICAgICdtZW1vaXplJyxcclxuICAgICAgICAnYmFuZHNFbmRwb2ludCdcclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gYmFuZHNMaXN0Q3RybChcclxuICAgICAgICAkbmdSZWR1eCxcclxuICAgICAgICBhY3Rpb25zLFxyXG4gICAgICAgIG1lbW9pemUsXHJcbiAgICAgICAgYmFuZHNFbmRwb2ludCkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uYmFuZExpc3RDb25maWcgPSBiYW5kTGlzdENvbmZpZztcclxuICAgICAgICB0aGlzLiRvbkluaXQgPSAkb25Jbml0O1xyXG4gICAgICAgIHRoaXMuJG9uRGVzdHJveSA9ICRvbkRlc3Ryb3k7XHJcblxyXG4gICAgICAgIHZtLmdldEJhbmRzID0gbWVtb2l6ZSgodmFsdWUpID0+IHtcclxuICAgICAgICAgICAgYmFuZHNFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEJhbmRzKHt9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0uYmFuZHMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgbGV0IHVuY29ubmVjdCA9ICRuZ1JlZHV4LmNvbm5lY3QobWFwU3RhdGUsIG1hcERpc3BhdGNoKCkpKHZtKTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uSW5pdCgpIHtcclxuICAgICAgICAgICAgdm0uZ2V0QmFuZHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcFN0YXRlKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIGxldCBjb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBiYW5kTGlzdENvbmZpZy5kZWZhdWx0U3RhdGUsIHN0YXRlLmJhbmRMaXN0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcERpc3BhdGNoKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2V0QmFuZExpc3RTb3J0aW5nOiBhY3Rpb25zLnNldEJhbmRMaXN0U29ydGluZyxcclxuICAgICAgICAgICAgICAgIHNldEJhbmRMaXN0Vmlld2luZzogYWN0aW9ucy5zZXRCYW5kTGlzdFZpZXdpbmdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uRGVzdHJveSgpIHtcclxuICAgICAgICAgICAgdW5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnY29udGVudCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogY29udGVudENvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGNvbnRlbnRDb250cm9sbGVyLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnbWVtb2l6ZScsXHJcbiAgICAgICAgJyRsb2NhdGlvbiddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnRlbnRDb250cm9sbGVyKCRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtb2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbikge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TG9jYXRpb24gPSBtZW1vaXplKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2V0SGFzaFNlYXJjaCA9IG1lbW9pemUoZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJG5nUmVkdXguc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHN0YXRlID0gJG5nUmVkdXguZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRMb2NhdGlvbihzdGF0ZS5sb2NhdGlvbi5wYXRoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRIYXNoU2VhcmNoKHN0YXRlLmxvY2F0aW9uLmhhc2hTZWFyY2gpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvcC1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9wLW1lbnVfX2hvbGRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0yXCI+PGEgaHJlZj1cIiMvXCI+PGltZyBzcmM9XCJjc3MvaW1nL2xvZ28yLnBuZ1wiIGFsdD1cIlJvY2twYXJhZGVcIj48L2E+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5hdmlnYXRpb24+PC9uYXZpZ2F0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YXV0aC13aWRnZXQ+PC9hdXRoLXdpZGdldD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50IGhhcy10b3AtbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBuZy12aWV3PVwiXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnZXZlbnRDcmVhdGUnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGV2ZW50Q3JlYXRlQ3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgZXZlbnRDcmVhdGVDdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJ2V2ZW50RW5kcG9pbnQnLFxyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBldmVudENyZWF0ZUN0cmwoZXZlbnRFbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5mb3JtRGF0YSA9IHtcclxuICAgICAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgICAgIGRhdGU6ICcnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJycsXHJcbiAgICAgICAgICAgIHBsYWNlOiAnJyxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZtLmZvcm1TdWJtaXQgPSBmb3JtU3VibWl0SGFuZGxlcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtU3VibWl0SGFuZGxlcihlKSB7XHJcbiAgICAgICAgICAgIGV2ZW50RW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5jcmVhdGVFdmVudCh2bS5mb3JtRGF0YSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmxvY2F0aW9uKCcvaG9tZScpKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG48ZGl2IGNsYXNzPVwiY29udGFpbmVyXCI+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMlwiPlxyXG4gICAgICAgICAgICA8aDM+0KHQvtC30LTQsNC90LjQtSDQvNC10YDQvtC/0YDQuNGP0YLQuNGPPC9oMz5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gbmFtZT1cImZvcm0tY3JlYXRlLWJhbmRcIiBuZy1zdWJtaXQ9XCIkY3RybC5mb3JtU3VibWl0KClcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3JlYXRlLWV2ZW50LW5hbWVcIj7QndCw0LfQstCw0L3QuNC1INC80LXRgNC+0L/RgNC40Y/RgtC40Y88L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImNyZWF0ZS1ldmVudC1uYW1lXCIgbmctbW9kZWw9XCIkY3RybC5mb3JtRGF0YS5uYW1lXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjcmVhdGUtZXZlbnQtZGF0ZVwiPtCU0LDRgtCwINC/0YDQvtCy0LXQtNC10L3QuNGPINC80LXRgNC+0L/RgNC40Y/RgtC40Y88L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImNyZWF0ZS1ldmVudC1kYXRlXCIgbmctbW9kZWw9XCIkY3RybC5mb3JtRGF0YS5kYXRlXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjcmVhdGUtZXZlbnQtcGxhY2VcIj7QnNC10YHRgtC+INC/0YDQvtCy0LXQtNC10L3QuNGPINC80LXRgNC+0L/RgNC40Y/RgtC40Y88L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgbmFtZT1cImNyZWF0ZS1ldmVudC1wbGFjZVwiIG5nLW1vZGVsPVwiJGN0cmwuZm9ybURhdGEucGxhY2VcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNyZWF0ZS1ldmVudC1kZXNjcmlwdGlvblwiPtCe0L/QuNGB0LDQvdC40LUg0LzQtdGA0L7Qv9GA0LjRj9GC0LjRjzwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBuYW1lPVwiY3JlYXRlLWV2ZW50LWRlc2NyaXB0aW9uXCIgbmctbW9kZWw9XCIkY3RybC5mb3JtRGF0YS5kZXNjcmlwdGlvblwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+0KHQvtC30LTQsNGC0Yw8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnZXZlbnRJbmZvJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBldmVudEluZm9DdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBldmVudEluZm9DdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJ2V2ZW50RW5kcG9pbnQnLFxyXG4gICAgICAgICckcm91dGVQYXJhbXMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBldmVudEluZm9DdHJsKGV2ZW50RW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb3V0ZVBhcmFtcykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblxyXG4gICAgICAgIGV2ZW50RW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRFdmVudCh7aWQ6IHZtLmlkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHZtLmV2ZW50RGF0YSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8aDM+e3skY3RybC5ldmVudERhdGEubmFtZX19PC9oMz5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuZXZlbnREYXRhLmRlc2NyaXB0aW9ufX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmV2ZW50RGF0YS5kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmV2ZW50RGF0YS5wbGFjZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5ldmVudERhdGEuY3JlYXRvcn19PC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdldmVudHNMaXN0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBldmVudHNMaXN0Q3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgZXZlbnRzTGlzdEN0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdtZW1vaXplJyxcclxuICAgICAgICAnZXZlbnRzRW5kcG9pbnQnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGV2ZW50c0xpc3RDdHJsKCRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtb2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50c0VuZHBvaW50KSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gJG9uRGVzdHJveTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRFdmVudHMgPSBtZW1vaXplKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50c0VuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0RXZlbnRzKHtzZWFyY2hTdHJpbmc6IHZhbHVlfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZXZlbnRzID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRFdmVudHNBbGwoe30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmV2ZW50cyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgdW5jb25uZWN0ID0gJG5nUmVkdXguc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHN0YXRlID0gJG5nUmVkdXguZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5nZXRFdmVudHMoc3RhdGUuc2VhcmNoLnF1ZXJ5KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRFdmVudHMoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uRGVzdHJveSgpIHtcclxuICAgICAgICAgICAgdW5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIgbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ldmVudHNcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgPGgzPjxhIGhyZWY9XCIjL2V2ZW50L3t7aXRlbS5pZH19XCI+e3tpdGVtLm5hbWV9fTwvYT48L2gzPlxyXG4gICAgICAgICAgICAgICAgPHA+e3tpdGVtLmRlc2NyaXB0aW9ufX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57e2l0ZW0uZGF0ZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnbmF2aWdhdGlvbicsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogbmF2aWdhdGlvbkN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIG5hdmlnYXRpb25DdHJsLiRpbmplY3QgPSBbJ2F1dGhTZXJ2aWNlJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBuYXZpZ2F0aW9uQ3RybChhdXRoU2VydmljZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaXNBdXRoID0gYXV0aFNlcnZpY2UuaXNBdXRoKCk7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdhdXRoQ2hhbmdlZCcsIGF1dGhDaGFuZ2VkKTtcclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cInRvcC1uYXZcIj4gXHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIG5nLWlmPVwiJGN0cmwuaXNBdXRoXCI+PGEgaHJlZj1cIiMvaG9tZVwiPtCc0L7RjyDRgdGC0YDQsNC90LjRhtCwPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL2JhbmRzXCI+0JPRgNGD0L/Qv9GLPC9hPjwvbGk+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9ldmVudHNcIj7QnNC10YDQvtC/0YDQuNGP0YLQuNGPPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c2VhcmNoLXdpZGdldD48L3NlYXJjaC13aWRnZXQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdzZWFyY2hNb2R1bGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3NlYXJjaFdpZGdldCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogc2VhcmNoV2lkZ2V0Q3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgc2VhcmNoV2lkZ2V0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNlYXJjaFdpZGdldEN0cmwoJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgdW5jb25uZWN0ID0gJG5nUmVkdXguY29ubmVjdChtYXBTdGF0ZVRvVGhpcywgYWN0aW9ucykodm0pO1xyXG5cclxuICAgICAgICB0aGlzLnF1ZXJ5ID0gJyc7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hLZXlQcmVzcyA9IHNlYXJjaEtleVByZXNzO1xyXG4gICAgICAgIHRoaXMuc2VhcmNoS2V5VXAgPSBzZWFyY2hLZXlVcDtcclxuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSAkb25EZXN0cm95O1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcFN0YXRlVG9UaGlzKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZTogc3RhdGVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoS2V5UHJlc3MoZSkge1xyXG4gICAgICAgICAgICBpZiAoZS5jaGFyQ29kZSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9zZWFyY2gnKSk7XHJcbiAgICAgICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmhhc2hTZWFyY2goJ3E9JyArIHRoaXMucXVlcnkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoS2V5VXAoZSkge1xyXG4gICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmNoYW5nZVNlYXJjaFN0cmluZyh0aGlzLnF1ZXJ5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiAkb25EZXN0cm95KCkge1xyXG4gICAgICAgICAgICB1bmNvbm5lY3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZWFyY2gtd2lkZ2V0XCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInNlYXJjaFwiIFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgbmcta2V5cHJlc3M9XCIkY3RybC5zZWFyY2hLZXlQcmVzcygkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICBuZy1rZXl1cD1cIiRjdHJsLnNlYXJjaEtleVVwKCRldmVudClcIlxyXG4gICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVwiJGN0cmwucXVlcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi0J/QvtC40YHQulwiPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdhdXRoRW5kcG9pbnQnLCBhdXRoRW5kcG9pbnQpO1xyXG5cclxuYXV0aEVuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJGNvb2tpZXMnXTtcclxuXHJcbmZ1bmN0aW9uIGF1dGhFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJGNvb2tpZXMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG4gICAgdmFyIHRva2VuID0gJGNvb2tpZXMuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICB2YXIgc3RhciA9ICcqJztcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvOmVudGl0eS86dHlwZScsIHF1ZXJ5UGFyYW0sIHtcclxuICAgICAgICAgICAgZ2V0Q3VycmVudFVzZXI6IHtcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogJ3VzZXInXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxvZ2luOiB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6ICdsb2dpbicsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZrJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2JhbmRFbmRwb2ludCcsIGJhbmRFbmRwb2ludCk7XHJcblxyXG5iYW5kRW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCddO1xyXG5cclxuZnVuY3Rpb24gYmFuZEVuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRSZXNvdXJjZTogZ2V0UmVzb3VyY2VcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmVzb3VyY2UocGFyYW1zKSB7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZShhcGlVcmwgKyAnL2JhbmQvOmlkLzplbnRpdHknLCBwYXJhbXMsIHtcclxuICAgICAgICAgICAgZ2V0QmFuZDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBlZGl0QmFuZDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjcmVhdGVCYW5kOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBhZGRNZW1iZXJUb0JhbmQ6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6ICdtZW1iZXJzJ1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScpXHJcbiAgICAuc2VydmljZSgnYmFuZHNFbmRwb2ludCcsIGJhbmRzRW5kcG9pbnQpO1xyXG5cclxuYmFuZHNFbmRwb2ludC4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnYXBpVXJsJywgJyRxJ107XHJcblxyXG5mdW5jdGlvbiBiYW5kc0VuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsLCAkcSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBxdWVyeVBhcmFtID0ge307XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRSZXNvdXJjZTogZ2V0UmVzb3VyY2VcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmVzb3VyY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZShhcGlVcmwgKyAnL2JhbmRzLzpsaW1pdC86b2Zmc2V0JywgcXVlcnlQYXJhbSwge1xyXG4gICAgICAgICAgICBnZXRCYW5kczoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScpXHJcbiAgICAuc2VydmljZSgnZXZlbnRFbmRwb2ludCcsIGV2ZW50RW5kcG9pbnQpO1xyXG5cclxuZXZlbnRFbmRwb2ludC4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnYXBpVXJsJ107XHJcblxyXG5mdW5jdGlvbiBldmVudEVuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHF1ZXJ5UGFyYW0gPSB7fTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvZXZlbnQvOmlkLzplbnRpdHknLCBxdWVyeVBhcmFtLCB7XHJcbiAgICAgICAgICAgIGdldEV2ZW50OiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVkaXRFdmVudDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUFVUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBjcmVhdGVFdmVudDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdldmVudHNFbmRwb2ludCcsIGV2ZW50c0VuZHBvaW50KTtcclxuXHJcbmV2ZW50c0VuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJHEnXTtcclxuXHJcbmZ1bmN0aW9uIGV2ZW50c0VuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsLCAkcSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBxdWVyeVBhcmFtID0ge307XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRSZXNvdXJjZTogZ2V0UmVzb3VyY2VcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmVzb3VyY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZShhcGlVcmwgKyAnL2V2ZW50cy86bGlrZS86c2VhcmNoU3RyaW5nLzpsaW1pdC86b2Zmc2V0JywgcXVlcnlQYXJhbSwge1xyXG4gICAgICAgICAgICBnZXRFdmVudHNBbGw6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpa2U6IG51bGwsXHJcbiAgICAgICAgICAgICAgICAgICAgc2VhcmNoU3RyaW5nOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBnZXRFdmVudHM6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpa2U6ICdsaWtlJyxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3Byb2ZpbGUnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHByb2ZpbGVDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBjb25zdCBwcm9maWxlQ29uZmlnID0ge1xyXG4gICAgICAgIHZpZXdpbmc6IFtcclxuICAgICAgICAgICAge2lkOiAwLCBuYW1lOiAn0JzQvtC5INC/0YDQvtGE0LjQu9GMJ30sXHJcbiAgICAgICAgICAgIHtpZDogMSwgbmFtZTogJ9Cc0L7QuCDQs9GA0YPQv9C/0YsnfSxcclxuICAgICAgICAgICAge2lkOiAyLCBuYW1lOiAn0JzQvtC4INC80LXRgNC+0L/RgNC40Y/RgtC40Y8nfVxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgZGVmYXVsdFN0YXRlOiB7XHJcbiAgICAgICAgICAgIHZpZXdpbmc6IDBcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbjxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTEyXCI+XHJcbiAgICAgICAgICAgIDxoMz57eyRjdHJsLnVzZXIubmFtZX19PC9oMz5cclxuICAgICAgICAgICAgPGRpdj57eyRjdHJsLnVzZXIuZGVzY3JpcHRpb259fTwvZGl2PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9kaXY+XHJcbiAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy05IGNvbC14cy1vZmZzZXQtM1wiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicC12aWV3aW5nXCI+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJwLXZpZXdpbmctbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLnByb2ZpbGVDb25maWcudmlld2luZ1wiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsYXNzPVwieydhY3RpdmUnOml0ZW0uaWQ9PT0kY3RybC5jb25maWcudmlld2luZ31cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZy1jbGljaz1cIiRjdHJsLnNldFByb2ZpbGVWaWV3aW5nKGl0ZW0uaWQpXCI+e3tpdGVtLm5hbWV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgPGRpdiBjbGFzcz1cInJvdyBwLWNvbnRlbnRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXhzLTNcIj5cclxuICAgICAgICAgICAgPHA+0KHQvtC30LTQsNC90L4g0LPRgNGD0L/Qvzoge3skY3RybC51c2VyLmNyZWF0ZWRfYmFuZHMubGVuZ3RofX08L3A+XHJcbiAgICAgICAgICAgIDxwPtCh0L7Qt9C00LDQvdC+INC80LXRgNC+0L/RgNC40Y/RgtC40Lk6IHt7JGN0cmwudXNlci5ldmVudHMubGVuZ3RofX08L3A+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy05XCI+XHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IG5nLWlmPVwiJGN0cmwuY29uZmlnLnZpZXdpbmc9PT0wXCI+XHJcbiAgICAgICAgICAgICAgICAgICAg0JfQtNC10YHRjCDQvtGC0L7QsdGA0LDQttCw0LXRgtGB0Y8g0L/Rg9Cx0LvQuNGH0L3QsNGPINC40L3RhNC+0YDQvNCw0YbQuNGPLCDQutC+0YLQvtGA0YPRjiDQstC40LTRj9GCINC/0L7Qu9GM0LfQvtCy0LDRgtC10LvQuCwg0LfQsNGI0LXQtNGI0LjQtSDQvdCwINCy0LDRiCDQv9GA0L7RhNC40LvRjC5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBuZy1pZj1cIiRjdHJsLmNvbmZpZy52aWV3aW5nPT09MVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxwPtCh0L7Qt9C00LDQstCw0YLRjCDQs9GA0YPQv9C/0Ysg0L3QtdC+0LHRhdC+0LTQuNC80L4uLi48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiMvYmFuZENyZWF0ZVwiPtCh0L7Qt9C00LDRgtGMPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDxocj5cclxuICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPtCd0LDQt9Cy0LDQvdC40LU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD7QntC/0LjRgdCw0L3QuNC1PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+0JDQstGC0L7RgDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPtCU0LDRgtCwINGB0L7Qt9C00LDQvdC40Y88L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIG5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwudXNlci5jcmVhdGVkX2JhbmRzIHRyYWNrIGJ5IGl0ZW0uaWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGEgaHJlZj1cIiMvYmFuZC97e2l0ZW0uaWR9fVwiPnt7aXRlbS5uYW1lfX08L2E+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3tpdGVtLmRlc2NyaXB0aW9ufX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2l0ZW0uY3JlYXRvcn19PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3tpdGVtLnJlZ2lzdHJhdGlvbl9kYXRlfX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48YSBocmVmPVwiIy9iYW5kRWRpdC97e2l0ZW0uaWR9fVwiPtCg0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMPC9hPjwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgbmctaWY9XCIkY3RybC5jb25maWcudmlld2luZz09PTJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8cD7QodC+0LfQtNCw0LLQsNGC0Ywg0LzQtdGA0L7Qv9GA0LjRj9GC0LjRjyDQvdC10L7QsdGF0L7QtNC40LzQvi4uLjwvcD5cclxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPVwiIy9ldmVudENyZWF0ZVwiPtCh0L7Qt9C00LDRgtGMPC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIDxocj5cclxuICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPtCd0LDQt9Cy0LDQvdC40LU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD7QnNC10YHRgtC+PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+0J7Qv9C40YHQsNC90LjQtTwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPtCQ0LLRgtC+0YA8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD7QlNCw0YLQsCDQvNC10YDQvtC/0YDQuNGP0YLQuNGPPC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLnVzZXIuZXZlbnRzIHRyYWNrIGJ5IGl0ZW0uaWRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGEgaHJlZj1cIiMvYmFuZC97e2l0ZW0uaWR9fVwiPnt7aXRlbS5uYW1lfX08L2E+PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3tpdGVtLnBsYWNlfX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2l0ZW0uZGVzY3JpcHRpb259fTwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPnt7aXRlbS5jcmVhdG9yfX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2l0ZW0uZGF0ZX19PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgPC90YWJsZT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG48L2Rpdj5cclxuICAgIGA7XHJcbiAgICB9XHJcblxyXG4gICAgcHJvZmlsZUN0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdhY3Rpb25zJyxcclxuICAgICAgICAnbWVtb2l6ZScsXHJcbiAgICAgICAgJ2JhbmRzRW5kcG9pbnQnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIHByb2ZpbGVDdHJsKCRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9pemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICBiYW5kc0VuZHBvaW50KSB7XHJcblxyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ucHJvZmlsZUNvbmZpZyA9IHByb2ZpbGVDb25maWc7XHJcbiAgICAgICAgdGhpcy4kb25Jbml0ID0gJG9uSW5pdDtcclxuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSAkb25EZXN0cm95O1xyXG5cclxuICAgICAgICBsZXQgdW5jb25uZWN0ID0gJG5nUmVkdXguY29ubmVjdChtYXBTdGF0ZSwgbWFwRGlzcGF0Y2goKSkodm0pO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiAkb25Jbml0KCkge1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWFwU3RhdGUoc3RhdGUpIHtcclxuICAgICAgICAgICAgbGV0IGNvbmZpZyA9IE9iamVjdC5hc3NpZ24oe30sIHByb2ZpbGVDb25maWcuZGVmYXVsdFN0YXRlLCBzdGF0ZS5wcm9maWxlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHVzZXI6IHN0YXRlLnVzZXIsXHJcbiAgICAgICAgICAgICAgICBjb25maWc6IGNvbmZpZ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBtYXBEaXNwYXRjaCgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHNldFByb2ZpbGVWaWV3aW5nOiBhY3Rpb25zLnNldFByb2ZpbGVWaWV3aW5nXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uICRvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgICAgIHVuY29ubmVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSgpKTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
