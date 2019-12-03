'use strict';

describe('Controller: BillsPpmCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var BillsPpmCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BillsPpmCtrl = $controller('BillsPpmCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(BillsPpmCtrl.awesomeThings.length).toBe(3);
  });
});
