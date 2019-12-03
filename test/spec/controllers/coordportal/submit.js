'use strict';

describe('Controller: CoordportalSubmitCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var CoordportalSubmitCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    CoordportalSubmitCtrl = $controller('CoordportalSubmitCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(CoordportalSubmitCtrl.awesomeThings.length).toBe(3);
  });
});
