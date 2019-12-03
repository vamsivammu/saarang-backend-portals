'use strict';

describe('Controller: EventsRegistrationsCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var EventsRegistrationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventsRegistrationsCtrl = $controller('EventsRegistrationsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EventsRegistrationsCtrl.awesomeThings.length).toBe(3);
  });
});
