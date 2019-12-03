'use strict';

describe('Controller: OutreachAmbassadorsCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var OutreachAmbassadorsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    OutreachAmbassadorsCtrl = $controller('OutreachAmbassadorsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(OutreachAmbassadorsCtrl.awesomeThings.length).toBe(3);
  });
});
