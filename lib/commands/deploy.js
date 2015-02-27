'use strict';

module.exports = {
  name: 'deploy',
  description: 'Deploys assets to S3 and an activated index.html to Redis',
  works: 'insideProject',

  _commands: {
    DeployAssets: require('./deploy-assets'),
    DeployIndex:  require('./deploy-index'),
    Activate:     require('./activate')
  },

  availableOptions: [
    { name: 'environment', type: String, default: 'development' },
    { name: 'dist-dir', type: String, default: 'dist/' }
  ],

  run: function(commandOptions) {
    var deployAssets  = this._inject(this._commands.DeployAssets);
    var deployIndex   = this._inject(this._commands.DeployIndex);
    var activate      = this._inject(this._commands.Activate);

    return deployAssets.run(commandOptions)
      .then(function() {
        return deployIndex.run(commandOptions);
      })
      .then(function(key) {
        return activate.run(commandOptions, [key]);
      });
  },

  _inject: function(command) {
    command.project = this.project;
    command.ui = this.ui;
    return command;
  }
};
