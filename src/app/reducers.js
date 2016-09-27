(function() {

    function reducers(state = 0, action) {
        switch (action.type) {
            case 'plus':
                return state + 1;
            case 'minus':
                return state - 1;
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