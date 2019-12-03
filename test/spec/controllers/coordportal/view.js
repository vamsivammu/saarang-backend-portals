'use strict';

describe('Controller: CoordportalViewCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var CoordportalViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CoordportalViewCtrl = $controller('CoordportalViewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CoordportalViewCtrl.awesomeThings.length).toBe(3);
  });
});
