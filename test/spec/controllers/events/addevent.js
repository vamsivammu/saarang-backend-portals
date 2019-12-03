'use strict';

describe('Controller: EventsAddeventCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var EventsAddeventCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventsAddeventCtrl = $controller('EventsAddeventCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EventsAddeventCtrl.awesomeThings.length).toBe(3);
  });
});
