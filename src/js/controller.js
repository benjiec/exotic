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

  $scope.table_rows = [];

  function update_table() {
    var rows = [];

    for (var si=0; si<$scope.selected_samples.length; si++) {
      var sample_rows = [];
      var sample = $scope.selected_samples[si]
      var props = sample.properties();
     
      var row = [[sample.name, null]];
      sample_rows.push(row);

      for (var pi=0; pi<$scope.show_properties.length; pi++) {
        var p = $scope.show_properties[pi];
        var v = props[p];

        if (v === undefined || v.length == 1) {
          for (var ri=0; ri<sample_rows.length; ri++) {
            if (v === undefined) {
              sample_rows[ri].push([undefined, null]);
            } else {
              sample_rows[ri].push([v[0], null]);
            }
          }
        }
        else {
          var new_rows = [];
          for (var ri=0; ri<sample_rows.length; ri++) {
            for (var j=0; j<v.length; j++) {
              var new_row = sample_rows[ri].slice(0);
              new_row.push([v[j], null]);
              new_rows.push(new_row);
            }
          }
          sample_rows = new_rows;
        }
      }

      if ($scope.selected_observations.length > 0) {
        var obs_rows = [{}];

        for (var oi=0; oi<$scope.selected_observations.length; oi++) {
          var obs = $scope.selected_observations[oi];
          var v = $scope.data_by_sample[sample.id][obs.id];
          console.log('sample '+sample.id+', obs '+obs.id);
          console.log(v);
        
          if (v === undefined || v.length == 1) {
            for (var ri=0; ri<obs_rows.length; ri++) {
              if (v === undefined) {
                obs_rows[ri][obs.id] = undefined;
              } else {
                obs_rows[ri][obs.id] = v[0];
              }
            }
          }
          else {
            var new_rows = [];
            for (var j=0; j<v.length; j++) {
              for (var ri=0; ri<obs_rows.length; ri++) {
                var new_row = {};
                for (var f in obs_rows[ri]) {
                  new_row[f] = obs_rows[ri][f];
                }
                new_row[obs.id] = v[j];
                new_rows.push(new_row);
              }
            }
            obs_rows = new_rows;
          }
        }
        console.log('obs rows');
        console.log(obs_rows);
          
        var new_rows = [];
        for (var ri=0; ri<sample_rows.length; ri++) {
          for (var j=0; j<obs_rows.length; j++) {
            var new_row = sample_rows[ri].slice(0);
            for (var fi=0; fi<$scope.attrs.length; fi++) {
              var f = $scope.attrs[fi];
              new_row.push([obs_rows[j][f[0]][f[1]], f[2]]);
            }
            new_rows.push(new_row);
          }
        }
        sample_rows = new_rows;
      }

      for (var ri=0; ri<sample_rows.length; ri++) {
        rows.push(sample_rows[ri]);
      }
    }

    $scope.table_rows = rows;
  }

  function update_attrs() {
    if ($scope.example_value !== undefined) {
      $scope.attrs = [];
      for (var i=0; i<$scope.selected_observations.length; i++) {
        for (var j=0; j<$scope.example_value.__attrs__.length; j++) {
          var field = $scope.example_value.__attrs__[j];
          var type = null;
          if ($scope.example_value.__type__) { type = $scope.example_value.__type__[j]; }
          if ($scope.object_attrs.indexOf(field) >= 0) {
            $scope.attrs.push([$scope.selected_observations[i].id, field, type]);
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

    update_table();
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

    update_table();
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

    update_table();
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

    if (to_fetch.length == 0) {
      return;
    }
    $scope.fetches += 1;

    exoticValues.get($http, to_fetch, observation, function(values) {
      for (var i=0; i<to_fetch.length; i++) {
        var sample = to_fetch[i];
        var value = values[i];
        $scope.data_by_sample[sample.id][observation.id] = value;
        if (value !== null && value.length > 0 && $scope.example_value === undefined) {
          $scope.example_value = value[0];
          $scope.object_attrs = $scope.example_value.__attrs__.slice(0);
          update_attrs();
        }
      }

      $scope.fetches -= 1;
      update_table();
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
    update_table();
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
    update_table();
  }

  exoticSamples.get($http, function(samples) {
    $scope.samples = samples;
    $scope.selected_samples = $scope.samples.slice(0);
    update_properties();
  });
  exoticObservations.get($http, function(observations) { $scope.observations = observations; });
}
