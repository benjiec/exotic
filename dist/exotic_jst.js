window.JST = window.JST || {};
var template = function(str){var fn = new Function('obj', 'var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push(\''+str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/<%=([\s\S]+?)%>/g,function(match,code){return "',"+code.replace(/\\'/g, "'")+",'";}).replace(/<%([\s\S]+?)%>/g,function(match,code){return "');"+code.replace(/\\'/g, "'").replace(/[\r\n\t]/g,' ')+"__p.push('";}).replace(/\r/g,'\\r').replace(/\n/g,'\\n').replace(/\t/g,'\\t')+"');}return __p.join('');");return fn;};
window.JST['main'] = template('<div ng-if="fetches > 0" class="panel panel-warning" id="alerts">\n  <div class="panel-heading"><b>Fetching data</b></div>\n  <div class="panel-body">\n    {{ fetches }} outstanding request(s)\n  </div>\n</div>\n\n<div ng-if="selected_samples.length != 0 && selected_observations.length != 0">\n  <p>\n    {{ selected_samples.length }} sample(s),\n    {{ selected_observations.length }} observation(s).\n    <a href="javascript:void(0);" ng-click="csv=!csv;">Toggle CSV</a>.\n  </p>\n\n  <div ng-class="!csv ? \'show\' : \'hidden\'">\n    <partial template="table"></partial>\n  </div>\n  <div ng-class="csv ? \'show\' : \'hidden\'">\n    <textarea class="csv" readonly>{{ table_csv }}</textarea>\n  </div>\n\n  <a href="javascript:void(0);" ng-click="showScatterMatrix()" ng-if="scatter_matrix===undefined"\n   >Show scatter matrix</a>\n  <h3 ng-if="scatter_matrix !== undefined">Scatter Matrix</h3>\n  <div id="scatter-matrix-box"></div>\n\n</div>\n\n<div ng-if="selected_samples.length == 0 || selected_observations.length == 0">\n  <div class="jumbotron">\n    <h1>\n      Are your data exotic?\n    </h1>\n    <br/>\n    <p>\n      Select some samples and observations to find out.\n    </p>\n  </div>\n</div>\n');
window.JST['table'] = template('<table class="table table-condensed table-bordered" ng-bind-html="table_html">\n</table>\n');
window.JST['container'] = template('<div class="container-fluid">\n<div class="row">\n\n<div class="col-md-2" id="left-menu">\n  <partial template="left"></partial>\n</div>\n\n<div class="col-md-10" id="main">\n  <partial template="main"></partial>\n</div>\n\n</div> <!-- row -->\n</div> <!-- container-fluid -->\n');
window.JST['left'] = template('<p>\n  <a href="#/" class="lead">Exotic</a>\n</p>\n\n<div class="panel-group" id="accordion">\n\n<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a href="javascript:void(0);"\n         data-toggle="collapse" data-target="#collapse-observations">Observations</a>\n    </h4>\n  </div>\n  <div id="collapse-observations" class="panel-collapse collapse in">\n    <div class="panel-body">\n\n      <table>\n        <tr ng-repeat="observation in observations">\n          <td>\n          <input type="checkbox"\n                 ng-checked="selected_observations.indexOf(observation) > -1"\n                 ng-click="selectObservation(observation)" />\n          </td>\n          <td> {{ observation.name }} </td>\n        </tr>\n      </table>\n\n    </div>\n  </div>\n</div> <!-- observations panel -->\n\n\n<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a href="javascript:void(0);"\n         data-toggle="collapse" data-target="#collapse-attributes">Observation Attributes</a>\n    </h4>\n  </div>\n  <div id="collapse-attributes" class="panel-collapse collapse">\n    <div class="panel-body">\n\n      <table>\n        <tr ng-repeat="attr in example_value.__attrs__">\n          <td>\n          <input type="checkbox"\n                 ng-checked="object_attrs.indexOf(attr) >= 0"\n                 ng-click="toggleAttribute(attr)" />\n          </td>\n          <td> {{ attr }} </td>\n        </tr>\n      </table>\n\n    </div>\n  </div>\n</div> <!-- attributes panel -->\n\n\n<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a href="javascript:void(0);"\n         data-toggle="collapse" data-target="#collapse-samples">Samples</a>\n    </h4>\n  </div>\n  <div id="collapse-samples" class="panel-collapse collapse">\n    <div class="panel-body">\n\n      <table>\n        <tr ng-repeat="sample in samples">\n          <td>\n          <input type="checkbox"\n                 ng-checked="selected_samples.indexOf(sample) > -1"\n                 ng-click="selectSample(sample)" />\n          </td>\n          <td> {{ sample.name }} </td>\n        </tr>\n      </table>\n\n    </div>\n  </div>\n</div> <!-- samples panel -->\n\n\n<div class="panel panel-default">\n  <div class="panel-heading">\n    <h4 class="panel-title">\n      <a href="javascript:void(0);"\n         data-toggle="collapse" data-target="#collapse-properties">Sample Properties</a>\n    </h4>\n  </div>\n  <div id="collapse-properties" class="panel-collapse collapse">\n    <div class="panel-body">\n\n      <div ng-repeat="(name, props) in properties">\n        <input type="checkbox"\n               ng-checked="show_properties.indexOf(name) >= 0"\n               ng-click="toggleProperty(name)"\n         /> {{ name }}\n        <table ng-if="show_properties.indexOf(name) >= 0">\n          <tr ng-repeat="value in props">\n            <td>\n              <input type="checkbox"\n                     ng-checked="filter_properties[name].indexOf(value) >= 0"\n                     ng-click="filterProperty(name, value)"\n               />\n            </td>\n            <td> {{ value }} </td>\n          </tr>\n        </table>\n      </div>\n\n    </div>\n  </div>\n</div> <!-- properties panel -->\n\n\n</div> <!-- panel-group -->\n');
