'use strict';

module.exports = {
  name: 'deploy',
  description: 'Deploys assets to S3 and an activated index.html to Redis',
  works: 'insideProject',

  availableOptions: [
    { name: 'environment', type: String, default: 'development' },
    { name: 'dist-dir', type: String, default: 'dist/' }
  ],

  run: function(commandOptions) {
    var deployAssets = this._command('./deploy-assets');
    var deployIndex = this._command('./deploy-index');
    var activate = this._command('./activate');

    return deployAssets.run(commandOptions)
      .then(function() {
        return deployIndex.run(commandOptions);
      })
      .then(function(key) {
        return activate.run(commandOptions, [key]);
      });
  },

  _command: function(commandPath) {
    var command = require(commandPath);
    command.project = this.project;
    command.ui = this.ui;
    return command;
  }
};
