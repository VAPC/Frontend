(function () {
    'use strict';
    angular
        .module('rockparade')
        .component('eventCreate', {
            controller: eventCreateCtrl,
            template: template
        });

    eventCreateCtrl.$inject = [
        'eventEndpoint',
        '$ngRedux',
        'actions'];

    function eventCreateCtrl(eventEndpoint,
                             $ngRedux,
                             actions) {
        var vm = this;
        vm.formData = {
            name: '',
            date: '',
            description: '',
            place: '',
        };
        vm.formSubmit = formSubmitHandler;

        return vm;

        function formSubmitHandler(e) {
            eventEndpoint.getResource().createEvent(vm.formData, function (response) {
                $ngRedux.dispatch(actions.location('/bands'));
            }, function (response) {
                console.log('cl response', response);
            });
        }
    }

    function template() {
        return `
<div class="container">
    <div class="row">
        <div class="col-xs-12">
            <h3>Создание мероприятия</h3>
            <div class="panel panel-default">
                <div class="panel-body">
                    <form name="form-create-band" ng-submit="$ctrl.formSubmit()">
                          <div class="form-group">
                              <label for="create-event-name">Название мероприятия</label>
                              <input name="create-event-name" ng-model="$ctrl.formData.name" type="text" class="form-control">
                          </div>
                          <div class="form-group">
                              <label for="create-event-date">Дата проведения мероприятия</label>
                              <input name="create-event-date" ng-model="$ctrl.formData.date" type="text" class="form-control">
                          </div>
                          <div class="form-group">
                              <label for="create-event-place">Место проведения мероприятия</label>
                              <input name="create-event-place" ng-model="$ctrl.formData.place" type="text" class="form-control">
                          </div>
                          <div class="form-group">
                              <label for="create-event-description">Описание мероприятия</label>
                              <textarea name="create-event-description" ng-model="$ctrl.formData.description" type="text" class="form-control"></textarea>
                          </div>
                          <div class="form-group">
                              <button type="submit" class="btn btn-primary">Создать</button>
                          </div>
                      </form>
                </div>
            </div>
            </div>
            </div>
            </div>
        `;
    }

}());