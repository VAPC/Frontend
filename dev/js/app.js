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
        if (TOKEN) {

            var $http = $injector.get('$http');
            $http.defaults.headers.common['AUTH-TOKEN'] = TOKEN;
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
            hashSearch:hashSearch,
            setBandListSorting:setBandListSorting,
            setBandListViewing:setBandListViewing,
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

        function setBandListSorting(id){
            return {
                type: 'SET_BAND_LIST_SORTING',
                payload: id
            }
        }

        function setBandListViewing(id){
            return {
                type: 'SET_BAND_LIST_VIEWING',
                payload: id
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
(function() {

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

    authWidgetCtrl.$inject = ['authService',
        'apiUrl', '$rootScope'];

    function authWidgetCtrl(authService,
                            apiUrl,
                            $rootScope) {
        var vm = this;
        vm.loginUrl = apiUrl + '/login/vk';
        vm.isAuth = authService.isAuth();
        vm.login = authService.login;
        vm.logout = logout;
        $rootScope.$on('authChanged', authChanged);

        if (vm.isAuth) {
            authService.getCurrentUser().then(function (response) {
                console.log('cl response', response);
                vm.user = response.data;
            });
        }

        return vm;

        function logout() {
            authService.logout();
            $rootScope.$emit('authChanged');
        }

        function authChanged() {
            vm.isAuth = authService.isAuth();
        }

    }

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
                                <td>{{item.name}}</td>
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

        this.getBands = memoize((value) => {
            bandsEndpoint.getResource().getBands({}, function(response) {
                vm.bands = response.data;
            });
        });

        let unconnect = $ngRedux.connect(mapState, mapDispatch())(vm);

        function $onInit() {
            this.getBands();
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
                    <li><a href="#/bands">Артисты</a></li>   
                    <li><a href="#/locations">Площадки</a></li> 
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

bandEndpoint.$inject = ['$resource', 'apiUrl', '$q'];

function bandEndpoint($resource, apiUrl, $q) {
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

eventEndpoint.$inject = ['$resource', 'apiUrl', '$q'];

function eventEndpoint($resource, apiUrl, $q) {
    'use strict';

    var queryParam = {};

    return {
        getResource: getResource
    };

    function getResource() {
        return $resource(apiUrl + '/event/:id', queryParam, {
            getEvent: {
                method: 'GET',
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImVuZHBvaW50cy9lbmRwb2ludHMubWRsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGgubWRsLmpzIiwiY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoLm1kbC5qcyIsInJvdXRlci5qcyIsImFwcC9hY3Rpb25zLmpzIiwiYXBwL21lbW9pemUuanMiLCJhcHAvcmVkdWNlcnMuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aC5zcnYuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aExvZ2luUHJvY2Vzcy5jdHJsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGhXaWRnZXQuY210LmpzIiwiY29tcG9uZW50cy9iYW5kLWNyZWF0ZS9iYW5kLWNyZWF0ZS5jbXQuanMiLCJjb21wb25lbnRzL2JhbmQtZWRpdC9iYW5kLWVkaXQuY210LmpzIiwiY29tcG9uZW50cy9iYW5kLWluZm8vYmFuZC1pbmZvLmNtdC5qcyIsImNvbXBvbmVudHMvYmFuZHMtbGlzdC9iYW5kcy1saXN0LmNtdC5qcyIsImNvbXBvbmVudHMvY29udGVudC9jb250ZW50LmNtdC5qcyIsImNvbXBvbmVudHMvZXZlbnRzLWxpc3QvZXZlbnRzLWxpc3QuY210LmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY210LmpzIiwiY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoV2lkZ2V0LmNtdC5qcyIsImNvbXBvbmVudHMvZXZlbnQtaW5mby9ldmVudHMtaW5mby5jbXQuanMiLCJlbmRwb2ludHMvYXV0aC9hdXRoRW5kcG9pbnQuanMiLCJlbmRwb2ludHMvYmFuZHMvYmFuZEVuZHBvaW50LmpzIiwiZW5kcG9pbnRzL2JhbmRzL2JhbmRzRW5kcG9pbnQuanMiLCJlbmRwb2ludHMvZXZlbnRzL2V2ZW50RW5kcG9pbnQuanMiLCJlbmRwb2ludHMvZXZlbnRzL2V2ZW50c0VuZHBvaW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN6SkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHJlZHVjZXJzIGZyb20gJy4vYXBwL3JlZHVjZXJzJ1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnLCBbXHJcbiAgICAgICAgICAgICduZ1JvdXRlJyxcclxuICAgICAgICAgICAgJ25nQ29va2llcycsXHJcbiAgICAgICAgICAgICduZ1Jlc291cmNlJyxcclxuICAgICAgICAgICAgJ25nUmVkdXgnLFxyXG5cclxuICAgICAgICAgICAgJ2VuZHBvaW50c01vZHVsZScsXHJcbiAgICAgICAgICAgICdhdXRoTW9kdWxlJyxcclxuICAgICAgICAgICAgJ3NlYXJjaE1vZHVsZScsXHJcbiAgICAgICAgXSk7XHJcblxyXG59KCkpOyIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnLCBbXSlcclxuICAgIC5mYWN0b3J5KCdhcGlVcmwnLCBhcGlVcmwpO1xyXG5cclxuZnVuY3Rpb24gYXBpVXJsKCkge1xyXG4gICAgdmFyIHVybDtcclxuICAgIHN3aXRjaCAod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKSB7XHJcbiAgICAgICAgY2FzZSAnbG9jYWxob3N0JzpcclxuICAgICAgICAgICAgdXJsID0gJ2h0dHA6Ly9yb2NrcGFyYWRlLmNyZW9yYS5ydS9hcGknO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgJy9hcGknO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHJldHVybiB1cmw7XHJcbn1cclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhdXRoTW9kdWxlJywgW10pXHJcbiAgICAgICAgLy8gLmNvbmZpZyhodHRwSW50ZXJjZXB0b3JDb25maWcpXHJcbiAgICAgICAgLnJ1bihodHRwSW50ZXJjZXB0b3JSdW4pO1xyXG5cclxuICAgIC8vIGh0dHBJbnRlcmNlcHRvckNvbmZpZy4kaW5qZWN0ID0gWyckaHR0cFByb3ZpZGVyJ107XHJcbiAgICAvL1xyXG4gICAgLy8gZnVuY3Rpb24gaHR0cEludGVyY2VwdG9yQ29uZmlnKCRodHRwUHJvdmlkZXIpIHtcclxuICAgIC8vICAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnVzZVhEb21haW4gPSB0cnVlO1xyXG4gICAgLy8gICAgIGRlbGV0ZSAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLVJlcXVlc3RlZC1XaXRoJ107XHJcbiAgICAvLyB9XHJcblxyXG4gICAgaHR0cEludGVyY2VwdG9yUnVuLiRpbmplY3QgPSBbJyRpbmplY3RvciddO1xyXG4gICAgZnVuY3Rpb24gaHR0cEludGVyY2VwdG9yUnVuKCRpbmplY3Rvcikge1xyXG4gICAgICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgICAgdmFyIFRPS0VOID0gJGluamVjdG9yLmdldCgnJGNvb2tpZXMnKS5nZXQoJ0FVVEgtVE9LRU4nKTtcclxuICAgICAgICBpZiAoVE9LRU4pIHtcclxuXHJcbiAgICAgICAgICAgIHZhciAkaHR0cCA9ICRpbmplY3Rvci5nZXQoJyRodHRwJyk7XHJcbiAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBVVRILVRPS0VOJ10gPSBUT0tFTjtcclxuICAgICAgICAgICAgLy8gJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5wb3N0WydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnO1xyXG4gICAgICAgICAgICAvLyAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLnB1dFsnQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JztcclxuXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBdXRoOiB1c2VyIGF1dGhlbnRpY2F0aW9uIGVycm9yLiBDb29raWVzIGRvZXNuXFwndCBjb250YWluIFwiQVVUSC1UT0tFTlwiJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnc2VhcmNoTW9kdWxlJywgW10pO1xyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbmZpZyhyb3V0ZXIpO1xyXG5cclxuICAgIHJvdXRlci4kaW5qZWN0ID0gWyckcm91dGVQcm92aWRlciddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJvdXRlcigkcm91dGVQcm92aWRlcikge1xyXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsYW5kaW5nLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2hvbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvZXZlbnQvOmlkJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdldmVudC5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9ldmVudHMnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2V2ZW50cy5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9iYW5kcycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmFuZHMuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvYmFuZC86aWQnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2JhbmQuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvYmFuZENyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmFuZENyZWF0ZS5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9iYW5kRWRpdC86aWQnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2JhbmRFZGl0Lmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL3NlYXJjaD86YmxhJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzZWFyY2guaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvbG9naW4vdmsvY2FsbGJhY2snLCB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnYXV0aExvZ2luUHJvY2Vzc0N0cmwnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICcnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8kbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xyXG4gICAgICAgIC8vICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgLy8gICAgcmVxdWlyZUJhc2U6IGZhbHNlXHJcbiAgICAgICAgLy99KTtcclxuICAgIH07XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLnNlcnZpY2UoJ2FjdGlvbnMnLCBhY3Rpb25zKTtcclxuXHJcbiAgICBhY3Rpb25zLiRpbmplY3QgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3Rpb25zKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNoYW5nZVNlYXJjaFN0cmluZzogY2hhbmdlU2VhcmNoU3RyaW5nLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24sXHJcbiAgICAgICAgICAgIGhhc2hTZWFyY2g6aGFzaFNlYXJjaCxcclxuICAgICAgICAgICAgc2V0QmFuZExpc3RTb3J0aW5nOnNldEJhbmRMaXN0U29ydGluZyxcclxuICAgICAgICAgICAgc2V0QmFuZExpc3RWaWV3aW5nOnNldEJhbmRMaXN0Vmlld2luZyxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VTZWFyY2hTdHJpbmcodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdDSEFOR0VfU0VBUkNIX1NUUklORycsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9jYXRpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdMT0NBVElPTicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBoYXNoU2VhcmNoKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnSEFTSF9TRUFSQ0gnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldEJhbmRMaXN0U29ydGluZyhpZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnU0VUX0JBTkRfTElTVF9TT1JUSU5HJyxcclxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IGlkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNldEJhbmRMaXN0Vmlld2luZyhpZCl7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnU0VUX0JBTkRfTElTVF9WSUVXSU5HJyxcclxuICAgICAgICAgICAgICAgIHBheWxvYWQ6IGlkXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBtZW1vaXplKCkge1xyXG4gICAgICAgIHJldHVybiAoZnVuYywgZXF1YWxpdHlDaGVjayA9IGRlZmF1bHRFcXVhbGl0eUNoZWNrKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBsYXN0QXJncyA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBsYXN0UmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdEFyZ3MgIT09IG51bGwgJiZcclxuICAgICAgICAgICAgICAgICAgICBsYXN0QXJncy5sZW5ndGggPT09IGFyZ3MubGVuZ3RoICYmXHJcbiAgICAgICAgICAgICAgICAgICAgYXJncy5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBlcXVhbGl0eUNoZWNrKHZhbHVlLCBsYXN0QXJnc1tpbmRleF0pKVxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0QXJncyA9IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBsYXN0UmVzdWx0ID0gZnVuYyguLi5hcmdzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZWZhdWx0RXF1YWxpdHlDaGVjayhhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIGEgPT09IGJcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmZhY3RvcnkoJ21lbW9pemUnLCBtZW1vaXplKTtcclxuXHJcblxyXG59KCkpO1xyXG5cclxuLy8gZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCBlcXVhbGl0eUNoZWNrID0gZGVmYXVsdEVxdWFsaXR5Q2hlY2spIHtcclxuLy8gICAgIGxldCBsYXN0QXJncyA9IG51bGw7XHJcbi8vICAgICBsZXQgbGFzdFJlc3VsdCA9IG51bGw7XHJcbi8vICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcclxuLy8gICAgICAgICBpZiAoXHJcbi8vICAgICAgICAgICAgIGxhc3RBcmdzICE9PSBudWxsICYmXHJcbi8vICAgICAgICAgICAgIGxhc3RBcmdzLmxlbmd0aCA9PT0gYXJncy5sZW5ndGggJiZcclxuLy8gICAgICAgICAgICAgYXJncy5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBlcXVhbGl0eUNoZWNrKHZhbHVlLCBsYXN0QXJnc1tpbmRleF0pKVxyXG4vLyAgICAgICAgICkge1xyXG4vLyAgICAgICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgbGFzdEFyZ3MgPSBhcmdzO1xyXG4vLyAgICAgICAgIGxhc3RSZXN1bHQgPSBmdW5jKC4uLmFyZ3MpO1xyXG4vLyAgICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xyXG4vLyAgICAgfVxyXG4vLyB9IiwiKGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIGNvbnN0IGRlZmF1bHRTdGF0ZSA9IHtcclxuICAgICAgICBsb2NhdGlvbjoge1xyXG4gICAgICAgICAgICBwYXRoOiAnJyxcclxuICAgICAgICAgICAgaGFzaFNlYXJjaDogJycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2g6IHtcclxuICAgICAgICAgICAgcXVlcnk6ICcnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXNlcjoge1xyXG4gICAgICAgICAgICB1aWQ6ICcnLFxyXG4gICAgICAgICAgICBuYW1lOiAnJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIGJhbmRMaXN0OiB7XHJcbiAgICAgICAgICAgIHNvcnRpbmc6IDAsXHJcbiAgICAgICAgICAgIHZpZXdpbmc6IDAsXHJcbiAgICAgICAgICAgIGZpbHRlcjoge1xyXG4gICAgICAgICAgICAgICAgc2VhcmNoOiAnJ1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiByZWR1Y2VycyhzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSB7XHJcbiAgICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnQ0hBTkdFX1NFQVJDSF9TVFJJTkcnOlxyXG4gICAgICAgICAgICAgICAgc3RhdGUuc2VhcmNoLnF1ZXJ5ID0gYWN0aW9uLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oc3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnTE9DQVRJT04nOlxyXG4gICAgICAgICAgICAgICAgc3RhdGUubG9jYXRpb24ucGF0aCA9IGFjdGlvbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlKTtcclxuICAgICAgICAgICAgY2FzZSAnSEFTSF9TRUFSQ0gnOlxyXG4gICAgICAgICAgICAgICAgc3RhdGUubG9jYXRpb24uaGFzaFNlYXJjaCA9IGFjdGlvbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlKTtcclxuICAgICAgICAgICAgY2FzZSAnU0VUX0JBTkRfTElTVF9TT1JUSU5HJzpcclxuICAgICAgICAgICAgICAgIGNvbnN0IGJhbmRMaXN0U29ydGluZyA9IE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLmJhbmRMaXN0LCB7XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydGluZzogYWN0aW9uLnBheWxvYWRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe30sIHN0YXRlLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFuZExpc3Q6IGJhbmRMaXN0U29ydGluZ1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIGNhc2UgJ1NFVF9CQU5EX0xJU1RfVklFV0lORyc6XHJcbiAgICAgICAgICAgICAgICBjb25zdCBiYW5kTGlzdFZpZXdpbmcgPSBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZS5iYW5kTGlzdCwge1xyXG4gICAgICAgICAgICAgICAgICAgIHZpZXdpbmc6IGFjdGlvbi5wYXlsb2FkXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHt9LCBzdGF0ZSwge1xyXG4gICAgICAgICAgICAgICAgICAgIGJhbmRMaXN0OiBiYW5kTGlzdFZpZXdpbmdcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb25maWcobmdSZWR1eENvbmZpZyk7XHJcblxyXG4gICAgbmdSZWR1eENvbmZpZy4kaW5qZWN0ID0gWyckbmdSZWR1eFByb3ZpZGVyJ107XHJcblxyXG4gICAgZnVuY3Rpb24gbmdSZWR1eENvbmZpZygkbmdSZWR1eFByb3ZpZGVyKSB7XHJcbiAgICAgICAgY29uc3QgbG9nZ2VyID0gKHN0b3JlKSA9PiAobmV4dCkgPT4gKGFjdGlvbikgPT4ge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnZGlzcGF0Y2hpbmcnLCBhY3Rpb24pO1xyXG4gICAgICAgICAgICBjb25zdCByZXN1bHQgPSBuZXh0KGFjdGlvbik7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCduZXh0IHN0YXRlJywgc3RvcmUuZ2V0U3RhdGUoKSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfTtcclxuICAgICAgICAkbmdSZWR1eFByb3ZpZGVyLmNyZWF0ZVN0b3JlV2l0aChyZWR1Y2VycywgW2xvZ2dlcl0pO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXV0aE1vZHVsZScpXHJcbiAgICAuc2VydmljZSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZSk7XHJcblxyXG5hdXRoU2VydmljZS4kaW5qZWN0ID0gWydhdXRoRW5kcG9pbnQnLFxyXG4gICAgJyRxJyxcclxuICAgICckY29va2llcycsXHJcbiAgICAnJGxvY2F0aW9uJ107XHJcblxyXG5mdW5jdGlvbiBhdXRoU2VydmljZShhdXRoRW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICRxLFxyXG4gICAgICAgICAgICAgICAgICAgICAkY29va2llcyxcclxuICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uKSB7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRVc2VyRGVmZXI7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpc0F1dGg6IGlzQXV0aCxcclxuICAgICAgICBsb2dpbjogbG9naW4sXHJcbiAgICAgICAgbG9nb3V0OiBsb2dvdXQsXHJcbiAgICAgICAgZ2V0Q3VycmVudFVzZXI6IGdldEN1cnJlbnRVc2VyLFxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBpc0F1dGgoKSB7XHJcbiAgICAgICAgcmV0dXJuICEhJGNvb2tpZXMuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9naW4oKSB7XHJcbiAgICAgICAgYXV0aEVuZHBvaW50LmdldFJlc291cmNlKCkubG9naW4oe30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlOicsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2U6JywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgICAgICAgJGNvb2tpZXMucmVtb3ZlKCdBVVRILVRPS0VOJyk7XHJcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8jJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXIoKSB7XHJcbiAgICAgICAgaWYgKCFjdXJyZW50VXNlckRlZmVyKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyRGVmZXIgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICBhdXRoRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRDdXJyZW50VXNlcih7fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXJEZWZlci5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyRGVmZXIucmVqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRVc2VyRGVmZXIucHJvbWlzZTtcclxuICAgIH1cclxufVxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2F1dGhNb2R1bGUnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdhdXRoTG9naW5Qcm9jZXNzQ3RybCcsIGF1dGhMb2dpblByb2Nlc3NDdHJsKTtcclxuXHJcbiAgICBhdXRoTG9naW5Qcm9jZXNzQ3RybC4kaW5qZWN0ID0gWyckcm91dGVQYXJhbXMnLCAnJGxvY2F0aW9uJywgJyRjb29raWVzJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoTG9naW5Qcm9jZXNzQ3RybCgkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgJGNvb2tpZXMsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIGlmICgkcm91dGVQYXJhbXMuaGFzT3duUHJvcGVydHkoJ3Rva2VuJykpIHtcclxuICAgICAgICAgICAgdmFyIGV4cGlyZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBleHBpcmVEYXRlLnNldERhdGUoZXhwaXJlRGF0ZS5nZXREYXRlKCkgKyAxNCk7XHJcbiAgICAgICAgICAgICRjb29raWVzLnB1dCgnQVVUSC1UT0tFTicsICRyb3V0ZVBhcmFtcy50b2tlbiwgeydleHBpcmVzJzogZXhwaXJlRGF0ZX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdhdXRoQ2hhbmdlZCcpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLyMvaG9tZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB2bTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2F1dGhNb2R1bGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2F1dGhXaWRnZXQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGF1dGhXaWRnZXRDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBhdXRoV2lkZ2V0Q3RybC4kaW5qZWN0ID0gWydhdXRoU2VydmljZScsXHJcbiAgICAgICAgJ2FwaVVybCcsICckcm9vdFNjb3BlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0aFdpZGdldEN0cmwoYXV0aFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGlVcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5sb2dpblVybCA9IGFwaVVybCArICcvbG9naW4vdmsnO1xyXG4gICAgICAgIHZtLmlzQXV0aCA9IGF1dGhTZXJ2aWNlLmlzQXV0aCgpO1xyXG4gICAgICAgIHZtLmxvZ2luID0gYXV0aFNlcnZpY2UubG9naW47XHJcbiAgICAgICAgdm0ubG9nb3V0ID0gbG9nb3V0O1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdhdXRoQ2hhbmdlZCcsIGF1dGhDaGFuZ2VkKTtcclxuXHJcbiAgICAgICAgaWYgKHZtLmlzQXV0aCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5nZXRDdXJyZW50VXNlcigpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB2bS51c2VyID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2UubG9nb3V0KCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJ2F1dGhDaGFuZ2VkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhdXRoQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdm0uaXNBdXRoID0gYXV0aFNlcnZpY2UuaXNBdXRoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYXV0aC13aWRnZXRfX2J0bi1ob2xkZXJcIiBcclxuICAgICAgICAgICAgICAgICBuZy1pZj1cIiEkY3RybC5pc0F1dGhcIj5cclxuICAgICAgICAgICAgICAgIDxhIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0IGJ0bi1zbVwiIGhyZWY9XCJ7eyRjdHJsLmxvZ2luVXJsfX1cIj7QktC+0LnRgtC4PC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBuZy1pZj1cIiRjdHJsLmlzQXV0aFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdj5IaSwge3skY3RybC51c2VyLmxvZ2lufX0hPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YSBuZy1jbGljaz1cIiRjdHJsLmxvZ291dCgpXCI+TG9nb3V0PC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdiYW5kQ3JlYXRlJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBiYW5kQ3JlYXRlQ3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgYmFuZENyZWF0ZUN0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnYmFuZEVuZHBvaW50JyxcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdhY3Rpb25zJ107XHJcblxyXG4gICAgZnVuY3Rpb24gYmFuZENyZWF0ZUN0cmwoYmFuZEVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5mb3JtRGF0YSA9IHtcclxuICAgICAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdm0uZm9ybVN1Ym1pdCA9IGZvcm1TdWJtaXRIYW5kbGVyO1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1TdWJtaXRIYW5kbGVyKGUpIHtcclxuICAgICAgICAgICAgYmFuZEVuZHBvaW50LmdldFJlc291cmNlKCkuY3JlYXRlQmFuZCh2bS5mb3JtRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZScsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmxvY2F0aW9uKCcvYmFuZHMnKSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Zm9ybSBuYW1lPVwiZm9ybS1jcmVhdGUtYmFuZFwiIG5nLXN1Ym1pdD1cIiRjdHJsLmZvcm1TdWJtaXQoKVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjcmVhdGUtYmFuZC1uYW1lXCI+0J3QsNC30LLQsNC90LjQtSDQs9GA0YPQv9C/0Ys8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjcmVhdGUtYmFuZC1uYW1lXCIgbmFtZT1cImNyZWF0ZS1iYW5kLW5hbWVcIiBuZy1tb2RlbD1cIiRjdHJsLmZvcm1EYXRhLm5hbWVcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNyZWF0ZS1iYW5kLWRlc2NyaXB0aW9uXCI+0J7Qv9C40YHQsNC90LjQtSDQs9GA0YPQv9C/0Ys8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiIG5hbWU9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiIG5nLW1vZGVsPVwiJGN0cmwuZm9ybURhdGEuZGVzY3JpcHRpb25cIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPtCh0L7Qt9C00LDRgtGMPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2JhbmRFZGl0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBiYW5kRWRpdEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGJhbmRFZGl0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICdiYW5kRW5kcG9pbnQnLFxyXG4gICAgICAgICckcm91dGVQYXJhbXMnLFxyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBiYW5kRWRpdEN0cmwoYmFuZEVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICRyb3V0ZVBhcmFtcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcbiAgICAgICAgYmFuZEVuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0QmFuZCh7aWQ6IHZtLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdm0uYmFuZERhdGEgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2bS5mb3JtU3VibWl0ID0gZm9ybVN1Ym1pdDtcclxuICAgICAgICB2bS5mb3JtQ2FuY2VsID0gZm9ybUNhbmNlbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtU3VibWl0KCkge1xyXG5cclxuICAgICAgICAgICAgYmFuZEVuZHBvaW50LmdldFJlc291cmNlKHtpZDogdm0uaWR9KS5lZGl0QmFuZCh0aGlzLmJhbmREYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9iYW5kLycgKyB2bS5pZCkpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1DYW5jZWwoKSB7XHJcbiAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9iYW5kLycgKyB2bS5pZCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBuZy1oaWRlPVwiJGN0cmwuYmFuZERhdGFcIj5Mb2FkaW5nLi4uPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgbmctc2hvdz1cIiRjdHJsLmJhbmREYXRhXCIgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgIDxoMz7QoNC10LTQsNC60YLQuNGA0L7QstCw0YLRjDwvaDM+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8Zm9ybSBuYW1lPVwiZm9ybS1lZGl0LWJhbmRcIiBuZy1zdWJtaXQ9XCIkY3RybC5mb3JtU3VibWl0KClcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3JlYXRlLWJhbmQtbmFtZVwiPtCd0LDQt9Cy0LDQvdC40LUg0LPRgNGD0L/Qv9GLPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY3JlYXRlLWJhbmQtbmFtZVwiIG5hbWU9XCJjcmVhdGUtYmFuZC1uYW1lXCIgbmctbW9kZWw9XCIkY3RybC5iYW5kRGF0YS5uYW1lXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiPtCe0L/QuNGB0LDQvdC40LUg0LPRgNGD0L/Qv9GLPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIiBuYW1lPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIiBuZy1tb2RlbD1cIiRjdHJsLmJhbmREYXRhLmRlc2NyaXB0aW9uXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj7QodC+0YXRgNCw0L3QuNGC0Yw8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwicmVzZXRcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIG5nLWNsaWNrPVwiJGN0cmwuZm9ybUNhbmNlbCgpXCI+0J7RgtC80LXQvdCwPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLnJlZ2lzdHJhdGlvbl9kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLm1lbWJlcnN9fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEuY3JlYXRvcn19PC9wPlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdiYW5kSW5mbycsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogYmFuZEluZm9DdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBiYW5kSW5mb0N0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnYmFuZEVuZHBvaW50JyxcclxuICAgICAgICAnJHJvdXRlUGFyYW1zJyxcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdhY3Rpb25zJ107XHJcblxyXG4gICAgZnVuY3Rpb24gYmFuZEluZm9DdHJsKGJhbmRFbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAkcm91dGVQYXJhbXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblxyXG4gICAgICAgIGJhbmRFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEJhbmQoe2lkOiB2bS5pZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHZtLmJhbmREYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdm0uYmFuZEVkaXQgPSBiYW5kRWRpdDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBiYW5kRWRpdCgpIHtcclxuICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5sb2NhdGlvbignL2JhbmRFZGl0LycgKyB2bS5pZCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudF9fYmFuZFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlcm8taW1hZ2VcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaWRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNpZGUtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmFuZF9fbGVmdC1ib3hcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiYW5kX19waG90b1wiPjxpbWcgc3JjPVwiLi4vYXNzZXRzL2FudG9uLnBuZ1wiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJhbmRfX3N1YnNjcmliZVwiPjxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj7Qn9C+0LTQv9C40YHQsNC9PC9idXR0b24+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmFuZF9fY291bnRlcnNcIj45OTk5PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJhbmRfX2xlZnQtYm94XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdC1ib3hfX2hlYWRlclwiPtCh0L7RgdGC0L7QuNGCINCyINCz0YDRg9C/0L/QsNGFIDI8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0LWJveF9fZ3JvdXBzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdyb3Vwc19fZ3JvdXBcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2lkZS1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVwcGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXBwZXJfX25hbWVcIj7QkNC90YLQvtC9INCa0L7RgNC10LvRj9C60L7QsjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVwcGVyX19idXR0b25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPtCh0L7QvtCx0YnQtdC90LjQtTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj7Qn9GA0LjQs9C70LDRgdC40YLRjDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgbmctaGlkZT1cIiRjdHJsLmJhbmREYXRhXCI+TG9hZGluZy4uLjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IG5nLXNob3c9XCIkY3RybC5iYW5kRGF0YVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz57eyRjdHJsLmJhbmREYXRhLm5hbWV9fTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEuZGVzY3JpcHRpb259fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEucGxhY2V9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5jcmVhdG9yfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIG5nLWNsaWNrPVwiJGN0cmwuYmFuZEVkaXQoKVwiPtCg0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdiYW5kc0xpc3QnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGJhbmRzTGlzdEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGJhbmRMaXN0Q29uZmlnID0ge1xyXG4gICAgICAgIHNvcnRpbmc6IFtcclxuICAgICAgICAgICAgeyBpZDogMCwgbmFtZTogJ9C/0L4g0L/QvtC/0YPQu9GP0YDQvdC+0YHRgtC4JyB9LFxyXG4gICAgICAgICAgICB7IGlkOiAxLCBuYW1lOiAn0L/QviDRhtC10L3QtScgfSxcclxuICAgICAgICAgICAgeyBpZDogMiwgbmFtZTogJ9C/0L4g0YDQtdC50YLQuNC90LPRgycgfSxcclxuICAgICAgICAgICAgeyBpZDogMywgbmFtZTogJ9C/0L4g0L3QvtCy0LjQt9C90LUnIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIHZpZXdpbmc6IFtcclxuICAgICAgICAgICAgeyBpZDogMCwgbmFtZTogJ9GC0LDQsdC70LjRhtCwJyB9LFxyXG4gICAgICAgICAgICB7IGlkOiAxLCBuYW1lOiAn0LHQu9C+0LrQuCcgfSxcclxuICAgICAgICAgICAgeyBpZDogMiwgbmFtZTogJ9C60LDRgNGC0L7Rh9C60LgnIH1cclxuICAgICAgICBdLFxyXG4gICAgICAgIGRlZmF1bHRTdGF0ZToge1xyXG4gICAgICAgICAgICBzb3J0aW5nOiAwLFxyXG4gICAgICAgICAgICB2aWV3aW5nOiAwLFxyXG4gICAgICAgICAgICBmaWx0ZXI6IHtcclxuICAgICAgICAgICAgICAgIHNlYXJjaDogJydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gICAgPGRpdiBjbGFzcz1cInJvd1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJsLWNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJibC1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmwtc29ydGluZ1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJibC1zb3J0aW5nLWxpc3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLmJhbmRMaXN0Q29uZmlnLnNvcnRpbmdcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsYXNzPVwieydhY3RpdmUnOml0ZW0uaWQ9PT0kY3RybC5jb25maWcuc29ydGluZ31cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5nLWNsaWNrPVwiJGN0cmwuc2V0QmFuZExpc3RTb3J0aW5nKGl0ZW0uaWQpXCI+e3tpdGVtLm5hbWV9fTwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJsLXZpZXdpbmdcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiYmwtdmlld2luZy1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGkgbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5iYW5kTGlzdENvbmZpZy52aWV3aW5nXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZy1jbGFzcz1cInsnYWN0aXZlJzppdGVtLmlkPT09JGN0cmwuY29uZmlnLnZpZXdpbmd9XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZy1jbGljaz1cIiRjdHJsLnNldEJhbmRMaXN0Vmlld2luZyhpdGVtLmlkKVwiPnt7aXRlbS5uYW1lfX08L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIDxkaXYgbmctaWY9XCIkY3RybC5jb25maWcudmlld2luZz09PTBcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPtCd0LDQt9Cy0LDQvdC40LU8L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD7QntC/0LjRgdCw0L3QuNC1PC90aD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+0JDQstGC0L7RgDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPtCU0LDRgtCwINGB0L7Qt9C00LDQvdC40Y88L3RoPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyIG5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwuYmFuZHMgdHJhY2sgYnkgaXRlbS5pZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2l0ZW0ubmFtZX19PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3tpdGVtLmRlc2NyaXB0aW9ufX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD57e2l0ZW0uY3JlYXRvcn19PC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+e3tpdGVtLnJlZ2lzdHJhdGlvbl9kYXRlfX08L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJibC1jbG9ja3NcIiBcclxuICAgICAgICAgICAgICAgICAgICBuZy1pZj1cIiRjdHJsLmNvbmZpZy52aWV3aW5nPT09MVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJibC1jbG9ja3MtaXRlbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwuYmFuZHMgdHJhY2sgYnkgaXRlbS5pZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDM+PGEgaHJlZj1cIiMvYmFuZC97e2l0ZW0uaWR9fVwiPnt7aXRlbS5uYW1lfX08L2E+PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3tpdGVtLmRlc2NyaXB0aW9ufX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnJlZ2lzdGVyOiB7e2l0ZW0ucmVnaXN0cmF0aW9uX2RhdGV9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+bWVtYmVyczoge3tpdGVtLm1lbWJlcnN9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+Y3JlYXRvcjoge3tpdGVtLmNyZWF0b3J9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiMvYmFuZEVkaXQve3tpdGVtLmlkfX1cIj7QoNC10LTQsNC60YLQuNGA0L7QstCw0YLRjDwvYT48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJsLWNhcmRzXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgbmctaWY9XCIkY3RybC5jb25maWcudmlld2luZz09PTJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmwtY2FyZHMtaXRlbVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwuYmFuZHMgdHJhY2sgYnkgaXRlbS5pZFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDM+PGEgaHJlZj1cIiMvYmFuZC97e2l0ZW0uaWR9fVwiPnt7aXRlbS5uYW1lfX08L2E+PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3tpdGVtLmRlc2NyaXB0aW9ufX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnJlZ2lzdGVyOiB7e2l0ZW0ucmVnaXN0cmF0aW9uX2RhdGV9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+bWVtYmVyczoge3tpdGVtLm1lbWJlcnN9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+Y3JlYXRvcjoge3tpdGVtLmNyZWF0b3J9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+PGEgaHJlZj1cIiMvYmFuZEVkaXQve3tpdGVtLmlkfX1cIj7QoNC10LTQsNC60YLQuNGA0L7QstCw0YLRjDwvYT48L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbiAgICBiYW5kc0xpc3RDdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnYWN0aW9ucycsXHJcbiAgICAgICAgJ21lbW9pemUnLFxyXG4gICAgICAgICdiYW5kc0VuZHBvaW50J1xyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiBiYW5kc0xpc3RDdHJsKFxyXG4gICAgICAgICRuZ1JlZHV4LFxyXG4gICAgICAgIGFjdGlvbnMsXHJcbiAgICAgICAgbWVtb2l6ZSxcclxuICAgICAgICBiYW5kc0VuZHBvaW50KSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5iYW5kTGlzdENvbmZpZyA9IGJhbmRMaXN0Q29uZmlnO1xyXG4gICAgICAgIHRoaXMuJG9uSW5pdCA9ICRvbkluaXQ7XHJcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gJG9uRGVzdHJveTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRCYW5kcyA9IG1lbW9pemUoKHZhbHVlKSA9PiB7XHJcbiAgICAgICAgICAgIGJhbmRzRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRCYW5kcyh7fSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLmJhbmRzID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGxldCB1bmNvbm5lY3QgPSAkbmdSZWR1eC5jb25uZWN0KG1hcFN0YXRlLCBtYXBEaXNwYXRjaCgpKSh2bSk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uICRvbkluaXQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0QmFuZHMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcFN0YXRlKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIGxldCBjb25maWcgPSBPYmplY3QuYXNzaWduKHt9LCBiYW5kTGlzdENvbmZpZy5kZWZhdWx0U3RhdGUsIHN0YXRlLmJhbmRMaXN0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIGNvbmZpZzogY29uZmlnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcERpc3BhdGNoKCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc2V0QmFuZExpc3RTb3J0aW5nOiBhY3Rpb25zLnNldEJhbmRMaXN0U29ydGluZyxcclxuICAgICAgICAgICAgICAgIHNldEJhbmRMaXN0Vmlld2luZzogYWN0aW9ucy5zZXRCYW5kTGlzdFZpZXdpbmdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uRGVzdHJveSgpIHtcclxuICAgICAgICAgICAgdW5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnY29udGVudCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogY29udGVudENvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGNvbnRlbnRDb250cm9sbGVyLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnbWVtb2l6ZScsXHJcbiAgICAgICAgJyRsb2NhdGlvbiddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnRlbnRDb250cm9sbGVyKCRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtb2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbikge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TG9jYXRpb24gPSBtZW1vaXplKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2V0SGFzaFNlYXJjaCA9IG1lbW9pemUoZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJG5nUmVkdXguc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHN0YXRlID0gJG5nUmVkdXguZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRMb2NhdGlvbihzdGF0ZS5sb2NhdGlvbi5wYXRoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRIYXNoU2VhcmNoKHN0YXRlLmxvY2F0aW9uLmhhc2hTZWFyY2gpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvcC1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9wLW1lbnVfX2hvbGRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0yXCI+PGEgaHJlZj1cIiMvXCI+PGltZyBzcmM9XCJjc3MvaW1nL2xvZ28yLnBuZ1wiIGFsdD1cIlJvY2twYXJhZGVcIj48L2E+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5hdmlnYXRpb24+PC9uYXZpZ2F0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YXV0aC13aWRnZXQ+PC9hdXRoLXdpZGdldD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50IGhhcy10b3AtbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBuZy12aWV3PVwiXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdldmVudHNMaXN0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBldmVudHNMaXN0Q3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgZXZlbnRzTGlzdEN0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdtZW1vaXplJyxcclxuICAgICAgICAnZXZlbnRzRW5kcG9pbnQnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGV2ZW50c0xpc3RDdHJsKCRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtb2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50c0VuZHBvaW50KSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gJG9uRGVzdHJveTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRFdmVudHMgPSBtZW1vaXplKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50c0VuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0RXZlbnRzKHtzZWFyY2hTdHJpbmc6IHZhbHVlfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZXZlbnRzID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRFdmVudHNBbGwoe30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmV2ZW50cyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgdW5jb25uZWN0ID0gJG5nUmVkdXguc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHN0YXRlID0gJG5nUmVkdXguZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5nZXRFdmVudHMoc3RhdGUuc2VhcmNoLnF1ZXJ5KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRFdmVudHMoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uRGVzdHJveSgpIHtcclxuICAgICAgICAgICAgdW5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIgbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ldmVudHNcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgPGgzPjxhIGhyZWY9XCIjL2V2ZW50L3t7aXRlbS5pZH19XCI+e3tpdGVtLm5hbWV9fTwvYT48L2gzPlxyXG4gICAgICAgICAgICAgICAgPHA+e3tpdGVtLmRlc2NyaXB0aW9ufX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57e2l0ZW0uZGF0ZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnbmF2aWdhdGlvbicsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogbmF2aWdhdGlvbkN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIG5hdmlnYXRpb25DdHJsLiRpbmplY3QgPSBbJ2F1dGhTZXJ2aWNlJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBuYXZpZ2F0aW9uQ3RybChhdXRoU2VydmljZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaXNBdXRoID0gYXV0aFNlcnZpY2UuaXNBdXRoKCk7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdhdXRoQ2hhbmdlZCcsIGF1dGhDaGFuZ2VkKTtcclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cInRvcC1uYXZcIj4gXHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIG5nLWlmPVwiJGN0cmwuaXNBdXRoXCI+PGEgaHJlZj1cIiMvaG9tZVwiPtCc0L7RjyDRgdGC0YDQsNC90LjRhtCwPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL2JhbmRzXCI+0JDRgNGC0LjRgdGC0Ys8L2E+PC9saT4gICBcclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvbG9jYXRpb25zXCI+0J/Qu9C+0YnQsNC00LrQuDwvYT48L2xpPiBcclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvZXZlbnRzXCI+0JzQtdGA0L7Qv9GA0LjRj9GC0LjRjzwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNlYXJjaC13aWRnZXQ+PC9zZWFyY2gtd2lkZ2V0PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnc2VhcmNoTW9kdWxlJylcclxuICAgICAgICAuY29tcG9uZW50KCdzZWFyY2hXaWRnZXQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHNlYXJjaFdpZGdldEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHNlYXJjaFdpZGdldEN0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdhY3Rpb25zJ1xyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiBzZWFyY2hXaWRnZXRDdHJsKCRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHVuY29ubmVjdCA9ICRuZ1JlZHV4LmNvbm5lY3QobWFwU3RhdGVUb1RoaXMsIGFjdGlvbnMpKHZtKTtcclxuXHJcbiAgICAgICAgdGhpcy5xdWVyeSA9ICcnO1xyXG4gICAgICAgIHRoaXMuc2VhcmNoS2V5UHJlc3MgPSBzZWFyY2hLZXlQcmVzcztcclxuICAgICAgICB0aGlzLnNlYXJjaEtleVVwID0gc2VhcmNoS2V5VXA7XHJcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gJG9uRGVzdHJveTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBtYXBTdGF0ZVRvVGhpcyhzdGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNlYXJjaEtleVByZXNzKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUuY2hhckNvZGUgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmxvY2F0aW9uKCcvc2VhcmNoJykpO1xyXG4gICAgICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5oYXNoU2VhcmNoKCdxPScgKyB0aGlzLnF1ZXJ5KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNlYXJjaEtleVVwKGUpIHtcclxuICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5jaGFuZ2VTZWFyY2hTdHJpbmcodGhpcy5xdWVyeSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uRGVzdHJveSgpIHtcclxuICAgICAgICAgICAgdW5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2VhcmNoLXdpZGdldFwiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzZWFyY2hcIiBcclxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiIFxyXG4gICAgICAgICAgICAgICAgICAgIG5nLWtleXByZXNzPVwiJGN0cmwuc2VhcmNoS2V5UHJlc3MoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmcta2V5dXA9XCIkY3RybC5zZWFyY2hLZXlVcCgkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICBuZy1tb2RlbD1cIiRjdHJsLnF1ZXJ5XCJcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cItCf0L7QuNGB0LpcIj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2V2ZW50SW5mbycsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZXZlbnRJbmZvQ3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgZXZlbnRJbmZvQ3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICdldmVudEVuZHBvaW50JyxcclxuICAgICAgICAnJHJvdXRlUGFyYW1zJ107XHJcblxyXG4gICAgZnVuY3Rpb24gZXZlbnRJbmZvQ3RybChldmVudEVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAkcm91dGVQYXJhbXMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cclxuICAgICAgICBldmVudEVuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0RXZlbnQoe2lkOiB2bS5pZH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICB2bS5ldmVudERhdGEgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgPGgzPnt7JGN0cmwuZXZlbnREYXRhLm5hbWV9fTwvaDM+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmV2ZW50RGF0YS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5ldmVudERhdGEuZGF0ZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5ldmVudERhdGEucGxhY2V9fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuZXZlbnREYXRhLmNyZWF0b3J9fTwvcD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdhdXRoRW5kcG9pbnQnLCBhdXRoRW5kcG9pbnQpO1xyXG5cclxuYXV0aEVuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJGNvb2tpZXMnXTtcclxuXHJcbmZ1bmN0aW9uIGF1dGhFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJGNvb2tpZXMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG4gICAgdmFyIHRva2VuID0gJGNvb2tpZXMuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICB2YXIgc3RhciA9ICcqJztcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvOmVudGl0eS86dHlwZScsIHF1ZXJ5UGFyYW0sIHtcclxuICAgICAgICAgICAgZ2V0Q3VycmVudFVzZXI6IHtcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogJ3VzZXInXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxvZ2luOiB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6ICdsb2dpbicsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZrJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2JhbmRFbmRwb2ludCcsIGJhbmRFbmRwb2ludCk7XHJcblxyXG5iYW5kRW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCcsICckcSddO1xyXG5cclxuZnVuY3Rpb24gYmFuZEVuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsLCAkcSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKHBhcmFtcykge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy9iYW5kLzppZC86ZW50aXR5JywgcGFyYW1zLCB7XHJcbiAgICAgICAgICAgIGdldEJhbmQ6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZWRpdEJhbmQ6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3JlYXRlQmFuZDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWRkTWVtYmVyVG9CYW5kOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5OiAnbWVtYmVycydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2JhbmRzRW5kcG9pbnQnLCBiYW5kc0VuZHBvaW50KTtcclxuXHJcbmJhbmRzRW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCcsICckcSddO1xyXG5cclxuZnVuY3Rpb24gYmFuZHNFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJHEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy9iYW5kcy86bGltaXQvOm9mZnNldCcsIHF1ZXJ5UGFyYW0sIHtcclxuICAgICAgICAgICAgZ2V0QmFuZHM6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2V2ZW50RW5kcG9pbnQnLCBldmVudEVuZHBvaW50KTtcclxuXHJcbmV2ZW50RW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCcsICckcSddO1xyXG5cclxuZnVuY3Rpb24gZXZlbnRFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJHEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy9ldmVudC86aWQnLCBxdWVyeVBhcmFtLCB7XHJcbiAgICAgICAgICAgIGdldEV2ZW50OiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScpXHJcbiAgICAuc2VydmljZSgnZXZlbnRzRW5kcG9pbnQnLCBldmVudHNFbmRwb2ludCk7XHJcblxyXG5ldmVudHNFbmRwb2ludC4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnYXBpVXJsJywgJyRxJ107XHJcblxyXG5mdW5jdGlvbiBldmVudHNFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJHEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy9ldmVudHMvOmxpa2UvOnNlYXJjaFN0cmluZy86bGltaXQvOm9mZnNldCcsIHF1ZXJ5UGFyYW0sIHtcclxuICAgICAgICAgICAgZ2V0RXZlbnRzQWxsOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaWtlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFN0cmluZzogbnVsbCxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0RXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaWtlOiAnbGlrZScsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
