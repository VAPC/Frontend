(function() {
    'use strict';
    angular
        .module('searchModule')
        .component('searchWidget', {
            controller: searchWidgetCtrl,
            template: template
        });

    searchWidgetCtrl.$inject = ['$ngRedux',
        'actionsService'];

    function searchWidgetCtrl($ngRedux,
                              actionsService) {
        var vm = this;

        $ngRedux.connect(mapStateToThis, actionsService)(vm);
        $ngRedux.dispatch(actionsService.plus());

        return vm;

        function mapStateToThis(state) {
            console.log('cl state:', state);

            return {
                counter: (state)
            }
        }

    }

    function template() {
        return `
            <div>
                <input type="search" 
                    class="form-control" 
                    ng-keyup="$ctrl.searchKeyup()" 
                    ng-model="$ctrl.searchString"
                    placeholder="Поиск">
            </div>
        `;
    }

}());