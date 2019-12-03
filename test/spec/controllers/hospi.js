'use strict';

describe('Controller: HospiCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var HospiCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HospiCtrl = $controller('HospiCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HospiCtrl.awesomeThings.length).toBe(3);
  });
});
