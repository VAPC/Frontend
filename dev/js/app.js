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

    httpInterceptorConfig.$inject = ['$httpProvider'];

    function httpInterceptorConfig($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }

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
            .when('/events', {
                templateUrl: 'events.html',
            })
            .when('/artists', {
                templateUrl: 'artists.html',
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
(function () {
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
                <h3>{{item.name}}</h3>
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
            <div class="navbar navbar-default">
                <ul class="nav navbar-nav"> 
                    <li ng-if="$ctrl.isAuth"><a href="#/home">Моя страница</a></li> 
                    <li><a href="#/events">Мероприятия</a></li> 
                    <li><a href="#/artists">Артисты</a></li> 
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
            }
        });
    }
}

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImVuZHBvaW50cy9lbmRwb2ludHMubWRsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGgubWRsLmpzIiwiY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoLm1kbC5qcyIsInJvdXRlci5qcyIsImFwcC9hY3Rpb25zLmpzIiwiYXBwL21lbW9pemUuanMiLCJhcHAvcmVkdWNlcnMuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aC5zcnYuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aExvZ2luUHJvY2Vzcy5jdHJsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGhXaWRnZXQuY210LmpzIiwiY29tcG9uZW50cy9jb250ZW50L2NvbnRlbnQuY210LmpzIiwiY29tcG9uZW50cy9ldmVudHNMaXN0L2V2ZW50c0xpc3QuY210LmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY210LmpzIiwiY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoV2lkZ2V0LmNtdC5qcyIsImVuZHBvaW50cy9hdXRoL2F1dGhFbmRwb2ludC5qcyIsImVuZHBvaW50cy9ldmVudHMvZXZlbnRzRW5kcG9pbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gaW1wb3J0IHJlZHVjZXJzIGZyb20gJy4vYXBwL3JlZHVjZXJzJ1xyXG5cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnLCBbXHJcbiAgICAgICAgICAgICduZ1JvdXRlJyxcclxuICAgICAgICAgICAgJ25nQ29va2llcycsXHJcbiAgICAgICAgICAgICduZ1Jlc291cmNlJyxcclxuICAgICAgICAgICAgJ25nUmVkdXgnLFxyXG5cclxuICAgICAgICAgICAgJ2VuZHBvaW50c01vZHVsZScsXHJcbiAgICAgICAgICAgICdhdXRoTW9kdWxlJyxcclxuICAgICAgICAgICAgJ3NlYXJjaE1vZHVsZScsXHJcbiAgICAgICAgXSk7XHJcblxyXG59KCkpOyIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnLCBbXSlcclxuICAgIC5mYWN0b3J5KCdhcGlVcmwnLCBhcGlVcmwpO1xyXG5cclxuZnVuY3Rpb24gYXBpVXJsKCkge1xyXG4gICAgdmFyIHVybDtcclxuICAgIHN3aXRjaCAod2luZG93LmxvY2F0aW9uLmhvc3RuYW1lKSB7XHJcbiAgICAgICAgY2FzZSAnbG9jYWxob3N0JzpcclxuICAgICAgICAgICAgdXJsID0gJ2h0dHA6Ly9yb2NrcGFyYWRlLmNyZW9yYS5ydS9hcGknO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICB1cmwgPSB3aW5kb3cubG9jYXRpb24ub3JpZ2luICsgJy9hcGknO1xyXG4gICAgICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHJldHVybiB1cmw7XHJcbn1cclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdhdXRoTW9kdWxlJywgW10pXHJcbiAgICAgICAgLy8gLmNvbmZpZyhodHRwSW50ZXJjZXB0b3JDb25maWcpXHJcbiAgICAgICAgLnJ1bihodHRwSW50ZXJjZXB0b3JSdW4pO1xyXG5cclxuICAgIGh0dHBJbnRlcmNlcHRvckNvbmZpZy4kaW5qZWN0ID0gWyckaHR0cFByb3ZpZGVyJ107XHJcblxyXG4gICAgZnVuY3Rpb24gaHR0cEludGVyY2VwdG9yQ29uZmlnKCRodHRwUHJvdmlkZXIpIHtcclxuICAgICAgICAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLnVzZVhEb21haW4gPSB0cnVlO1xyXG4gICAgICAgIGRlbGV0ZSAkaHR0cFByb3ZpZGVyLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydYLVJlcXVlc3RlZC1XaXRoJ107XHJcbiAgICB9XHJcblxyXG4gICAgaHR0cEludGVyY2VwdG9yUnVuLiRpbmplY3QgPSBbJyRpbmplY3RvciddO1xyXG4gICAgZnVuY3Rpb24gaHR0cEludGVyY2VwdG9yUnVuKCRpbmplY3Rvcikge1xyXG4gICAgICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgICAgdmFyIFRPS0VOID0gJGluamVjdG9yLmdldCgnJGNvb2tpZXMnKS5nZXQoJ0FVVEgtVE9LRU4nKTtcclxuICAgICAgICBpZiAoVE9LRU4pIHtcclxuXHJcbiAgICAgICAgICAgIHZhciAkaHR0cCA9ICRpbmplY3Rvci5nZXQoJyRodHRwJyk7XHJcbiAgICAgICAgICAgICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBVVRILVRPS0VOJ10gPSBUT0tFTjtcclxuICAgICAgICAgICAgLy8gJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5wb3N0WydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnO1xyXG4gICAgICAgICAgICAvLyAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLnB1dFsnQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JztcclxuXHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdBdXRoOiB1c2VyIGF1dGhlbnRpY2F0aW9uIGVycm9yLiBDb29raWVzIGRvZXNuXFwndCBjb250YWluIFwiQVVUSC1UT0tFTlwiJyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnc2VhcmNoTW9kdWxlJywgW10pO1xyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbmZpZyhyb3V0ZXIpO1xyXG5cclxuICAgIHJvdXRlci4kaW5qZWN0ID0gWyckcm91dGVQcm92aWRlciddO1xyXG5cclxuICAgIGZ1bmN0aW9uIHJvdXRlcigkcm91dGVQcm92aWRlcikge1xyXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdsYW5kaW5nLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2hvbWUnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2hvbWUuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvZXZlbnRzJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdldmVudHMuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvYXJ0aXN0cycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXJ0aXN0cy5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9zZWFyY2g/OmJsYScsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc2VhcmNoLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2xvZ2luL3ZrL2NhbGxiYWNrJywge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2F1dGhMb2dpblByb2Nlc3NDdHJsJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm90aGVyd2lzZSh7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnLydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcclxuICAgICAgICAvLyAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgIC8vICAgIHJlcXVpcmVCYXNlOiBmYWxzZVxyXG4gICAgICAgIC8vfSk7XHJcbiAgICB9O1xyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdhY3Rpb25zJywgYWN0aW9ucyk7XHJcblxyXG4gICAgYWN0aW9ucy4kaW5qZWN0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aW9ucygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjaGFuZ2VTZWFyY2hTdHJpbmc6IGNoYW5nZVNlYXJjaFN0cmluZyxcclxuICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxyXG4gICAgICAgICAgICBoYXNoU2VhcmNoOmhhc2hTZWFyY2gsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlU2VhcmNoU3RyaW5nKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnQ0hBTkdFX1NFQVJDSF9TVFJJTkcnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvY2F0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnTE9DQVRJT04nLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gaGFzaFNlYXJjaCh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ0hBU0hfU0VBUkNIJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gbWVtb2l6ZSgpIHtcclxuICAgICAgICByZXR1cm4gKGZ1bmMsIGVxdWFsaXR5Q2hlY2sgPSBkZWZhdWx0RXF1YWxpdHlDaGVjaykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbGFzdEFyZ3MgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgbGFzdFJlc3VsdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RBcmdzICE9PSBudWxsICYmXHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdEFyZ3MubGVuZ3RoID09PSBhcmdzLmxlbmd0aCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gZXF1YWxpdHlDaGVjayh2YWx1ZSwgbGFzdEFyZ3NbaW5kZXhdKSlcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGFzdEFyZ3MgPSBhcmdzO1xyXG4gICAgICAgICAgICAgICAgbGFzdFJlc3VsdCA9IGZ1bmMoLi4uYXJncyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVmYXVsdEVxdWFsaXR5Q2hlY2soYSwgYikge1xyXG4gICAgICAgIHJldHVybiBhID09PSBiXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdtZW1vaXplJywgbWVtb2l6ZSk7XHJcblxyXG5cclxufSgpKTtcclxuXHJcbi8vIGZ1bmN0aW9uIG1lbW9pemUoZnVuYywgZXF1YWxpdHlDaGVjayA9IGRlZmF1bHRFcXVhbGl0eUNoZWNrKSB7XHJcbi8vICAgICBsZXQgbGFzdEFyZ3MgPSBudWxsO1xyXG4vLyAgICAgbGV0IGxhc3RSZXN1bHQgPSBudWxsO1xyXG4vLyAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XHJcbi8vICAgICAgICAgaWYgKFxyXG4vLyAgICAgICAgICAgICBsYXN0QXJncyAhPT0gbnVsbCAmJlxyXG4vLyAgICAgICAgICAgICBsYXN0QXJncy5sZW5ndGggPT09IGFyZ3MubGVuZ3RoICYmXHJcbi8vICAgICAgICAgICAgIGFyZ3MuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gZXF1YWxpdHlDaGVjayh2YWx1ZSwgbGFzdEFyZ3NbaW5kZXhdKSlcclxuLy8gICAgICAgICApIHtcclxuLy8gICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGxhc3RBcmdzID0gYXJncztcclxuLy8gICAgICAgICBsYXN0UmVzdWx0ID0gZnVuYyguLi5hcmdzKTtcclxuLy8gICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcclxuLy8gICAgIH1cclxuLy8gfSIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgdmFyIGRlZmF1bHRTdGF0ZSA9IHtcclxuICAgICAgICBsb2NhdGlvbjoge1xyXG4gICAgICAgICAgICBwYXRoOiAnJyxcclxuICAgICAgICAgICAgaGFzaFNlYXJjaDogJycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2g6IHtcclxuICAgICAgICAgICAgcXVlcnk6ICcnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXNlcjoge1xyXG4gICAgICAgICAgICB1aWQ6ICcnLFxyXG4gICAgICAgICAgICBuYW1lOiAnJyxcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiByZWR1Y2VycyhzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSB7XHJcbiAgICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnQ0hBTkdFX1NFQVJDSF9TVFJJTkcnOlxyXG4gICAgICAgICAgICAgICAgc3RhdGUuc2VhcmNoLnF1ZXJ5ID0gYWN0aW9uLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oc3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnTE9DQVRJT04nOlxyXG4gICAgICAgICAgICAgICAgc3RhdGUubG9jYXRpb24ucGF0aCA9IGFjdGlvbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlKTtcclxuICAgICAgICAgICAgY2FzZSAnSEFTSF9TRUFSQ0gnOlxyXG4gICAgICAgICAgICAgICAgc3RhdGUubG9jYXRpb24uaGFzaFNlYXJjaCA9IGFjdGlvbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbmZpZyhuZ1JlZHV4Q29uZmlnKTtcclxuXHJcbiAgICBuZ1JlZHV4Q29uZmlnLiRpbmplY3QgPSBbJyRuZ1JlZHV4UHJvdmlkZXInXTtcclxuXHJcbiAgICBmdW5jdGlvbiBuZ1JlZHV4Q29uZmlnKCRuZ1JlZHV4UHJvdmlkZXIpIHtcclxuICAgICAgICAkbmdSZWR1eFByb3ZpZGVyLmNyZWF0ZVN0b3JlV2l0aChyZWR1Y2Vycyk7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsImFuZ3VsYXIubW9kdWxlKCdhdXRoTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlKTtcclxuXHJcbmF1dGhTZXJ2aWNlLiRpbmplY3QgPSBbJ2F1dGhFbmRwb2ludCcsXHJcbiAgICAnJHEnLFxyXG4gICAgJyRjb29raWVzJyxcclxuICAgICckbG9jYXRpb24nXTtcclxuXHJcbmZ1bmN0aW9uIGF1dGhTZXJ2aWNlKGF1dGhFbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgJHEsXHJcbiAgICAgICAgICAgICAgICAgICAgICRjb29raWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24pIHtcclxuXHJcbiAgICB2YXIgY3VycmVudFVzZXJEZWZlcjtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGlzQXV0aDogaXNBdXRoLFxyXG4gICAgICAgIGxvZ2luOiBsb2dpbixcclxuICAgICAgICBsb2dvdXQ6IGxvZ291dCxcclxuICAgICAgICBnZXRDdXJyZW50VXNlcjogZ2V0Q3VycmVudFVzZXIsXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGlzQXV0aCgpIHtcclxuICAgICAgICByZXR1cm4gISEkY29va2llcy5nZXQoJ0FVVEgtVE9LRU4nKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2dpbigpIHtcclxuICAgICAgICBhdXRoRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5sb2dpbih7fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2U6JywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZTonLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuICAgICAgICAkY29va2llcy5yZW1vdmUoJ0FVVEgtVE9LRU4nKTtcclxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLyMnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50VXNlcigpIHtcclxuICAgICAgICBpZiAoIWN1cnJlbnRVc2VyRGVmZXIpIHtcclxuICAgICAgICAgICAgY3VycmVudFVzZXJEZWZlciA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIGF1dGhFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEN1cnJlbnRVc2VyKHt9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlckRlZmVyLnJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXJEZWZlci5yZWplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY3VycmVudFVzZXJEZWZlci5wcm9taXNlO1xyXG4gICAgfVxyXG59XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXV0aE1vZHVsZScpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ2F1dGhMb2dpblByb2Nlc3NDdHJsJywgYXV0aExvZ2luUHJvY2Vzc0N0cmwpO1xyXG5cclxuICAgIGF1dGhMb2dpblByb2Nlc3NDdHJsLiRpbmplY3QgPSBbJyRyb3V0ZVBhcmFtcycsICckbG9jYXRpb24nLCAnJGNvb2tpZXMnLCAnJHJvb3RTY29wZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhMb2dpblByb2Nlc3NDdHJsKCRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCAkY29va2llcywgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndG9rZW4nKSkge1xyXG4gICAgICAgICAgICB2YXIgZXhwaXJlRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGV4cGlyZURhdGUuc2V0RGF0ZShleHBpcmVEYXRlLmdldERhdGUoKSArIDE0KTtcclxuICAgICAgICAgICAgJGNvb2tpZXMucHV0KCdBVVRILVRPS0VOJywgJHJvdXRlUGFyYW1zLnRva2VuLCB7J2V4cGlyZXMnOiBleHBpcmVEYXRlfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRyb290U2NvcGUuJGVtaXQoJ2F1dGhDaGFuZ2VkJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvIy9ob21lJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXV0aE1vZHVsZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYXV0aFdpZGdldCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogYXV0aFdpZGdldEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGF1dGhXaWRnZXRDdHJsLiRpbmplY3QgPSBbJ2F1dGhTZXJ2aWNlJyxcclxuICAgICAgICAnYXBpVXJsJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoV2lkZ2V0Q3RybChhdXRoU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaVVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmxvZ2luVXJsID0gYXBpVXJsICsgJy9sb2dpbi92ayc7XHJcbiAgICAgICAgdm0uaXNBdXRoID0gYXV0aFNlcnZpY2UuaXNBdXRoKCk7XHJcbiAgICAgICAgdm0ubG9naW4gPSBhdXRoU2VydmljZS5sb2dpbjtcclxuICAgICAgICB2bS5sb2dvdXQgPSBsb2dvdXQ7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2F1dGhDaGFuZ2VkJywgYXV0aENoYW5nZWQpO1xyXG5cclxuICAgICAgICBpZiAodm0uaXNBdXRoKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZScsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIHZtLnVzZXIgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5sb2dvdXQoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnYXV0aENoYW5nZWQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgbmctaWY9XCIhJGN0cmwuaXNBdXRoXCI+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCJ7eyRjdHJsLmxvZ2luVXJsfX1cIj5Mb2dpbiB3aXRoIFZrb250YWt0ZTwvYT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgbmctaWY9XCIkY3RybC5pc0F1dGhcIj5cclxuICAgICAgICAgICAgPGRpdj5IaSwge3skY3RybC51c2VyLmxvZ2lufX0hPC9kaXY+XHJcbiAgICAgICAgICAgIDxhIG5nLWNsaWNrPVwiJGN0cmwubG9nb3V0KClcIj5Mb2dvdXQ8L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdjb250ZW50Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBjb250ZW50Q29udHJvbGxlcixcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgY29udGVudENvbnRyb2xsZXIuJGluamVjdCA9IFtcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdtZW1vaXplJyxcclxuICAgICAgICAnJGxvY2F0aW9uJ107XHJcblxyXG4gICAgZnVuY3Rpb24gY29udGVudENvbnRyb2xsZXIoJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1vaXplLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy5zZXRMb2NhdGlvbiA9IG1lbW9pemUoZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgJGxvY2F0aW9uLnBhdGgodmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgdGhpcy5zZXRIYXNoU2VhcmNoID0gbWVtb2l6ZShmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24uc2VhcmNoKHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkbmdSZWR1eC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSAkbmdSZWR1eC5nZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldExvY2F0aW9uKHN0YXRlLmxvY2F0aW9uLnBhdGgpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEhhc2hTZWFyY2goc3RhdGUubG9jYXRpb24uaGFzaFNlYXJjaCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFnZS1ob2xkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8aGVhZGVyIGNsYXNzPVwicm93IGhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTJcIj48YSBocmVmPVwiIy9cIj48aW1nIHNyYz1cImNzcy9pbWcvbG9nby5wbmdcIiBoZWlnaHQ9XCI3NXB4XCIgYWx0PVwiUm9ja3BhcmFkZVwiPjwvYT48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS04XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bmF2aWdhdGlvbj48L25hdmlnYXRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxhdXRoLXdpZGdldD48L2F1dGgtd2lkZ2V0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2hlYWRlcj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IHNlYXJjaC1ob2xkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS04IGNvbC1zbS1vZmZzZXQtMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlYXJjaC13aWRnZXQ+PC9zZWFyY2gtd2lkZ2V0PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IG5nLXZpZXc9XCJcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2V2ZW50c0xpc3QnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGV2ZW50c0xpc3RDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBldmVudHNMaXN0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ21lbW9pemUnLFxyXG4gICAgICAgICdldmVudHNFbmRwb2ludCdcclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gZXZlbnRzTGlzdEN0cmwoJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtZW1vaXplLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXZlbnRzRW5kcG9pbnQpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSAkb25EZXN0cm95O1xyXG5cclxuICAgICAgICB0aGlzLmdldEV2ZW50cyA9IG1lbW9pemUoZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRFdmVudHMoe3NlYXJjaFN0cmluZzogdmFsdWV9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2bS5ldmVudHMgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBldmVudHNFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEV2ZW50c0FsbCh7fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZXZlbnRzID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciB1bmNvbm5lY3QgPSAkbmdSZWR1eC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSAkbmdSZWR1eC5nZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmdldEV2ZW50cyhzdGF0ZS5zZWFyY2gucXVlcnkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmdldEV2ZW50cygpO1xyXG5cclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiAkb25EZXN0cm95KCkge1xyXG4gICAgICAgICAgICB1bmNvbm5lY3QoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIiBuZy1yZXBlYXQ9XCJpdGVtIGluICRjdHJsLmV2ZW50c1wiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8aDM+e3tpdGVtLm5hbWV9fTwvaDM+XHJcbiAgICAgICAgICAgICAgICA8cD57e2l0ZW0uZGVzY3JpcHRpb259fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7aXRlbS5kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCduYXZpZ2F0aW9uJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBuYXZpZ2F0aW9uQ3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgbmF2aWdhdGlvbkN0cmwuJGluamVjdCA9IFsnYXV0aFNlcnZpY2UnLCAnJHJvb3RTY29wZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIG5hdmlnYXRpb25DdHJsKGF1dGhTZXJ2aWNlLCAkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuXHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2F1dGhDaGFuZ2VkJywgYXV0aENoYW5nZWQpO1xyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYXV0aENoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHZtLmlzQXV0aCA9IGF1dGhTZXJ2aWNlLmlzQXV0aCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0XCI+XHJcbiAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdlwiPiBcclxuICAgICAgICAgICAgICAgICAgICA8bGkgbmctaWY9XCIkY3RybC5pc0F1dGhcIj48YSBocmVmPVwiIy9ob21lXCI+0JzQvtGPINGB0YLRgNCw0L3QuNGG0LA8L2E+PC9saT4gXHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL2V2ZW50c1wiPtCc0LXRgNC+0L/RgNC40Y/RgtC40Y88L2E+PC9saT4gXHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL2FydGlzdHNcIj7QkNGA0YLQuNGB0YLRizwvYT48L2xpPiBcclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGE+0JHQu9C+0LM8L2E+PC9saT4gXHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3NlYXJjaE1vZHVsZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnc2VhcmNoV2lkZ2V0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBzZWFyY2hXaWRnZXRDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBzZWFyY2hXaWRnZXRDdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnYWN0aW9ucydcclxuICAgIF07XHJcblxyXG4gICAgZnVuY3Rpb24gc2VhcmNoV2lkZ2V0Q3RybCgkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZhciB1bmNvbm5lY3QgPSAkbmdSZWR1eC5jb25uZWN0KG1hcFN0YXRlVG9UaGlzLCBhY3Rpb25zKSh2bSk7XHJcblxyXG4gICAgICAgIHRoaXMucXVlcnkgPSAnJztcclxuICAgICAgICB0aGlzLnNlYXJjaEtleVByZXNzID0gc2VhcmNoS2V5UHJlc3M7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hLZXlVcCA9IHNlYXJjaEtleVVwO1xyXG4gICAgICAgIHRoaXMuJG9uRGVzdHJveSA9ICRvbkRlc3Ryb3k7XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbWFwU3RhdGVUb1RoaXMoc3RhdGUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHN0YXRlOiBzdGF0ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZWFyY2hLZXlQcmVzcyhlKSB7XHJcbiAgICAgICAgICAgIGlmIChlLmNoYXJDb2RlID09PSAxMykge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5sb2NhdGlvbignL3NlYXJjaCcpKTtcclxuICAgICAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMuaGFzaFNlYXJjaCgncT0nICsgdGhpcy5xdWVyeSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzZWFyY2hLZXlVcChlKSB7XHJcbiAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMuY2hhbmdlU2VhcmNoU3RyaW5nKHRoaXMucXVlcnkpKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uICRvbkRlc3Ryb3koKSB7XHJcbiAgICAgICAgICAgIHVuY29ubmVjdCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic2VhcmNoXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBcclxuICAgICAgICAgICAgICAgICAgICBuZy1rZXlwcmVzcz1cIiRjdHJsLnNlYXJjaEtleVByZXNzKCRldmVudClcIlxyXG4gICAgICAgICAgICAgICAgICAgIG5nLWtleXVwPVwiJGN0cmwuc2VhcmNoS2V5VXAoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmctbW9kZWw9XCIkY3RybC5xdWVyeVwiXHJcbiAgICAgICAgICAgICAgICAgICAgcGxhY2Vob2xkZXI9XCLQn9C+0LjRgdC6XCI+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2F1dGhFbmRwb2ludCcsIGF1dGhFbmRwb2ludCk7XHJcblxyXG5hdXRoRW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCcsICckY29va2llcyddO1xyXG5cclxuZnVuY3Rpb24gYXV0aEVuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsLCAkY29va2llcykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBxdWVyeVBhcmFtID0ge307XHJcbiAgICB2YXIgdG9rZW4gPSAkY29va2llcy5nZXQoJ0FVVEgtVE9LRU4nKTtcclxuICAgIHZhciBzdGFyID0gJyonO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy86ZW50aXR5Lzp0eXBlJywgcXVlcnlQYXJhbSwge1xyXG4gICAgICAgICAgICBnZXRDdXJyZW50VXNlcjoge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5OiAndXNlcidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbG9naW46IHtcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogJ2xvZ2luJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndmsnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScpXHJcbiAgICAuc2VydmljZSgnZXZlbnRzRW5kcG9pbnQnLCBldmVudHNFbmRwb2ludCk7XHJcblxyXG5ldmVudHNFbmRwb2ludC4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnYXBpVXJsJywgJyRxJ107XHJcblxyXG5mdW5jdGlvbiBldmVudHNFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJHEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy9ldmVudHMvOmxpa2UvOnNlYXJjaFN0cmluZy86bGltaXQvOm9mZnNldCcsIHF1ZXJ5UGFyYW0sIHtcclxuICAgICAgICAgICAgZ2V0RXZlbnRzQWxsOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaWtlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFN0cmluZzogbnVsbCxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0RXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaWtlOiAnbGlrZScsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
