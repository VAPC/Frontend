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
        console.log('cl TOKEN', TOKEN);
        if (TOKEN) {

            var $http = $injector.get('$http');
            $http.defaults.headers.common['AUTH-TOKEN'] = TOKEN;
            // $http.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
            // $http.defaults.headers.common['Access-Control-Request-Headers'] = 'accept, origin, authorization, key';
            //$http.defaults.headers.common['AUTH-TOKEN'] = 'test';

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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImVuZHBvaW50cy9lbmRwb2ludHMubWRsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGgubWRsLmpzIiwiY29tcG9uZW50cy9zZWFyY2gvc2VhcmNoLm1kbC5qcyIsInJvdXRlci5qcyIsImFwcC9hY3Rpb25zLmpzIiwiYXBwL21lbW9pemUuanMiLCJhcHAvcmVkdWNlcnMuanMiLCJjb21wb25lbnRzL2JhbmQtY3JlYXRlL2JhbmQtY3JlYXRlLmNtdC5qcyIsImNvbXBvbmVudHMvYXV0aC9hdXRoLnNydi5qcyIsImNvbXBvbmVudHMvYXV0aC9hdXRoTG9naW5Qcm9jZXNzLmN0cmwuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aFdpZGdldC5jbXQuanMiLCJjb21wb25lbnRzL2JhbmQtZWRpdC9iYW5kLWVkaXQuY210LmpzIiwiY29tcG9uZW50cy9iYW5kLWluZm8vYmFuZC1pbmZvLmNtdC5qcyIsImNvbXBvbmVudHMvYmFuZHMtbGlzdC9iYW5kcy1saXN0LmNtdC5qcyIsImNvbXBvbmVudHMvY29udGVudC9jb250ZW50LmNtdC5qcyIsImNvbXBvbmVudHMvZXZlbnQtaW5mby9ldmVudHMtaW5mby5jbXQuanMiLCJjb21wb25lbnRzL2V2ZW50cy1saXN0L2V2ZW50cy1saXN0LmNtdC5qcyIsImNvbXBvbmVudHMvbmF2aWdhdGlvbi9uYXZpZ2F0aW9uLmNtdC5qcyIsImNvbXBvbmVudHMvc2VhcmNoL3NlYXJjaFdpZGdldC5jbXQuanMiLCJlbmRwb2ludHMvYXV0aC9hdXRoRW5kcG9pbnQuanMiLCJlbmRwb2ludHMvYmFuZHMvYmFuZEVuZHBvaW50LmpzIiwiZW5kcG9pbnRzL2JhbmRzL2JhbmRzRW5kcG9pbnQuanMiLCJlbmRwb2ludHMvZXZlbnRzL2V2ZW50RW5kcG9pbnQuanMiLCJlbmRwb2ludHMvZXZlbnRzL2V2ZW50c0VuZHBvaW50LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNyREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDMURBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDaEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUN2QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBpbXBvcnQgcmVkdWNlcnMgZnJvbSAnLi9hcHAvcmVkdWNlcnMnXHJcblxyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScsIFtcclxuICAgICAgICAgICAgJ25nUm91dGUnLFxyXG4gICAgICAgICAgICAnbmdDb29raWVzJyxcclxuICAgICAgICAgICAgJ25nUmVzb3VyY2UnLFxyXG4gICAgICAgICAgICAnbmdSZWR1eCcsXHJcblxyXG4gICAgICAgICAgICAnZW5kcG9pbnRzTW9kdWxlJyxcclxuICAgICAgICAgICAgJ2F1dGhNb2R1bGUnLFxyXG4gICAgICAgICAgICAnc2VhcmNoTW9kdWxlJyxcclxuICAgICAgICBdKTtcclxuXHJcbn0oKSk7IiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ2FwaVVybCcsIGFwaVVybCk7XHJcblxyXG5mdW5jdGlvbiBhcGlVcmwoKSB7XHJcbiAgICB2YXIgdXJsO1xyXG4gICAgc3dpdGNoICh3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpIHtcclxuICAgICAgICBjYXNlICdsb2NhbGhvc3QnOlxyXG4gICAgICAgICAgICB1cmwgPSAnaHR0cDovL3JvY2twYXJhZGUuY3Jlb3JhLnJ1L2FwaSc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyAnL2FwaSc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVybDtcclxufVxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2F1dGhNb2R1bGUnLCBbXSlcclxuICAgICAgICAvLyAuY29uZmlnKGh0dHBJbnRlcmNlcHRvckNvbmZpZylcclxuICAgICAgICAucnVuKGh0dHBJbnRlcmNlcHRvclJ1bik7XHJcblxyXG4gICAgLy8gaHR0cEludGVyY2VwdG9yQ29uZmlnLiRpbmplY3QgPSBbJyRodHRwUHJvdmlkZXInXTtcclxuICAgIC8vXHJcbiAgICAvLyBmdW5jdGlvbiBodHRwSW50ZXJjZXB0b3JDb25maWcoJGh0dHBQcm92aWRlcikge1xyXG4gICAgLy8gICAgICRodHRwUHJvdmlkZXIuZGVmYXVsdHMudXNlWERvbWFpbiA9IHRydWU7XHJcbiAgICAvLyAgICAgZGVsZXRlICRodHRwUHJvdmlkZXIuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ1gtUmVxdWVzdGVkLVdpdGgnXTtcclxuICAgIC8vIH1cclxuXHJcbiAgICBodHRwSW50ZXJjZXB0b3JSdW4uJGluamVjdCA9IFsnJGluamVjdG9yJ107XHJcblxyXG4gICAgZnVuY3Rpb24gaHR0cEludGVyY2VwdG9yUnVuKCRpbmplY3Rvcikge1xyXG4gICAgICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICAgICAgdmFyIFRPS0VOID0gJGluamVjdG9yLmdldCgnJGNvb2tpZXMnKS5nZXQoJ0FVVEgtVE9LRU4nKTtcclxuICAgICAgICBjb25zb2xlLmxvZygnY2wgVE9LRU4nLCBUT0tFTik7XHJcbiAgICAgICAgaWYgKFRPS0VOKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgJGh0dHAgPSAkaW5qZWN0b3IuZ2V0KCckaHR0cCcpO1xyXG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQVVUSC1UT0tFTiddID0gVE9LRU47XHJcbiAgICAgICAgICAgIC8vICRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBY2Nlc3MtQ29udHJvbC1BbGxvdy1IZWFkZXJzJ10gPSAnQ29udGVudC1UeXBlLCBBdXRob3JpemF0aW9uLCBYLVJlcXVlc3RlZC1XaXRoJztcclxuICAgICAgICAgICAgLy8gJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5jb21tb25bJ0FjY2Vzcy1Db250cm9sLVJlcXVlc3QtSGVhZGVycyddID0gJ2FjY2VwdCwgb3JpZ2luLCBhdXRob3JpemF0aW9uLCBrZXknO1xyXG4gICAgICAgICAgICAvLyRodHRwLmRlZmF1bHRzLmhlYWRlcnMuY29tbW9uWydBVVRILVRPS0VOJ10gPSAndGVzdCc7XHJcblxyXG4gICAgICAgICAgICAvLyAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLnBvc3RbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCc7XHJcbiAgICAgICAgICAgIC8vICRodHRwLmRlZmF1bHRzLmhlYWRlcnMucHV0WydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7IGNoYXJzZXQ9VVRGLTgnO1xyXG5cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc29sZS5sb2coJ0F1dGg6IHVzZXIgYXV0aGVudGljYXRpb24gZXJyb3IuIENvb2tpZXMgZG9lc25cXCd0IGNvbnRhaW4gXCJBVVRILVRPS0VOXCInKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdzZWFyY2hNb2R1bGUnLCBbXSk7XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29uZmlnKHJvdXRlcik7XHJcblxyXG4gICAgcm91dGVyLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJ107XHJcblxyXG4gICAgZnVuY3Rpb24gcm91dGVyKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xhbmRpbmcuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvaG9tZScsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnaG9tZS5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9ldmVudC86aWQnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2V2ZW50Lmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2V2ZW50cycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnZXZlbnRzLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2JhbmRzJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdiYW5kcy5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9iYW5kLzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmFuZC5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9iYW5kQ3JlYXRlJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdiYW5kQ3JlYXRlLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2JhbmRFZGl0LzppZCcsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnYmFuZEVkaXQuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvc2VhcmNoPzpibGEnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3NlYXJjaC5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9sb2dpbi92ay9jYWxsYmFjaycsIHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdhdXRoTG9naW5Qcm9jZXNzQ3RybCcsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJycsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5vdGhlcndpc2Uoe1xyXG4gICAgICAgICAgICAgICAgcmVkaXJlY3RUbzogJy8nXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvLyRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSh7XHJcbiAgICAgICAgLy8gICAgZW5hYmxlZDogdHJ1ZSxcclxuICAgICAgICAvLyAgICByZXF1aXJlQmFzZTogZmFsc2VcclxuICAgICAgICAvL30pO1xyXG4gICAgfTtcclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuc2VydmljZSgnYWN0aW9ucycsIGFjdGlvbnMpO1xyXG5cclxuICAgIGFjdGlvbnMuJGluamVjdCA9IFtdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFjdGlvbnMoKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgY2hhbmdlU2VhcmNoU3RyaW5nOiBjaGFuZ2VTZWFyY2hTdHJpbmcsXHJcbiAgICAgICAgICAgIGxvY2F0aW9uOiBsb2NhdGlvbixcclxuICAgICAgICAgICAgaGFzaFNlYXJjaDpoYXNoU2VhcmNoLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGNoYW5nZVNlYXJjaFN0cmluZyh2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ0NIQU5HRV9TRUFSQ0hfU1RSSU5HJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2NhdGlvbih2YWx1ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgdHlwZTogJ0xPQ0FUSU9OJyxcclxuICAgICAgICAgICAgICAgIHZhbHVlOiB2YWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGhhc2hTZWFyY2godmFsdWUpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIHR5cGU6ICdIQVNIX1NFQVJDSCcsXHJcbiAgICAgICAgICAgICAgICB2YWx1ZTogdmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGZ1bmN0aW9uIG1lbW9pemUoKSB7XHJcbiAgICAgICAgcmV0dXJuIChmdW5jLCBlcXVhbGl0eUNoZWNrID0gZGVmYXVsdEVxdWFsaXR5Q2hlY2spID0+IHtcclxuICAgICAgICAgICAgbGV0IGxhc3RBcmdzID0gbnVsbDtcclxuICAgICAgICAgICAgbGV0IGxhc3RSZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gKC4uLmFyZ3MpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChcclxuICAgICAgICAgICAgICAgICAgICBsYXN0QXJncyAhPT0gbnVsbCAmJlxyXG4gICAgICAgICAgICAgICAgICAgIGxhc3RBcmdzLmxlbmd0aCA9PT0gYXJncy5sZW5ndGggJiZcclxuICAgICAgICAgICAgICAgICAgICBhcmdzLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IGVxdWFsaXR5Q2hlY2sodmFsdWUsIGxhc3RBcmdzW2luZGV4XSkpXHJcbiAgICAgICAgICAgICAgICApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbGFzdFJlc3VsdDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGxhc3RBcmdzID0gYXJncztcclxuICAgICAgICAgICAgICAgIGxhc3RSZXN1bHQgPSBmdW5jKC4uLmFyZ3MpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGRlZmF1bHRFcXVhbGl0eUNoZWNrKGEsIGIpIHtcclxuICAgICAgICByZXR1cm4gYSA9PT0gYlxyXG4gICAgfVxyXG5cclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuZmFjdG9yeSgnbWVtb2l6ZScsIG1lbW9pemUpO1xyXG5cclxuXHJcbn0oKSk7XHJcblxyXG4vLyBmdW5jdGlvbiBtZW1vaXplKGZ1bmMsIGVxdWFsaXR5Q2hlY2sgPSBkZWZhdWx0RXF1YWxpdHlDaGVjaykge1xyXG4vLyAgICAgbGV0IGxhc3RBcmdzID0gbnVsbDtcclxuLy8gICAgIGxldCBsYXN0UmVzdWx0ID0gbnVsbDtcclxuLy8gICAgIHJldHVybiAoLi4uYXJncykgPT4ge1xyXG4vLyAgICAgICAgIGlmIChcclxuLy8gICAgICAgICAgICAgbGFzdEFyZ3MgIT09IG51bGwgJiZcclxuLy8gICAgICAgICAgICAgbGFzdEFyZ3MubGVuZ3RoID09PSBhcmdzLmxlbmd0aCAmJlxyXG4vLyAgICAgICAgICAgICBhcmdzLmV2ZXJ5KCh2YWx1ZSwgaW5kZXgpID0+IGVxdWFsaXR5Q2hlY2sodmFsdWUsIGxhc3RBcmdzW2luZGV4XSkpXHJcbi8vICAgICAgICAgKSB7XHJcbi8vICAgICAgICAgICAgIHJldHVybiBsYXN0UmVzdWx0O1xyXG4vLyAgICAgICAgIH1cclxuLy8gICAgICAgICBsYXN0QXJncyA9IGFyZ3M7XHJcbi8vICAgICAgICAgbGFzdFJlc3VsdCA9IGZ1bmMoLi4uYXJncyk7XHJcbi8vICAgICAgICAgcmV0dXJuIGxhc3RSZXN1bHQ7XHJcbi8vICAgICB9XHJcbi8vIH0iLCIoZnVuY3Rpb24gKCkge1xyXG5cclxuICAgIHZhciBkZWZhdWx0U3RhdGUgPSB7XHJcbiAgICAgICAgbG9jYXRpb246IHtcclxuICAgICAgICAgICAgcGF0aDogJycsXHJcbiAgICAgICAgICAgIGhhc2hTZWFyY2g6ICcnLFxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgc2VhcmNoOiB7XHJcbiAgICAgICAgICAgIHF1ZXJ5OiAnJyxcclxuICAgICAgICB9LFxyXG4gICAgICAgIHVzZXI6IHtcclxuICAgICAgICAgICAgdWlkOiAnJyxcclxuICAgICAgICAgICAgbmFtZTogJycsXHJcbiAgICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gcmVkdWNlcnMoc3RhdGUgPSBkZWZhdWx0U3RhdGUsIGFjdGlvbikge1xyXG4gICAgICAgIHN3aXRjaCAoYWN0aW9uLnR5cGUpIHtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ0NIQU5HRV9TRUFSQ0hfU1RSSU5HJzpcclxuICAgICAgICAgICAgICAgIHN0YXRlLnNlYXJjaC5xdWVyeSA9IGFjdGlvbi52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHN0YXRlKTtcclxuXHJcbiAgICAgICAgICAgIGNhc2UgJ0xPQ0FUSU9OJzpcclxuICAgICAgICAgICAgICAgIHN0YXRlLmxvY2F0aW9uLnBhdGggPSBhY3Rpb24udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSk7XHJcbiAgICAgICAgICAgIGNhc2UgJ0hBU0hfU0VBUkNIJzpcclxuICAgICAgICAgICAgICAgIHN0YXRlLmxvY2F0aW9uLmhhc2hTZWFyY2ggPSBhY3Rpb24udmFsdWU7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihzdGF0ZSk7XHJcblxyXG4gICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN0YXRlO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb25maWcobmdSZWR1eENvbmZpZyk7XHJcblxyXG4gICAgbmdSZWR1eENvbmZpZy4kaW5qZWN0ID0gWyckbmdSZWR1eFByb3ZpZGVyJ107XHJcblxyXG4gICAgZnVuY3Rpb24gbmdSZWR1eENvbmZpZygkbmdSZWR1eFByb3ZpZGVyKSB7XHJcbiAgICAgICAgJG5nUmVkdXhQcm92aWRlci5jcmVhdGVTdG9yZVdpdGgocmVkdWNlcnMpO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYmFuZENyZWF0ZScsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogYmFuZENyZWF0ZUN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGJhbmRDcmVhdGVDdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJ2JhbmRFbmRwb2ludCcsXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnYWN0aW9ucyddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGJhbmRDcmVhdGVDdHJsKGJhbmRFbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uZm9ybURhdGEgPSB7XHJcbiAgICAgICAgICAgIG5hbWU6ICcnLFxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbjogJydcclxuICAgICAgICB9O1xyXG4gICAgICAgIHZtLmZvcm1TdWJtaXQgPSBmb3JtU3VibWl0SGFuZGxlcjtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtU3VibWl0SGFuZGxlcihlKSB7XHJcbiAgICAgICAgICAgIGJhbmRFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmNyZWF0ZUJhbmQodm0uZm9ybURhdGEsIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2UnLCByZXNwb25zZSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5sb2NhdGlvbignL2JhbmRzJykpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGZvcm0gbmFtZT1cImZvcm0tY3JlYXRlLWJhbmRcIiBuZy1zdWJtaXQ9XCIkY3RybC5mb3JtU3VibWl0KClcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3JlYXRlLWJhbmQtbmFtZVwiPtCd0LDQt9Cy0LDQvdC40LUg0LPRgNGD0L/Qv9GLPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY3JlYXRlLWJhbmQtbmFtZVwiIG5hbWU9XCJjcmVhdGUtYmFuZC1uYW1lXCIgbmctbW9kZWw9XCIkY3RybC5mb3JtRGF0YS5uYW1lXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiPtCe0L/QuNGB0LDQvdC40LUg0LPRgNGD0L/Qv9GLPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIiBuYW1lPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIiBuZy1tb2RlbD1cIiRjdHJsLmZvcm1EYXRhLmRlc2NyaXB0aW9uXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj7QodC+0LfQtNCw0YLRjDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgPC9mb3JtPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsImFuZ3VsYXIubW9kdWxlKCdhdXRoTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdhdXRoU2VydmljZScsIGF1dGhTZXJ2aWNlKTtcclxuXHJcbmF1dGhTZXJ2aWNlLiRpbmplY3QgPSBbJ2F1dGhFbmRwb2ludCcsXHJcbiAgICAnJHEnLFxyXG4gICAgJyRjb29raWVzJyxcclxuICAgICckbG9jYXRpb24nXTtcclxuXHJcbmZ1bmN0aW9uIGF1dGhTZXJ2aWNlKGF1dGhFbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgJHEsXHJcbiAgICAgICAgICAgICAgICAgICAgICRjb29raWVzLFxyXG4gICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24pIHtcclxuXHJcbiAgICB2YXIgY3VycmVudFVzZXJEZWZlcjtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGlzQXV0aDogaXNBdXRoLFxyXG4gICAgICAgIGxvZ2luOiBsb2dpbixcclxuICAgICAgICBsb2dvdXQ6IGxvZ291dCxcclxuICAgICAgICBnZXRDdXJyZW50VXNlcjogZ2V0Q3VycmVudFVzZXIsXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGlzQXV0aCgpIHtcclxuICAgICAgICByZXR1cm4gISEkY29va2llcy5nZXQoJ0FVVEgtVE9LRU4nKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2dpbigpIHtcclxuICAgICAgICBhdXRoRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5sb2dpbih7fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2U6JywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZTonLCByZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIGxvZ291dCgpIHtcclxuICAgICAgICAkY29va2llcy5yZW1vdmUoJ0FVVEgtVE9LRU4nKTtcclxuICAgICAgICAkbG9jYXRpb24ucGF0aCgnLyMnKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBnZXRDdXJyZW50VXNlcigpIHtcclxuICAgICAgICBpZiAoIWN1cnJlbnRVc2VyRGVmZXIpIHtcclxuICAgICAgICAgICAgY3VycmVudFVzZXJEZWZlciA9ICRxLmRlZmVyKCk7XHJcbiAgICAgICAgICAgIGF1dGhFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEN1cnJlbnRVc2VyKHt9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBjdXJyZW50VXNlckRlZmVyLnJlc29sdmUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXJEZWZlci5yZWplY3QocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gY3VycmVudFVzZXJEZWZlci5wcm9taXNlO1xyXG4gICAgfVxyXG59XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXV0aE1vZHVsZScpXHJcbiAgICAgICAgLmNvbnRyb2xsZXIoJ2F1dGhMb2dpblByb2Nlc3NDdHJsJywgYXV0aExvZ2luUHJvY2Vzc0N0cmwpO1xyXG5cclxuICAgIGF1dGhMb2dpblByb2Nlc3NDdHJsLiRpbmplY3QgPSBbJyRyb3V0ZVBhcmFtcycsICckbG9jYXRpb24nLCAnJGNvb2tpZXMnLCAnJHJvb3RTY29wZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhMb2dpblByb2Nlc3NDdHJsKCRyb3V0ZVBhcmFtcywgJGxvY2F0aW9uLCAkY29va2llcywgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgaWYgKCRyb3V0ZVBhcmFtcy5oYXNPd25Qcm9wZXJ0eSgndG9rZW4nKSkge1xyXG4gICAgICAgICAgICB2YXIgZXhwaXJlRGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICAgICAgICAgIGV4cGlyZURhdGUuc2V0RGF0ZShleHBpcmVEYXRlLmdldERhdGUoKSArIDE0KTtcclxuICAgICAgICAgICAgJGNvb2tpZXMucHV0KCdBVVRILVRPS0VOJywgJHJvdXRlUGFyYW1zLnRva2VuLCB7J2V4cGlyZXMnOiBleHBpcmVEYXRlfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRyb290U2NvcGUuJGVtaXQoJ2F1dGhDaGFuZ2VkJyk7XHJcbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICRsb2NhdGlvbi5wYXRoKCcvIy9ob21lJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG4gICAgfVxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnYXV0aE1vZHVsZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYXV0aFdpZGdldCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogYXV0aFdpZGdldEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGF1dGhXaWRnZXRDdHJsLiRpbmplY3QgPSBbJ2F1dGhTZXJ2aWNlJyxcclxuICAgICAgICAnYXBpVXJsJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoV2lkZ2V0Q3RybChhdXRoU2VydmljZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFwaVVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmxvZ2luVXJsID0gYXBpVXJsICsgJy9sb2dpbi92ayc7XHJcbiAgICAgICAgdm0uaXNBdXRoID0gYXV0aFNlcnZpY2UuaXNBdXRoKCk7XHJcbiAgICAgICAgdm0ubG9naW4gPSBhdXRoU2VydmljZS5sb2dpbjtcclxuICAgICAgICB2bS5sb2dvdXQgPSBsb2dvdXQ7XHJcbiAgICAgICAgJHJvb3RTY29wZS4kb24oJ2F1dGhDaGFuZ2VkJywgYXV0aENoYW5nZWQpO1xyXG5cclxuICAgICAgICBpZiAodm0uaXNBdXRoKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCdjbCByZXNwb25zZScsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIHZtLnVzZXIgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgICAgICAgICBhdXRoU2VydmljZS5sb2dvdXQoKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kZW1pdCgnYXV0aENoYW5nZWQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhdXRoLXdpZGdldF9fYnRuLWhvbGRlclwiIFxyXG4gICAgICAgICAgICAgICAgIG5nLWlmPVwiISRjdHJsLmlzQXV0aFwiPlxyXG4gICAgICAgICAgICAgICAgPGEgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHQgYnRuLXNtXCIgaHJlZj1cInt7JGN0cmwubG9naW5Vcmx9fVwiPtCS0L7QudGC0Lg8L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IG5nLWlmPVwiJGN0cmwuaXNBdXRoXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2PkhpLCB7eyRjdHJsLnVzZXIubG9naW59fSE8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxhIG5nLWNsaWNrPVwiJGN0cmwubG9nb3V0KClcIj5Mb2dvdXQ8L2E+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTtcclxuIiwiKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2JhbmRFZGl0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBiYW5kRWRpdEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGJhbmRFZGl0Q3RybC4kaW5qZWN0ID0gW1xyXG4gICAgICAgICdiYW5kRW5kcG9pbnQnLFxyXG4gICAgICAgICckcm91dGVQYXJhbXMnLFxyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ2FjdGlvbnMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBiYW5kRWRpdEN0cmwoYmFuZEVuZHBvaW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICRyb3V0ZVBhcmFtcyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5pZCA9ICRyb3V0ZVBhcmFtcy5pZDtcclxuXHJcbiAgICAgICAgYmFuZEVuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0QmFuZCh7aWQ6IHZtLmlkfSwgZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdm0uYmFuZERhdGEgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2bS5mb3JtU3VibWl0ID0gZm9ybVN1Ym1pdDtcclxuICAgICAgICB2bS5mb3JtQ2FuY2VsID0gZm9ybUNhbmNlbDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBmb3JtU3VibWl0KCkge1xyXG5cclxuICAgICAgICAgICAgYmFuZEVuZHBvaW50LmdldFJlc291cmNlKHtpZDogdm0uaWR9KS5lZGl0QmFuZCh0aGlzLmJhbmREYXRhLCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG5cclxuICAgICAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9iYW5kLycgKyB2bS5pZCkpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbihyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZvcm1DYW5jZWwoKSB7XHJcbiAgICAgICAgICAgICRuZ1JlZHV4LmRpc3BhdGNoKGFjdGlvbnMubG9jYXRpb24oJy9iYW5kLycgKyB2bS5pZCkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBuZy1oaWRlPVwiJGN0cmwuYmFuZERhdGFcIj5Mb2FkaW5nLi4uPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgbmctc2hvdz1cIiRjdHJsLmJhbmREYXRhXCIgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgIDxoMz7QoNC10LTQsNC60YLQuNGA0L7QstCw0YLRjDwvaDM+XHJcbiAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8Zm9ybSBuYW1lPVwiZm9ybS1lZGl0LWJhbmRcIiBuZy1zdWJtaXQ9XCIkY3RybC5mb3JtU3VibWl0KClcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiZm9ybS1ncm91cFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGFiZWwgZm9yPVwiY3JlYXRlLWJhbmQtbmFtZVwiPtCd0LDQt9Cy0LDQvdC40LUg0LPRgNGD0L/Qv9GLPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IGlkPVwiY3JlYXRlLWJhbmQtbmFtZVwiIG5hbWU9XCJjcmVhdGUtYmFuZC1uYW1lXCIgbmctbW9kZWw9XCIkY3RybC5iYW5kRGF0YS5uYW1lXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJmb3JtLWdyb3VwXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxsYWJlbCBmb3I9XCJjcmVhdGUtYmFuZC1kZXNjcmlwdGlvblwiPtCe0L/QuNGB0LDQvdC40LUg0LPRgNGD0L/Qv9GLPC9sYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRleHRhcmVhIGlkPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIiBuYW1lPVwiY3JlYXRlLWJhbmQtZGVzY3JpcHRpb25cIiBuZy1tb2RlbD1cIiRjdHJsLmJhbmREYXRhLmRlc2NyaXB0aW9uXCIgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiPjwvdGV4dGFyZWE+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0tZ3JvdXBcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwic3VibWl0XCIgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIj7QodC+0YXRgNCw0L3QuNGC0Yw8L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwicmVzZXRcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIG5nLWNsaWNrPVwiJGN0cmwuZm9ybUNhbmNlbCgpXCI+0J7RgtC80LXQvdCwPC9idXR0b24+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICA8L2Zvcm0+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLnJlZ2lzdHJhdGlvbl9kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmJhbmREYXRhLm1lbWJlcnN9fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEuY3JlYXRvcn19PC9wPlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdiYW5kSW5mbycsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogYmFuZEluZm9DdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBiYW5kSW5mb0N0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnYmFuZEVuZHBvaW50JyxcclxuICAgICAgICAnJHJvdXRlUGFyYW1zJyxcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdhY3Rpb25zJ107XHJcblxyXG4gICAgZnVuY3Rpb24gYmFuZEluZm9DdHJsKGJhbmRFbmRwb2ludCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAkcm91dGVQYXJhbXMsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aW9ucykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblxyXG4gICAgICAgIGJhbmRFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEJhbmQoe2lkOiB2bS5pZH0sIGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHZtLmJhbmREYXRhID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdm0uYmFuZEVkaXQgPSBiYW5kRWRpdDtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBiYW5kRWRpdCgpIHtcclxuICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5sb2NhdGlvbignL2JhbmRFZGl0LycgKyB2bS5pZCkpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudF9fYmFuZFwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImhlcm8taW1hZ2VcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJzaWRlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInNpZGUtbGVmdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmFuZF9fbGVmdC1ib3hcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJiYW5kX19waG90b1wiPjxpbWcgc3JjPVwiLi4vYXNzZXRzL2FudG9uLnBuZ1wiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJhbmRfX3N1YnNjcmliZVwiPjxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj7Qn9C+0LTQv9C40YHQsNC9PC9idXR0b24+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYmFuZF9fY291bnRlcnNcIj45OTk5PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJhbmRfX2xlZnQtYm94XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibGVmdC1ib3hfX2hlYWRlclwiPtCh0L7RgdGC0L7QuNGCINCyINCz0YDRg9C/0L/QsNGFIDI8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJsZWZ0LWJveF9fZ3JvdXBzXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImdyb3Vwc19fZ3JvdXBcIj48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2lkZS1jZW50ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVwcGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwidXBwZXJfX25hbWVcIj7QkNC90YLQvtC9INCa0L7RgNC10LvRj9C60L7QsjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInVwcGVyX19idXR0b25zXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPtCh0L7QvtCx0YnQtdC90LjQtTwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj7Qn9GA0LjQs9C70LDRgdC40YLRjDwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDxkaXYgbmctaGlkZT1cIiRjdHJsLmJhbmREYXRhXCI+TG9hZGluZy4uLjwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IG5nLXNob3c9XCIkY3RybC5iYW5kRGF0YVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxoMz57eyRjdHJsLmJhbmREYXRhLm5hbWV9fTwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEuZGVzY3JpcHRpb259fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuYmFuZERhdGEucGxhY2V9fTwvcD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+e3skY3RybC5iYW5kRGF0YS5jcmVhdG9yfX08L3A+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIG5nLWNsaWNrPVwiJGN0cmwuYmFuZEVkaXQoKVwiPtCg0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMPC9idXR0b24+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnYmFuZHNMaXN0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBiYW5kc0xpc3RDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBiYW5kc0xpc3RDdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJyRuZ1JlZHV4JyxcclxuICAgICAgICAnbWVtb2l6ZScsXHJcbiAgICAgICAgJ2JhbmRzRW5kcG9pbnQnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGJhbmRzTGlzdEN0cmwoJG5nUmVkdXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9pemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIGJhbmRzRW5kcG9pbnQpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLiRvbkRlc3Ryb3kgPSAkb25EZXN0cm95O1xyXG5cclxuICAgICAgICB0aGlzLmdldEJhbmRzID0gbWVtb2l6ZShmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgYmFuZHNFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEJhbmRzKHt9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIHZtLmJhbmRzID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHZhciB1bmNvbm5lY3QgPSAkbmdSZWR1eC5zdWJzY3JpYmUoKCkgPT4ge1xyXG4gICAgICAgICAgICBsZXQgc3RhdGUgPSAkbmdSZWR1eC5nZXRTdGF0ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmdldEJhbmRzKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0QmFuZHMoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uRGVzdHJveSgpIHtcclxuICAgICAgICAgICAgdW5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIgbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5iYW5kc1wiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8aDM+PGEgaHJlZj1cIiMvYmFuZC97e2l0ZW0uaWR9fVwiPnt7aXRlbS5uYW1lfX08L2E+PC9oMz5cclxuICAgICAgICAgICAgICAgIDxwPnt7aXRlbS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+cmVnaXN0ZXI6IHt7aXRlbS5yZWdpc3RyYXRpb25fZGF0ZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+bWVtYmVyczoge3tpdGVtLm1lbWJlcnN9fTwvcD5cclxuICAgICAgICAgICAgICAgIDxwPmNyZWF0b3I6IHt7aXRlbS5jcmVhdG9yfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD48YSBocmVmPVwiIy9iYW5kRWRpdC97e2l0ZW0uaWR9fVwiPtCg0LXQtNCw0LrRgtC40YDQvtCy0LDRgtGMPC9hPjwvcD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2NvbnRlbnQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGNvbnRlbnRDb250cm9sbGVyLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBjb250ZW50Q29udHJvbGxlci4kaW5qZWN0ID0gW1xyXG4gICAgICAgICckbmdSZWR1eCcsXHJcbiAgICAgICAgJ21lbW9pemUnLFxyXG4gICAgICAgICckbG9jYXRpb24nXTtcclxuXHJcbiAgICBmdW5jdGlvbiBjb250ZW50Q29udHJvbGxlcigkbmdSZWR1eCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1lbW9pemUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbG9jYXRpb24pIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB0aGlzLnNldExvY2F0aW9uID0gbWVtb2l6ZShmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAkbG9jYXRpb24ucGF0aCh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgICB0aGlzLnNldEhhc2hTZWFyY2ggPSBtZW1vaXplKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICRsb2NhdGlvbi5zZWFyY2godmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRuZ1JlZHV4LnN1YnNjcmliZSgoKSA9PiB7XHJcbiAgICAgICAgICAgIGxldCBzdGF0ZSA9ICRuZ1JlZHV4LmdldFN0YXRlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TG9jYXRpb24oc3RhdGUubG9jYXRpb24ucGF0aCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0SGFzaFNlYXJjaChzdGF0ZS5sb2NhdGlvbi5oYXNoU2VhcmNoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b3AtbWVudVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRvcC1tZW51X19ob2xkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMlwiPjxhIGhyZWY9XCIjL1wiPjxpbWcgc3JjPVwiY3NzL2ltZy9sb2dvMi5wbmdcIiBhbHQ9XCJSb2NrcGFyYWRlXCI+PC9hPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLThcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuYXZpZ2F0aW9uPjwvbmF2aWdhdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGF1dGgtd2lkZ2V0PjwvYXV0aC13aWRnZXQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29udGVudCBoYXMtdG9wLW1lbnVcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgbmctdmlldz1cIlwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnZXZlbnRJbmZvJywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBldmVudEluZm9DdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBldmVudEluZm9DdHJsLiRpbmplY3QgPSBbXHJcbiAgICAgICAgJ2V2ZW50RW5kcG9pbnQnLFxyXG4gICAgICAgICckcm91dGVQYXJhbXMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBldmVudEluZm9DdHJsKGV2ZW50RW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICRyb3V0ZVBhcmFtcykge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaWQgPSAkcm91dGVQYXJhbXMuaWQ7XHJcblxyXG4gICAgICAgIGV2ZW50RW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRFdmVudCh7aWQ6IHZtLmlkfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHZtLmV2ZW50RGF0YSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiPlxyXG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICA8aDM+e3skY3RybC5ldmVudERhdGEubmFtZX19PC9oMz5cclxuICAgICAgICAgICAgICAgIDxwPnt7JGN0cmwuZXZlbnREYXRhLmRlc2NyaXB0aW9ufX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmV2ZW50RGF0YS5kYXRlfX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57eyRjdHJsLmV2ZW50RGF0YS5wbGFjZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3skY3RybC5ldmVudERhdGEuY3JlYXRvcn19PC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29tcG9uZW50KCdldmVudHNMaXN0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBldmVudHNMaXN0Q3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgZXZlbnRzTGlzdEN0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdtZW1vaXplJyxcclxuICAgICAgICAnZXZlbnRzRW5kcG9pbnQnXHJcbiAgICBdO1xyXG5cclxuICAgIGZ1bmN0aW9uIGV2ZW50c0xpc3RDdHJsKCRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWVtb2l6ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50c0VuZHBvaW50KSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gJG9uRGVzdHJveTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRFdmVudHMgPSBtZW1vaXplKGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50c0VuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0RXZlbnRzKHtzZWFyY2hTdHJpbmc6IHZhbHVlfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uZXZlbnRzID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRFdmVudHNBbGwoe30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLmV2ZW50cyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB2YXIgdW5jb25uZWN0ID0gJG5nUmVkdXguc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICAgICAgbGV0IHN0YXRlID0gJG5nUmVkdXguZ2V0U3RhdGUoKTtcclxuICAgICAgICAgICAgdGhpcy5nZXRFdmVudHMoc3RhdGUuc2VhcmNoLnF1ZXJ5KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRFdmVudHMoKTtcclxuXHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uRGVzdHJveSgpIHtcclxuICAgICAgICAgICAgdW5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIgbmctcmVwZWF0PVwiaXRlbSBpbiAkY3RybC5ldmVudHNcIj5cclxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgPGgzPjxhIGhyZWY9XCIjL2V2ZW50L3t7aXRlbS5pZH19XCI+e3tpdGVtLm5hbWV9fTwvYT48L2gzPlxyXG4gICAgICAgICAgICAgICAgPHA+e3tpdGVtLmRlc2NyaXB0aW9ufX08L3A+XHJcbiAgICAgICAgICAgICAgICA8cD57e2l0ZW0uZGF0ZX19PC9wPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnbmF2aWdhdGlvbicsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogbmF2aWdhdGlvbkN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIG5hdmlnYXRpb25DdHJsLiRpbmplY3QgPSBbJ2F1dGhTZXJ2aWNlJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBuYXZpZ2F0aW9uQ3RybChhdXRoU2VydmljZSwgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaXNBdXRoID0gYXV0aFNlcnZpY2UuaXNBdXRoKCk7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCdhdXRoQ2hhbmdlZCcsIGF1dGhDaGFuZ2VkKTtcclxuICAgICAgICByZXR1cm4gdm07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGF1dGhDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cInRvcC1uYXZcIj4gXHJcbiAgICAgICAgICAgICAgICAgICAgPGxpIG5nLWlmPVwiJGN0cmwuaXNBdXRoXCI+PGEgaHJlZj1cIiMvaG9tZVwiPtCc0L7RjyDRgdGC0YDQsNC90LjRhtCwPC9hPjwvbGk+XHJcbiAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjL2JhbmRzXCI+0JDRgNGC0LjRgdGC0Ys8L2E+PC9saT4gICBcclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvbG9jYXRpb25zXCI+0J/Qu9C+0YnQsNC00LrQuDwvYT48L2xpPiBcclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvZXZlbnRzXCI+0JzQtdGA0L7Qv9GA0LjRj9GC0LjRjzwvYT48L2xpPlxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNlYXJjaC13aWRnZXQ+PC9zZWFyY2gtd2lkZ2V0PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvbGk+XHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgnc2VhcmNoTW9kdWxlJylcclxuICAgICAgICAuY29tcG9uZW50KCdzZWFyY2hXaWRnZXQnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHNlYXJjaFdpZGdldEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIHNlYXJjaFdpZGdldEN0cmwuJGluamVjdCA9IFtcclxuICAgICAgICAnJG5nUmVkdXgnLFxyXG4gICAgICAgICdhY3Rpb25zJ1xyXG4gICAgXTtcclxuXHJcbiAgICBmdW5jdGlvbiBzZWFyY2hXaWRnZXRDdHJsKCRuZ1JlZHV4LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb25zKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuXHJcbiAgICAgICAgdmFyIHVuY29ubmVjdCA9ICRuZ1JlZHV4LmNvbm5lY3QobWFwU3RhdGVUb1RoaXMsIGFjdGlvbnMpKHZtKTtcclxuXHJcbiAgICAgICAgdGhpcy5xdWVyeSA9ICcnO1xyXG4gICAgICAgIHRoaXMuc2VhcmNoS2V5UHJlc3MgPSBzZWFyY2hLZXlQcmVzcztcclxuICAgICAgICB0aGlzLnNlYXJjaEtleVVwID0gc2VhcmNoS2V5VXA7XHJcbiAgICAgICAgdGhpcy4kb25EZXN0cm95ID0gJG9uRGVzdHJveTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBtYXBTdGF0ZVRvVGhpcyhzdGF0ZSkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc3RhdGU6IHN0YXRlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNlYXJjaEtleVByZXNzKGUpIHtcclxuICAgICAgICAgICAgaWYgKGUuY2hhckNvZGUgPT09IDEzKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAkbmdSZWR1eC5kaXNwYXRjaChhY3Rpb25zLmxvY2F0aW9uKCcvc2VhcmNoJykpO1xyXG4gICAgICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5oYXNoU2VhcmNoKCdxPScgKyB0aGlzLnF1ZXJ5KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNlYXJjaEtleVVwKGUpIHtcclxuICAgICAgICAgICAgJG5nUmVkdXguZGlzcGF0Y2goYWN0aW9ucy5jaGFuZ2VTZWFyY2hTdHJpbmcodGhpcy5xdWVyeSkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gJG9uRGVzdHJveSgpIHtcclxuICAgICAgICAgICAgdW5jb25uZWN0KCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwic2VhcmNoLXdpZGdldFwiPlxyXG4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJzZWFyY2hcIiBcclxuICAgICAgICAgICAgICAgICAgICBjbGFzcz1cImZvcm0tY29udHJvbCBpbnB1dC1zbVwiIFxyXG4gICAgICAgICAgICAgICAgICAgIG5nLWtleXByZXNzPVwiJGN0cmwuc2VhcmNoS2V5UHJlc3MoJGV2ZW50KVwiXHJcbiAgICAgICAgICAgICAgICAgICAgbmcta2V5dXA9XCIkY3RybC5zZWFyY2hLZXlVcCgkZXZlbnQpXCJcclxuICAgICAgICAgICAgICAgICAgICBuZy1tb2RlbD1cIiRjdHJsLnF1ZXJ5XCJcclxuICAgICAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cItCf0L7QuNGB0LpcIj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYDtcclxuICAgIH1cclxuXHJcbn0oKSk7IiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScpXHJcbiAgICAuc2VydmljZSgnYXV0aEVuZHBvaW50JywgYXV0aEVuZHBvaW50KTtcclxuXHJcbmF1dGhFbmRwb2ludC4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnYXBpVXJsJywgJyRjb29raWVzJ107XHJcblxyXG5mdW5jdGlvbiBhdXRoRW5kcG9pbnQoJHJlc291cmNlLCBhcGlVcmwsICRjb29raWVzKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHF1ZXJ5UGFyYW0gPSB7fTtcclxuICAgIHZhciB0b2tlbiA9ICRjb29raWVzLmdldCgnQVVUSC1UT0tFTicpO1xyXG4gICAgdmFyIHN0YXIgPSAnKic7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRSZXNvdXJjZTogZ2V0UmVzb3VyY2VcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmVzb3VyY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZShhcGlVcmwgKyAnLzplbnRpdHkvOnR5cGUnLCBxdWVyeVBhcmFtLCB7XHJcbiAgICAgICAgICAgIGdldEN1cnJlbnRVc2VyOiB7XHJcbiAgICAgICAgICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgICAgICAgICAgICBlbnRpdHk6ICd1c2VyJ1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBsb2dpbjoge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5OiAnbG9naW4nLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICd2aycsXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdiYW5kRW5kcG9pbnQnLCBiYW5kRW5kcG9pbnQpO1xyXG5cclxuYmFuZEVuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJHEnXTtcclxuXHJcbmZ1bmN0aW9uIGJhbmRFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJHEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZShwYXJhbXMpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvYmFuZC86aWQvOmVudGl0eScsIHBhcmFtcywge1xyXG4gICAgICAgICAgICBnZXRCYW5kOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVkaXRCYW5kOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdQVVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGNyZWF0ZUJhbmQ6IHtcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGFkZE1lbWJlclRvQmFuZDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogJ21lbWJlcnMnXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdiYW5kc0VuZHBvaW50JywgYmFuZHNFbmRwb2ludCk7XHJcblxyXG5iYW5kc0VuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJHEnXTtcclxuXHJcbmZ1bmN0aW9uIGJhbmRzRW5kcG9pbnQoJHJlc291cmNlLCBhcGlVcmwsICRxKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHF1ZXJ5UGFyYW0gPSB7fTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvYmFuZHMvOmxpbWl0LzpvZmZzZXQnLCBxdWVyeVBhcmFtLCB7XHJcbiAgICAgICAgICAgIGdldEJhbmRzOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdldmVudEVuZHBvaW50JywgZXZlbnRFbmRwb2ludCk7XHJcblxyXG5ldmVudEVuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJHEnXTtcclxuXHJcbmZ1bmN0aW9uIGV2ZW50RW5kcG9pbnQoJHJlc291cmNlLCBhcGlVcmwsICRxKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHF1ZXJ5UGFyYW0gPSB7fTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvZXZlbnQvOmlkJywgcXVlcnlQYXJhbSwge1xyXG4gICAgICAgICAgICBnZXRFdmVudDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2V2ZW50c0VuZHBvaW50JywgZXZlbnRzRW5kcG9pbnQpO1xyXG5cclxuZXZlbnRzRW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCcsICckcSddO1xyXG5cclxuZnVuY3Rpb24gZXZlbnRzRW5kcG9pbnQoJHJlc291cmNlLCBhcGlVcmwsICRxKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgdmFyIHF1ZXJ5UGFyYW0gPSB7fTtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGdldFJlc291cmNlOiBnZXRSZXNvdXJjZVxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBnZXRSZXNvdXJjZSgpIHtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKGFwaVVybCArICcvZXZlbnRzLzpsaWtlLzpzZWFyY2hTdHJpbmcvOmxpbWl0LzpvZmZzZXQnLCBxdWVyeVBhcmFtLCB7XHJcbiAgICAgICAgICAgIGdldEV2ZW50c0FsbDoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlrZTogbnVsbCxcclxuICAgICAgICAgICAgICAgICAgICBzZWFyY2hTdHJpbmc6IG51bGwsXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGdldEV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlrZTogJ2xpa2UnLFxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
