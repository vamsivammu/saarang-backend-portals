'use strict';

describe('Controller: EventsEventscheduleCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var EventsEventscheduleCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventsEventscheduleCtrl = $controller('EventsEventscheduleCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EventsEventscheduleCtrl.awesomeThings.length).toBe(3);
  });
});
