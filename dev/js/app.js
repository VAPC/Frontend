(function () {
    'use strict';
    angular
        .module('rockparade', [
            'ngRoute',
            'ngResource',
            'endpointsModule'
        ])
        .config(router);

    router.$inject = ['$routeProvider'];
    function router($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'main.html',
            })
            .when('/zakaz/', {
                templateUrl: 'zakaz.html',
                controller: 'zakazCtrl',
                controllerAs: 'zakaz'
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
        console.log('cl eventsEndpoint', eventsEndpoint);

        eventsEndpoint.getResource().getEvents({}, function (response) {
            vm.events = response;
        });
        return vm;
    }

    function template() {
        return `
            <div>{{$ctrl.events}}</div>
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

    function navigationCtrl() {
        var vm = this;
        return vm;
    }

    function template() {
        return `
            <div class="navbar navbar-default">
                <ul class="nav navbar-nav"> 
                    <li><a>Мероприятия</a></li> 
                    <li><a>Артисты</a></li> 
                    <li><a>Блог</a></li> 
                </ul>
            </div>
        `;
    }

}());
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImVuZHBvaW50cy9lbmRwb2ludHMubWRsLmpzIiwiY29tcG9uZW50cy9ldmVudHNMaXN0L2V2ZW50c0xpc3QuY210LmpzIiwiY29tcG9uZW50cy9uYXZpZ2F0aW9uL25hdmlnYXRpb24uY210LmpzIiwiZW5kcG9pbnRzL2V2ZW50cy9ldmVudHNFbmRwb2ludC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXJcclxuICAgICAgICAubW9kdWxlKCdyb2NrcGFyYWRlJywgW1xyXG4gICAgICAgICAgICAnbmdSb3V0ZScsXHJcbiAgICAgICAgICAgICduZ1Jlc291cmNlJyxcclxuICAgICAgICAgICAgJ2VuZHBvaW50c01vZHVsZSdcclxuICAgICAgICBdKVxyXG4gICAgICAgIC5jb25maWcocm91dGVyKTtcclxuXHJcbiAgICByb3V0ZXIuJGluamVjdCA9IFsnJHJvdXRlUHJvdmlkZXInXTtcclxuICAgIGZ1bmN0aW9uIHJvdXRlcigkcm91dGVQcm92aWRlcikge1xyXG4gICAgICAgICRyb3V0ZVByb3ZpZGVyXHJcbiAgICAgICAgICAgIC53aGVuKCcvJywge1xyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdtYWluLmh0bWwnLFxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAud2hlbignL3pha2F6LycsIHtcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAnemFrYXouaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnemFrYXpDdHJsJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3pha2F6J1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAub3RoZXJ3aXNlKHtcclxuICAgICAgICAgICAgICAgIHJlZGlyZWN0VG86ICcvJ1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgLy8kbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoe1xyXG4gICAgICAgIC8vICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICAgICAgLy8gICAgcmVxdWlyZUJhc2U6IGZhbHNlXHJcbiAgICAgICAgLy99KTtcclxuICAgIH07XHJcbn0oKSk7IiwiYW5ndWxhci5tb2R1bGUoJ2VuZHBvaW50c01vZHVsZScsIFtdKVxyXG4gICAgLmZhY3RvcnkoJ2FwaVVybCcsIGFwaVVybCk7XHJcblxyXG5mdW5jdGlvbiBhcGlVcmwoKSB7XHJcbiAgICB2YXIgdXJsO1xyXG4gICAgc3dpdGNoICh3aW5kb3cubG9jYXRpb24uaG9zdG5hbWUpIHtcclxuICAgICAgICBjYXNlICdsb2NhbGhvc3QnOlxyXG4gICAgICAgICAgICB1cmwgPSAnaHR0cDovL3JvY2twYXJhZGUuY3Jlb3JhLnJ1L2FwaSc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHVybCA9IHdpbmRvdy5sb2NhdGlvbi5vcmlnaW4gKyAnL2FwaSc7XHJcbiAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHVybDtcclxufVxyXG4iLCIoZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhclxyXG4gICAgICAgIC5tb2R1bGUoJ3JvY2twYXJhZGUnKVxyXG4gICAgICAgIC5jb21wb25lbnQoJ2V2ZW50c0xpc3QnLCB7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IGV2ZW50c0xpc3RDdHJsLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGVcclxuICAgICAgICB9KTtcclxuXHJcbiAgICBldmVudHNMaXN0Q3RybC4kaW5qZWN0ID0gWydldmVudHNFbmRwb2ludCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIGV2ZW50c0xpc3RDdHJsKGV2ZW50c0VuZHBvaW50KSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICBjb25zb2xlLmxvZygnY2wgZXZlbnRzRW5kcG9pbnQnLCBldmVudHNFbmRwb2ludCk7XHJcblxyXG4gICAgICAgIGV2ZW50c0VuZHBvaW50LmdldFJlc291cmNlKCkuZ2V0RXZlbnRzKHt9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgdm0uZXZlbnRzID0gcmVzcG9uc2U7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXY+e3skY3RybC5ldmVudHN9fTwvZGl2PlxyXG4gICAgICAgIGA7XHJcbiAgICB9XHJcblxyXG59KCkpOyIsIihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyXHJcbiAgICAgICAgLm1vZHVsZSgncm9ja3BhcmFkZScpXHJcbiAgICAgICAgLmNvbXBvbmVudCgnbmF2aWdhdGlvbicsIHtcclxuICAgICAgICAgICAgY29udHJvbGxlcjogbmF2aWdhdGlvbkN0cmwsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIGZ1bmN0aW9uIG5hdmlnYXRpb25DdHJsKCkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgcmV0dXJuIHZtO1xyXG4gICAgfVxyXG5cclxuICAgIGZ1bmN0aW9uIHRlbXBsYXRlKCkge1xyXG4gICAgICAgIHJldHVybiBgXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHRcIj5cclxuICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2XCI+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YT7QnNC10YDQvtC/0YDQuNGP0YLQuNGPPC9hPjwvbGk+IFxyXG4gICAgICAgICAgICAgICAgICAgIDxsaT48YT7QkNGA0YLQuNGB0YLRizwvYT48L2xpPiBcclxuICAgICAgICAgICAgICAgICAgICA8bGk+PGE+0JHQu9C+0LM8L2E+PC9saT4gXHJcbiAgICAgICAgICAgICAgICA8L3VsPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICBgO1xyXG4gICAgfVxyXG5cclxufSgpKTsiLCJhbmd1bGFyLm1vZHVsZSgnZW5kcG9pbnRzTW9kdWxlJylcclxuICAgIC5zZXJ2aWNlKCdldmVudHNFbmRwb2ludCcsIGV2ZW50c0VuZHBvaW50KTtcclxuXHJcbmV2ZW50c0VuZHBvaW50LiRpbmplY3QgPSBbJyRyZXNvdXJjZScsICdhcGlVcmwnLCAnJHEnXTtcclxuXHJcbmZ1bmN0aW9uIGV2ZW50c0VuZHBvaW50KCRyZXNvdXJjZSwgYXBpVXJsLCAkcSkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIHZhciBxdWVyeVBhcmFtID0ge307XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBnZXRSZXNvdXJjZTogZ2V0UmVzb3VyY2VcclxuICAgIH07XHJcblxyXG4gICAgZnVuY3Rpb24gZ2V0UmVzb3VyY2UoKSB7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZShhcGlVcmwgKyAnL2V2ZW50cycsIHF1ZXJ5UGFyYW0sIHtcclxuICAgICAgICAgICAgZ2V0RXZlbnRzOiB7XHJcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxyXG4gICAgICAgICAgICAgICAgaXNBcnJheTogZmFsc2VcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290IjoiL3NvdXJjZS8ifQ==
