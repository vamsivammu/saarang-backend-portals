'use strict';

describe('Controller: OpcCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var OpcCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OpcCtrl = $controller('OpcCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OpcCtrl.awesomeThings.length).toBe(3);
  });
});
