(function () {
    'use strict';
    angular
        .module('rockparade', [
            'ngRoute',
            'ngCookies',
            'ngResource',

            'endpointsModule',
            'authModule',
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
    angular.module('rockparade')
        .component('content', {
            template: template
        });

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
                            <input class="form-control" type="search" name="search" placeholder="Search">
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

    eventsListCtrl.$inject = ['eventsEndpoint'];

    function eventsListCtrl(eventsEndpoint) {
        var vm = this;

        eventsEndpoint.getResource().getEvents({}, function (response) {
            vm.events = response.data;
        });

        return vm;
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
        return $resource(apiUrl + '/events', queryParam, {
            getEvents: {
                method: 'GET',
                isArray: false
            }
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
            $location.path('/#');
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImVuZHBvaW50cy9lbmRwb2ludHMubWRsLmpzIiwiY29tcG9uZW50cy9hdXRoL2F1dGgubWRsLmpzIiwicm91dGVyLmpzIiwiY29tcG9uZW50cy9jb250ZW50L2NvbnRlbnQuY210LmpzIiwiY29tcG9uZW50cy9ldmVudHNMaXN0L2V2ZW50c0xpc3QuY210LmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY210LmpzIiwiZW5kcG9pbnRzL2F1dGgvYXV0aEVuZHBvaW50LmpzIiwiZW5kcG9pbnRzL2V2ZW50cy9ldmVudHNFbmRwb2ludC5qcyIsImNvbXBvbmVudHMvYXV0aC9hdXRoLnNydi5qcyIsImNvbXBvbmVudHMvYXV0aC9hdXRoTG9naW5Qcm9jZXNzLmN0cmwuanMiLCJjb21wb25lbnRzL2F1dGgvYXV0aFdpZGdldC5jbXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3BDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3JEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImFwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScsIFtcclxuICAgICAgICAgICAgJ25nUm91dGUnLFxyXG4gICAgICAgICAgICAnbmdDb29raWVzJyxcclxuICAgICAgICAgICAgJ25nUmVzb3VyY2UnLFxyXG5cclxuICAgICAgICAgICAgJ2VuZHBvaW50c01vZHVsZScsXHJcbiAgICAgICAgICAgICdhdXRoTW9kdWxlJyxcclxuICAgICAgICBdKTtcclxufSgpKTsiLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJywgW10pXHJcbiAgICAuZmFjdG9yeSgnYXBpVXJsJywgYXBpVXJsKTtcclxuXHJcbmZ1bmN0aW9uIGFwaVVybCgpIHtcclxuICAgIHZhciB1cmw7XHJcbiAgICBzd2l0Y2ggKHdpbmRvdy5sb2NhdGlvbi5ob3N0bmFtZSkge1xyXG4gICAgICAgIGNhc2UgJ2xvY2FsaG9zdCc6XHJcbiAgICAgICAgICAgIHVybCA9ICdodHRwOi8vcm9ja3BhcmFkZS5jcmVvcmEucnUvYXBpJztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdXJsID0gd2luZG93LmxvY2F0aW9uLm9yaWdpbiArICcvYXBpJztcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdXJsO1xyXG59XHJcbiIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYXV0aE1vZHVsZScsIFtdKVxyXG4gICAgICAgIC8vIC5jb25maWcoaHR0cEludGVyY2VwdG9yQ29uZmlnKVxyXG4gICAgICAgIC5ydW4oaHR0cEludGVyY2VwdG9yUnVuKTtcclxuXHJcbiAgICBodHRwSW50ZXJjZXB0b3JDb25maWcuJGluamVjdCA9IFsnJGh0dHBQcm92aWRlciddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGh0dHBJbnRlcmNlcHRvckNvbmZpZygkaHR0cFByb3ZpZGVyKSB7XHJcbiAgICAgICAgJGh0dHBQcm92aWRlci5kZWZhdWx0cy51c2VYRG9tYWluID0gdHJ1ZTtcclxuICAgICAgICBkZWxldGUgJGh0dHBQcm92aWRlci5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnWC1SZXF1ZXN0ZWQtV2l0aCddO1xyXG4gICAgfVxyXG5cclxuICAgIGh0dHBJbnRlcmNlcHRvclJ1bi4kaW5qZWN0ID0gWyckaW5qZWN0b3InXTtcclxuICAgIGZ1bmN0aW9uIGh0dHBJbnRlcmNlcHRvclJ1bigkaW5qZWN0b3IpIHtcclxuICAgICAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgICAgIHZhciBUT0tFTiA9ICRpbmplY3Rvci5nZXQoJyRjb29raWVzJykuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICAgICAgaWYgKFRPS0VOKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgJGh0dHAgPSAkaW5qZWN0b3IuZ2V0KCckaHR0cCcpO1xyXG4gICAgICAgICAgICAkaHR0cC5kZWZhdWx0cy5oZWFkZXJzLmNvbW1vblsnQVVUSC1UT0tFTiddID0gVE9LRU47XHJcbiAgICAgICAgICAgIC8vICRodHRwLmRlZmF1bHRzLmhlYWRlcnMucG9zdFsnQ29udGVudC1UeXBlJ10gPSAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkOyBjaGFyc2V0PVVURi04JztcclxuICAgICAgICAgICAgLy8gJGh0dHAuZGVmYXVsdHMuaGVhZGVycy5wdXRbJ0NvbnRlbnQtVHlwZSddID0gJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZDsgY2hhcnNldD1VVEYtOCc7XHJcblxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygnQXV0aDogdXNlciBhdXRoZW50aWNhdGlvbiBlcnJvci4gQ29va2llcyBkb2VzblxcJ3QgY29udGFpbiBcIkFVVEgtVE9LRU5cIicpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJylcclxuICAgICAgICAuY29uZmlnKHJvdXRlcik7XHJcblxyXG4gICAgcm91dGVyLiRpbmplY3QgPSBbJyRyb3V0ZVByb3ZpZGVyJ107XHJcblxyXG4gICAgZnVuY3Rpb24gcm91dGVyKCRyb3V0ZVByb3ZpZGVyKSB7XHJcbiAgICAgICAgJHJvdXRlUHJvdmlkZXJcclxuICAgICAgICAgICAgLndoZW4oJy8nLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2xhbmRpbmcuaHRtbCcsXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC53aGVuKCcvaG9tZScsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnaG9tZS5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9ldmVudHMnLCB7XHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ2V2ZW50cy5odG1sJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLndoZW4oJy9hcnRpc3RzJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdhcnRpc3RzLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL2xvZ2luL3ZrL2NhbGxiYWNrJywge1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ2F1dGhMb2dpblByb2Nlc3NDdHJsJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlOiAnJyxcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgLm90aGVyd2lzZSh7XHJcbiAgICAgICAgICAgICAgICByZWRpcmVjdFRvOiAnLydcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8vJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcclxuICAgICAgICAvLyAgICBlbmFibGVkOiB0cnVlLFxyXG4gICAgICAgIC8vICAgIHJlcXVpcmVCYXNlOiBmYWxzZVxyXG4gICAgICAgIC8vfSk7XHJcbiAgICB9O1xyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2NvbnRlbnQnLCB7XHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLWhvbGRlclwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRhaW5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgIDxoZWFkZXIgY2xhc3M9XCJyb3cgaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMlwiPjxhIGhyZWY9XCIjL1wiPjxpbWcgc3JjPVwiY3NzL2ltZy9sb2dvLnBuZ1wiIGhlaWdodD1cIjc1cHhcIiBhbHQ9XCJSb2NrcGFyYWRlXCI+PC9hPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLThcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxuYXZpZ2F0aW9uPjwvbmF2aWdhdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtc20tMlwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGF1dGgtd2lkZ2V0PjwvYXV0aC13aWRnZXQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvaGVhZGVyPlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgc2VhcmNoLWhvbGRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTggY29sLXNtLW9mZnNldC0yXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiB0eXBlPVwic2VhcmNoXCIgbmFtZT1cInNlYXJjaFwiIHBsYWNlaG9sZGVyPVwiU2VhcmNoXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgbmctdmlldz1cIlwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnZXZlbnRzTGlzdCcsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogZXZlbnRzTGlzdEN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGV2ZW50c0xpc3RDdHJsLiRpbmplY3QgPSBbJ2V2ZW50c0VuZHBvaW50J107XHJcblxyXG4gICAgZnVuY3Rpb24gZXZlbnRzTGlzdEN0cmwoZXZlbnRzRW5kcG9pbnQpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICBldmVudHNFbmRwb2ludC5nZXRSZXNvdXJjZSgpLmdldEV2ZW50cyh7fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIHZtLmV2ZW50cyA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB2bTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiB0ZW1wbGF0ZSgpIHtcclxuICAgICAgICByZXR1cm4gYFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiIG5nLXJlcGVhdD1cIml0ZW0gaW4gJGN0cmwuZXZlbnRzXCI+XHJcbiAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgIDxoMz57e2l0ZW0ubmFtZX19PC9oMz5cclxuICAgICAgICAgICAgICAgIDxwPnt7aXRlbS5kZXNjcmlwdGlvbn19PC9wPlxyXG4gICAgICAgICAgICAgICAgPHA+e3tpdGVtLmRhdGV9fTwvcD5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ25hdmlnYXRpb24nLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IG5hdmlnYXRpb25DdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBuYXZpZ2F0aW9uQ3RybC4kaW5qZWN0ID0gWydhdXRoU2VydmljZScsICckcm9vdFNjb3BlJ107XHJcblxyXG4gICAgZnVuY3Rpb24gbmF2aWdhdGlvbkN0cmwoYXV0aFNlcnZpY2UsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmlzQXV0aCA9IGF1dGhTZXJ2aWNlLmlzQXV0aCgpO1xyXG5cclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignYXV0aENoYW5nZWQnLCBhdXRoQ2hhbmdlZCk7XHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBhdXRoQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdm0uaXNBdXRoID0gYXV0aFNlcnZpY2UuaXNBdXRoKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2XCI+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaSBuZy1pZj1cIiRjdHJsLmlzQXV0aFwiPjxhIGhyZWY9XCIjL2hvbWVcIj7QnNC+0Y8g0YHRgtGA0LDQvdC40YbQsDwvYT48L2xpPiBcclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvZXZlbnRzXCI+0JzQtdGA0L7Qv9GA0LjRj9GC0LjRjzwvYT48L2xpPiBcclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiMvYXJ0aXN0c1wiPtCQ0YDRgtC40YHRgtGLPC9hPjwvbGk+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YT7QkdC70L7QszwvYT48L2xpPiBcclxuICAgICAgICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsImFuZ3VsYXIubW9kdWxlKCdlbmRwb2ludHNNb2R1bGUnKVxyXG4gICAgLnNlcnZpY2UoJ2F1dGhFbmRwb2ludCcsIGF1dGhFbmRwb2ludCk7XHJcblxyXG5hdXRoRW5kcG9pbnQuJGluamVjdCA9IFsnJHJlc291cmNlJywgJ2FwaVVybCcsICckY29va2llcyddO1xyXG5cclxuZnVuY3Rpb24gYXV0aEVuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsLCAkY29va2llcykge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBxdWVyeVBhcmFtID0ge307XHJcbiAgICB2YXIgdG9rZW4gPSAkY29va2llcy5nZXQoJ0FVVEgtVE9LRU4nKTtcclxuICAgIHZhciBzdGFyID0gJyonO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy86ZW50aXR5Lzp0eXBlJywgcXVlcnlQYXJhbSwge1xyXG4gICAgICAgICAgICBnZXRDdXJyZW50VXNlcjoge1xyXG4gICAgICAgICAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgZW50aXR5OiAndXNlcidcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2VcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgbG9naW46IHtcclxuICAgICAgICAgICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGVudGl0eTogJ2xvZ2luJyxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAndmsnLFxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBpc0FycmF5OiBmYWxzZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuIiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScpXHJcbiAgICAuc2VydmljZSgnZXZlbnRzRW5kcG9pbnQnLCBldmVudHNFbmRwb2ludCk7XHJcblxyXG5ldmVudHNFbmRwb2ludC4kaW5qZWN0ID0gWyckcmVzb3VyY2UnLCAnYXBpVXJsJywgJyRxJ107XHJcblxyXG5mdW5jdGlvbiBldmVudHNFbmRwb2ludCgkcmVzb3VyY2UsIGFwaVVybCwgJHEpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICB2YXIgcXVlcnlQYXJhbSA9IHt9O1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZ2V0UmVzb3VyY2U6IGdldFJlc291cmNlXHJcbiAgICB9O1xyXG5cclxuICAgIGZ1bmN0aW9uIGdldFJlc291cmNlKCkge1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoYXBpVXJsICsgJy9ldmVudHMnLCBxdWVyeVBhcmFtLCB7XHJcbiAgICAgICAgICAgIGdldEV2ZW50czoge1xyXG4gICAgICAgICAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICAgICAgICAgIGlzQXJyYXk6IGZhbHNlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG4iLCJhbmd1bGFyLm1vZHVsZSgnYXV0aE1vZHVsZScpXHJcbiAgICAuc2VydmljZSgnYXV0aFNlcnZpY2UnLCBhdXRoU2VydmljZSk7XHJcblxyXG5hdXRoU2VydmljZS4kaW5qZWN0ID0gWydhdXRoRW5kcG9pbnQnLFxyXG4gICAgJyRxJyxcclxuICAgICckY29va2llcycsXHJcbiAgICAnJGxvY2F0aW9uJ107XHJcblxyXG5mdW5jdGlvbiBhdXRoU2VydmljZShhdXRoRW5kcG9pbnQsXHJcbiAgICAgICAgICAgICAgICAgICAgICRxLFxyXG4gICAgICAgICAgICAgICAgICAgICAkY29va2llcyxcclxuICAgICAgICAgICAgICAgICAgICAgJGxvY2F0aW9uKSB7XHJcblxyXG4gICAgdmFyIGN1cnJlbnRVc2VyRGVmZXI7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpc0F1dGg6IGlzQXV0aCxcclxuICAgICAgICBsb2dpbjogbG9naW4sXHJcbiAgICAgICAgbG9nb3V0OiBsb2dvdXQsXHJcbiAgICAgICAgZ2V0Q3VycmVudFVzZXI6IGdldEN1cnJlbnRVc2VyLFxyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiBpc0F1dGgoKSB7XHJcbiAgICAgICAgcmV0dXJuICEhJGNvb2tpZXMuZ2V0KCdBVVRILVRPS0VOJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gbG9naW4oKSB7XHJcbiAgICAgICAgYXV0aEVuZHBvaW50LmdldFJlc291cmNlKCkubG9naW4oe30sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlOicsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygnY2wgcmVzcG9uc2U6JywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgICAgICAgJGNvb2tpZXMucmVtb3ZlKCdBVVRILVRPS0VOJyk7XHJcbiAgICAgICAgJGxvY2F0aW9uLnBhdGgoJy8jJyk7XHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0Q3VycmVudFVzZXIoKSB7XHJcbiAgICAgICAgaWYgKCFjdXJyZW50VXNlckRlZmVyKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyRGVmZXIgPSAkcS5kZWZlcigpO1xyXG4gICAgICAgICAgICBhdXRoRW5kcG9pbnQuZ2V0UmVzb3VyY2UoKS5nZXRDdXJyZW50VXNlcih7fSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY3VycmVudFVzZXJEZWZlci5yZXNvbHZlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyRGVmZXIucmVqZWN0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGN1cnJlbnRVc2VyRGVmZXIucHJvbWlzZTtcclxuICAgIH1cclxufVxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2F1dGhNb2R1bGUnKVxyXG4gICAgICAgIC5jb250cm9sbGVyKCdhdXRoTG9naW5Qcm9jZXNzQ3RybCcsIGF1dGhMb2dpblByb2Nlc3NDdHJsKTtcclxuXHJcbiAgICBhdXRoTG9naW5Qcm9jZXNzQ3RybC4kaW5qZWN0ID0gWyckcm91dGVQYXJhbXMnLCAnJGxvY2F0aW9uJywgJyRjb29raWVzJywgJyRyb290U2NvcGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBhdXRoTG9naW5Qcm9jZXNzQ3RybCgkcm91dGVQYXJhbXMsICRsb2NhdGlvbiwgJGNvb2tpZXMsICRyb290U2NvcGUpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIGlmICgkcm91dGVQYXJhbXMuaGFzT3duUHJvcGVydHkoJ3Rva2VuJykpIHtcclxuICAgICAgICAgICAgdmFyIGV4cGlyZURhdGUgPSBuZXcgRGF0ZSgpO1xyXG4gICAgICAgICAgICBleHBpcmVEYXRlLnNldERhdGUoZXhwaXJlRGF0ZS5nZXREYXRlKCkgKyAxNCk7XHJcbiAgICAgICAgICAgICRjb29raWVzLnB1dCgnQVVUSC1UT0tFTicsICRyb3V0ZVBhcmFtcy50b2tlbiwgeydleHBpcmVzJzogZXhwaXJlRGF0ZX0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdhdXRoQ2hhbmdlZCcpO1xyXG4gICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnLyMnKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gdm07XHJcbiAgICB9XHJcbn0oKSk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdhdXRoTW9kdWxlJylcclxuICAgICAgICAuY29tcG9uZW50KCdhdXRoV2lkZ2V0Jywge1xyXG4gICAgICAgICAgICBjb250cm9sbGVyOiBhdXRoV2lkZ2V0Q3RybCxcclxuICAgICAgICAgICAgdGVtcGxhdGU6IHRlbXBsYXRlXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgYXV0aFdpZGdldEN0cmwuJGluamVjdCA9IFsnYXV0aFNlcnZpY2UnLFxyXG4gICAgICAgICdhcGlVcmwnLCAnJHJvb3RTY29wZSddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGF1dGhXaWRnZXRDdHJsKGF1dGhTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYXBpVXJsLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0ubG9naW5VcmwgPSBhcGlVcmwgKyAnL2xvZ2luL3ZrJztcclxuICAgICAgICB2bS5pc0F1dGggPSBhdXRoU2VydmljZS5pc0F1dGgoKTtcclxuICAgICAgICB2bS5sb2dpbiA9IGF1dGhTZXJ2aWNlLmxvZ2luO1xyXG4gICAgICAgIHZtLmxvZ291dCA9IGxvZ291dDtcclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignYXV0aENoYW5nZWQnLCBhdXRoQ2hhbmdlZCk7XHJcblxyXG4gICAgICAgIGlmICh2bS5pc0F1dGgpIHtcclxuICAgICAgICAgICAgYXV0aFNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2NsIHJlc3BvbnNlJywgcmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgdm0udXNlciA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBsb2dvdXQoKSB7XHJcbiAgICAgICAgICAgIGF1dGhTZXJ2aWNlLmxvZ291dCgpO1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRlbWl0KCdhdXRoQ2hhbmdlZCcpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYXV0aENoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHZtLmlzQXV0aCA9IGF1dGhTZXJ2aWNlLmlzQXV0aCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG4gICAgZnVuY3Rpb24gdGVtcGxhdGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIGBcclxuICAgICAgICAgICAgPGRpdiBuZy1pZj1cIiEkY3RybC5pc0F1dGhcIj5cclxuICAgICAgICAgICAgPGEgaHJlZj1cInt7JGN0cmwubG9naW5Vcmx9fVwiPkxvZ2luIHdpdGggVmtvbnRha3RlPC9hPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPGRpdiBuZy1pZj1cIiRjdHJsLmlzQXV0aFwiPlxyXG4gICAgICAgICAgICA8ZGl2PkhpLCB7eyRjdHJsLnVzZXIubG9naW59fSE8L2Rpdj5cclxuICAgICAgICAgICAgPGEgbmctY2xpY2s9XCIkY3RybC5sb2dvdXQoKVwiPkxvZ291dDwvYT5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
