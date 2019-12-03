'use strict';

describe('Controller: EventsRCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var EventsRCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventsRCtrl = $controller('EventsRCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EventsRCtrl.awesomeThings.length).toBe(3);
  });
});
