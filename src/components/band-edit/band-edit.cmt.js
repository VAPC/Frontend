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

            bandEndpoint.getResource().editBand(this.bandData, function(response) {
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