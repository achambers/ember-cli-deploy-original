'use strict';

var chalk       = require('chalk');
var CoreObject  = require('core-object');
var SilentError = require('ember-cli/lib/errors/silent');

module.exports = CoreObject.extend({
  init: function() {
    var addons = this.project.addons;

    this.adapters = addons.reduce(function(previous, addon) {
      var adapter = addon.adapter;

      if (adapter) {
        if (adapter.type === 'index-adapter') {
          previous.index.push(adapter);
        }
        if (adapter.type === 'asset-adapter'){
          previous.asset.push(adapter);
        }
      }
      return previous;
    }, {index: [], asset: []});
  },

  indexAdapter: function() {
    var ui = this.ui;

    if (!this.adapters.index.length > 0) {
      ui.write(chalk.yellow('No index adapter specified.  Defaulting to `redis-index-adapter`\n'));
      return require('ember-cli-deploy-redis-index-adapter/lib/redis-index-adapter');
    }

    return this.adapters.index[0];
  }
});
