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