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
            .when('/event/:id', {
                templateUrl: 'event.html',
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImVuZHBvaW50cy9lbmRwb2ludHMubWRsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGgubWRsLmpzIiwiY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoLm1kbC5qcyIsInJvdXRlci5qcyIsImFwcC9hY3Rpb25zLmpzIiwiYXBwL21lbW9pemUuanMiLCJhcHAvcmVkdWNlcnMuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aC5zcnYuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aExvZ2luUHJvY2Vzcy5jdHJsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGhXaWRnZXQuY210LmpzIiwiY29tcG9uZW50cy9ldmVudC1pbmZvL2V2ZW50cy1pbmZvLmNtdC5qcyIsImNvbXBvbmVudHMvY29udGVudC9jb250ZW50LmNtdC5qcyIsImNvbXBvbmVudHMvZXZlbnRzLWxpc3QvZXZlbnRzLWxpc3QuY210LmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY210LmpzIiwiY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoV2lkZ2V0LmNtdC5qcyIsImVuZHBvaW50cy9hdXRoL2F1dGhFbmRwb2ludC5qcyIsImVuZHBvaW50cy9ldmVudHMvZXZlbnRFbmRwb2ludC5qcyIsImVuZHBvaW50cy9ldmVudHMvZXZlbnRzRW5kcG9pbnQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUJBO0FBQ0E7QUFDQTtBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDckRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN0REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMvREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8vIGltcG9ydCByZWR1Y2VycyBmcm9tICcuL2FwcC9yZWR1Y2VycydcclxuXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJywgW1xyXG4gICAgICAgICAgICAnbmdSb3V0ZScsXHJcbiAgICAgICAgICAgICduZ0Nvb2tpZXMnLFxyXG4gICAgICAgICAgICAnbmdSZXNvdXJjZScsXHJcbiAgICAgICAgICAgICduZ1JlZHV4JyxcclxuXHJcbiAgICAgICAgICAgICdlbmRwb2ludHNNb2R1bGUnLFxyXG4gICAgICAgICAgICAnYXV0aE1vZHVsZScsXHJcbiAgICAgICAgICAgICdzZWFyY2hNb2R1bGUnLFxyXG4gICAgICAgIF0pO1xyXG5cclxufSgpKTsiLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJywgW10pXHJcbiAgICAuZmFjdG9yeSgnYXBpVXJsJywgYXBpVXJsKTtcclxuXHJcbmZ1bmN0aW9uIGFwaVVybCgpIHtcclxuICAgIHZhciB1cmw7XHJcbiAgICBzd2l0Y2ggKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSkge1xyXG4gICAgICAgIGNhc2UgJ2xvY2FsaG9zdCc6XHJcbiAgICAgICAgICAgIHVybCA9ICdodHRwOi8vcm9ja3BhcmFkZS5jcmVvcmEucnUvYXBpJztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArICcvYXBpJztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXJsO1xyXG59XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXV0aE1vZHVsZScsIFtdKVxyXG4gICAgICAgIC8vIC5jb25maWcoaHR0cEludGVyY2VwdG9yQ29uZmlnKVxyXG4gICAgICAgIC5ydW4oaHR0cEludGVyY2VwdG9yUnVuKTtcclxuXHJcbiAgICBodHRwSW50ZXJjZXB0b3JDb25maWcuJGluamVjdCA9IFsnJGh0dHBQcm92aWRlciddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGh0dHBJbnRlcmNlcHRvckNvbmZpZygkaHR0cFByb3ZpZGVyKSB7XHJcbiAgICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy51c2VYRG9tYWluID0gdHJ1ZTtcclxuICAgICAgICBkZWxldGUgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1SZXF1ZXN0ZWQtV2l0aCddO1xyXG4gICAgfVxyXG5cclxuICAgIGh0dHBJbnRlcmNlcHRvclJ1bi4kaW5qZWN0ID0gWyckaW5qZWN0b3InXTtcclxuICAgIGZ1bmN0aW9uIGh0dHBJbnRlcmNlcHRvclJ1bigkaW5qZWN0b3IpIHtcclxuICAgICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAgIHZhciBUT0tFTiA9ICRpbmplY3Rvci5nZXQoJyRjb29raWVzJykuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICAgICAgaWYgKFRPS0VOKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgJGh0dHAgPSAkaW5qZWN0b3IuZ2V0KCckaHR0cCcpO1xyXG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQVVUSC1UT0tFTiddID0gVE9LRU47XHJcbiAgICAgICAgICAgIC8vICRodHRwLmRlZmF1bHRzLmhlYWRlcnMucG9zdFsnQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JztcclxuICAgICAgICAgICAgLy8gJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5wdXRbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCc7XHJcblxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQXV0aDogdXNlciBhdXRoZW50aWNhdGlvbiBlcnJvci4gQ29va2llcyBkb2VzblxcJ3QgY29udGFpbiBcIkFVVEgtVE9LRU5cIicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3NlYXJjaE1vZHVsZScsIFtdKTtcclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb25maWcocm91dGVyKTtcclxuXHJcbiAgICByb3V0ZXIuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInXTtcclxuXHJcbiAgICBmdW5jdGlvbiByb3V0ZXIoJHJvdXRlUHJvdmlkZXIpIHtcclxuICAgICAgICAkcm91dGVQcm92aWRlclxyXG4gICAgICAgICAgICAud2hlbignLycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnbGFuZGluZy5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9ob21lJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdob21lLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2V2ZW50LzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZXZlbnQuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvZXZlbnRzJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdldmVudHMuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvYXJ0aXN0cycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYXJ0aXN0cy5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9zZWFyY2g/OmJsYScsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc2VhcmNoLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2xvZ2luL3ZrL2NhbGxiYWNrJywge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2F1dGhMb2dpblByb2Nlc3NDdHJsJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm90aGVyd2lzZSh7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnLydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcclxuICAgICAgICAvLyAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgIC8vICAgIHJlcXVpcmVCYXNlOiBmYWxzZVxyXG4gICAgICAgIC8vfSk7XHJcbiAgICB9O1xyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5zZXJ2aWNlKCdhY3Rpb25zJywgYWN0aW9ucyk7XHJcblxyXG4gICAgYWN0aW9ucy4kaW5qZWN0ID0gW107XHJcblxyXG4gICAgZnVuY3Rpb24gYWN0aW9ucygpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBjaGFuZ2VTZWFyY2hTdHJpbmc6IGNoYW5nZVNlYXJjaFN0cmluZyxcclxuICAgICAgICAgICAgbG9jYXRpb246IGxvY2F0aW9uLFxyXG4gICAgICAgICAgICBoYXNoU2VhcmNoOmhhc2hTZWFyY2gsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gY2hhbmdlU2VhcmNoU3RyaW5nKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnQ0hBTkdFX1NFQVJDSF9TVFJJTkcnLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGxvY2F0aW9uKHZhbHVlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICB0eXBlOiAnTE9DQVRJT04nLFxyXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gaGFzaFNlYXJjaCh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ0hBU0hfU0VBUkNIJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgZnVuY3Rpb24gbWVtb2l6ZSgpIHtcclxuICAgICAgICByZXR1cm4gKGZ1bmMsIGVxdWFsaXR5Q2hlY2sgPSBkZWZhdWx0RXF1YWxpdHlDaGVjaykgPT4ge1xyXG4gICAgICAgICAgICBsZXQgbGFzdEFyZ3MgPSBudWxsO1xyXG4gICAgICAgICAgICBsZXQgbGFzdFJlc3VsdCA9IG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKFxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RBcmdzICE9PSBudWxsICYmXHJcbiAgICAgICAgICAgICAgICAgICAgbGFzdEFyZ3MubGVuZ3RoID09PSBhcmdzLmxlbmd0aCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGFyZ3MuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gZXF1YWxpdHlDaGVjayh2YWx1ZSwgbGFzdEFyZ3NbaW5kZXhdKSlcclxuICAgICAgICAgICAgICAgICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgbGFzdEFyZ3MgPSBhcmdzO1xyXG4gICAgICAgICAgICAgICAgbGFzdFJlc3VsdCA9IGZ1bmMoLi4uYXJncyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZGVmYXVsdEVxdWFsaXR5Q2hlY2soYSwgYikge1xyXG4gICAgICAgIHJldHVybiBhID09PSBiXHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5mYWN0b3J5KCdtZW1vaXplJywgbWVtb2l6ZSk7XHJcblxyXG5cclxufSgpKTtcclxuXHJcbi8vIGZ1bmN0aW9uIG1lbW9pemUoZnVuYywgZXF1YWxpdHlDaGVjayA9IGRlZmF1bHRFcXVhbGl0eUNoZWNrKSB7XHJcbi8vICAgICBsZXQgbGFzdEFyZ3MgPSBudWxsO1xyXG4vLyAgICAgbGV0IGxhc3RSZXN1bHQgPSBudWxsO1xyXG4vLyAgICAgcmV0dXJuICguLi5hcmdzKSA9PiB7XHJcbi8vICAgICAgICAgaWYgKFxyXG4vLyAgICAgICAgICAgICBsYXN0QXJncyAhPT0gbnVsbCAmJlxyXG4vLyAgICAgICAgICAgICBsYXN0QXJncy5sZW5ndGggPT09IGFyZ3MubGVuZ3RoICYmXHJcbi8vICAgICAgICAgICAgIGFyZ3MuZXZlcnkoKHZhbHVlLCBpbmRleCkgPT4gZXF1YWxpdHlDaGVjayh2YWx1ZSwgbGFzdEFyZ3NbaW5kZXhdKSlcclxuLy8gICAgICAgICApIHtcclxuLy8gICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XHJcbi8vICAgICAgICAgfVxyXG4vLyAgICAgICAgIGxhc3RBcmdzID0gYXJncztcclxuLy8gICAgICAgICBsYXN0UmVzdWx0ID0gZnVuYyguLi5hcmdzKTtcclxuLy8gICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcclxuLy8gICAgIH1cclxuLy8gfSIsIihmdW5jdGlvbiAoKSB7XHJcblxyXG4gICAgdmFyIGRlZmF1bHRTdGF0ZSA9IHtcclxuICAgICAgICBsb2NhdGlvbjoge1xyXG4gICAgICAgICAgICBwYXRoOiAnJyxcclxuICAgICAgICAgICAgaGFzaFNlYXJjaDogJycsXHJcbiAgICAgICAgfSxcclxuICAgICAgICBzZWFyY2g6IHtcclxuICAgICAgICAgICAgcXVlcnk6ICcnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgdXNlcjoge1xyXG4gICAgICAgICAgICB1aWQ6ICcnLFxyXG4gICAgICAgICAgICBuYW1lOiAnJyxcclxuICAgICAgICB9LFxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiByZWR1Y2VycyhzdGF0ZSA9IGRlZmF1bHRTdGF0ZSwgYWN0aW9uKSB7XHJcbiAgICAgICAgc3dpdGNoIChhY3Rpb24udHlwZSkge1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnQ0hBTkdFX1NFQVJDSF9TVFJJTkcnOlxyXG4gICAgICAgICAgICAgICAgc3RhdGUuc2VhcmNoLnF1ZXJ5ID0gYWN0aW9uLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oc3RhdGUpO1xyXG5cclxuICAgICAgICAgICAgY2FzZSAnTE9DQVRJT04nOlxyXG4gICAgICAgICAgICAgICAgc3RhdGUubG9jYXRpb24ucGF0aCA9IGFjdGlvbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlKTtcclxuICAgICAgICAgICAgY2FzZSAnSEFTSF9TRUFSQ0gnOlxyXG4gICAgICAgICAgICAgICAgc3RhdGUubG9jYXRpb24uaGFzaFNlYXJjaCA9IGFjdGlvbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3RhdGU7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbmZpZyhuZ1JlZHV4Q29uZmlnKTtcclxuXHJcbiAgICBuZ1JlZHV4Q29uZmlnLiRpbmplY3QgPSBbJyRuZ1JlZHV4UHJvdmlkZXInXTtcclxuXHJcbiAgICBmdW5jdGlvbiBuZ1JlZHV4Q29uZmlnKCRuZ1JlZHV4UHJvdmlkZXIpIHtcclxuICAgICAgICAkbmdSZWR1eFByb3ZpZGVyLmNyZWF0ZVN0b3JlV2l0aChyZWR1Y2Vycyk7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsImFuZ3VsYXIubW9kdWxlKCdhdXRoTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlKTtcclxuXHJcbmF1dGhTZXJ2aWNlLiRpbmplY3QgPSBbJ2F1dGhFbmRwb2ludCcsXHJcbiAgICAnJHEnLFxyXG4gICAgJyRjb29raWVzJyxcclxuICAgICckbG9jYXRpb24nXTtcclxuXHJcbmZ1bmN0aW9uIGF1dGhTZXJ2aWNlKGF1dGhFbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgJHEsXHJcbiAgICAgICAgICAgICAgICAgICAgICRjb29raWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24pIHtcclxuXHJcbiAgICB2YXIgY3VycmVudFVzZXJEZWZlcjtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGlzQXV0aDogaXNBdXRoLFxyXG4gICAgICAgIGxvZ2luOiBsb2dpbixcclxuICAgICAgICBsb2dvdXQ6IGxvZ291dCxcclxuICAgICAgICBnZXRDdXJyZW50VXNlcjogZ2V0Q3VycmVudFVzZXIsXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGlzQXV0aCgpIHtcclxuICAgICAgICByZXR1cm4gISEkY29va2llcy5nZXQoJ0FVVEgtVE9LRU4nKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2dpbigpIHtcclxuICAgICAgICBhdXRoRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5sb2dpbih7fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2U6JywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZTonLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuICAgICAgICAkY29va2llcy5yZW1vdmUoJ0FVVEgtVE9LRU4nKTtcclxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLyMnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50VXNlcigpIHtcclxuICAgICAgICBpZiAoIWN1cnJlbnRVc2VyRGVmZXIpIHtcclxuICAgICAgICAgICAgY3VycmVudFVzZXJEZWZlciA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIGF1dGhFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEN1cnJlbnRVc2VyKHt9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlckRlZmVyLnJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXJEZWZlci5yZWplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY3VycmVudFVzZXJEZWZlci5wcm9taXNlO1xyXG4gICAgfVxyXG59XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXV0aE1vZHVsZScpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ2F1dGhMb2dpblByb2Nlc3NDdHJsJywgYXV0aExvZ2luUHJvY2Vzc0N0cmwpO1xyXG5cclxuICAgIGF1dGhMb2dpblByb2Nlc3NDdHJsLiRpbmplY3QgPSBbJyRyb3V0ZVBhcmFtcycsICckbG9jYXRpb24nLCAnJGNvb2tpZXMnLCAnJHJvb3RTY29wZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhMb2dpblByb2Nlc3NDdHJsKCRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCAkY29va2llcywgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndG9rZW4nKSkge1xyXG4gICAgICAgICAgICB2YXIgZXhwaXJlRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGV4cGlyZURhdGUuc2V0RGF0ZShleHBpcmVEYXRlLmdldERhdGUoKSArIDE0KTtcclxuICAgICAgICAgICAgJGNvb2tpZXMucHV0KCdBVVRILVRPS0VOJywgJHJvdXRlUGFyYW1zLnRva2VuLCB7J2V4cGlyZXMnOiBleHBpcmVEYXRlfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRyb290U2NvcGUuJGVtaXQoJ2F1dGhDaGFuZ2VkJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvIy9ob21lJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXV0aE1vZHVsZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYXV0aFdpZGdldCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogYXV0aFdpZGdldEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGF1dGhXaWRnZXRDdHJsLiRpbmplY3QgPSBbJ2F1dGhTZXJ2aWNlJyxcclxuICAgICAgICAnYXBpVXJsJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoV2lkZ2V0Q3RybChhdXRoU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaVVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmxvZ2luVXJsID0gYXBpVXJsICsgJy9sb2dpbi92ayc7XHJcbiAgICAgICAgdm0uaXNBdXRoID0gYXV0aFNlcnZpY2UuaXNBdXRoKCk7XHJcbiAgICAgICAgdm0ubG9naW4gPSBhdXRoU2VydmljZS5sb2dpbjtcclxuICAgICAgICB2bS5sb2dvdXQgPSBsb2dvdXQ7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2F1dGhDaGFuZ2VkJywgYXV0aENoYW5nZWQpO1xyXG5cclxuICAgICAgICBpZiAodm0uaXNBdXRoKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZScsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIHZtLnVzZXIgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5sb2dvdXQoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnYXV0aENoYW5nZWQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgbmctaWY9XCIhJGN0cmwuaXNBdXRoXCI+XHJcbiAgICAgICAgICAgIDxhIGhyZWY9XCJ7eyRjdHJsLmxvZ2luVXJsfX1cIj5Mb2dpbiB3aXRoIFZrb250YWt0ZTwvYT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgbmctaWY9XCIkY3RybC5pc0F1dGhcIj5cclxuICAgICAgICAgICAgPGRpdj5IaSwge3skY3RybC51c2VyLmxvZ2lufX0hPC9kaXY+XHJcbiAgICAgICAgICAgIDxhIG5nLWNsaWNrPVwiJGN0cmwubG9nb3V0KClcIj5Mb2dvdXQ8L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2V2ZW50SW5mbycsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZXZlbnRJbmZvQ3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgZXZlbnRJbmZvQ3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICdldmVudEVuZHBvaW50JyxcclxuICAgICAgICAnJHJvdXRlUGFyYW1zJ107XHJcblxyXG4gICAgZnVuY3Rpb24gZXZlbnRJbmZvQ3RybChldmVudEVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAkcm91dGVQYXJhbXMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlkID0gJHJvdXRlUGFyYW1zLmlkO1xyXG5cclxuICAgICAgICBldmVudEVuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0RXZlbnQoe2lkOiB2bS5pZH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICB2bS5ldmVudERhdGEgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgPGgzPnt7JGN0cmwuZXZlbnREYXRhLm5hbWV9fTwvaDM+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmV2ZW50RGF0YS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5ldmVudERhdGEuZGF0ZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5ldmVudERhdGEucGxhY2V9fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuZXZlbnREYXRhLmNyZWF0b3J9fTwvcD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2NvbnRlbnQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRlbnRDb250cm9sbGVyLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBjb250ZW50Q29udHJvbGxlci4kaW5qZWN0ID0gW1xyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ21lbW9pemUnLFxyXG4gICAgICAgICckbG9jYXRpb24nXTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb250ZW50Q29udHJvbGxlcigkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9pemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24pIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnNldExvY2F0aW9uID0gbWVtb2l6ZShmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNldEhhc2hTZWFyY2ggPSBtZW1vaXplKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2godmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRuZ1JlZHV4LnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzdGF0ZSA9ICRuZ1JlZHV4LmdldFN0YXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYXRpb24oc3RhdGUubG9jYXRpb24ucGF0aCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0SGFzaFNlYXJjaChzdGF0ZS5sb2NhdGlvbi5oYXNoU2VhcmNoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLWhvbGRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoZWFkZXIgY2xhc3M9XCJyb3cgaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMlwiPjxhIGhyZWY9XCIjL1wiPjxpbWcgc3JjPVwiY3NzL2ltZy9sb2dvLnBuZ1wiIGhlaWdodD1cIjc1cHhcIiBhbHQ9XCJSb2NrcGFyYWRlXCI+PC9hPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLThcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuYXZpZ2F0aW9uPjwvbmF2aWdhdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGF1dGgtd2lkZ2V0PjwvYXV0aC13aWRnZXQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgc2VhcmNoLWhvbGRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTggY29sLXNtLW9mZnNldC0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VhcmNoLXdpZGdldD48L3NlYXJjaC13aWRnZXQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgbmctdmlldz1cIlwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdldmVudHNMaXN0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBldmVudHNMaXN0Q3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgZXZlbnRzTGlzdEN0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdtZW1vaXplJyxcclxuICAgICAgICAnZXZlbnRzRW5kcG9pbnQnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGV2ZW50c0xpc3RDdHJsKCRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtb2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50c0VuZHBvaW50KSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gJG9uRGVzdHJveTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRFdmVudHMgPSBtZW1vaXplKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50c0VuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0RXZlbnRzKHtzZWFyY2hTdHJpbmc6IHZhbHVlfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZXZlbnRzID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRFdmVudHNBbGwoe30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmV2ZW50cyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgdW5jb25uZWN0ID0gJG5nUmVkdXguc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHN0YXRlID0gJG5nUmVkdXguZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5nZXRFdmVudHMoc3RhdGUuc2VhcmNoLnF1ZXJ5KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRFdmVudHMoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uRGVzdHJveSgpIHtcclxuICAgICAgICAgICAgdW5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIgbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ldmVudHNcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgPGgzPjxhIGhyZWY9XCIjL2V2ZW50L3t7aXRlbS5pZH19XCI+e3tpdGVtLm5hbWV9fTwvYT48L2gzPlxyXG4gICAgICAgICAgICAgICAgPHA+e3tpdGVtLmRlc2NyaXB0aW9ufX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57e2l0ZW0uZGF0ZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnbmF2aWdhdGlvbicsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogbmF2aWdhdGlvbkN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIG5hdmlnYXRpb25DdHJsLiRpbmplY3QgPSBbJ2F1dGhTZXJ2aWNlJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBuYXZpZ2F0aW9uQ3RybChhdXRoU2VydmljZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaXNBdXRoID0gYXV0aFNlcnZpY2UuaXNBdXRoKCk7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdhdXRoQ2hhbmdlZCcsIGF1dGhDaGFuZ2VkKTtcclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm5hdmJhciBuYXZiYXItZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXZcIj4gXHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIG5nLWlmPVwiJGN0cmwuaXNBdXRoXCI+PGEgaHJlZj1cIiMvaG9tZVwiPtCc0L7RjyDRgdGC0YDQsNC90LjRhtCwPC9hPjwvbGk+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9ldmVudHNcIj7QnNC10YDQvtC/0YDQuNGP0YLQuNGPPC9hPjwvbGk+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiIy9hcnRpc3RzXCI+0JDRgNGC0LjRgdGC0Ys8L2E+PC9saT4gXHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhPtCR0LvQvtCzPC9hPjwvbGk+IFxyXG4gICAgICAgICAgICAgICAgPC91bD5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdzZWFyY2hNb2R1bGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ3NlYXJjaFdpZGdldCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogc2VhcmNoV2lkZ2V0Q3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgc2VhcmNoV2lkZ2V0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIHNlYXJjaFdpZGdldEN0cmwoJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbnMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB2YXIgdW5jb25uZWN0ID0gJG5nUmVkdXguY29ubmVjdChtYXBTdGF0ZVRvVGhpcywgYWN0aW9ucykodm0pO1xyXG5cclxuICAgICAgICB0aGlzLnF1ZXJ5ID0gJyc7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hLZXlQcmVzcyA9IHNlYXJjaEtleVByZXNzO1xyXG4gICAgICAgIHRoaXMuc2VhcmNoS2V5VXAgPSBzZWFyY2hLZXlVcDtcclxuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSAkb25EZXN0cm95O1xyXG5cclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG1hcFN0YXRlVG9UaGlzKHN0YXRlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzdGF0ZTogc3RhdGVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoS2V5UHJlc3MoZSkge1xyXG4gICAgICAgICAgICBpZiAoZS5jaGFyQ29kZSA9PT0gMTMpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9zZWFyY2gnKSk7XHJcbiAgICAgICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmhhc2hTZWFyY2goJ3E9JyArIHRoaXMucXVlcnkpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2VhcmNoS2V5VXAoZSkge1xyXG4gICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmNoYW5nZVNlYXJjaFN0cmluZyh0aGlzLnF1ZXJ5KSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiAkb25EZXN0cm95KCkge1xyXG4gICAgICAgICAgICB1bmNvbm5lY3QoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInNlYXJjaFwiIFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzPVwiZm9ybS1jb250cm9sXCIgXHJcbiAgICAgICAgICAgICAgICAgICAgbmcta2V5cHJlc3M9XCIkY3RybC5zZWFyY2hLZXlQcmVzcygkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICBuZy1rZXl1cD1cIiRjdHJsLnNlYXJjaEtleVVwKCRldmVudClcIlxyXG4gICAgICAgICAgICAgICAgICAgIG5nLW1vZGVsPVwiJGN0cmwucXVlcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgIHBsYWNlaG9sZGVyPVwi0J/QvtC40YHQulwiPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdhdXRoRW5kcG9pbnQnLCBhdXRoRW5kcG9pbnQpO1xyXG5cclxuYXV0aEVuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJGNvb2tpZXMnXTtcclxuXHJcbmZ1bmN0aW9uIGF1dGhFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJGNvb2tpZXMpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG4gICAgdmFyIHRva2VuID0gJGNvb2tpZXMuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICB2YXIgc3RhciA9ICcqJztcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvOmVudGl0eS86dHlwZScsIHF1ZXJ5UGFyYW0sIHtcclxuICAgICAgICAgICAgZ2V0Q3VycmVudFVzZXI6IHtcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogJ3VzZXInXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGxvZ2luOiB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6ICdsb2dpbicsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3ZrJyxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2V2ZW50RW5kcG9pbnQnLCBldmVudEVuZHBvaW50KTtcclxuXHJcbmV2ZW50RW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCcsICckcSddO1xyXG5cclxuZnVuY3Rpb24gZXZlbnRFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJHEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy9ldmVudC86aWQnLCBxdWVyeVBhcmFtLCB7XHJcbiAgICAgICAgICAgIGdldEV2ZW50OiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScpXHJcbiAgICAuc2VydmljZSgnZXZlbnRzRW5kcG9pbnQnLCBldmVudHNFbmRwb2ludCk7XHJcblxyXG5ldmVudHNFbmRwb2ludC4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnYXBpVXJsJywgJyRxJ107XHJcblxyXG5mdW5jdGlvbiBldmVudHNFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJHEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy9ldmVudHMvOmxpa2UvOnNlYXJjaFN0cmluZy86bGltaXQvOm9mZnNldCcsIHF1ZXJ5UGFyYW0sIHtcclxuICAgICAgICAgICAgZ2V0RXZlbnRzQWxsOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaWtlOiBudWxsLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlYXJjaFN0cmluZzogbnVsbCxcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZ2V0RXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBsaWtlOiAnbGlrZScsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIl0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
