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
        console.log('cl TOKEN', TOKEN);
        if (TOKEN) {

            var $http = $injector.get('$http');
            $http.defaults.headers.common['AUTH-TOKEN'] = TOKEN;
            // $http.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
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

    var defaultState = {
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

            default:
                return state;

        }
    }

    angular
        .module('rockparade')
        .config(ngReduxConfig);

    ngReduxConfig.$inject = ['$ngReduxProvider'];

    function ngReduxConfig($ngReduxProvider) {
        $ngReduxProvider.createStoreWith(reducers);
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
                <p><a href="#/bandEdit/{{item.id}}">Редактировать</a></p>
                </div>
            </div>
        `;
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImVuZHBvaW50cy9lbmRwb2ludHMubWRsLmpzIiwiY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoLm1kbC5qcyIsImNvbXBvbmVudHMvYXV0aC9hdXRoLm1kbC5qcyIsInJvdXRlci5qcyIsImFwcC9hY3Rpb25zLmpzIiwiYXBwL21lbW9pemUuanMiLCJhcHAvcmVkdWNlcnMuanMiLCJjb21wb25lbnRzL2JhbmQtY3JlYXRlL2JhbmQtY3JlYXRlLmNtdC5qcyIsImNvbXBvbmVudHMvYmFuZC1lZGl0L2JhbmQtZWRpdC5jbXQuanMiLCJjb21wb25lbnRzL2JhbmQtaW5mby9iYW5kLWluZm8uY210LmpzIiwiY29tcG9uZW50cy9iYW5kcy1saXN0L2JhbmRzLWxpc3QuY210LmpzIiwiY29tcG9uZW50cy9jb250ZW50L2NvbnRlbnQuY210LmpzIiwiY29tcG9uZW50cy9ldmVudC1pbmZvL2V2ZW50cy1pbmZvLmNtdC5qcyIsImNvbXBvbmVudHMvZXZlbnRzLWxpc3QvZXZlbnRzLWxpc3QuY210LmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY210LmpzIiwiY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoV2lkZ2V0LmNtdC5qcyIsImVuZHBvaW50cy9hdXRoL2F1dGhFbmRwb2ludC5qcyIsImVuZHBvaW50cy9iYW5kcy9iYW5kRW5kcG9pbnQuanMiLCJlbmRwb2ludHMvYmFuZHMvYmFuZHNFbmRwb2ludC5qcyIsImVuZHBvaW50cy9ldmVudHMvZXZlbnRFbmRwb2ludC5qcyIsImVuZHBvaW50cy9ldmVudHMvZXZlbnRzRW5kcG9pbnQuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aC5zcnYuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aExvZ2luUHJvY2Vzcy5jdHJsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGhXaWRnZXQuY210LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgcmVkdWNlcnMgZnJvbSAnLi9hcHAvcmVkdWNlcnMnXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScsIFtcclxuICAgICAgICAgICAgJ25nUm91dGUnLFxyXG4gICAgICAgICAgICAnbmdDb29raWVzJyxcclxuICAgICAgICAgICAgJ25nUmVzb3VyY2UnLFxyXG4gICAgICAgICAgICAnbmdSZWR1eCcsXHJcblxyXG4gICAgICAgICAgICAnZW5kcG9pbnRzTW9kdWxlJyxcclxuICAgICAgICAgICAgJ2F1dGhNb2R1bGUnLFxyXG4gICAgICAgICAgICAnc2VhcmNoTW9kdWxlJyxcclxuICAgICAgICBdKTtcclxuXHJcbn0oKSk7IiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ2FwaVVybCcsIGFwaVVybCk7XHJcblxyXG5mdW5jdGlvbiBhcGlVcmwoKSB7XHJcbiAgICB2YXIgdXJsO1xyXG4gICAgc3dpdGNoICh3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpIHtcclxuICAgICAgICBjYXNlICdsb2NhbGhvc3QnOlxyXG4gICAgICAgICAgICB1cmwgPSAnaHR0cDovL3JvY2twYXJhZGUuY3Jlb3JhLnJ1L2FwaSc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyAnL2FwaSc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVybDtcclxufVxyXG4iLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnc2VhcmNoTW9kdWxlJywgW10pO1xyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXV0aE1vZHVsZScsIFtdKVxyXG4gICAgICAgIC8vIC5jb25maWcoaHR0cEludGVyY2VwdG9yQ29uZmlnKVxyXG4gICAgICAgIC5ydW4oaHR0cEludGVyY2VwdG9yUnVuKTtcclxuXHJcbiAgICAvLyBodHRwSW50ZXJjZXB0b3JDb25maWcuJGluamVjdCA9IFsnJGh0dHBQcm92aWRlciddO1xyXG4gICAgLy9cclxuICAgIC8vIGZ1bmN0aW9uIGh0dHBJbnRlcmNlcHRvckNvbmZpZygkaHR0cFByb3ZpZGVyKSB7XHJcbiAgICAvLyAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy51c2VYRG9tYWluID0gdHJ1ZTtcclxuICAgIC8vICAgICBkZWxldGUgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1SZXF1ZXN0ZWQtV2l0aCddO1xyXG4gICAgLy8gfVxyXG5cclxuICAgIGh0dHBJbnRlcmNlcHRvclJ1bi4kaW5qZWN0ID0gWyckaW5qZWN0b3InXTtcclxuXHJcbiAgICBmdW5jdGlvbiBodHRwSW50ZXJjZXB0b3JSdW4oJGluamVjdG9yKSB7XHJcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgICB2YXIgVE9LRU4gPSAkaW5qZWN0b3IuZ2V0KCckY29va2llcycpLmdldCgnQVVUSC1UT0tFTicpO1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdjbCBUT0tFTicsIFRPS0VOKTtcclxuICAgICAgICBpZiAoVE9LRU4pIHtcclxuXHJcbiAgICAgICAgICAgIHZhciAkaHR0cCA9ICRpbmplY3Rvci5nZXQoJyRodHRwJyk7XHJcbiAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBVVRILVRPS0VOJ10gPSBUT0tFTjtcclxuICAgICAgICAgICAgLy8gJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0FjY2Vzcy1Db250cm9sLUFsbG93LUhlYWRlcnMnXSA9ICdDb250ZW50LVR5cGUsIEF1dGhvcml6YXRpb24sIFgtUmVxdWVzdGVkLVdpdGgnO1xyXG4gICAgICAgICAgICAvLyAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQWNjZXNzLUNvbnRyb2wtUmVxdWVzdC1IZWFkZXJzJ10gPSAnYWNjZXB0LCBvcmlnaW4sIGF1dGhvcml6YXRpb24sIGtleSc7XHJcbiAgICAgICAgICAgIC8vICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBVVRILVRPS0VOJ10gPSAndGVzdCc7XHJcblxyXG4gICAgICAgICAgICAvLyAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLnBvc3RbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCc7XHJcbiAgICAgICAgICAgIC8vICRodHRwLmRlZmF1bHRzLmhlYWRlcnMucHV0WydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnO1xyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0F1dGg6IHVzZXIgYXV0aGVudGljYXRpb24gZXJyb3IuIENvb2tpZXMgZG9lc25cXCd0IGNvbnRhaW4gXCJBVVRILVRPS0VOXCInKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbmZpZyhyb3V0ZXIpO1xyXG5cclxuICAgIHJvdXRlci4kaW5qZWN0ID0gWyckcm91dGVQcm92aWRlciddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJvdXRlcigkcm91dGVQcm92aWRlcikge1xyXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsYW5kaW5nLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2hvbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvZXZlbnQvOmlkJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdldmVudC5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9ldmVudHMnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2V2ZW50cy5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9iYW5kcycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmFuZHMuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvYmFuZC86aWQnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2JhbmQuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvYmFuZENyZWF0ZScsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmFuZENyZWF0ZS5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9iYW5kRWRpdC86aWQnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2JhbmRFZGl0Lmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL3NlYXJjaD86YmxhJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdzZWFyY2guaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvbG9naW4vdmsvY2FsbGJhY2snLCB7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnYXV0aExvZ2luUHJvY2Vzc0N0cmwnLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGU6ICcnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8kbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xyXG4gICAgICAgIC8vICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgLy8gICAgcmVxdWlyZUJhc2U6IGZhbHNlXHJcbiAgICAgICAgLy99KTtcclxuICAgIH07XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLnNlcnZpY2UoJ2FjdGlvbnMnLCBhY3Rpb25zKTtcclxuXHJcbiAgICBhY3Rpb25zLiRpbmplY3QgPSBbXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhY3Rpb25zKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGNoYW5nZVNlYXJjaFN0cmluZzogY2hhbmdlU2VhcmNoU3RyaW5nLFxyXG4gICAgICAgICAgICBsb2NhdGlvbjogbG9jYXRpb24sXHJcbiAgICAgICAgICAgIGhhc2hTZWFyY2g6aGFzaFNlYXJjaCxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBjaGFuZ2VTZWFyY2hTdHJpbmcodmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdDSEFOR0VfU0VBUkNIX1NUUklORycsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9jYXRpb24odmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdMT0NBVElPTicsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBoYXNoU2VhcmNoKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnSEFTSF9TRUFSQ0gnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBmdW5jdGlvbiBtZW1vaXplKCkge1xyXG4gICAgICAgIHJldHVybiAoZnVuYywgZXF1YWxpdHlDaGVjayA9IGRlZmF1bHRFcXVhbGl0eUNoZWNrKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBsYXN0QXJncyA9IG51bGw7XHJcbiAgICAgICAgICAgIGxldCBsYXN0UmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoXHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdEFyZ3MgIT09IG51bGwgJiZcclxuICAgICAgICAgICAgICAgICAgICBsYXN0QXJncy5sZW5ndGggPT09IGFyZ3MubGVuZ3RoICYmXHJcbiAgICAgICAgICAgICAgICAgICAgYXJncy5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBlcXVhbGl0eUNoZWNrKHZhbHVlLCBsYXN0QXJnc1tpbmRleF0pKVxyXG4gICAgICAgICAgICAgICAgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBsYXN0QXJncyA9IGFyZ3M7XHJcbiAgICAgICAgICAgICAgICBsYXN0UmVzdWx0ID0gZnVuYyguLi5hcmdzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBkZWZhdWx0RXF1YWxpdHlDaGVjayhhLCBiKSB7XHJcbiAgICAgICAgcmV0dXJuIGEgPT09IGJcclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmZhY3RvcnkoJ21lbW9pemUnLCBtZW1vaXplKTtcclxuXHJcblxyXG59KCkpO1xyXG5cclxuLy8gZnVuY3Rpb24gbWVtb2l6ZShmdW5jLCBlcXVhbGl0eUNoZWNrID0gZGVmYXVsdEVxdWFsaXR5Q2hlY2spIHtcclxuLy8gICAgIGxldCBsYXN0QXJncyA9IG51bGw7XHJcbi8vICAgICBsZXQgbGFzdFJlc3VsdCA9IG51bGw7XHJcbi8vICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcclxuLy8gICAgICAgICBpZiAoXHJcbi8vICAgICAgICAgICAgIGxhc3RBcmdzICE9PSBudWxsICYmXHJcbi8vICAgICAgICAgICAgIGxhc3RBcmdzLmxlbmd0aCA9PT0gYXJncy5sZW5ndGggJiZcclxuLy8gICAgICAgICAgICAgYXJncy5ldmVyeSgodmFsdWUsIGluZGV4KSA9PiBlcXVhbGl0eUNoZWNrKHZhbHVlLCBsYXN0QXJnc1tpbmRleF0pKVxyXG4vLyAgICAgICAgICkge1xyXG4vLyAgICAgICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcclxuLy8gICAgICAgICB9XHJcbi8vICAgICAgICAgbGFzdEFyZ3MgPSBhcmdzO1xyXG4vLyAgICAgICAgIGxhc3RSZXN1bHQgPSBmdW5jKC4uLmFyZ3MpO1xyXG4vLyAgICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xyXG4vLyAgICAgfVxyXG4vLyB9IiwiKGZ1bmN0aW9uICgpIHtcclxuXHJcbiAgICB2YXIgZGVmYXVsdFN0YXRlID0ge1xyXG4gICAgICAgIGxvY2F0aW9uOiB7XHJcbiAgICAgICAgICAgIHBhdGg6ICcnLFxyXG4gICAgICAgICAgICBoYXNoU2VhcmNoOiAnJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHNlYXJjaDoge1xyXG4gICAgICAgICAgICBxdWVyeTogJycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICB1c2VyOiB7XHJcbiAgICAgICAgICAgIHVpZDogJycsXHJcbiAgICAgICAgICAgIG5hbWU6ICcnLFxyXG4gICAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIHJlZHVjZXJzKHN0YXRlID0gZGVmYXVsdFN0YXRlLCBhY3Rpb24pIHtcclxuICAgICAgICBzd2l0Y2ggKGFjdGlvbi50eXBlKSB7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdDSEFOR0VfU0VBUkNIX1NUUklORyc6XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5zZWFyY2gucXVlcnkgPSBhY3Rpb24udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBjYXNlICdMT0NBVElPTic6XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5sb2NhdGlvbi5wYXRoID0gYWN0aW9uLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oc3RhdGUpO1xyXG4gICAgICAgICAgICBjYXNlICdIQVNIX1NFQVJDSCc6XHJcbiAgICAgICAgICAgICAgICBzdGF0ZS5sb2NhdGlvbi5oYXNoU2VhcmNoID0gYWN0aW9uLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oc3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgIHJldHVybiBzdGF0ZTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29uZmlnKG5nUmVkdXhDb25maWcpO1xyXG5cclxuICAgIG5nUmVkdXhDb25maWcuJGluamVjdCA9IFsnJG5nUmVkdXhQcm92aWRlciddO1xyXG5cclxuICAgIGZ1bmN0aW9uIG5nUmVkdXhDb25maWcoJG5nUmVkdXhQcm92aWRlcikge1xyXG4gICAgICAgICRuZ1JlZHV4UHJvdmlkZXIuY3JlYXRlU3RvcmVXaXRoKHJlZHVjZXJzKTtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2JhbmRDcmVhdGUnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGJhbmRDcmVhdGVDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBiYW5kQ3JlYXRlQ3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICdiYW5kRW5kcG9pbnQnLFxyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBiYW5kQ3JlYXRlQ3RybChiYW5kRW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmZvcm1EYXRhID0ge1xyXG4gICAgICAgICAgICBuYW1lOiAnJyxcclxuICAgICAgICAgICAgZGVzY3JpcHRpb246ICcnXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2bS5mb3JtU3VibWl0ID0gZm9ybVN1Ym1pdEhhbmRsZXI7XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9ybVN1Ym1pdEhhbmRsZXIoZSkge1xyXG4gICAgICAgICAgICBiYW5kRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5jcmVhdGVCYW5kKHZtLmZvcm1EYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9iYW5kcycpKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZScsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxmb3JtIG5hbWU9XCJmb3JtLWNyZWF0ZS1iYW5kXCIgbmctc3VibWl0PVwiJGN0cmwuZm9ybVN1Ym1pdCgpXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNyZWF0ZS1iYW5kLW5hbWVcIj7QndCw0LfQstCw0L3QuNC1INCz0YDRg9C/0L/RizwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCBpZD1cImNyZWF0ZS1iYW5kLW5hbWVcIiBuYW1lPVwiY3JlYXRlLWJhbmQtbmFtZVwiIG5nLW1vZGVsPVwiJGN0cmwuZm9ybURhdGEubmFtZVwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIj7QntC/0LjRgdCw0L3QuNC1INCz0YDRg9C/0L/RizwvbGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZXh0YXJlYSBpZD1cImNyZWF0ZS1iYW5kLWRlc2NyaXB0aW9uXCIgbmFtZT1cImNyZWF0ZS1iYW5kLWRlc2NyaXB0aW9uXCIgbmctbW9kZWw9XCIkY3RybC5mb3JtRGF0YS5kZXNjcmlwdGlvblwiIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIj48L3RleHRhcmVhPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cInN1Ym1pdFwiIGNsYXNzPVwiYnRuIGJ0bi1wcmltYXJ5XCI+0KHQvtC30LTQsNGC0Yw8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYmFuZEVkaXQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGJhbmRFZGl0Q3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgYmFuZEVkaXRDdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJ2JhbmRFbmRwb2ludCcsXHJcbiAgICAgICAgJyRyb3V0ZVBhcmFtcycsXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnYWN0aW9ucyddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGJhbmRFZGl0Q3RybChiYW5kRW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvdXRlUGFyYW1zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cclxuICAgICAgICBiYW5kRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRCYW5kKHtpZDogdm0uaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICB2bS5iYW5kRGF0YSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZtLmZvcm1TdWJtaXQgPSBmb3JtU3VibWl0O1xyXG4gICAgICAgIHZtLmZvcm1DYW5jZWwgPSBmb3JtQ2FuY2VsO1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1TdWJtaXQoKSB7XHJcblxyXG4gICAgICAgICAgICBiYW5kRW5kcG9pbnQuZ2V0UmVzb3VyY2Uoe2lkOiB2bS5pZH0pLmVkaXRCYW5kKHRoaXMuYmFuZERhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5sb2NhdGlvbignL2JhbmQvJyArIHZtLmlkKSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZm9ybUNhbmNlbCgpIHtcclxuICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5sb2NhdGlvbignL2JhbmQvJyArIHZtLmlkKSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IG5nLWhpZGU9XCIkY3RybC5iYW5kRGF0YVwiPkxvYWRpbmcuLi48L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBuZy1zaG93PVwiJGN0cmwuYmFuZERhdGFcIiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgPGgzPtCg0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMPC9oMz5cclxuICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDxmb3JtIG5hbWU9XCJmb3JtLWVkaXQtYmFuZFwiIG5nLXN1Ym1pdD1cIiRjdHJsLmZvcm1TdWJtaXQoKVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjcmVhdGUtYmFuZC1uYW1lXCI+0J3QsNC30LLQsNC90LjQtSDQs9GA0YPQv9C/0Ys8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjcmVhdGUtYmFuZC1uYW1lXCIgbmFtZT1cImNyZWF0ZS1iYW5kLW5hbWVcIiBuZy1tb2RlbD1cIiRjdHJsLmJhbmREYXRhLm5hbWVcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNyZWF0ZS1iYW5kLWRlc2NyaXB0aW9uXCI+0J7Qv9C40YHQsNC90LjQtSDQs9GA0YPQv9C/0Ys8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiIG5hbWU9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiIG5nLW1vZGVsPVwiJGN0cmwuYmFuZERhdGEuZGVzY3JpcHRpb25cIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPtCh0L7RhdGA0LDQvdC40YLRjDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJyZXNldFwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgbmctY2xpY2s9XCIkY3RybC5mb3JtQ2FuY2VsKClcIj7QntGC0LzQtdC90LA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgIDwvZm9ybT5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEucmVnaXN0cmF0aW9uX2RhdGV9fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEubWVtYmVyc319PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5jcmVhdG9yfX08L3A+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2JhbmRJbmZvJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBiYW5kSW5mb0N0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGJhbmRJbmZvQ3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICdiYW5kRW5kcG9pbnQnLFxyXG4gICAgICAgICckcm91dGVQYXJhbXMnLFxyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBiYW5kSW5mb0N0cmwoYmFuZEVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICRyb3V0ZVBhcmFtcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcbiAgICAgICAgYmFuZEVuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0QmFuZCh7aWQ6IHZtLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdm0uYmFuZERhdGEgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2bS5iYW5kRWRpdCA9IGJhbmRFZGl0O1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGJhbmRFZGl0KCkge1xyXG4gICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmxvY2F0aW9uKCcvYmFuZEVkaXQvJyArIHZtLmlkKSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50X19iYW5kXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaGVyby1pbWFnZVwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNpZGVcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2lkZS1sZWZ0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiYW5kX19sZWZ0LWJveFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJhbmRfX3Bob3RvXCI+PGltZyBzcmM9XCIuLi9hc3NldHMvYW50b24ucG5nXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmFuZF9fc3Vic2NyaWJlXCI+PGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPtCf0L7QtNC/0LjRgdCw0L08L2J1dHRvbj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiYW5kX19jb3VudGVyc1wiPjk5OTk8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmFuZF9fbGVmdC1ib3hcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0LWJveF9faGVhZGVyXCI+0KHQvtGB0YLQvtC40YIg0LIg0LPRgNGD0L/Qv9Cw0YUgMjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImxlZnQtYm94X19ncm91cHNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZ3JvdXBzX19ncm91cFwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaWRlLWNlbnRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXBwZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ1cHBlcl9fbmFtZVwiPtCQ0L3RgtC+0L0g0JrQvtGA0LXQu9GP0LrQvtCyPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXBwZXJfX2J1dHRvbnNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+0KHQvtC+0LHRidC10L3QuNC1PC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPtCf0YDQuNCz0LvQsNGB0LjRgtGMPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBuZy1oaWRlPVwiJGN0cmwuYmFuZERhdGFcIj5Mb2FkaW5nLi4uPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgbmctc2hvdz1cIiRjdHJsLmJhbmREYXRhXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPnt7JGN0cmwuYmFuZERhdGEubmFtZX19PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLmRhdGV9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5wbGFjZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLmNyZWF0b3J9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgbmctY2xpY2s9XCIkY3RybC5iYW5kRWRpdCgpXCI+0KDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Yw8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdiYW5kc0xpc3QnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGJhbmRzTGlzdEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGJhbmRzTGlzdEN0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdtZW1vaXplJyxcclxuICAgICAgICAnYmFuZHNFbmRwb2ludCdcclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gYmFuZHNMaXN0Q3RybCgkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtb2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgYmFuZHNFbmRwb2ludCkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuJG9uRGVzdHJveSA9ICRvbkRlc3Ryb3k7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0QmFuZHMgPSBtZW1vaXplKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBiYW5kc0VuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0QmFuZHMoe30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0uYmFuZHMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdmFyIHVuY29ubmVjdCA9ICRuZ1JlZHV4LnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzdGF0ZSA9ICRuZ1JlZHV4LmdldFN0YXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZ2V0QmFuZHMoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRCYW5kcygpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiAkb25EZXN0cm95KCkge1xyXG4gICAgICAgICAgICB1bmNvbm5lY3QoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIiBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLmJhbmRzXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgIDxoMz48YSBocmVmPVwiIy9iYW5kL3t7aXRlbS5pZH19XCI+e3tpdGVtLm5hbWV9fTwvYT48L2gzPlxyXG4gICAgICAgICAgICAgICAgPHA+e3tpdGVtLmRlc2NyaXB0aW9ufX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD5yZWdpc3Rlcjoge3tpdGVtLnJlZ2lzdHJhdGlvbl9kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD5tZW1iZXJzOiB7e2l0ZW0ubWVtYmVyc319PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+Y3JlYXRvcjoge3tpdGVtLmNyZWF0b3J9fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPjxhIGhyZWY9XCIjL2JhbmRFZGl0L3t7aXRlbS5pZH19XCI+0KDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Yw8L2E+PC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnY29udGVudCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogY29udGVudENvbnRyb2xsZXIsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGNvbnRlbnRDb250cm9sbGVyLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnbWVtb2l6ZScsXHJcbiAgICAgICAgJyRsb2NhdGlvbiddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGNvbnRlbnRDb250cm9sbGVyKCRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtb2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbikge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0TG9jYXRpb24gPSBtZW1vaXplKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHRoaXMuc2V0SGFzaFNlYXJjaCA9IG1lbW9pemUoZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnNlYXJjaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgJG5nUmVkdXguc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHN0YXRlID0gJG5nUmVkdXguZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRMb2NhdGlvbihzdGF0ZS5sb2NhdGlvbi5wYXRoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRIYXNoU2VhcmNoKHN0YXRlLmxvY2F0aW9uLmhhc2hTZWFyY2gpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvcC1tZW51XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidG9wLW1lbnVfX2hvbGRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0yXCI+PGEgaHJlZj1cIiMvXCI+PGltZyBzcmM9XCJjc3MvaW1nL2xvZ28yLnBuZ1wiIGFsdD1cIlJvY2twYXJhZGVcIj48L2E+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tOFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPG5hdmlnYXRpb24+PC9uYXZpZ2F0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YXV0aC13aWRnZXQ+PC9hdXRoLXdpZGdldD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50IGhhcy10b3AtbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBuZy12aWV3PVwiXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdldmVudEluZm8nLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGV2ZW50SW5mb0N0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGV2ZW50SW5mb0N0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnZXZlbnRFbmRwb2ludCcsXHJcbiAgICAgICAgJyRyb3V0ZVBhcmFtcyddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGV2ZW50SW5mb0N0cmwoZXZlbnRFbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvdXRlUGFyYW1zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcbiAgICAgICAgZXZlbnRFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEV2ZW50KHtpZDogdm0uaWR9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdm0uZXZlbnREYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgIDxoMz57eyRjdHJsLmV2ZW50RGF0YS5uYW1lfX08L2gzPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5ldmVudERhdGEuZGVzY3JpcHRpb259fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuZXZlbnREYXRhLmRhdGV9fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuZXZlbnREYXRhLnBsYWNlfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmV2ZW50RGF0YS5jcmVhdG9yfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2V2ZW50c0xpc3QnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGV2ZW50c0xpc3RDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBldmVudHNMaXN0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ21lbW9pemUnLFxyXG4gICAgICAgICdldmVudHNFbmRwb2ludCdcclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gZXZlbnRzTGlzdEN0cmwoJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1vaXplLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzRW5kcG9pbnQpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSAkb25EZXN0cm95O1xyXG5cclxuICAgICAgICB0aGlzLmdldEV2ZW50cyA9IG1lbW9pemUoZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRFdmVudHMoe3NlYXJjaFN0cmluZzogdmFsdWV9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ldmVudHMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBldmVudHNFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEV2ZW50c0FsbCh7fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZXZlbnRzID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciB1bmNvbm5lY3QgPSAkbmdSZWR1eC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSAkbmdSZWR1eC5nZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmdldEV2ZW50cyhzdGF0ZS5zZWFyY2gucXVlcnkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmdldEV2ZW50cygpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiAkb25EZXN0cm95KCkge1xyXG4gICAgICAgICAgICB1bmNvbm5lY3QoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIiBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLmV2ZW50c1wiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8aDM+PGEgaHJlZj1cIiMvZXZlbnQve3tpdGVtLmlkfX1cIj57e2l0ZW0ubmFtZX19PC9hPjwvaDM+XHJcbiAgICAgICAgICAgICAgICA8cD57e2l0ZW0uZGVzY3JpcHRpb259fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7aXRlbS5kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCduYXZpZ2F0aW9uJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBuYXZpZ2F0aW9uQ3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgbmF2aWdhdGlvbkN0cmwuJGluamVjdCA9IFsnYXV0aFNlcnZpY2UnLCAnJHJvb3RTY29wZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIG5hdmlnYXRpb25DdHJsKGF1dGhTZXJ2aWNlLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuXHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2F1dGhDaGFuZ2VkJywgYXV0aENoYW5nZWQpO1xyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYXV0aENoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHZtLmlzQXV0aCA9IGF1dGhTZXJ2aWNlLmlzQXV0aCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwidG9wLW5hdlwiPiBcclxuICAgICAgICAgICAgICAgICAgICA8bGkgbmctaWY9XCIkY3RybC5pc0F1dGhcIj48YSBocmVmPVwiIy9ob21lXCI+0JzQvtGPINGB0YLRgNCw0L3QuNGG0LA8L2E+PC9saT5cclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvYmFuZHNcIj7QkNGA0YLQuNGB0YLRizwvYT48L2xpPiAgIFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9sb2NhdGlvbnNcIj7Qn9C70L7RidCw0LTQutC4PC9hPjwvbGk+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9ldmVudHNcIj7QnNC10YDQvtC/0YDQuNGP0YLQuNGPPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c2VhcmNoLXdpZGdldD48L3NlYXJjaC13aWRnZXQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9saT5cclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdzZWFyY2hNb2R1bGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3NlYXJjaFdpZGdldCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogc2VhcmNoV2lkZ2V0Q3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgc2VhcmNoV2lkZ2V0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNlYXJjaFdpZGdldEN0cmwoJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgdW5jb25uZWN0ID0gJG5nUmVkdXguY29ubmVjdChtYXBTdGF0ZVRvVGhpcywgYWN0aW9ucykodm0pO1xyXG5cclxuICAgICAgICB0aGlzLnF1ZXJ5ID0gJyc7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hLZXlQcmVzcyA9IHNlYXJjaEtleVByZXNzO1xyXG4gICAgICAgIHRoaXMuc2VhcmNoS2V5VXAgPSBzZWFyY2hLZXlVcDtcclxuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSAkb25EZXN0cm95O1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcFN0YXRlVG9UaGlzKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZTogc3RhdGVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoS2V5UHJlc3MoZSkge1xyXG4gICAgICAgICAgICBpZiAoZS5jaGFyQ29kZSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9zZWFyY2gnKSk7XHJcbiAgICAgICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmhhc2hTZWFyY2goJ3E9JyArIHRoaXMucXVlcnkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoS2V5VXAoZSkge1xyXG4gICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmNoYW5nZVNlYXJjaFN0cmluZyh0aGlzLnF1ZXJ5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiAkb25EZXN0cm95KCkge1xyXG4gICAgICAgICAgICB1bmNvbm5lY3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzZWFyY2gtd2lkZ2V0XCI+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInNlYXJjaFwiIFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZm9ybS1jb250cm9sIGlucHV0LXNtXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgbmcta2V5cHJlc3M9XCIkY3RybC5zZWFyY2hLZXlQcmVzcygkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICBuZy1rZXl1cD1cIiRjdHJsLnNlYXJjaEtleVVwKCRldmVudClcIlxyXG4gICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVwiJGN0cmwucXVlcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi0J/QvtC40YHQulwiPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdhdXRoRW5kcG9pbnQnLCBhdXRoRW5kcG9pbnQpO1xyXG5cclxuYXV0aEVuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJGNvb2tpZXMnXTtcclxuXHJcbmZ1bmN0aW9uIGF1dGhFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJGNvb2tpZXMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG4gICAgdmFyIHRva2VuID0gJGNvb2tpZXMuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICB2YXIgc3RhciA9ICcqJztcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvOmVudGl0eS86dHlwZScsIHF1ZXJ5UGFyYW0sIHtcclxuICAgICAgICAgICAgZ2V0Q3VycmVudFVzZXI6IHtcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogJ3VzZXInXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxvZ2luOiB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6ICdsb2dpbicsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZrJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2JhbmRFbmRwb2ludCcsIGJhbmRFbmRwb2ludCk7XHJcblxyXG5iYW5kRW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCcsICckcSddO1xyXG5cclxuZnVuY3Rpb24gYmFuZEVuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsLCAkcSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKHBhcmFtcykge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy9iYW5kLzppZC86ZW50aXR5JywgcGFyYW1zLCB7XHJcbiAgICAgICAgICAgIGdldEJhbmQ6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZWRpdEJhbmQ6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BVVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgY3JlYXRlQmFuZDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgYWRkTWVtYmVyVG9CYW5kOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5OiAnbWVtYmVycydcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2JhbmRzRW5kcG9pbnQnLCBiYW5kc0VuZHBvaW50KTtcclxuXHJcbmJhbmRzRW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCcsICckcSddO1xyXG5cclxuZnVuY3Rpb24gYmFuZHNFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJHEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy9iYW5kcy86bGltaXQvOm9mZnNldCcsIHF1ZXJ5UGFyYW0sIHtcclxuICAgICAgICAgICAgZ2V0QmFuZHM6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2V2ZW50RW5kcG9pbnQnLCBldmVudEVuZHBvaW50KTtcclxuXHJcbmV2ZW50RW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCcsICckcSddO1xyXG5cclxuZnVuY3Rpb24gZXZlbnRFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJHEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy9ldmVudC86aWQnLCBxdWVyeVBhcmFtLCB7XHJcbiAgICAgICAgICAgIGdldEV2ZW50OiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScpXHJcbiAgICAuc2VydmljZSgnZXZlbnRzRW5kcG9pbnQnLCBldmVudHNFbmRwb2ludCk7XHJcblxyXG5ldmVudHNFbmRwb2ludC4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnYXBpVXJsJywgJyRxJ107XHJcblxyXG5mdW5jdGlvbiBldmVudHNFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJHEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy9ldmVudHMvOmxpa2UvOnNlYXJjaFN0cmluZy86bGltaXQvOm9mZnNldCcsIHF1ZXJ5UGFyYW0sIHtcclxuICAgICAgICAgICAgZ2V0RXZlbnRzQWxsOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaWtlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFN0cmluZzogbnVsbCxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0RXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaWtlOiAnbGlrZScsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiYW5ndWxhci5tb2R1bGUoJ2F1dGhNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2F1dGhTZXJ2aWNlJywgYXV0aFNlcnZpY2UpO1xyXG5cclxuYXV0aFNlcnZpY2UuJGluamVjdCA9IFsnYXV0aEVuZHBvaW50JyxcclxuICAgICckcScsXHJcbiAgICAnJGNvb2tpZXMnLFxyXG4gICAgJyRsb2NhdGlvbiddO1xyXG5cclxuZnVuY3Rpb24gYXV0aFNlcnZpY2UoYXV0aEVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAkcSxcclxuICAgICAgICAgICAgICAgICAgICAgJGNvb2tpZXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICRsb2NhdGlvbikge1xyXG5cclxuICAgIHZhciBjdXJyZW50VXNlckRlZmVyO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNBdXRoOiBpc0F1dGgsXHJcbiAgICAgICAgbG9naW46IGxvZ2luLFxyXG4gICAgICAgIGxvZ291dDogbG9nb3V0LFxyXG4gICAgICAgIGdldEN1cnJlbnRVc2VyOiBnZXRDdXJyZW50VXNlcixcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gaXNBdXRoKCkge1xyXG4gICAgICAgIHJldHVybiAhISRjb29raWVzLmdldCgnQVVUSC1UT0tFTicpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvZ2luKCkge1xyXG4gICAgICAgIGF1dGhFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmxvZ2luKHt9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZTonLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlOicsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgICAgICRjb29raWVzLnJlbW92ZSgnQVVUSC1UT0tFTicpO1xyXG4gICAgICAgICRsb2NhdGlvbi5wYXRoKCcvIycpO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGdldEN1cnJlbnRVc2VyKCkge1xyXG4gICAgICAgIGlmICghY3VycmVudFVzZXJEZWZlcikge1xyXG4gICAgICAgICAgICBjdXJyZW50VXNlckRlZmVyID0gJHEuZGVmZXIoKTtcclxuICAgICAgICAgICAgYXV0aEVuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0Q3VycmVudFVzZXIoe30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyRGVmZXIucmVzb2x2ZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlckRlZmVyLnJlamVjdChyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjdXJyZW50VXNlckRlZmVyLnByb21pc2U7XHJcbiAgICB9XHJcbn1cclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhdXRoTW9kdWxlJylcclxuICAgICAgICAuY29udHJvbGxlcignYXV0aExvZ2luUHJvY2Vzc0N0cmwnLCBhdXRoTG9naW5Qcm9jZXNzQ3RybCk7XHJcblxyXG4gICAgYXV0aExvZ2luUHJvY2Vzc0N0cmwuJGluamVjdCA9IFsnJHJvdXRlUGFyYW1zJywgJyRsb2NhdGlvbicsICckY29va2llcycsICckcm9vdFNjb3BlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0aExvZ2luUHJvY2Vzc0N0cmwoJHJvdXRlUGFyYW1zLCAkbG9jYXRpb24sICRjb29raWVzLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICBpZiAoJHJvdXRlUGFyYW1zLmhhc093blByb3BlcnR5KCd0b2tlbicpKSB7XHJcbiAgICAgICAgICAgIHZhciBleHBpcmVEYXRlID0gbmV3IERhdGUoKTtcclxuICAgICAgICAgICAgZXhwaXJlRGF0ZS5zZXREYXRlKGV4cGlyZURhdGUuZ2V0RGF0ZSgpICsgMTQpO1xyXG4gICAgICAgICAgICAkY29va2llcy5wdXQoJ0FVVEgtVE9LRU4nLCAkcm91dGVQYXJhbXMudG9rZW4sIHsnZXhwaXJlcyc6IGV4cGlyZURhdGV9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnYXV0aENoYW5nZWQnKTtcclxuICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8jL2hvbWUnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdm07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhdXRoTW9kdWxlJylcclxuICAgICAgICAuY29tcG9uZW50KCdhdXRoV2lkZ2V0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBhdXRoV2lkZ2V0Q3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgYXV0aFdpZGdldEN0cmwuJGluamVjdCA9IFsnYXV0aFNlcnZpY2UnLFxyXG4gICAgICAgICdhcGlVcmwnLCAnJHJvb3RTY29wZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhXaWRnZXRDdHJsKGF1dGhTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpVXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubG9naW5VcmwgPSBhcGlVcmwgKyAnL2xvZ2luL3ZrJztcclxuICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuICAgICAgICB2bS5sb2dpbiA9IGF1dGhTZXJ2aWNlLmxvZ2luO1xyXG4gICAgICAgIHZtLmxvZ291dCA9IGxvZ291dDtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignYXV0aENoYW5nZWQnLCBhdXRoQ2hhbmdlZCk7XHJcblxyXG4gICAgICAgIGlmICh2bS5pc0F1dGgpIHtcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdm0udXNlciA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmxvZ291dCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdhdXRoQ2hhbmdlZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYXV0aENoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHZtLmlzQXV0aCA9IGF1dGhTZXJ2aWNlLmlzQXV0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImF1dGgtd2lkZ2V0X19idG4taG9sZGVyXCIgXHJcbiAgICAgICAgICAgICAgICAgbmctaWY9XCIhJGN0cmwuaXNBdXRoXCI+XHJcbiAgICAgICAgICAgICAgICA8YSBjbGFzcz1cImJ0biBidG4tZGVmYXVsdCBidG4tc21cIiBocmVmPVwie3skY3RybC5sb2dpblVybH19XCI+0JLQvtC50YLQuDwvYT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgbmctaWY9XCIkY3RybC5pc0F1dGhcIj5cclxuICAgICAgICAgICAgICAgIDxkaXY+SGksIHt7JGN0cmwudXNlci5sb2dpbn19ITwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGEgbmctY2xpY2s9XCIkY3RybC5sb2dvdXQoKVwiPkxvZ291dDwvYT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
