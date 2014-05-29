var app = angular.module('exotic', ['ngRoute', 'ngSanitize'])
  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/', { template: JST['container'],
                   controller: ExoticController})
      .otherwise({redirectTo: '/'});
  }]);

app.directive('partial', function($compile) {
  var linker = function(scope, element, attrs) {
    element.html(JST[attrs.template]());
    $compile(element.contents())(scope);
  };
  return {
    link: linker,
    restrict: 'E'
  }
});

app.filter('encodeURIComponent', function() { return window.encodeURIComponent; });
app.filter('encodeURI', function() { return window.encodeURI; });
