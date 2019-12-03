'use strict';

describe('Controller: EventsCategoryCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var EventsCategoryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    EventsCategoryCtrl = $controller('EventsCategoryCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(EventsCategoryCtrl.awesomeThings.length).toBe(3);
  });
});
