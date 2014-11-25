'use strict';

var chalk       = require('chalk');
var Promise     = require('ember-cli/lib/ext/promise');
var SilentError = require('ember-cli/lib/errors/silent');
var Task        = require('ember-cli/lib/models/task');
var Config      = require('../utilities/configuration');

module.exports = Task.extend({
  run: function(options) {
    var project  = this.project;
    var ui       = this.ui;
    var registry = this.registry;
    var key      = options.key;

    if(!key) {
      var message = chalk.yellow('The `ember activate` command requires a deploy version to be specified.');
      return Promise.reject(new SilentError(message));
    }

    var config = new Config({
      project: project,
      environment: options.environment
    });

    var IndexAdapter = registry.indexAdapter();
    var adapter = new IndexAdapter({
      appId: project.name(),
      connection: config.index
    });

    return adapter.setCurrent(key)
      .then(function() {
        var message = 'Version `' + key + '` activated\n';
        ui.write(message);
      });
  }
});
