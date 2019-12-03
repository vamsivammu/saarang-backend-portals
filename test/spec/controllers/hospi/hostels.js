'use strict';

describe('Controller: HospiHostelsCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var HospiHostelsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HospiHostelsCtrl = $controller('HospiHostelsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HospiHostelsCtrl.awesomeThings.length).toBe(3);
  });
});
