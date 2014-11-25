var CoreObject  = require('core-object');
var MockAdapter = require('./mock-adapter');

module.exports = CoreObject.extend({
  indexAdapter: function() {
    return MockAdapter;
  }
});
