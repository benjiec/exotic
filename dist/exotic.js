exoticSamples = (new function () {
  this.get = function ($http, cb) {
    //
    // Implemention should return list of objects with id and name attributes
    // and properties method. id attribute should be unique. Properties should
    // be a hash.
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
    // Implementation should return list of values with __attrs__ attribute
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
  
  $scope.fetches = 0;
  $scope.data_by_sample = {};

  $scope.example_value = undefined;
  $scope.object_attrs = undefined;
  $scope.attrs = [];

  $scope.properties = {};
  $scope.show_properties = [];
  $scope.filter_properties = {};

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
    $scope.filter_properties = {};
    for (var k in $scope.properties) {
      $scope.show_properties.push(k);
      $scope.filter_properties[k] = $scope.properties[k].slice(0);
    }
    $scope.show_properties = $scope.show_properties.sort();
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

  $scope.filterProperty = function (prop, value) {
    var i = $scope.filter_properties[prop].indexOf(value);
    if (i >= 0) { // remove
      $scope.filter_properties[prop].splice(i, 1);
    }
    else {
      $scope.filter_properties[prop].push(value);
    }

    // update selected sample list
    var ss = [];
    for (var i=0; i<$scope.samples.length; i++) {
      // a sample is "selected" if all its properties appear in
      // filter_properties
      var sample = $scope.samples[i];
      var props = sample.properties();
      var selected = true;
      for (var k in props) {
        var v = props[k];
        if ($scope.filter_properties[k].indexOf(v) < 0) { selected = false; break; }
      }
      if (selected === true) { ss.push(sample); }
    }
    $scope.selected_samples = ss;
  }

  function fetch(samples, observation) {
    var to_fetch = [];
    for (var i=0; i<samples.length; i++) {
      var sample = samples[i];
      if ($scope.data_by_sample[sample.id] === undefined) {
        $scope.data_by_sample[sample.id] = {};
      }
      if ($scope.data_by_sample[sample.id][observation.id] === undefined) {
        to_fetch.push(sample);
        // remember we are fetching this sample and observation
        $scope.data_by_sample[sample.id][observation.id] = 'fetching';
      }
    }

    if (to_fetch.length == 0) { return; }
    $scope.fetches += 1;

    exoticValues.get($http, to_fetch, observation, function(values) {
      for (var i=0; i<to_fetch.length; i++) {
        var sample = to_fetch[i];
        var value = values[i];
        $scope.data_by_sample[sample.id][observation.id] = value;
        if (value !== null && $scope.example_value === undefined) {
          $scope.example_value = value;
          $scope.object_attrs = $scope.example_value.__attrs__.slice(0);
          update_attrs();
        }
      }

      $scope.fetches -= 1;
    });
  }

  $scope.selectSample = function(sample) {
    if ($scope.selected_samples.indexOf(sample) > -1) {
      $scope.selected_samples.splice($scope.selected_samples.indexOf(sample), 1);
    }
    else {
      $scope.selected_samples.push(sample);
      // fetch data for this sample with all selected observations
      for (var i=0; i<$scope.selected_observations.length; i++) {
        fetch([sample], $scope.selected_observations[i]);
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
      fetch($scope.selected_samples, observation);
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
