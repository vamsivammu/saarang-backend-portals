'use strict';

describe('Controller: FinanceCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var FinanceCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FinanceCtrl = $controller('FinanceCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FinanceCtrl.awesomeThings.length).toBe(3);
  });
});
