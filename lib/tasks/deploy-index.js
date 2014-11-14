'use strict';

var fs          = require('fs');
var Promise     = require('ember-cli/lib/ext/promise');
var Task        = require('ember-cli/lib/models/task');
var SilentError = require('ember-cli/lib/errors/silent');
var Config      = require('../utilities/configuration');

var readFile = Promise.denodeify(fs.readFile);

module.exports = Task.extend({
  run: function(options) {
    var project  = this.project;
    var ui       = this.ui;
    var registry = this.registry;

    var config = new Config({
      project: project,
      environment: options.environment
    });

    var IndexAdapter = registry.indexAdapter();
    var adapter = new IndexAdapter({
      appId: project.name(),
      connection: config.index
    });

    var indexFilePath = options.distDir + '/index.html';

    return this._indexFile(indexFilePath)
      .then(adapter.upload.bind(adapter), this._fileNotFound.bind(this))
      .then(function(key) {
        var message = 'ember activate ' + key + '\n';
        ui.write(message);
      });
  },

  _fileNotFound: function() {
    var message = 'index.html could not be found.\n';
    return Promise.reject(new SilentError(message));
  },

  _indexFile: function(filePath) {
    return readFile(filePath);
  }
});
