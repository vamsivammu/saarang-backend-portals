'use strict';

describe('Controller: BillsPaymentCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var BillsPaymentCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BillsPaymentCtrl = $controller('BillsPaymentCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BillsPaymentCtrl.awesomeThings.length).toBe(3);
  });
});
