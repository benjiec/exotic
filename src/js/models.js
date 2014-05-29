exoticSamples = (new function () {
  this.get = function ($http, cb) {
    //
    // Implemention should return list of objects with id and name attributes
    // and properties method. id attribute should be unique. Each property
    // should be a string.
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
