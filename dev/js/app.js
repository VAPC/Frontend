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
            <div ng-if="!$ctrl.isAuth">
            <a href="{{$ctrl.loginUrl}}">Login with Vkontakte</a>
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
            <div class="page-holder">
                <div class="container">
                    <header class="row header">
                        <div class="col-sm-2"><a href="#/"><img src="css/img/logo.png" height="75px" alt="Rockparade"></a></div>
                        <div class="col-sm-8">
                            <navigation></navigation>
                        </div>
                        <div class="col-sm-2">
                            <auth-widget></auth-widget>
                        </div>
                    </header>
                    <div class="row search-holder">
                        <div class="col-sm-8 col-sm-offset-2">
                            <search-widget></search-widget>
                        </div>
                    </div>
                    <div class="content">
                        <div ng-view=""></div>
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
            <div class="navbar navbar-default">
                <ul class="nav navbar-nav"> 
                    <li ng-if="$ctrl.isAuth"><a href="#/home">Моя страница</a></li> 
                    <li><a href="#/events">Мероприятия</a></li> 
                    <li><a href="#/bands">Артисты</a></li> 
                    <li><a>Блог</a></li> 
                </ul>
            </div>
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
            <div>
                <input type="search" 
                    class="form-control" 
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImVuZHBvaW50cy9lbmRwb2ludHMubWRsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGgubWRsLmpzIiwiY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoLm1kbC5qcyIsInJvdXRlci5qcyIsImFwcC9hY3Rpb25zLmpzIiwiYXBwL21lbW9pemUuanMiLCJhcHAvcmVkdWNlcnMuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aC5zcnYuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aExvZ2luUHJvY2Vzcy5jdHJsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGhXaWRnZXQuY210LmpzIiwiY29tcG9uZW50cy9iYW5kLWNyZWF0ZS9iYW5kLWNyZWF0ZS5jbXQuanMiLCJjb21wb25lbnRzL2JhbmQtZWRpdC9iYW5kLWVkaXQuY210LmpzIiwiY29tcG9uZW50cy9iYW5kcy1saXN0L2JhbmRzLWxpc3QuY210LmpzIiwiY29tcG9uZW50cy9iYW5kLWluZm8vYmFuZC1pbmZvLmNtdC5qcyIsImNvbXBvbmVudHMvY29udGVudC9jb250ZW50LmNtdC5qcyIsImNvbXBvbmVudHMvZXZlbnQtaW5mby9ldmVudHMtaW5mby5jbXQuanMiLCJjb21wb25lbnRzL25hdmlnYXRpb24vbmF2aWdhdGlvbi5jbXQuanMiLCJjb21wb25lbnRzL3NlYXJjaC9zZWFyY2hXaWRnZXQuY210LmpzIiwiY29tcG9uZW50cy9ldmVudHMtbGlzdC9ldmVudHMtbGlzdC5jbXQuanMiLCJlbmRwb2ludHMvYXV0aC9hdXRoRW5kcG9pbnQuanMiLCJlbmRwb2ludHMvYmFuZHMvYmFuZEVuZHBvaW50LmpzIiwiZW5kcG9pbnRzL2JhbmRzL2JhbmRzRW5kcG9pbnQuanMiLCJlbmRwb2ludHMvZXZlbnRzL2V2ZW50RW5kcG9pbnQuanMiLCJlbmRwb2ludHMvZXZlbnRzL2V2ZW50c0VuZHBvaW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgcmVkdWNlcnMgZnJvbSAnLi9hcHAvcmVkdWNlcnMnXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScsIFtcclxuICAgICAgICAgICAgJ25nUm91dGUnLFxyXG4gICAgICAgICAgICAnbmdDb29raWVzJyxcclxuICAgICAgICAgICAgJ25nUmVzb3VyY2UnLFxyXG4gICAgICAgICAgICAnbmdSZWR1eCcsXHJcblxyXG4gICAgICAgICAgICAnZW5kcG9pbnRzTW9kdWxlJyxcclxuICAgICAgICAgICAgJ2F1dGhNb2R1bGUnLFxyXG4gICAgICAgICAgICAnc2VhcmNoTW9kdWxlJyxcclxuICAgICAgICBdKTtcclxuXHJcbn0oKSk7IiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ2FwaVVybCcsIGFwaVVybCk7XHJcblxyXG5mdW5jdGlvbiBhcGlVcmwoKSB7XHJcbiAgICB2YXIgdXJsO1xyXG4gICAgc3dpdGNoICh3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpIHtcclxuICAgICAgICBjYXNlICdsb2NhbGhvc3QnOlxyXG4gICAgICAgICAgICB1cmwgPSAnaHR0cDovL3JvY2twYXJhZGUuY3Jlb3JhLnJ1L2FwaSc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyAnL2FwaSc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVybDtcclxufVxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2F1dGhNb2R1bGUnLCBbXSlcclxuICAgICAgICAvLyAuY29uZmlnKGh0dHBJbnRlcmNlcHRvckNvbmZpZylcclxuICAgICAgICAucnVuKGh0dHBJbnRlcmNlcHRvclJ1bik7XHJcblxyXG4gICAgLy8gaHR0cEludGVyY2VwdG9yQ29uZmlnLiRpbmplY3QgPSBbJyRodHRwUHJvdmlkZXInXTtcclxuICAgIC8vXHJcbiAgICAvLyBmdW5jdGlvbiBodHRwSW50ZXJjZXB0b3JDb25maWcoJGh0dHBQcm92aWRlcikge1xyXG4gICAgLy8gICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMudXNlWERvbWFpbiA9IHRydWU7XHJcbiAgICAvLyAgICAgZGVsZXRlICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtUmVxdWVzdGVkLVdpdGgnXTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBodHRwSW50ZXJjZXB0b3JSdW4uJGluamVjdCA9IFsnJGluamVjdG9yJ107XHJcbiAgICBmdW5jdGlvbiBodHRwSW50ZXJjZXB0b3JSdW4oJGluamVjdG9yKSB7XHJcbiAgICAgICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgICAgICB2YXIgVE9LRU4gPSAkaW5qZWN0b3IuZ2V0KCckY29va2llcycpLmdldCgnQVVUSC1UT0tFTicpO1xyXG4gICAgICAgIGlmIChUT0tFTikge1xyXG5cclxuICAgICAgICAgICAgdmFyICRodHRwID0gJGluamVjdG9yLmdldCgnJGh0dHAnKTtcclxuICAgICAgICAgICAgJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0FVVEgtVE9LRU4nXSA9IFRPS0VOO1xyXG4gICAgICAgICAgICAvLyAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLnBvc3RbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCc7XHJcbiAgICAgICAgICAgIC8vICRodHRwLmRlZmF1bHRzLmhlYWRlcnMucHV0WydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnO1xyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0F1dGg6IHVzZXIgYXV0aGVudGljYXRpb24gZXJyb3IuIENvb2tpZXMgZG9lc25cXCd0IGNvbnRhaW4gXCJBVVRILVRPS0VOXCInKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZWFyY2hNb2R1bGUnLCBbXSk7XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29uZmlnKHJvdXRlcik7XHJcblxyXG4gICAgcm91dGVyLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJ107XHJcblxyXG4gICAgZnVuY3Rpb24gcm91dGVyKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xhbmRpbmcuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvaG9tZScsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnaG9tZS5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9ldmVudC86aWQnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2V2ZW50Lmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2V2ZW50cycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZXZlbnRzLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2JhbmRzJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdiYW5kcy5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9iYW5kLzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmFuZC5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9iYW5kQ3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdiYW5kQ3JlYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2JhbmRFZGl0LzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmFuZEVkaXQuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvc2VhcmNoPzpibGEnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NlYXJjaC5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9sb2dpbi92ay9jYWxsYmFjaycsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdhdXRoTG9naW5Qcm9jZXNzQ3RybCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJycsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vdGhlcndpc2Uoe1xyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XHJcbiAgICAgICAgLy8gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAvLyAgICByZXF1aXJlQmFzZTogZmFsc2VcclxuICAgICAgICAvL30pO1xyXG4gICAgfTtcclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuc2VydmljZSgnYWN0aW9ucycsIGFjdGlvbnMpO1xyXG5cclxuICAgIGFjdGlvbnMuJGluamVjdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGlvbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2hhbmdlU2VhcmNoU3RyaW5nOiBjaGFuZ2VTZWFyY2hTdHJpbmcsXHJcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcclxuICAgICAgICAgICAgaGFzaFNlYXJjaDpoYXNoU2VhcmNoLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVNlYXJjaFN0cmluZyh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ0NIQU5HRV9TRUFSQ0hfU1RSSU5HJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2NhdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ0xPQ0FUSU9OJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGhhc2hTZWFyY2godmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdIQVNIX1NFQVJDSCcsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIG1lbW9pemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIChmdW5jLCBlcXVhbGl0eUNoZWNrID0gZGVmYXVsdEVxdWFsaXR5Q2hlY2spID0+IHtcclxuICAgICAgICAgICAgbGV0IGxhc3RBcmdzID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IGxhc3RSZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBsYXN0QXJncyAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RBcmdzLmxlbmd0aCA9PT0gYXJncy5sZW5ndGggJiZcclxuICAgICAgICAgICAgICAgICAgICBhcmdzLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IGVxdWFsaXR5Q2hlY2sodmFsdWUsIGxhc3RBcmdzW2luZGV4XSkpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxhc3RBcmdzID0gYXJncztcclxuICAgICAgICAgICAgICAgIGxhc3RSZXN1bHQgPSBmdW5jKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRlZmF1bHRFcXVhbGl0eUNoZWNrKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gYSA9PT0gYlxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuZmFjdG9yeSgnbWVtb2l6ZScsIG1lbW9pemUpO1xyXG5cclxuXHJcbn0oKSk7XHJcblxyXG4vLyBmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIGVxdWFsaXR5Q2hlY2sgPSBkZWZhdWx0RXF1YWxpdHlDaGVjaykge1xyXG4vLyAgICAgbGV0IGxhc3RBcmdzID0gbnVsbDtcclxuLy8gICAgIGxldCBsYXN0UmVzdWx0ID0gbnVsbDtcclxuLy8gICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xyXG4vLyAgICAgICAgIGlmIChcclxuLy8gICAgICAgICAgICAgbGFzdEFyZ3MgIT09IG51bGwgJiZcclxuLy8gICAgICAgICAgICAgbGFzdEFyZ3MubGVuZ3RoID09PSBhcmdzLmxlbmd0aCAmJlxyXG4vLyAgICAgICAgICAgICBhcmdzLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IGVxdWFsaXR5Q2hlY2sodmFsdWUsIGxhc3RBcmdzW2luZGV4XSkpXHJcbi8vICAgICAgICAgKSB7XHJcbi8vICAgICAgICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBsYXN0QXJncyA9IGFyZ3M7XHJcbi8vICAgICAgICAgbGFzdFJlc3VsdCA9IGZ1bmMoLi4uYXJncyk7XHJcbi8vICAgICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XHJcbi8vICAgICB9XHJcbi8vIH0iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHZhciBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICAgICAgcGF0aDogJycsXHJcbiAgICAgICAgICAgIGhhc2hTZWFyY2g6ICcnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoOiB7XHJcbiAgICAgICAgICAgIHF1ZXJ5OiAnJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVzZXI6IHtcclxuICAgICAgICAgICAgdWlkOiAnJyxcclxuICAgICAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gcmVkdWNlcnMoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikge1xyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ0NIQU5HRV9TRUFSQ0hfU1RSSU5HJzpcclxuICAgICAgICAgICAgICAgIHN0YXRlLnNlYXJjaC5xdWVyeSA9IGFjdGlvbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ0xPQ0FUSU9OJzpcclxuICAgICAgICAgICAgICAgIHN0YXRlLmxvY2F0aW9uLnBhdGggPSBhY3Rpb24udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSk7XHJcbiAgICAgICAgICAgIGNhc2UgJ0hBU0hfU0VBUkNIJzpcclxuICAgICAgICAgICAgICAgIHN0YXRlLmxvY2F0aW9uLmhhc2hTZWFyY2ggPSBhY3Rpb24udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb25maWcobmdSZWR1eENvbmZpZyk7XHJcblxyXG4gICAgbmdSZWR1eENvbmZpZy4kaW5qZWN0ID0gWyckbmdSZWR1eFByb3ZpZGVyJ107XHJcblxyXG4gICAgZnVuY3Rpb24gbmdSZWR1eENvbmZpZygkbmdSZWR1eFByb3ZpZGVyKSB7XHJcbiAgICAgICAgJG5nUmVkdXhQcm92aWRlci5jcmVhdGVTdG9yZVdpdGgocmVkdWNlcnMpO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCJhbmd1bGFyLm1vZHVsZSgnYXV0aE1vZHVsZScpXHJcbiAgICAuc2VydmljZSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZSk7XHJcblxyXG5hdXRoU2VydmljZS4kaW5qZWN0ID0gWydhdXRoRW5kcG9pbnQnLFxyXG4gICAgJyRxJyxcclxuICAgICckY29va2llcycsXHJcbiAgICAnJGxvY2F0aW9uJ107XHJcblxyXG5mdW5jdGlvbiBhdXRoU2VydmljZShhdXRoRW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICRxLFxyXG4gICAgICAgICAgICAgICAgICAgICAkY29va2llcyxcclxuICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uKSB7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRVc2VyRGVmZXI7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpc0F1dGg6IGlzQXV0aCxcclxuICAgICAgICBsb2dpbjogbG9naW4sXHJcbiAgICAgICAgbG9nb3V0OiBsb2dvdXQsXHJcbiAgICAgICAgZ2V0Q3VycmVudFVzZXI6IGdldEN1cnJlbnRVc2VyLFxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBpc0F1dGgoKSB7XHJcbiAgICAgICAgcmV0dXJuICEhJGNvb2tpZXMuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9naW4oKSB7XHJcbiAgICAgICAgYXV0aEVuZHBvaW50LmdldFJlc291cmNlKCkubG9naW4oe30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlOicsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2U6JywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgICAgICAgJGNvb2tpZXMucmVtb3ZlKCdBVVRILVRPS0VOJyk7XHJcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8jJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXIoKSB7XHJcbiAgICAgICAgaWYgKCFjdXJyZW50VXNlckRlZmVyKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyRGVmZXIgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICBhdXRoRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRDdXJyZW50VXNlcih7fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXJEZWZlci5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyRGVmZXIucmVqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRVc2VyRGVmZXIucHJvbWlzZTtcclxuICAgIH1cclxufVxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2F1dGhNb2R1bGUnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdhdXRoTG9naW5Qcm9jZXNzQ3RybCcsIGF1dGhMb2dpblByb2Nlc3NDdHJsKTtcclxuXHJcbiAgICBhdXRoTG9naW5Qcm9jZXNzQ3RybC4kaW5qZWN0ID0gWyckcm91dGVQYXJhbXMnLCAnJGxvY2F0aW9uJywgJyRjb29raWVzJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoTG9naW5Qcm9jZXNzQ3RybCgkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgJGNvb2tpZXMsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIGlmICgkcm91dGVQYXJhbXMuaGFzT3duUHJvcGVydHkoJ3Rva2VuJykpIHtcclxuICAgICAgICAgICAgdmFyIGV4cGlyZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBleHBpcmVEYXRlLnNldERhdGUoZXhwaXJlRGF0ZS5nZXREYXRlKCkgKyAxNCk7XHJcbiAgICAgICAgICAgICRjb29raWVzLnB1dCgnQVVUSC1UT0tFTicsICRyb3V0ZVBhcmFtcy50b2tlbiwgeydleHBpcmVzJzogZXhwaXJlRGF0ZX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdhdXRoQ2hhbmdlZCcpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLyMvaG9tZScpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiB2bTtcclxuICAgIH1cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ2F1dGhNb2R1bGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2F1dGhXaWRnZXQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGF1dGhXaWRnZXRDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBhdXRoV2lkZ2V0Q3RybC4kaW5qZWN0ID0gWydhdXRoU2VydmljZScsXHJcbiAgICAgICAgJ2FwaVVybCcsICckcm9vdFNjb3BlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gYXV0aFdpZGdldEN0cmwoYXV0aFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhcGlVcmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5sb2dpblVybCA9IGFwaVVybCArICcvbG9naW4vdmsnO1xyXG4gICAgICAgIHZtLmlzQXV0aCA9IGF1dGhTZXJ2aWNlLmlzQXV0aCgpO1xyXG4gICAgICAgIHZtLmxvZ2luID0gYXV0aFNlcnZpY2UubG9naW47XHJcbiAgICAgICAgdm0ubG9nb3V0ID0gbG9nb3V0O1xyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdhdXRoQ2hhbmdlZCcsIGF1dGhDaGFuZ2VkKTtcclxuXHJcbiAgICAgICAgaWYgKHZtLmlzQXV0aCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5nZXRDdXJyZW50VXNlcigpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB2bS51c2VyID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2UubG9nb3V0KCk7XHJcbiAgICAgICAgICAgICRyb290U2NvcGUuJGVtaXQoJ2F1dGhDaGFuZ2VkJyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBhdXRoQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdm0uaXNBdXRoID0gYXV0aFNlcnZpY2UuaXNBdXRoKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IG5nLWlmPVwiISRjdHJsLmlzQXV0aFwiPlxyXG4gICAgICAgICAgICA8YSBocmVmPVwie3skY3RybC5sb2dpblVybH19XCI+TG9naW4gd2l0aCBWa29udGFrdGU8L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IG5nLWlmPVwiJGN0cmwuaXNBdXRoXCI+XHJcbiAgICAgICAgICAgIDxkaXY+SGksIHt7JGN0cmwudXNlci5sb2dpbn19ITwvZGl2PlxyXG4gICAgICAgICAgICA8YSBuZy1jbGljaz1cIiRjdHJsLmxvZ291dCgpXCI+TG9nb3V0PC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7XHJcbiIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdiYW5kQ3JlYXRlJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBiYW5kQ3JlYXRlQ3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgYmFuZENyZWF0ZUN0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnYmFuZEVuZHBvaW50JyxcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdhY3Rpb25zJ107XHJcblxyXG4gICAgZnVuY3Rpb24gYmFuZENyZWF0ZUN0cmwoYmFuZEVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5mb3JtRGF0YSA9IHtcclxuICAgICAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiAnJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdm0uZm9ybVN1Ym1pdCA9IGZvcm1TdWJtaXRIYW5kbGVyO1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1TdWJtaXRIYW5kbGVyKGUpIHtcclxuICAgICAgICAgICAgYmFuZEVuZHBvaW50LmdldFJlc291cmNlKCkuY3JlYXRlQmFuZCh2bS5mb3JtRGF0YSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZScsIHJlc3BvbnNlKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmxvY2F0aW9uKCcvYmFuZHMnKSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICA8Zm9ybSBuYW1lPVwiZm9ybS1jcmVhdGUtYmFuZFwiIG5nLXN1Ym1pdD1cIiRjdHJsLmZvcm1TdWJtaXQoKVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjcmVhdGUtYmFuZC1uYW1lXCI+0J3QsNC30LLQsNC90LjQtSDQs9GA0YPQv9C/0Ys8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgaWQ9XCJjcmVhdGUtYmFuZC1uYW1lXCIgbmFtZT1cImNyZWF0ZS1iYW5kLW5hbWVcIiBuZy1tb2RlbD1cIiRjdHJsLmZvcm1EYXRhLm5hbWVcIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxhYmVsIGZvcj1cImNyZWF0ZS1iYW5kLWRlc2NyaXB0aW9uXCI+0J7Qv9C40YHQsNC90LjQtSDQs9GA0YPQv9C/0Ys8L2xhYmVsPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGV4dGFyZWEgaWQ9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiIG5hbWU9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiIG5nLW1vZGVsPVwiJGN0cmwuZm9ybURhdGEuZGVzY3JpcHRpb25cIiB0eXBlPVwidGV4dFwiIGNsYXNzPVwiZm9ybS1jb250cm9sXCI+PC90ZXh0YXJlYT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJzdWJtaXRcIiBjbGFzcz1cImJ0biBidG4tcHJpbWFyeVwiPtCh0L7Qt9C00LDRgtGMPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2JhbmRFZGl0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBiYW5kRWRpdEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGJhbmRFZGl0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICdiYW5kRW5kcG9pbnQnLFxyXG4gICAgICAgICckcm91dGVQYXJhbXMnLFxyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBiYW5kRWRpdEN0cmwoYmFuZEVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICRyb3V0ZVBhcmFtcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcbiAgICAgICAgYmFuZEVuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0QmFuZCh7aWQ6IHZtLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdm0uYmFuZERhdGEgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2bS5mb3JtU3VibWl0ID0gZm9ybVN1Ym1pdDtcclxuICAgICAgICB2bS5mb3JtQ2FuY2VsID0gZm9ybUNhbmNlbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtU3VibWl0KCkge1xyXG5cclxuICAgICAgICAgICAgYmFuZEVuZHBvaW50LmdldFJlc291cmNlKHtpZDogdm0uaWR9KS5lZGl0QmFuZCh0aGlzLmJhbmREYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9iYW5kLycgKyB2bS5pZCkpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1DYW5jZWwoKSB7XHJcbiAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9iYW5kLycgKyB2bS5pZCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBuZy1oaWRlPVwiJGN0cmwuYmFuZERhdGFcIj5Mb2FkaW5nLi4uPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgbmctc2hvdz1cIiRjdHJsLmJhbmREYXRhXCIgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgIDxoMz7QoNC10LTQsNC60YLQuNGA0L7QstCw0YLRjDwvaDM+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8Zm9ybSBuYW1lPVwiZm9ybS1lZGl0LWJhbmRcIiBuZy1zdWJtaXQ9XCIkY3RybC5mb3JtU3VibWl0KClcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3JlYXRlLWJhbmQtbmFtZVwiPtCd0LDQt9Cy0LDQvdC40LUg0LPRgNGD0L/Qv9GLPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY3JlYXRlLWJhbmQtbmFtZVwiIG5hbWU9XCJjcmVhdGUtYmFuZC1uYW1lXCIgbmctbW9kZWw9XCIkY3RybC5iYW5kRGF0YS5uYW1lXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiPtCe0L/QuNGB0LDQvdC40LUg0LPRgNGD0L/Qv9GLPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIiBuYW1lPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIiBuZy1tb2RlbD1cIiRjdHJsLmJhbmREYXRhLmRlc2NyaXB0aW9uXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj7QodC+0YXRgNCw0L3QuNGC0Yw8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwicmVzZXRcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIG5nLWNsaWNrPVwiJGN0cmwuZm9ybUNhbmNlbCgpXCI+0J7RgtC80LXQvdCwPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLnJlZ2lzdHJhdGlvbl9kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLm1lbWJlcnN9fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEuY3JlYXRvcn19PC9wPlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYmFuZHNMaXN0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBiYW5kc0xpc3RDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBiYW5kc0xpc3RDdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnbWVtb2l6ZScsXHJcbiAgICAgICAgJ2JhbmRzRW5kcG9pbnQnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGJhbmRzTGlzdEN0cmwoJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9pemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbmRzRW5kcG9pbnQpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSAkb25EZXN0cm95O1xyXG5cclxuICAgICAgICB0aGlzLmdldEJhbmRzID0gbWVtb2l6ZShmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgYmFuZHNFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEJhbmRzKHt9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLmJhbmRzID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciB1bmNvbm5lY3QgPSAkbmdSZWR1eC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSAkbmdSZWR1eC5nZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmdldEJhbmRzKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0QmFuZHMoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uRGVzdHJveSgpIHtcclxuICAgICAgICAgICAgdW5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIgbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5iYW5kc1wiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8aDM+PGEgaHJlZj1cIiMvYmFuZC97e2l0ZW0uaWR9fVwiPnt7aXRlbS5uYW1lfX08L2E+PC9oMz5cclxuICAgICAgICAgICAgICAgIDxwPnt7aXRlbS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+cmVnaXN0ZXI6IHt7aXRlbS5yZWdpc3RyYXRpb25fZGF0ZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+bWVtYmVyczoge3tpdGVtLm1lbWJlcnN9fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPmNyZWF0b3I6IHt7aXRlbS5jcmVhdG9yfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD48YSBocmVmPVwiIy9iYW5kRWRpdC97e2l0ZW0uaWR9fVwiPtCg0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMPC9hPjwvcD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYmFuZEluZm8nLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGJhbmRJbmZvQ3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgYmFuZEluZm9DdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJ2JhbmRFbmRwb2ludCcsXHJcbiAgICAgICAgJyRyb3V0ZVBhcmFtcycsXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnYWN0aW9ucyddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGJhbmRJbmZvQ3RybChiYW5kRW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvdXRlUGFyYW1zLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cclxuICAgICAgICBiYW5kRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRCYW5kKHtpZDogdm0uaWR9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICB2bS5iYW5kRGF0YSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZtLmJhbmRFZGl0ID0gYmFuZEVkaXQ7XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYmFuZEVkaXQoKSB7XHJcbiAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9iYW5kRWRpdC8nICsgdm0uaWQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBuZy1oaWRlPVwiJGN0cmwuYmFuZERhdGFcIj5Mb2FkaW5nLi4uPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgbmctc2hvdz1cIiRjdHJsLmJhbmREYXRhXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgzPnt7JGN0cmwuYmFuZERhdGEubmFtZX19PC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLmRhdGV9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5wbGFjZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLmNyZWF0b3J9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgbmctY2xpY2s9XCIkY3RybC5iYW5kRWRpdCgpXCI+0KDQtdC00LDQutGC0LjRgNC+0LLQsNGC0Yw8L2J1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdjb250ZW50Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBjb250ZW50Q29udHJvbGxlcixcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgY29udGVudENvbnRyb2xsZXIuJGluamVjdCA9IFtcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdtZW1vaXplJyxcclxuICAgICAgICAnJGxvY2F0aW9uJ107XHJcblxyXG4gICAgZnVuY3Rpb24gY29udGVudENvbnRyb2xsZXIoJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1vaXplLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXRMb2NhdGlvbiA9IG1lbW9pemUoZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZXRIYXNoU2VhcmNoID0gbWVtb2l6ZShmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkbmdSZWR1eC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSAkbmdSZWR1eC5nZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldExvY2F0aW9uKHN0YXRlLmxvY2F0aW9uLnBhdGgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEhhc2hTZWFyY2goc3RhdGUubG9jYXRpb24uaGFzaFNlYXJjaCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1ob2xkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aGVhZGVyIGNsYXNzPVwicm93IGhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTJcIj48YSBocmVmPVwiIy9cIj48aW1nIHNyYz1cImNzcy9pbWcvbG9nby5wbmdcIiBoZWlnaHQ9XCI3NXB4XCIgYWx0PVwiUm9ja3BhcmFkZVwiPjwvYT48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmF2aWdhdGlvbj48L25hdmlnYXRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhdXRoLXdpZGdldD48L2F1dGgtd2lkZ2V0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IHNlYXJjaC1ob2xkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS04IGNvbC1zbS1vZmZzZXQtMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlYXJjaC13aWRnZXQ+PC9zZWFyY2gtd2lkZ2V0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IG5nLXZpZXc9XCJcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnZXZlbnRJbmZvJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBldmVudEluZm9DdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBldmVudEluZm9DdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJ2V2ZW50RW5kcG9pbnQnLFxyXG4gICAgICAgICckcm91dGVQYXJhbXMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBldmVudEluZm9DdHJsKGV2ZW50RW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb3V0ZVBhcmFtcykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblxyXG4gICAgICAgIGV2ZW50RW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRFdmVudCh7aWQ6IHZtLmlkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHZtLmV2ZW50RGF0YSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8aDM+e3skY3RybC5ldmVudERhdGEubmFtZX19PC9oMz5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuZXZlbnREYXRhLmRlc2NyaXB0aW9ufX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmV2ZW50RGF0YS5kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmV2ZW50RGF0YS5wbGFjZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5ldmVudERhdGEuY3JlYXRvcn19PC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnbmF2aWdhdGlvbicsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogbmF2aWdhdGlvbkN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIG5hdmlnYXRpb25DdHJsLiRpbmplY3QgPSBbJ2F1dGhTZXJ2aWNlJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBuYXZpZ2F0aW9uQ3RybChhdXRoU2VydmljZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaXNBdXRoID0gYXV0aFNlcnZpY2UuaXNBdXRoKCk7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdhdXRoQ2hhbmdlZCcsIGF1dGhDaGFuZ2VkKTtcclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5hdmJhciBuYXZiYXItZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXZcIj4gXHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIG5nLWlmPVwiJGN0cmwuaXNBdXRoXCI+PGEgaHJlZj1cIiMvaG9tZVwiPtCc0L7RjyDRgdGC0YDQsNC90LjRhtCwPC9hPjwvbGk+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9ldmVudHNcIj7QnNC10YDQvtC/0YDQuNGP0YLQuNGPPC9hPjwvbGk+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9iYW5kc1wiPtCQ0YDRgtC40YHRgtGLPC9hPjwvbGk+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YT7QkdC70L7QszwvYT48L2xpPiBcclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnc2VhcmNoTW9kdWxlJylcclxuICAgICAgICAuY29tcG9uZW50KCdzZWFyY2hXaWRnZXQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHNlYXJjaFdpZGdldEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHNlYXJjaFdpZGdldEN0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdhY3Rpb25zJ1xyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiBzZWFyY2hXaWRnZXRDdHJsKCRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHVuY29ubmVjdCA9ICRuZ1JlZHV4LmNvbm5lY3QobWFwU3RhdGVUb1RoaXMsIGFjdGlvbnMpKHZtKTtcclxuXHJcbiAgICAgICAgdGhpcy5xdWVyeSA9ICcnO1xyXG4gICAgICAgIHRoaXMuc2VhcmNoS2V5UHJlc3MgPSBzZWFyY2hLZXlQcmVzcztcclxuICAgICAgICB0aGlzLnNlYXJjaEtleVVwID0gc2VhcmNoS2V5VXA7XHJcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gJG9uRGVzdHJveTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBtYXBTdGF0ZVRvVGhpcyhzdGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNlYXJjaEtleVByZXNzKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUuY2hhckNvZGUgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmxvY2F0aW9uKCcvc2VhcmNoJykpO1xyXG4gICAgICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5oYXNoU2VhcmNoKCdxPScgKyB0aGlzLnF1ZXJ5KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNlYXJjaEtleVVwKGUpIHtcclxuICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5jaGFuZ2VTZWFyY2hTdHJpbmcodGhpcy5xdWVyeSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uRGVzdHJveSgpIHtcclxuICAgICAgICAgICAgdW5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzZWFyY2hcIiBcclxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZvcm0tY29udHJvbFwiIFxyXG4gICAgICAgICAgICAgICAgICAgIG5nLWtleXByZXNzPVwiJGN0cmwuc2VhcmNoS2V5UHJlc3MoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmcta2V5dXA9XCIkY3RybC5zZWFyY2hLZXlVcCgkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICBuZy1tb2RlbD1cIiRjdHJsLnF1ZXJ5XCJcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cItCf0L7QuNGB0LpcIj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2V2ZW50c0xpc3QnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGV2ZW50c0xpc3RDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBldmVudHNMaXN0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ21lbW9pemUnLFxyXG4gICAgICAgICdldmVudHNFbmRwb2ludCdcclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gZXZlbnRzTGlzdEN0cmwoJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1vaXplLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzRW5kcG9pbnQpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSAkb25EZXN0cm95O1xyXG5cclxuICAgICAgICB0aGlzLmdldEV2ZW50cyA9IG1lbW9pemUoZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRFdmVudHMoe3NlYXJjaFN0cmluZzogdmFsdWV9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ldmVudHMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBldmVudHNFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEV2ZW50c0FsbCh7fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZXZlbnRzID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciB1bmNvbm5lY3QgPSAkbmdSZWR1eC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSAkbmdSZWR1eC5nZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmdldEV2ZW50cyhzdGF0ZS5zZWFyY2gucXVlcnkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmdldEV2ZW50cygpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiAkb25EZXN0cm95KCkge1xyXG4gICAgICAgICAgICB1bmNvbm5lY3QoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIiBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLmV2ZW50c1wiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8aDM+PGEgaHJlZj1cIiMvZXZlbnQve3tpdGVtLmlkfX1cIj57e2l0ZW0ubmFtZX19PC9hPjwvaDM+XHJcbiAgICAgICAgICAgICAgICA8cD57e2l0ZW0uZGVzY3JpcHRpb259fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7aXRlbS5kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScpXHJcbiAgICAuc2VydmljZSgnYXV0aEVuZHBvaW50JywgYXV0aEVuZHBvaW50KTtcclxuXHJcbmF1dGhFbmRwb2ludC4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnYXBpVXJsJywgJyRjb29raWVzJ107XHJcblxyXG5mdW5jdGlvbiBhdXRoRW5kcG9pbnQoJHJlc291cmNlLCBhcGlVcmwsICRjb29raWVzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHF1ZXJ5UGFyYW0gPSB7fTtcclxuICAgIHZhciB0b2tlbiA9ICRjb29raWVzLmdldCgnQVVUSC1UT0tFTicpO1xyXG4gICAgdmFyIHN0YXIgPSAnKic7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRSZXNvdXJjZTogZ2V0UmVzb3VyY2VcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmVzb3VyY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZShhcGlVcmwgKyAnLzplbnRpdHkvOnR5cGUnLCBxdWVyeVBhcmFtLCB7XHJcbiAgICAgICAgICAgIGdldEN1cnJlbnRVc2VyOiB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6ICd1c2VyJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsb2dpbjoge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5OiAnbG9naW4nLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd2aycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdiYW5kRW5kcG9pbnQnLCBiYW5kRW5kcG9pbnQpO1xyXG5cclxuYmFuZEVuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJHEnXTtcclxuXHJcbmZ1bmN0aW9uIGJhbmRFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJHEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZShwYXJhbXMpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvYmFuZC86aWQvOmVudGl0eScsIHBhcmFtcywge1xyXG4gICAgICAgICAgICBnZXRCYW5kOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVkaXRCYW5kOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNyZWF0ZUJhbmQ6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFkZE1lbWJlclRvQmFuZDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogJ21lbWJlcnMnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdiYW5kc0VuZHBvaW50JywgYmFuZHNFbmRwb2ludCk7XHJcblxyXG5iYW5kc0VuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJHEnXTtcclxuXHJcbmZ1bmN0aW9uIGJhbmRzRW5kcG9pbnQoJHJlc291cmNlLCBhcGlVcmwsICRxKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHF1ZXJ5UGFyYW0gPSB7fTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvYmFuZHMvOmxpbWl0LzpvZmZzZXQnLCBxdWVyeVBhcmFtLCB7XHJcbiAgICAgICAgICAgIGdldEJhbmRzOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdldmVudEVuZHBvaW50JywgZXZlbnRFbmRwb2ludCk7XHJcblxyXG5ldmVudEVuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJHEnXTtcclxuXHJcbmZ1bmN0aW9uIGV2ZW50RW5kcG9pbnQoJHJlc291cmNlLCBhcGlVcmwsICRxKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHF1ZXJ5UGFyYW0gPSB7fTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvZXZlbnQvOmlkJywgcXVlcnlQYXJhbSwge1xyXG4gICAgICAgICAgICBnZXRFdmVudDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2V2ZW50c0VuZHBvaW50JywgZXZlbnRzRW5kcG9pbnQpO1xyXG5cclxuZXZlbnRzRW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCcsICckcSddO1xyXG5cclxuZnVuY3Rpb24gZXZlbnRzRW5kcG9pbnQoJHJlc291cmNlLCBhcGlVcmwsICRxKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHF1ZXJ5UGFyYW0gPSB7fTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvZXZlbnRzLzpsaWtlLzpzZWFyY2hTdHJpbmcvOmxpbWl0LzpvZmZzZXQnLCBxdWVyeVBhcmFtLCB7XHJcbiAgICAgICAgICAgIGdldEV2ZW50c0FsbDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlrZTogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hTdHJpbmc6IG51bGwsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldEV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlrZTogJ2xpa2UnLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
