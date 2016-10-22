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
                <div class="container-fluid">
                    <header class="row">
                        <div class="col-sm-1"><a href="#/"><img src="css/img/logo2.png" alt="Rockparade"></a></div>
                        <div class="col-sm-5">
                            <navigation></navigation>
                        </div>
                        <div class="col-sm-3">
                            <search-widget></search-widget>
                        </div>
                        <div class="col-sm-3">
                            <auth-widget></auth-widget>
                        </div>
                    </header>
                </div>
                <div class="content">
                    <div ng-view=""></div>
                </div>
            </div>
        `;
    }

}());