'use strict';

describe('Controller: ApplicationsViewCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var ApplicationsViewCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApplicationsViewCtrl = $controller('ApplicationsViewCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ApplicationsViewCtrl.awesomeThings.length).toBe(3);
  });
});
