(function () {
    angular
        .module('rockparade')
        .service('actions', actions);

    actions.$inject = [];

    function actions() {
        return {
            changeSearchString: changeSearchString,
            location: location,
            hashSearch: hashSearch,
            setCurrentUser: setCurrentUser,
            setBandListSorting: setBandListSorting,
            setBandListViewing: setBandListViewing,
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

        function setBandListSorting(id) {
            return {
                type: 'SET_BAND_LIST_SORTING',
                payload: id
            }
        }

        function setBandListViewing(id) {
            return {
                type: 'SET_BAND_LIST_VIEWING',
                payload: id
            }
        }

        function setCurrentUser(payload) {
            return {
                type: 'SET_CURRENT_USER',
                payload: payload
            }
        }
    }

}());