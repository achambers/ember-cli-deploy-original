'use strict';

var Promise = require('ember-cli/lib/ext/promise');

function MockAdapter() {};

MockAdapter.prototype.upload = function() {
  return Promise.resolve();
};

MockAdapter.prototype.setCurrent = function(key) {
  return Promise.resolve();
};

MockAdapter.type = 'index-adapter';

module.exports = MockAdapter;
