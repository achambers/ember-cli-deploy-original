'use strict';

var chalk       = require('chalk');
var Promise     = require('ember-cli/lib/ext/promise');
var SilentError = require('ember-cli/lib/errors/silent');

function ActivateConfigValidator() {};

ActivateConfigValidator.prototype.validate = function(config) {
  config = config || {};

  var indexConfig = config.index;
  var defaultIndexConfig = {
    host: 'localhost',
    port: '6379',
    password: null
  };

  if (!config.key) {
    var message = chalk.yellow('The `ember activate` command requires a deploy key to be specified. For more details see http://github.com/achambers/ember-cli-deploy\n');
    return Promise.reject(new SilentError(message));
  }

  if (!indexConfig) {
    var message = chalk.yellow('The `ember activate` command requires index config to be set.  For more details see http://github.com/achambers/ember-cli-deploy');
    return Promise.reject(new SilentError(message));
  }

  for (var prop in defaultIndexConfig) {
    if (!indexConfig.hasOwnProperty(prop) || indexConfig[prop] == null) {
      indexConfig[prop] = defaultIndexConfig[prop];
    }
  }

  return Promise.resolve(config);
};

module.exports = ActivateConfigValidator;
