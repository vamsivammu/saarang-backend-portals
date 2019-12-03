'use strict';

describe('Controller: EventRegistrationsCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var EventRegistrationsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventRegistrationsCtrl = $controller('EventRegistrationsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EventRegistrationsCtrl.awesomeThings.length).toBe(3);
  });
});
