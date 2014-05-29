'use strict';

function ExoticController($scope, $http) {
  $scope.samples = [];
  $scope.observations = [];
  $scope.properties = [];
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

  function update_properties() {
    for (var i=0; i<$scope.samples.length; i++) {
      var sample = $scope.samples[i];
      var properties = sample.properties();
      for (var j=0; j<properties.length; j++) {
        if ($scope.properties.indexOf(properties[j]) < 0) {
          $scope.properties.push(properties[j]);
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

  exoticSamples.get($http, function(samples) {
    $scope.samples = samples;
    update_properties();
  });
  exoticObservations.get($http, function(observations) { $scope.observations = observations; });
}
