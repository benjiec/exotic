window.JST = window.JST || {};
var template = function(str){var fn = new Function('obj', 'var __p=[],print=function(){__p.push.apply(__p,arguments);};with(obj||{}){__p.push(\''+str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/<%=([\s\S]+?)%>/g,function(match,code){return "',"+code.replace(/\\'/g, "'")+",'";}).replace(/<%([\s\S]+?)%>/g,function(match,code){return "');"+code.replace(/\\'/g, "'").replace(/[\r\n\t]/g,' ')+"__p.push('";}).replace(/\r/g,'\\r').replace(/\n/g,'\\n').replace(/\t/g,'\\t')+"');}return __p.join('');");return fn;};
window.JST['main'] = template('<div ng-if="fetches.length > 0" class="panel panel-warning" id="alerts">\n  <div class="panel-heading"><b>Fetching data for</b></div>\n  <div class="panel-body">\n    <span ng-repeat="fetch in fetches">\n      {{ fetch }}\n      <br/>\n    </span>\n  </div>\n</div>\n\n<div ng-if="selected_samples.length != 0 && selected_observations.length != 0">\n  <p>\n    {{ selected_samples.length }} sample(s),\n    {{ selected_observations.length }} observation(s).\n  </p>\n  <partial template="table"></partial>\n</div>\n\n<div ng-if="selected_samples.length == 0 || selected_observations.length == 0">\n  <div class="jumbotron">\n    <h1>\n      Are your data exotic?\n    </h1>\n    <br/>\n    <p>\n      Select some samples and observations to find out.\n    </p>\n  </div>\n</div>\n');
window.JST['table'] = template('<table class="table table-condensed table-bordered">\n  <tr class="success">\n    <th></th>\n    <th ng-repeat="k in show_properties"></th>\n    <th ng-repeat="obs in selected_observations" colspan="{{ object_attrs.length }}">\n      {{ obs.name }}\n    </th>\n  </tr>\n\n  <tr class="success">\n    <th> Sample </th>\n    <th ng-repeat="k in show_properties"> {{ k }} </th>\n    <th ng-repeat="field in attrs">\n      {{ field[1] }}\n    </th>\n  </tr>\n\n  <tr ng-repeat="sample in selected_samples">\n    <td>\n      {{ sample.name }}\n    </td>\n    <th ng-repeat="k in show_properties">\n      {{ sample.properties()[k] }}\n    </td>\n    <td ng-repeat="field in attrs">\n      {{ data_by_sample[sample.id][field[0]][field[1]] }}\n    </td>\n  </tr>\n</table>\n');
window.JST['container'] = template('<div class="container-fluid">\n<div class="row">\n\n<div class="col-md-2" id="left-menu">\n  <partial template="left"></partial>\n</div>\n\n<div class="col-md-10" id="main">\n  <partial template="main"></partial>\n</div>\n\n</div> <!-- row -->\n</div> <!-- container-fluid -->\n');
window.JST['left'] = template('<p>\n  <a href="#/" class="lead">Exotic</a>\n</p>\n\n\n<p>\n  <b>Observations</b>\n</p>\n\n<ul>\n  <li ng-repeat="observation in observations">\n    <input type="checkbox"\n           ng-checked="selected_observations.indexOf(observation) > -1"\n           ng-click="selectObservation(observation)"\n     /> {{ observation.name }}\n  </li>\n</ul>\n\n\n<p>\n  <b>Observation Attributes</b>\n</p>\n\n<ul>\n  <li ng-repeat="attr in example_value.__attrs__">\n    <input type="checkbox"\n           ng-checked="object_attrs.indexOf(attr) >= 0"\n           ng-click="toggleAttribute(attr)"\n     /> {{ attr }}\n  </li>\n</ul>\n\n\n<p>\n  <b>Samples</b>\n</p>\n\n<ul>\n  <li ng-repeat="sample in samples">\n    <input type="checkbox"\n           ng-checked="selected_samples.indexOf(sample) > -1"\n           ng-click="selectSample(sample)"\n     /> {{ sample.name }}\n  </li>\n</ul>\n\n\n<p>\n  <b>Sample Properties</b>\n</p>\n  \n<div ng-repeat="(name, props) in properties">\n  <input type="checkbox"\n         ng-checked="show_properties.indexOf(name) >= 0"\n         ng-click="toggleProperty(name)"\n   /> {{ name }}\n  <ul>\n    <li ng-repeat="value in props">\n      <input type="checkbox"\n             ng-checked="filter_properties[name].indexOf(value) >= 0"\n             ng-click="filterProperty(name, value)"\n       /> {{ value }}\n    </li>\n  </ul>\n</div>\n');
