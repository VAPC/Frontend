(function() {
    angular
        .module('rockparade')
        .service('actionsService', actionsService);

    actionsService.$inject = [];

    function actionsService() {
        return {
            plus: plus,
            minus: minus
        };

        function plus() {
            return {
                type: 'PLUS'
            }
        }

        function minus() {
            return {
                type: 'MINUS'
            }
        }
    }

}());