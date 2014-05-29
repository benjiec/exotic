exoticSamples = (new function () {
  this.get = function ($http, cb) {
    //
    // Implemention should return list of objects with id and name attributes
    // and properties method. id attribute should be unique.
    //
    alert("Not configured with a customized list of samples.");
    cb([]);
  }
});

exoticObservations = (new function () {
  this.get = function ($http, cb) {
    //
    // Implemention should return list of objects with id and name attributes.
    // id attribute should be unique.
    //
    alert("Not configured with a customized list of observations.");
    cb([]);
  }
});

exoticValues = (new function () {
  this.get = function ($http, samples, observation, cb) {
    //
    // Implementation should return list of values with __fields__ attribute
    // and field values. The list of values should correspond with list of
    // samples.
    //
    alert("Not configured to fetch value by samples and observations.");
    cb([]);
  }
});

'use strict';

function ExoticController($scope, $http) {
  $scope.samples = [];
  $scope.observations = [];
  $scope.selected_samples = [];
  $scope.selected_observations = [];
  $scope.fetches = [];
  $scope.example_value = undefined;
  $scope.data_by_sample = {};
  $scope.fields = [];

  function update_fields() {
    if ($scope.example_value !== undefined) {
      $scope.fields = [];
      for (var i=0; i<$scope.selected_observations.length; i++) {
        for (var j=0; j<$scope.example_value.__fields__.length; j++) {
          $scope.fields.push([$scope.selected_observations[i].id, $scope.example_value.__fields__[j]]);
        }
      }
    }
  }

  function fetch(sample, observation) {
    function fetch_desc(sample, observation) {
      return ""+sample.name+", "+observation.name;
    }

    if ($scope.data_by_sample[sample.id] === undefined) {
      $scope.data_by_sample[sample.id] = {};
    }
    if ($scope.data_by_sample[sample.id][observation.id] === undefined) {
      // remember we are fetching this sample and observation
      $scope.data_by_sample[sample.id][observation.id] = 'fetching';
      $scope.fetches.push(fetch_desc(sample, observation));
      exoticValues.get($http, [sample], observation, function(values) {
        $scope.data_by_sample[sample.id][observation.id] = values[0];
        if ($scope.example_value === undefined) {
          $scope.example_value = values[0];
          update_fields();
        }

        // update alerts
        var i = $scope.fetches.indexOf(fetch_desc(sample, observation));
        $scope.fetches.splice(i, 1);

        // force notification of scope changes
        $scope.$apply();
      });
    }
  }

  $scope.selectSample = function(sample) {
    if ($scope.selected_samples.indexOf(sample) > -1) {
      $scope.selected_samples.splice($scope.selected_samples.indexOf(sample), 1);
    }
    else {
      $scope.selected_samples.push(sample);
      // fetch data for this sample with all selected observations
      for (var i=0; i<$scope.selected_observations.length; i++) {
        fetch(sample, $scope.selected_observations[i]);
      }
    }
  }

  $scope.selectObservation = function(observation) {
    if ($scope.selected_observations.indexOf(observation) > -1) {
      $scope.selected_observations.splice($scope.selected_observations.indexOf(observation), 1);
    }
    else {
      $scope.selected_observations.push(observation);
      // fetch data for this observation with all selected samples
      for (var i=0; i<$scope.selected_samples.length; i++) {
        fetch($scope.selected_samples[i], observation);
      }
    }
    update_fields();
  }

  exoticSamples.get($http, function(samples) { $scope.samples = samples; });
  exoticObservations.get($http, function(observations) { $scope.observations = observations; });
}

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
