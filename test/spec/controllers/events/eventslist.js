'use strict';

describe('Controller: EventsEventslistCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var EventsEventslistCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventsEventslistCtrl = $controller('EventsEventslistCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EventsEventslistCtrl.awesomeThings.length).toBe(3);
  });
});
