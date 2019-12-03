'use strict';

describe('Controller: FinanceReimbursementCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var FinanceReimbursementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FinanceReimbursementCtrl = $controller('FinanceReimbursementCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FinanceReimbursementCtrl.awesomeThings.length).toBe(3);
  });
});
