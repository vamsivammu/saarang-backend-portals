'use strict';

describe('Controller: FinancePpmCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var FinancePpmCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FinancePpmCtrl = $controller('FinancePpmCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FinancePpmCtrl.awesomeThings.length).toBe(3);
  });
});
