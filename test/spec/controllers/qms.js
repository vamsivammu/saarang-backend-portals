'use strict';

describe('Controller: QmsCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var QmsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    QmsCtrl = $controller('QmsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(QmsCtrl.awesomeThings.length).toBe(3);
  });
});
