'use strict';

describe('Controller: HospiStatisticsCtrl', function () {

  // load the controller's module
  beforeEach(module('erpSaarangFrontendApp'));

  var HospiStatisticsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    HospiStatisticsCtrl = $controller('HospiStatisticsCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(HospiStatisticsCtrl.awesomeThings.length).toBe(3);
  });
});
