'use strict';

describe('Controller: EventsAddwinnerCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var EventsAddwinnerCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventsAddwinnerCtrl = $controller('EventsAddwinnerCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EventsAddwinnerCtrl.awesomeThings.length).toBe(3);
  });
});
