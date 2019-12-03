'use strict';

describe('Controller: HospiTeamsCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var HospiTeamsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HospiTeamsCtrl = $controller('HospiTeamsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HospiTeamsCtrl.awesomeThings.length).toBe(3);
  });
});
