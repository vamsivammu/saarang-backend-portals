'use strict';

describe('Controller: OutreachCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var OutreachCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OutreachCtrl = $controller('OutreachCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OutreachCtrl.awesomeThings.length).toBe(3);
  });
});
