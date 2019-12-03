'use strict';

describe('Controller: FinancePaymentCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var FinancePaymentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FinancePaymentCtrl = $controller('FinancePaymentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FinancePaymentCtrl.awesomeThings.length).toBe(3);
  });
});
