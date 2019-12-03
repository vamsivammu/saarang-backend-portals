'use strict';

describe('Controller: BillsReimbursementCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var BillsReimbursementCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BillsReimbursementCtrl = $controller('BillsReimbursementCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BillsReimbursementCtrl.awesomeThings.length).toBe(3);
  });
});
