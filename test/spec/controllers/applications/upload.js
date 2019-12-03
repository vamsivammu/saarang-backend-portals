'use strict';

describe('Controller: ApplicationsUploadCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var ApplicationsUploadCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    ApplicationsUploadCtrl = $controller('ApplicationsUploadCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(ApplicationsUploadCtrl.awesomeThings.length).toBe(3);
  });
});
