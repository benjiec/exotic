'use strict';

function ExoticController($scope, $http) {
  $scope.samples = [];
  $scope.observations = [];
  $scope.properties = {};
  $scope.show_properties = [];
  $scope.selected_samples = [];
  $scope.selected_observations = [];
  $scope.fetches = [];
  $scope.example_value = undefined;
  $scope.object_attrs = undefined;
  $scope.data_by_sample = {};
  $scope.attrs = [];

  function update_attrs() {
    if ($scope.example_value !== undefined) {
      $scope.attrs = [];
      for (var i=0; i<$scope.selected_observations.length; i++) {
        for (var j=0; j<$scope.example_value.__attrs__.length; j++) {
          var field = $scope.example_value.__attrs__[j];
          if ($scope.object_attrs.indexOf(field) >= 0) {
            $scope.attrs.push([$scope.selected_observations[i].id, field]);
          }
        }
      }
    }
  }

  $scope.toggleAttribute = function (field) {
    var i = $scope.object_attrs.indexOf(field);
    if (i >= 0) { // turn off
      $scope.object_attrs.splice(i, 1);
    }
    else { // turn on
      var new_attrs = [];
      for (var i=0; i<$scope.example_value.__attrs__.length; i++) {
        var a = $scope.example_value.__attrs__[i];
        if ($scope.object_attrs.indexOf(a) >= 0 || a == field) {
          new_attrs.push(a);
        }
      }
      $scope.object_attrs = new_attrs;
    }
    update_attrs();
  }

  function update_properties() {
    for (var i=0; i<$scope.samples.length; i++) {
      var sample = $scope.samples[i];
      var properties = sample.properties();
      for (var k in properties) {
        var v = properties[k];
        if ($scope.properties[k] === undefined) {
          $scope.properties[k] = [];
        }
        if ($scope.properties[k].indexOf(v) < 0) {
          $scope.properties[k].push(v);
        }
      }
    }
    $scope.show_properties = [];
    for (var k in $scope.properties) {
      $scope.show_properties.push(k);
    }
  }

  $scope.toggleProperty = function (prop) {
    var i = $scope.show_properties.indexOf(prop);
    if (i >= 0) { // turn off
      $scope.show_properties.splice(i, 1);
    }
    else { // turn on
      var new_props = [];
      for (var k in $scope.properties) {
        if ($scope.show_properties.indexOf(k) >= 0 || k == prop) {
          new_props.push(k);
        }
      }
      $scope.show_properties = new_props;
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
          $scope.object_attrs = $scope.example_value.__attrs__.slice(0);
          update_attrs();
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
    update_attrs();
  }

  exoticSamples.get($http, function(samples) {
    $scope.samples = samples;
    $scope.selected_samples = $scope.samples.slice(0);
    update_properties();
  });
  exoticObservations.get($http, function(observations) { $scope.observations = observations; });
}
