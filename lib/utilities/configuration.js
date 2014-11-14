'use strict';

var path        = require('path');
var fs          = require('fs');
var CoreObject  = require('core-object');
var SilentError = require('ember-cli/lib/errors/silent');

module.exports = CoreObject.extend({
  init: function() {
    if (!this.environment) {
      throw new SilentError('Configuration must define an `environment` property\n');
    }

    var configPath = path.join(this.project.root, 'config', 'deploy', this.environment);

    if (!fs.existsSync(configPath + '.js')) {
      throw new SilentError('`' + this.environment + '` config does not exist\n');
    }

    var config = require(configPath);

    for(var prop in config) {
      this[prop] = config[prop];
    }
  }
});
