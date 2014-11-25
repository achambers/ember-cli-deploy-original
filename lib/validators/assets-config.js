'use strict';

var chalk       = require('chalk');
var Promise     = require('ember-cli/lib/ext/promise');
var SilentError = require('ember-cli/lib/errors/silent');

var errorMessage = 'The `ember deploy:assets` command requires {0} config to be set.  For more details see http://github.com/achambers/ember-cli-deploy';

function AssetsConfigValidator(options) {
  this.project = options.project;
};

AssetsConfigValidator.prototype.validate = function(config) {
  config = config || {};

  var assetsConfig         = config.assets;
  var defaultAssetsConfig = {
    region: 'us-east-1',
    filePattern: '**/*.{js,css,png,gif,jpg}'
  };

  if (!config.distDir) {
    config.distDir = 'dist';
  }

  if (!assetsConfig) {
    var message = chalk.yellow(errorMessage.replace('{0}', 'assets'));
    return Promise.reject(new SilentError(message));
  }

  for (var prop in defaultAssetsConfig) {
    if (!assetsConfig.hasOwnProperty(prop) || assetsConfig[prop] == null) {
      assetsConfig[prop] = defaultAssetsConfig[prop];
    }
  }

  if (!assetsConfig.accessKeyId) {
    var message = chalk.yellow(errorMessage.replace('{0}', 'assets.accessKeyId'));
    return Promise.reject(new SilentError(message));
  }

  if (!assetsConfig.secretAccessKey) {
    var message = chalk.yellow(errorMessage.replace('{0}', 'assets.secretAccessKey'));
    return Promise.reject(new SilentError(message));
  }

  if (!assetsConfig.bucket) {
    var message = chalk.yellow(errorMessage.replace('{0}', 'assets.bucket'));
    return Promise.reject(new SilentError(message));
  }

  return Promise.resolve(config);
}

module.exports = AssetsConfigValidator;
