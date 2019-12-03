'use strict';

describe('Controller: AllTeamsCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var AllTeamsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    AllTeamsCtrl = $controller('AllTeamsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(AllTeamsCtrl.awesomeThings.length).toBe(3);
  });
});
