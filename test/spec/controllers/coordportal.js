'use strict';

describe('Controller: CoordportalCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var CoordportalCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CoordportalCtrl = $controller('CoordportalCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CoordportalCtrl.awesomeThings.length).toBe(3);
  });
});
