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