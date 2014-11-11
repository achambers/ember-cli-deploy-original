'use strict';

var chalk       = require('chalk');
var Promise     = require('ember-cli/lib/ext/promise');
var SilentError = require('ember-cli/lib/errors/silent');

var errorMessage = 'The `ember deploy:index` command requires {0} config to be set.  For more details see http://github.com/achambers/ember-cli-deploy';

function IndexConfigValidator(options) {
  this.project = options.project;
};

IndexConfigValidator.prototype.validate = function(config) {
  config = config || {};

  var indexConfig = config.index;
  var defaultIndexConfig = {
    host: 'localhost',
    port: '6379',
    password: null
  };

  if (!config.distDir) {
    config.distDir = 'dist';
  }

  if (!indexConfig) {
    var message = chalk.yellow(errorMessage.replace('{0}', 'index'));
    return Promise.reject(new SilentError(message));
  }

  for (var prop in defaultIndexConfig) {
    if (!indexConfig.hasOwnProperty(prop) || indexConfig[prop] == null) {
      indexConfig[prop] = defaultIndexConfig[prop];
    }
  }

  return Promise.resolve(config);
};

module.exports = IndexConfigValidator;
